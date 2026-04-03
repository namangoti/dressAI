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
  face:     BodyRegion | null;  // face bounding box in original photo pixels
  neckY:    number | null;       // Y pixel where face/neck transitions to chest
  hipCY:    number | null;       // Y pixel center of hips (lower body cut line)
  detected: boolean;
}

type DetectorType = PoseDetectionTypes.PoseDetector;

let detectorPromise: Promise<DetectorType> | null = null;

async function getDetector(): Promise<DetectorType> {
  if (detectorPromise) return detectorPromise;

  detectorPromise = (async () => {
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
 * regions for tops/bottoms garment placement plus face/neck/hip for restoration.
 */
export async function detectPoseRegions(
  img: HTMLImageElement
): Promise<PoseRegions> {
  const empty: PoseRegions = {
    tops: null, bottoms: null,
    face: null, neckY: null, hipCY: null,
    detected: false,
  };

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
    const nose      = get("nose");
    const lEye      = get("left_eye");
    const rEye      = get("right_eye");
    const lEar      = get("left_ear");
    const rEar      = get("right_ear");

    const MIN_SCORE = 0.25;
    const ok = (...pts: (PoseDetectionTypes.Keypoint | undefined)[]) =>
      pts.every(p => p && (p.score ?? 0) >= MIN_SCORE);

    if (!ok(lShoulder, rShoulder, lHip, rHip)) return empty;

    const shoulderCX   = (lShoulder!.x + rShoulder!.x) / 2;
    const shoulderCY   = (lShoulder!.y + rShoulder!.y) / 2;
    const hipCX        = (lHip!.x + rHip!.x) / 2;
    const hipCY        = (lHip!.y + rHip!.y) / 2;
    const shoulderSpan = Math.abs(rShoulder!.x - lShoulder!.x);
    const torsoH       = hipCY - shoulderCY;

    // ── Tops region ──────────────────────────────────────────────
    const tW: number = shoulderSpan * 1.55;
    const tH: number = torsoH * 1.25;
    const tops: BodyRegion = {
      x: shoulderCX - tW / 2,
      y: shoulderCY - tH * 0.10,
      w: tW,
      h: tH,
    };

    // ── Bottoms region ───────────────────────────────────────────
    const hipSpan = Math.abs(rHip!.x - lHip!.x);
    let legH: number;
    if (ok(lAnkle, rAnkle)) {
      legH = ((lAnkle!.y + rAnkle!.y) / 2) - hipCY;
    } else if (ok(lKnee, rKnee)) {
      legH = (((lKnee!.y + rKnee!.y) / 2) - hipCY) * 2.1;
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

    // ── Face region ──────────────────────────────────────────────
    let face: BodyRegion | null = null;
    let neckY: number | null    = null;

    if (ok(nose, lEye, rEye)) {
      const eyeMidY     = (lEye!.y + rEye!.y) / 2;
      const eyeMidX     = (lEye!.x + rEye!.x) / 2;
      const eyeSpan     = Math.abs(rEye!.x - lEye!.x);
      const noseEyeDist = Math.max(1, nose!.y - eyeMidY);

      // Head width: prefer ear-to-ear span, fall back to eye span estimate
      const headW = ok(lEar, rEar)
        ? Math.abs(rEar!.x - lEar!.x) * 1.35
        : eyeSpan * 3.8;

      // Forehead extends ~1.8× the nose-eye distance above the eyes
      // Chin extends ~2.2× the nose-eye distance below the nose
      const foreheadY = eyeMidY - noseEyeDist * 1.8;
      const chinY     = nose!.y   + noseEyeDist * 2.2;

      face = {
        x: eyeMidX - headW / 2,
        y: foreheadY,
        w: headW,
        h: chinY - foreheadY,
      };

      // neckY: midpoint between chin and shoulder line
      neckY = (chinY + shoulderCY) / 2;
    }

    return { tops, bottoms, face, neckY, hipCY, detected: true };
  } catch (err) {
    console.warn("[pose] detection failed:", err instanceof Error ? err.message : String(err));
    return empty;
  }
}
