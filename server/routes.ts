import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // POST /api/tryon
  // Accepts: { personImage: base64 string, garmentImage: base64 string }
  // Calls Replicate IDM-VTON model and polls until done
  // Returns: { resultUrl: string }
  app.post("/api/tryon", async (req, res) => {
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

      // Start prediction using IDM-VTON (virtual try-on model)
      const startResp = await fetch("https://api.replicate.com/v1/models/cuuupid/idm-vton/predictions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Prefer: "wait=60",
        },
        body: JSON.stringify({
          input: {
            human_img: personImage,
            garm_img: garmentImage,
            garment_des: "a clothing item",
            is_checked: true,
            is_checked_crop: false,
            denoise_steps: 30,
            seed: 42,
          },
        }),
      });

      const prediction = await startResp.json() as any;

      if (!startResp.ok) {
        console.error("Replicate API error:", prediction);
        return res.status(502).json({ error: prediction?.detail || "Replicate API error" });
      }

      // If already completed (Prefer: wait worked)
      if (prediction.status === "succeeded" && prediction.output) {
        const output = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
        return res.json({ resultUrl: output });
      }

      // Otherwise poll
      const predictionId = prediction.id;
      const pollUrl = `https://api.replicate.com/v1/predictions/${predictionId}`;
      let attempts = 0;
      const maxAttempts = 60;

      while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 2000));
        attempts++;

        const pollResp = await fetch(pollUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const poll = await pollResp.json() as any;

        if (poll.status === "succeeded") {
          const output = Array.isArray(poll.output) ? poll.output[0] : poll.output;
          return res.json({ resultUrl: output });
        }

        if (poll.status === "failed" || poll.status === "canceled") {
          return res.status(502).json({ error: poll.error || "Try-on generation failed" });
        }
      }

      return res.status(504).json({ error: "Timed out waiting for result" });

    } catch (err: any) {
      console.error("Try-on error:", err);
      return res.status(500).json({ error: err.message || "Internal server error" });
    }
  });

  return httpServer;
}
