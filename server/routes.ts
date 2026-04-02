import type { Express } from "express";
import { createServer, type Server } from "http";

// Abort a fetch if it takes longer than `ms` milliseconds
function fetchWithTimeout(url: string, opts: RequestInit, ms: number) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

const REPLICATE_TOKEN   = () => process.env.REPLICATE_API_TOKEN ?? "";
const MODEL_ENDPOINT    = "https://api.replicate.com/v1/models/cuuupid/idm-vton/predictions";
const MAX_POLL_MS       = 110_000; // 110 s total polling budget

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/tryon", async (req, res) => {
    // Hard server-side response timeout
    res.setTimeout(125_000, () => {
      if (!res.headersSent) res.status(504).json({ error: "Server timed out — please try again." });
    });

    try {
      const { personImage, garmentImage } = req.body as {
        personImage: string; garmentImage: string;
      };

      if (!personImage || !garmentImage) {
        return res.status(400).json({ error: "personImage and garmentImage are required" });
      }

      const token = REPLICATE_TOKEN();
      if (!token) return res.status(500).json({ error: "REPLICATE_API_TOKEN not configured" });

      console.log("[tryon] Starting IDM-VTON prediction…");

      // Fire the prediction — ask Replicate to wait up to 55 s synchronously
      let startResp: Response;
      try {
        startResp = await fetchWithTimeout(
          MODEL_ENDPOINT,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "Prefer": "wait=55",
            },
            body: JSON.stringify({
              input: {
                human_img:      personImage,
                garm_img:       garmentImage,
                garment_des:    "a clothing item",
                is_checked:     true,
                is_checked_crop: false,
                denoise_steps:  20,
                seed:           42,
              },
            }),
          },
          60_000   // 60 s timeout on this single fetch
        );
      } catch (e: any) {
        console.error("[tryon] Initial fetch error:", e.message);
        return res.status(502).json({ error: "Could not reach AI service — please try again." });
      }

      const prediction = await startResp.json() as any;

      if (!startResp.ok) {
        console.error("[tryon] API error:", JSON.stringify(prediction).slice(0, 300));
        return res.status(502).json({ error: prediction?.detail || "Replicate API error" });
      }

      console.log(`[tryon] Prediction id=${prediction.id} status=${prediction.status}`);

      // Succeeded synchronously (Prefer:wait worked)
      if (prediction.status === "succeeded" && prediction.output) {
        const out = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
        console.log("[tryon] Immediate success:", out);
        return res.json({ resultUrl: out });
      }
      if (prediction.status === "failed" || prediction.status === "canceled") {
        return res.status(502).json({ error: prediction.error || "Prediction failed immediately" });
      }

      // Poll until done or budget exhausted
      const predId   = prediction.id;
      const pollUrl  = `https://api.replicate.com/v1/predictions/${predId}`;
      const deadline = Date.now() + MAX_POLL_MS;
      let attempt    = 0;

      while (Date.now() < deadline) {
        await new Promise(r => setTimeout(r, 3000));
        attempt++;
        console.log(`[tryon] Poll #${attempt} (${Math.round((deadline - Date.now()) / 1000)}s left)…`);

        let poll: any;
        try {
          const pollResp = await fetchWithTimeout(
            pollUrl,
            { headers: { Authorization: `Bearer ${token}` } },
            12_000
          );
          poll = await pollResp.json();
        } catch (e: any) {
          console.warn("[tryon] Poll network error:", e.message, "— retrying");
          continue;
        }

        console.log("[tryon] Poll status:", poll.status);

        if (poll.status === "succeeded") {
          const out = Array.isArray(poll.output) ? poll.output[0] : poll.output;
          console.log("[tryon] Done:", out);
          return res.json({ resultUrl: out });
        }
        if (poll.status === "failed" || poll.status === "canceled") {
          return res.status(502).json({ error: poll.error || "Try-on generation failed" });
        }
      }

      console.error("[tryon] Timed out after polling budget exhausted");
      return res.status(504).json({ error: "AI took too long — please try again." });

    } catch (err: any) {
      console.error("[tryon] Unexpected error:", err);
      if (!res.headersSent) res.status(500).json({ error: err.message || "Internal server error" });
    }
  });

  return httpServer;
}
