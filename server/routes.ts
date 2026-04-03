import type { Express } from "express";
import { createServer, type Server } from "http";

function fetchWithTimeout(url: string, opts: RequestInit, ms: number) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

const MAX_POLL_MS   = 110_000;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/tryon", async (req, res) => {
    res.setTimeout(125_000, () => {
      if (!res.headersSent) res.status(504).json({ error: "Server timed out — please try again." });
    });

    try {
      const { personImage, garmentImage, garmentName } = req.body as {
        personImage: string; garmentImage: string; garmentName?: string;
      };

      if (!personImage || !garmentImage) {
        return res.status(400).json({ error: "personImage and garmentImage are required" });
      }

      const token = process.env.REPLICATE_API_TOKEN;
      if (!token) return res.status(500).json({ error: "REPLICATE_API_TOKEN not configured" });

      console.log("[tryon] Fetching latest model version…");

      // Step 1: resolve the latest published version of cuuupid/idm-vton
      let version: string;
      try {
        const vr = await fetchWithTimeout(
          "https://api.replicate.com/v1/models/cuuupid/idm-vton/versions",
          { headers: { Authorization: `Bearer ${token}` } },
          15_000
        );
        if (!vr.ok) {
          const body = await vr.json().catch(() => ({})) as any;
          console.error("[tryon] Version fetch failed:", vr.status, JSON.stringify(body).slice(0, 200));
          return res.status(502).json({ error: `Could not load AI model (HTTP ${vr.status}). Check your Replicate account and billing.` });
        }
        const vd = await vr.json() as any;
        version = vd?.results?.[0]?.id;
        if (!version) throw new Error("No published versions found for cuuupid/idm-vton");
        console.log("[tryon] Using version:", version);
      } catch (e: any) {
        console.error("[tryon] Version fetch error:", e.message);
        return res.status(502).json({ error: "Could not reach Replicate — check your network or API token." });
      }

      console.log("[tryon] Starting prediction…");

      let startResp: Response;
      try {
        startResp = await fetchWithTimeout(
          "https://api.replicate.com/v1/predictions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "Prefer": "wait=55",
            },
            body: JSON.stringify({
              version,
              input: {
                human_img:       personImage,
                garm_img:        garmentImage,
                garment_des:     garmentName || "a clothing item",
                is_checked:      true,
                is_checked_crop: true,
                denoise_steps:   30,
                seed:            Math.floor(Math.random() * 2147483647),
              },
            }),
          },
          60_000
        );
      } catch (e: any) {
        console.error("[tryon] Fetch error:", e.message);
        return res.status(502).json({ error: "Could not reach AI service — please try again." });
      }

      const prediction = await startResp.json() as any;

      // Billing / credit errors
      if (startResp.status === 402) {
        console.error("[tryon] Insufficient Replicate credits (402)");
        return res.status(402).json({
          error: "Replicate account has insufficient credits.",
          type: "billing",
          billingUrl: "https://replicate.com/account/billing#billing",
        });
      }

      // Rate-limited — treat same as billing so client shows the add-credit prompt
      if (startResp.status === 429) {
        console.error("[tryon] Rate limited (429) — account needs more credits");
        return res.status(402).json({
          error: "Replicate rate limit hit. Add at least $5 credit to your account to enable normal usage.",
          type: "billing",
          billingUrl: "https://replicate.com/account/billing#billing",
        });
      }

      if (!startResp.ok) {
        console.error("[tryon] API error:", JSON.stringify(prediction).slice(0, 300));
        return res.status(502).json({ error: prediction?.detail || "Replicate API error" });
      }

      console.log(`[tryon] id=${prediction.id} status=${prediction.status}`);

      if (prediction.status === "succeeded" && prediction.output) {
        const out = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
        return res.json({ resultUrl: out });
      }
      if (prediction.status === "failed" || prediction.status === "canceled") {
        return res.status(502).json({ error: prediction.error || "Prediction failed" });
      }

      // Poll
      const pollUrl  = `https://api.replicate.com/v1/predictions/${prediction.id}`;
      const deadline = Date.now() + MAX_POLL_MS;
      let attempt    = 0;

      while (Date.now() < deadline) {
        await new Promise(r => setTimeout(r, 3000));
        attempt++;
        console.log(`[tryon] Poll #${attempt}…`);

        let poll: any;
        try {
          const pr = await fetchWithTimeout(
            pollUrl,
            { headers: { Authorization: `Bearer ${token}` } },
            12_000
          );
          poll = await pr.json();
        } catch (e: any) {
          console.warn("[tryon] Poll error:", e.message);
          continue;
        }

        console.log("[tryon] Poll status:", poll.status);

        if (poll.status === "succeeded") {
          const out = Array.isArray(poll.output) ? poll.output[0] : poll.output;
          return res.json({ resultUrl: out });
        }
        if (poll.status === "failed" || poll.status === "canceled") {
          return res.status(502).json({ error: poll.error || "Generation failed" });
        }
      }

      return res.status(504).json({ error: "AI took too long — please try again." });

    } catch (err: any) {
      console.error("[tryon] Error:", err);
      if (!res.headersSent) res.status(500).json({ error: err.message || "Internal server error" });
    }
  });

  return httpServer;
}
