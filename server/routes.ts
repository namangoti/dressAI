import type { Express } from "express";
import { createServer, type Server } from "http";

const REPLICATE_TIMEOUT_MS = 30_000; // 30 s per individual fetch
const MAX_POLL_SECONDS     = 120;    // give up after 2 min total

function fetchWithTimeout(url: string, opts: RequestInit, ms = REPLICATE_TIMEOUT_MS) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // POST /api/tryon
  app.post("/api/tryon", async (req, res) => {
    // Hard server-side timeout so we always respond within 130 s
    res.setTimeout(130_000, () => {
      if (!res.headersSent) res.status(504).json({ error: "Request timed out" });
    });

    try {
      const { personImage, garmentImage } = req.body as {
        personImage: string;
        garmentImage: string;
      };

      if (!personImage || !garmentImage) {
        return res.status(400).json({ error: "personImage and garmentImage are required" });
      }

      const token = process.env.REPLICATE_API_TOKEN;
      if (!token) {
        return res.status(500).json({ error: "REPLICATE_API_TOKEN not configured" });
      }

      console.log("[tryon] Starting prediction…");

      // Start prediction — ask Replicate to wait up to 30 s synchronously
      let startResp: Response;
      try {
        startResp = await fetchWithTimeout(
          "https://api.replicate.com/v1/models/fashn/tryon/predictions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Prefer: "wait=25",
            },
            body: JSON.stringify({
              input: {
                model_image:    personImage,
                garment_image:  garmentImage,
                category:       "tops",
                long_top:       false,
              },
            }),
          },
          30_000
        );
      } catch (e: any) {
        console.error("[tryon] Initial fetch failed:", e.message);
        return res.status(502).json({ error: "Could not reach Replicate API — try again" });
      }

      const prediction = await startResp.json() as any;

      if (!startResp.ok) {
        console.error("[tryon] Replicate error:", prediction);
        return res.status(502).json({ error: prediction?.detail || "Replicate API error" });
      }

      console.log("[tryon] Prediction created, status:", prediction.status, "id:", prediction.id);

      // If already succeeded (synchronous wait worked)
      if (prediction.status === "succeeded" && prediction.output) {
        const output = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
        console.log("[tryon] Succeeded immediately:", output);
        return res.json({ resultUrl: output });
      }

      if (prediction.status === "failed" || prediction.status === "canceled") {
        return res.status(502).json({ error: prediction.error || "Prediction failed" });
      }

      // Poll with timeout
      const predictionId = prediction.id;
      const pollUrl = `https://api.replicate.com/v1/predictions/${predictionId}`;
      const deadline = Date.now() + MAX_POLL_SECONDS * 1000;
      let attempt = 0;

      while (Date.now() < deadline) {
        await new Promise(r => setTimeout(r, 3000));
        attempt++;
        console.log(`[tryon] Poll attempt ${attempt}…`);

        let poll: any;
        try {
          const pollResp = await fetchWithTimeout(
            pollUrl,
            { headers: { Authorization: `Bearer ${token}` } },
            12_000
          );
          poll = await pollResp.json();
        } catch (e: any) {
          console.warn("[tryon] Poll fetch error:", e.message);
          continue; // network blip — retry
        }

        console.log("[tryon] Poll status:", poll.status);

        if (poll.status === "succeeded") {
          const output = Array.isArray(poll.output) ? poll.output[0] : poll.output;
          console.log("[tryon] Succeeded:", output);
          return res.json({ resultUrl: output });
        }

        if (poll.status === "failed" || poll.status === "canceled") {
          return res.status(502).json({ error: poll.error || "Try-on generation failed" });
        }
      }

      console.error("[tryon] Timed out after", MAX_POLL_SECONDS, "s");
      return res.status(504).json({ error: "Timed out — the AI took too long. Please try again." });

    } catch (err: any) {
      console.error("[tryon] Unexpected error:", err);
      if (!res.headersSent) {
        return res.status(500).json({ error: err.message || "Internal server error" });
      }
    }
  });

  return httpServer;
}
