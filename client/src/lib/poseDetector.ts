/**
 * Pose detection using TensorFlow.js MoveNet (SINGLEPOSE_LIGHTNING).
 * The model is loaded lazily and cached — only fetched the first time a photo is uploaded.
 */
import type * as PoseDetectionTypes from "@tensorflow-models/pose-detection";

export interface BodyRegion {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PoseRegions {
  tops:     BodyRegion | null;
  bottoms:  BodyRegion | null;
  detected: boolean;
}

type DetectorType = PoseDetectionTypes.PoseDetector;

let detectorPromise: Promise<DetectorType> | null = null;

async function getDetector(): Promise<DetectorType> {
  if (detectorPromise) return detectorPromise;

  detectorPromise = (async () => {
    // Dynamic imports keep TF.js out of the initial bundle
    const tf            = await import("@tensorflow/tfjs-core");
    await import("@tensorflow/tfjs-backend-webgl");
    await tf.ready();

    const poseDetection = await import("@tensorflow-models/pose-detection");
    return poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
    );
  })();

  return detectorPromise;
}

/**
 * Analyse an already-loaded HTMLImageElement and return pixel-space body
 * regions for tops and bottoms garment placement.
 * Falls back gracefully — if pose can't be detected, returns detected:false
 * so the caller can use the proportional fallback.
 */
export async function detectPoseRegions(
  img: HTMLImageElement
): Promise<PoseRegions> {
  const empty: PoseRegions = { tops: null, bottoms: null, detected: false };

  try {
    const detector = await getDetector();
    const poses = await detector.estimatePoses(img, { flipHorizontal: false });

    if (!poses.length) return empty;

    const kp  = poses[0].keypoints;
    const get = (name: string) => kp.find(k => k.name === name);

    const lShoulder = get("left_shoulder");
    const rShoulder = get("right_shoulder");
    const lHip      = get("left_hip");
    const rHip      = get("right_hip");
    const lKnee     = get("left_knee");
    const rKnee     = get("right_knee");
    const lAnkle    = get("left_ankle");
    const rAnkle    = get("right_ankle");

    const MIN_SCORE = 0.25;
    const ok = (...pts: (PoseDetectionTypes.Keypoint | undefined)[]) =>
      pts.every(p => p && (p.score ?? 0) >= MIN_SCORE);

    if (!ok(lShoulder, rShoulder, lHip, rHip)) return empty;

    // ── Tops region ──────────────────────────────────────────────────
    const shoulderCX   = (lShoulder!.x + rShoulder!.x) / 2;
    const shoulderCY   = (lShoulder!.y + rShoulder!.y) / 2;
    const hipCX        = (lHip!.x + rHip!.x) / 2;
    const hipCY        = (lHip!.y + rHip!.y) / 2;
    const shoulderSpan = Math.abs(rShoulder!.x - lShoulder!.x);
    const torsoH       = hipCY - shoulderCY;

    const tW: number = shoulderSpan * 1.55;
    const tH: number = torsoH * 1.25;
    const tops: BodyRegion = {
      x: shoulderCX - tW / 2,
      y: shoulderCY - tH * 0.10,
      w: tW,
      h: tH,
    };

    // ── Bottoms region ────────────────────────────────────────────────
    const hipSpan = Math.abs(rHip!.x - lHip!.x);

    let legH: number;
    if (ok(lAnkle, rAnkle)) {
      const ankleCY = (lAnkle!.y + rAnkle!.y) / 2;
      legH = ankleCY - hipCY;
    } else if (ok(lKnee, rKnee)) {
      const kneeCY = (lKnee!.y + rKnee!.y) / 2;
      legH = (kneeCY - hipCY) * 2.1;
    } else {
      legH = torsoH * 1.6;
    }

    const bW: number = hipSpan * 1.65;
    const bH: number = legH * 1.05;
    const bottoms: BodyRegion = {
      x: hipCX - bW / 2,
      y: hipCY - bH * 0.04,
      w: bW,
      h: bH,
    };

    return { tops, bottoms, detected: true };
  } catch (err) {
    console.warn("[pose] detection failed:", err instanceof Error ? err.message : String(err));
    return empty;
  }
}
