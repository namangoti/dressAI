import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft, Check, Camera, Image as ImageIcon,
  RotateCcw, Share2, Heart, Ruler, Weight, Shirt, Sparkles,
  Loader2, AlertCircle, Clock, Wand2, ScanLine,
  ZoomIn, ZoomOut, X, Maximize2, RefreshCw, Move,
} from "lucide-react";
import { useLocation } from "wouter";
import { detectPoseRegions, type PoseRegions } from "@/lib/poseDetector";

import garment1 from "@/assets/images/tshirt-black.png";
import garment2 from "@/assets/images/tshirt-white.png";
import garment3 from "@/assets/images/tshirt-grey.png";
import garment4 from "@/assets/images/tshirt-red.png";
import garment5 from "@/assets/images/tshirt-blue.png";
import garment6 from "@/assets/images/tshirt-graphic.png";
import garment7 from "@/assets/images/mens-jeans.png";
import garment8 from "@/assets/images/jeans-black-slim.png";
import garment9 from "@/assets/images/jeans-blue-denim.png";
import garment10 from "@/assets/images/trousers-khaki-chino.png";

/* ── Outfit catalogue ─────────────────────────────────────── */
type GarmentType = "tops" | "bottoms";
const GARMENTS = [
  { id: 1,  image: garment1,  name: "Black T-Shirt",     price: "₹599",  tag: "Bestseller", type: "tops" as GarmentType,
    fallbackM: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=600&q=80" },
  { id: 2,  image: garment2,  name: "White T-Shirt",     price: "₹499",  tag: "New",        type: "tops" as GarmentType,
    fallbackM: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1485231183945-fffde7ae021e?w=600&q=80" },
  { id: 3,  image: garment3,  name: "Grey T-Shirt",      price: "₹549",  tag: "",           type: "tops" as GarmentType,
    fallbackM: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80" },
  { id: 4,  image: garment4,  name: "Red T-Shirt",       price: "₹649",  tag: "Hot",        type: "tops" as GarmentType,
    fallbackM: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" },
  { id: 5,  image: garment5,  name: "Blue T-Shirt",      price: "₹599",  tag: "",           type: "tops" as GarmentType,
    fallbackM: "https://images.unsplash.com/photo-1473621038790-b778b4de3b84?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=600&q=80" },
  { id: 6,  image: garment6,  name: "Graphic T-Shirt",   price: "₹799",  tag: "Trending",   type: "tops" as GarmentType,
    fallbackM: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80" },
  { id: 7,  image: garment7,  name: "Classic Blue Jeans", price: "₹1,299", tag: "Bestseller", type: "bottoms" as GarmentType,
    fallbackM: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80" },
  { id: 8,  image: garment8,  name: "Black Slim Jeans",  price: "₹1,199", tag: "New",        type: "bottoms" as GarmentType,
    fallbackM: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&q=80" },
  { id: 9,  image: garment9,  name: "Blue Denim Jeans",  price: "₹1,099", tag: "",           type: "bottoms" as GarmentType,
    fallbackM: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80" },
  { id: 10, image: garment10, name: "Khaki Chinos",      price: "₹999",  tag: "Hot",        type: "bottoms" as GarmentType,
    fallbackM: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
type Size   = typeof SIZES[number];
type Gender = "man" | "woman";

const SKIN_TONES = [
  { key: "fair",   color: "#FDDBB4" },
  { key: "light",  color: "#E8B88A" },
  { key: "medium", color: "#C68642" },
  { key: "tan",    color: "#A0522D" },
  { key: "dark",   color: "#4A2912" },
];

/* ── Canvas utilities ─────────────────────────────────────── */

/**
 * Load an <img> from any src. Rejects with a proper Error (not a browser Event).
 */
function loadImage(src: string, crossOrigin = false): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (crossOrigin) img.crossOrigin = "anonymous";
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error(`Image load failed: ${src.slice(0, 80)}`));
    img.src = src;
  });
}

/**
 * Flood-fill background removal seeded from all border pixels.
 * Works for any uniform-background garment PNG.
 */
function stripBackground(imgData: ImageData): ImageData {
  const { width, height, data } = imgData;
  const visited = new Uint8Array(width * height);
  const queue: number[] = [];

  const seed = (i: number) => { if (!visited[i]) { visited[i] = 1; queue.push(i); } };
  for (let x = 0; x < width;  x++) { seed(x); seed((height - 1) * width + x); }
  for (let y = 1; y < height - 1; y++) { seed(y * width); seed(y * width + width - 1); }

  const bgR = data[0], bgG = data[1], bgB = data[2];
  const out  = new ImageData(new Uint8ClampedArray(data), width, height);
  const THRESH = 42;

  let head = 0;
  while (head < queue.length) {
    const idx = queue[head++];
    const p   = idx * 4;
    if (Math.abs(data[p] - bgR) + Math.abs(data[p+1] - bgG) + Math.abs(data[p+2] - bgB) > THRESH) continue;
    out.data[p + 3] = 0;
    const x = idx % width, y = (idx / width) | 0;
    if (x > 0          && !visited[idx-1])     { visited[idx-1]     = 1; queue.push(idx-1); }
    if (x < width - 1  && !visited[idx+1])     { visited[idx+1]     = 1; queue.push(idx+1); }
    if (y > 0          && !visited[idx-width])  { visited[idx-width] = 1; queue.push(idx-width); }
    if (y < height - 1 && !visited[idx+width])  { visited[idx+width] = 1; queue.push(idx+width); }
  }
  return out;
}

/**
 * Load a garment PNG as a canvas with background stripped.
 * Uses same-origin asset URL directly — no fetch/FileReader needed.
 */
function processGarment(src: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const w = img.naturalWidth  || 300;
        const h = img.naturalHeight || 300;
        const c   = document.createElement("canvas");
        c.width   = w;
        c.height  = h;
        const ctx = c.getContext("2d", { willReadFrequently: true });
        if (!ctx) { resolve(c); return; } // canvas unavailable — return blank, don't crash
        ctx.drawImage(img, 0, 0);
        try {
          ctx.putImageData(stripBackground(ctx.getImageData(0, 0, w, h)), 0, 0);
        } catch {
          // getImageData can fail (CORS/security) — still resolve with drawn canvas
        }
        resolve(c);
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    };
    img.onerror = () => reject(new Error(`Failed to load garment: ${src.slice(0, 60)}`));
    img.src = src;
  });
}

/**
 * Draw a garment in horizontal strips, linearly interpolating the width
 * from `topScale` (fraction of garW at the top edge) to `bottomScale`
 * (fraction of garW at the bottom edge). This creates a perspective-warp
 * effect that follows the body's contour (e.g. wider at shoulders, narrower
 * at waist for tops; wider at hips, narrower at ankles for bottoms).
 *
 * The strips are drawn in the caller's coordinate system (already translated
 * / rotated to the garment center). garW/garH define the full garment rect.
 */
function drawWarpedStrips(
  ctx: CanvasRenderingContext2D,
  garment: HTMLCanvasElement,
  garW: number,
  garH: number,
  topScale: number,
  bottomScale: number,
) {
  const STRIPS = 32;
  const srcH = garment.height;
  const srcW = garment.width;
  const stripH = garH / STRIPS;
  const srcStripH = srcH / STRIPS;

  for (let i = 0; i < STRIPS; i++) {
    const t = STRIPS <= 1 ? 0 : i / (STRIPS - 1);
    const scale = topScale + (bottomScale - topScale) * t;
    const stripW = garW * scale;
    const stripX = -stripW / 2;
    const stripY = -garH / 2 + i * stripH;

    ctx.drawImage(
      garment,
      0, Math.round(i * srcStripH), srcW, Math.ceil(srcStripH) + 1,
      stripX, stripY, stripW, stripH + 0.5,
    );
  }
}

/**
 * Composite a garment onto a person photo.
 *
 * Key principles:
 * - TOPS are anchored at shoulder level and scaled by shoulder width.
 *   They taper from shoulder width to hip width for a body-hugging look.
 * - BOTTOMS are anchored at hip level and scaled by hip width.
 *   They taper from hip width to ankle width for a realistic leg fit.
 * - When pose detection is unavailable, proportional fallbacks are used
 *   with separate coordinate ranges for tops (14–62% height) and
 *   bottoms (46–98% height).
 */
async function composite(
  personDataUrl: string,
  garmentCanvas: HTMLCanvasElement,
  type: GarmentType,
  poseRegions?: PoseRegions | null,
): Promise<string> {
  const person = await loadImage(personDataUrl);
  const pw = person.naturalWidth  || person.width  || 400;
  const ph = person.naturalHeight || person.height || 600;

  const out = document.createElement("canvas");
  out.width  = pw;
  out.height = ph;
  const ctx  = out.getContext("2d");
  if (!ctx) return personDataUrl;

  ctx.drawImage(person, 0, 0, pw, ph);

  if (garmentCanvas.width <= 0 || garmentCanvas.height <= 0) {
    return out.toDataURL("image/jpeg", 0.93);
  }

  let garX: number, garY: number, garW: number, garH: number;
  let topWarpScale = 1;
  let bottomWarpScale = 1;
  let tiltAngle = 0;
  const MAX_TILT = 12 * Math.PI / 180;

  console.log("[composite] Clothing type:", type, "| Image size:", pw, "×", ph);

  if (type === "tops") {
    if (poseRegions?.detected && poseRegions.shoulderL && poseRegions.shoulderR
        && poseRegions.hipL && poseRegions.hipR && poseRegions.shoulderMidY != null && poseRegions.hipMidY != null) {
      const shoulderMidX = (poseRegions.shoulderL.x + poseRegions.shoulderR.x) / 2;
      const shoulderW = poseRegions.shoulderSpanPx! * 1.35;
      const torsoTop = poseRegions.shoulderMidY - (poseRegions.hipMidY - poseRegions.shoulderMidY) * 0.08;
      const torsoBottom = poseRegions.hipMidY;

      garW = shoulderW;
      garH = torsoBottom - torsoTop;
      garX = shoulderMidX - garW / 2;
      garY = torsoTop;

      const taperRatio = Math.min(1, (poseRegions.hipSpanPx ?? shoulderW) / (poseRegions.shoulderSpanPx ?? shoulderW));
      topWarpScale = 1;
      bottomWarpScale = 0.6 + taperRatio * 0.4;

      const sLeft = poseRegions.shoulderL.x <= poseRegions.shoulderR.x ? poseRegions.shoulderL : poseRegions.shoulderR;
      const sRight = poseRegions.shoulderL.x <= poseRegions.shoulderR.x ? poseRegions.shoulderR : poseRegions.shoulderL;
      tiltAngle = Math.max(-MAX_TILT, Math.min(MAX_TILT, Math.atan2(sRight.y - sLeft.y, sRight.x - sLeft.x)));
    } else {
      garW = pw * 0.6;
      garH = ph * 0.4;
      garX = (pw - garW) / 2;
      garY = ph * 0.1;
      bottomWarpScale = 0.88;
    }

    const maxBottom = ph * 0.55;
    if (garY + garH > maxBottom) {
      garH = maxBottom - garY;
    }
    console.log("[composite] TOP placed at y:", Math.round(garY), "to", Math.round(garY + garH));

    const cx = garX + garW / 2;
    const cy = garY + garH / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tiltAngle);
    ctx.shadowColor   = "rgba(0,0,0,0.18)";
    ctx.shadowBlur    = 12;
    ctx.shadowOffsetY = 4;
    ctx.globalAlpha   = 0.94;
    drawWarpedStrips(ctx, garmentCanvas, garW, garH, topWarpScale, bottomWarpScale);
    ctx.restore();

    try {
      const lit = document.createElement("canvas");
      lit.width  = garmentCanvas.width;
      lit.height = garmentCanvas.height;
      const lCtx = lit.getContext("2d")!;
      lCtx.drawImage(person, garX, garY, garW, garH, 0, 0, garmentCanvas.width, garmentCanvas.height);
      lCtx.globalCompositeOperation = "destination-in";
      lCtx.drawImage(garmentCanvas, 0, 0);
      lCtx.globalCompositeOperation = "source-over";
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      ctx.globalAlpha = 0.25;
      ctx.translate(cx, cy);
      ctx.rotate(tiltAngle);
      drawWarpedStrips(ctx, lit, garW, garH, topWarpScale, bottomWarpScale);
      ctx.restore();
    } catch {}
  } else {
    if (poseRegions?.detected && poseRegions.hipL && poseRegions.hipR && poseRegions.hipMidY != null) {
      const hipMidX = poseRegions.bodyMidX ?? (poseRegions.hipL.x + poseRegions.hipR.x) / 2;
      const hipW = (poseRegions.hipSpanPx ?? pw * 0.3) * 1.4;
      garY = poseRegions.hipMidY;

      let legBottom: number;
      if (poseRegions.ankleL && poseRegions.ankleR) {
        legBottom = Math.max(poseRegions.ankleL.y, poseRegions.ankleR.y) + ph * 0.03;
      } else if (poseRegions.kneeL && poseRegions.kneeR) {
        const kneeAvgY = (poseRegions.kneeL.y + poseRegions.kneeR.y) / 2;
        legBottom = kneeAvgY + (kneeAvgY - garY) * 1.1;
      } else {
        legBottom = ph * 0.97;
      }

      garW = hipW;
      garH = legBottom - garY;
      garX = hipMidX - garW / 2;

      const hLeft = poseRegions.hipL.x <= poseRegions.hipR.x ? poseRegions.hipL : poseRegions.hipR;
      const hRight = poseRegions.hipL.x <= poseRegions.hipR.x ? poseRegions.hipR : poseRegions.hipL;
      tiltAngle = Math.max(-MAX_TILT, Math.min(MAX_TILT, Math.atan2(hRight.y - hLeft.y, hRight.x - hLeft.x)));
    } else {
      garW = pw * 0.5;
      garY = ph * 0.5;
      garH = ph * 0.47;
      garX = (pw - garW) / 2;
    }

    if (garY < ph * 0.45) {
      garH -= (ph * 0.45 - garY);
      garY = ph * 0.45;
    }
    if (garH < ph * 0.15) garH = ph * 0.15;
    if (garY + garH > ph * 0.98) garH = ph * 0.98 - garY;

    console.log("[composite] BOTTOM placed at y:", Math.round(garY), "to", Math.round(garY + garH), "(lower body, starts at", Math.round(garY / ph * 100) + "%)");

    const cx = garX + garW / 2;
    const cy = garY + garH / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tiltAngle);
    ctx.shadowColor   = "rgba(0,0,0,0.15)";
    ctx.shadowBlur    = 10;
    ctx.shadowOffsetY = 3;
    ctx.globalAlpha   = 0.92;
    ctx.drawImage(garmentCanvas, -garW / 2, -garH / 2, garW, garH);
    ctx.restore();
  }

  return out.toDataURL("image/jpeg", 0.93);
}

/**
 * Client-side body restoration pass applied after the AI try-on result arrives.
 *
 * Problem: IDM-VTON regenerates the full image at a lower resolution (~768×1024),
 * causing (1) face blur and (2) garment hem misalignment.
 *
 * Fix: Using pose keypoints, copy the face region from the original high-res
 * photo back onto the AI result (fixes blur), and for tops garments also copy
 * the lower body below the hip line (anchors the hem naturally).
 *
 * Both regions use feathered ellipse/gradient masks for smooth blending.
 */
async function restoreBodyRegions(
  aiResultUrl:     string,
  originalPhotoUrl: string,
  poseRegions:     PoseRegions | null,
  garmentType:     GarmentType,
): Promise<string> {
  // Load AI result with crossOrigin so we can manipulate pixels in canvas
  const [aiImg, origImg] = await Promise.all([
    loadImage(aiResultUrl, true),
    loadImage(originalPhotoUrl),
  ]);

  const aiW   = aiImg.naturalWidth   || aiImg.width   || 768;
  const aiH   = aiImg.naturalHeight  || aiImg.height  || 1024;
  const origW = origImg.naturalWidth  || origImg.width  || 768;
  const origH = origImg.naturalHeight || origImg.height || 1024;

  const out = document.createElement("canvas");
  out.width  = aiW;
  out.height = aiH;
  const ctx  = out.getContext("2d")!;

  // Base layer: AI result
  ctx.drawImage(aiImg, 0, 0, aiW, aiH);

  // Scale factors from original photo pixels → AI result pixels
  const sx = aiW  / origW;
  const sy = aiH  / origH;

  // ── Derive face ellipse, neckY cut, and hip cut line ────────────
  // The face restore region spans from forehead (face.y) down to neckY,
  // using neckY as the explicit lower boundary as specified.
  let faceCX: number, faceRX: number;
  let faceTop_ai: number, restoreBottom_ai: number;  // vertical span
  let hipY_ai: number;

  if (poseRegions?.detected && poseRegions.face && poseRegions.hipCY !== null) {
    const f = poseRegions.face;
    faceCX          = (f.x + f.w / 2) * sx;
    faceRX          = (f.w / 2 + 4)   * sx;  // slight outward padding
    faceTop_ai      = f.y * sy;
    // Use neckY as the lower boundary (forehead → neck); falls back to chin if absent
    restoreBottom_ai = (poseRegions.neckY ?? (f.y + f.h)) * sy;
    hipY_ai          = poseRegions.hipCY * sy;
  } else {
    // Proportional fallback: face occupies top ~22% height, centred, ~30% width
    faceCX           = aiW * 0.50;
    faceRX           = aiW * 0.15;           // ≈ half of 30% width
    faceTop_ai       = aiH * 0.01;           // near the very top
    restoreBottom_ai = aiH * 0.22;           // down to 22% height
    hipY_ai          = aiH * 0.60;
  }

  // Derived ellipse geometry from the forehead→neckY span
  const faceCY = (faceTop_ai + restoreBottom_ai) / 2;
  const faceRY = (restoreBottom_ai - faceTop_ai) / 2;

  /**
   * Helper: paint an elliptical feathered white mask onto `mCtx`.
   * Technique: create a 2×2 radial gradient canvas (opaque centre → transparent
   * edge) and scale-draw it into the desired ellipse bounding box.  This avoids
   * canvas transform tricks and works in all browsers.
   */
  function drawEllipseMask(
    mCtx: CanvasRenderingContext2D,
    cx: number, cy: number,
    rx: number, ry: number,
    feather: number,
  ) {
    const g2    = document.createElement("canvas");
    g2.width    = 4; g2.height = 4;
    const g2Ctx = g2.getContext("2d")!;
    const grad  = g2Ctx.createRadialGradient(2, 2, 0.4, 2, 2, 2);
    grad.addColorStop(0,    "rgba(255,255,255,1)");
    grad.addColorStop(0.55, "rgba(255,255,255,1)");
    grad.addColorStop(1,    "rgba(255,255,255,0)");
    g2Ctx.fillStyle = grad;
    g2Ctx.fillRect(0, 0, 4, 4);

    const bx = cx - rx - feather;
    const by = cy - ry - feather;
    mCtx.drawImage(g2, bx, by, (rx + feather) * 2, (ry + feather) * 2);
  }

  // ── 1. FACE RESTORE ─────────────────────────────────────────────
  // Copy original face onto AI result with feathered ellipse mask
  try {
    const patch  = document.createElement("canvas");
    patch.width  = aiW; patch.height = aiH;
    const pCtx   = patch.getContext("2d")!;
    pCtx.drawImage(origImg, 0, 0, aiW, aiH);

    const maskC  = document.createElement("canvas");
    maskC.width  = aiW; maskC.height = aiH;
    const mCtx   = maskC.getContext("2d")!;
    const feather = Math.min(faceRX, faceRY) * 0.45;
    drawEllipseMask(mCtx, faceCX, faceCY, faceRX, faceRY, feather);

    pCtx.globalCompositeOperation = "destination-in";
    pCtx.drawImage(maskC, 0, 0);
    pCtx.globalCompositeOperation = "source-over";

    ctx.drawImage(patch, 0, 0);
  } catch (e) {
    console.warn("[restore] face patch failed:", e);
  }

  // ── 2. LOWER BODY RESTORE (tops only) ───────────────────────────
  // Copy original legs/lower body below hip line with feathered top edge
  if (garmentType === "tops") {
    try {
      const patch  = document.createElement("canvas");
      patch.width  = aiW; patch.height = aiH;
      const pCtx   = patch.getContext("2d")!;
      pCtx.drawImage(origImg, 0, 0, aiW, aiH);

      const maskC  = document.createElement("canvas");
      maskC.width  = aiW; maskC.height = aiH;
      const mCtx   = maskC.getContext("2d")!;

      // Shift cut line 12% of image height below hipCY so the paste
      // starts cleanly below the t-shirt hem rather than through it.
      const cutY    = hipY_ai + aiH * 0.12;
      const feather = aiH * 0.06;
      const grad    = mCtx.createLinearGradient(0, cutY - feather, 0, cutY + feather);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(1, "rgba(255,255,255,1)");
      mCtx.fillStyle = grad;
      mCtx.fillRect(0, Math.max(0, cutY - feather), aiW, aiH);

      pCtx.globalCompositeOperation = "destination-in";
      pCtx.drawImage(maskC, 0, 0);
      pCtx.globalCompositeOperation = "source-over";

      ctx.drawImage(patch, 0, 0);
    } catch (e) {
      console.warn("[restore] lower body patch failed:", e);
    }
  }

  try {
    return out.toDataURL("image/jpeg", 0.93);
  } catch {
    // Canvas tainted (CORS) — return original AI URL unchanged
    console.warn("[restore] canvas tainted — skipping restoration");
    return aiResultUrl;
  }
}

/* ════════════════════════════════════════════════════════════ */
export default function TryOn() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<1 | 2>(1);

  /* ── profile ── */
  const [gender,       setGender]       = useState<Gender>("man");
  const [height,       setHeight]       = useState(170);
  const [weight,       setWeight]       = useState(70);
  const [size,         setSize]         = useState<Size>("M");
  const [waistSize,    setWaistSize]    = useState(32);
  const [skinTone,     setSkinTone]     = useState("medium");
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [photoError,    setPhotoError]    = useState<string | null>(null);

  /* ── outfit state ── */
  const [garmentFilter, setGarmentFilter] = useState<GarmentType>("tops");
  const [selectedId,  setSelectedId]  = useState(1);
  const [saved,       setSaved]       = useState(false);
  const [tryOnUrl,    setTryOnUrl]    = useState<string | null>(null);
  const [tryOnMode,   setTryOnMode]   = useState<"canvas" | "ai">("canvas");
  const [compositing, setCompositing] = useState(false);

  /* ── pose detection ── */
  const [poseRegions,   setPoseRegions]   = useState<PoseRegions | null>(null);
  const [poseDetecting, setPoseDetecting] = useState(false);
  const [poseStatus,    setPoseStatus]    = useState<"idle"|"detecting"|"done"|"fallback">("idle");

  /* ── AI generation state ── */
  const [aiLoading,    setAiLoading]    = useState(false);
  const [aiEnhancing,  setAiEnhancing]  = useState(false);
  const [aiError,      setAiError]      = useState<string | null>(null);
  const [billingError, setBillingError] = useState(false);
  const [elapsed,      setElapsed]      = useState(0);
  const [aiResultUrl,  setAiResultUrl]  = useState<string | null>(null);
  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const selectedIdRef = useRef(selectedId);

  /* ── Fullscreen preview + zoom state ── */
  const [previewOpen, setPreviewOpen] = useState(false);
  const [zoom,        setZoom]        = useState(1);
  const [pan,         setPan]         = useState({ x: 0, y: 0 });
  const [isPanning,   setIsPanning]   = useState(false);
  const panStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });
  const imgRef   = useRef<HTMLImageElement>(null);

  /* Reset zoom/pan when preview opens or closes */
  useEffect(() => {
    if (!previewOpen) { setZoom(1); setPan({ x: 0, y: 0 }); }
  }, [previewOpen]);

  /* Clear stale AI result when garment selection changes */
  useEffect(() => {
    selectedIdRef.current = selectedId;
    setAiResultUrl(null);
    setTryOnMode("canvas");
  }, [selectedId]);

  /* Elapsed-time ticker while AI is generating */
  useEffect(() => {
    if (aiLoading) {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [aiLoading]);

  /* ── garment cache: Map<id, processed canvas> ── */
  const cache     = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const [cacheReady, setCacheReady] = useState(false);

  /* Preload & process all garments once on mount */
  useEffect(() => {
    Promise.allSettled(
      GARMENTS.map(g =>
        processGarment(g.image)
          .then(c => cache.current.set(g.id, c))
          .catch(err => console.warn("[preload] garment", g.id, "failed:", err.message))
      )
    ).finally(() => setCacheReady(true));
  }, []);

  /* Run pose detection whenever a new photo is uploaded */
  useEffect(() => {
    if (!uploadedPhoto) {
      setPoseRegions(null);
      setPoseStatus("idle");
      return;
    }
    setPoseStatus("detecting");
    setPoseDetecting(true);

    const img = new Image();
    img.onload = () => {
      detectPoseRegions(img)
        .then(regions => {
          setPoseRegions(regions);
          setPoseStatus(regions.detected ? "done" : "fallback");
        })
        .catch(() => {
          setPoseRegions(null);
          setPoseStatus("fallback");
        })
        .finally(() => setPoseDetecting(false));
    };
    img.onerror = () => {
      setPoseDetecting(false);
      setPoseStatus("fallback");
    };
    img.src = uploadedPhoto;
  }, [uploadedPhoto]);

  /* Auto-composite whenever photo, garment, cache, or pose regions change */
  const doComposite = useCallback(async (
    photo: string,
    garmentId: number,
    regions: PoseRegions | null,
  ) => {
    const garmentCanvas = cache.current.get(garmentId);
    if (!garmentCanvas) return;
    const g = GARMENTS.find(x => x.id === garmentId)!;
    setCompositing(true);
    try {
      const result = await composite(photo, garmentCanvas, g.type, regions);
      setTryOnUrl(result);
      setTryOnMode("canvas");
    } catch (err: any) {
      console.warn("[composite] failed:", err?.message ?? String(err));
      setTryOnUrl(photo);
    } finally {
      setCompositing(false);
    }
  }, []);

  useEffect(() => {
    if (uploadedPhoto && cacheReady && !poseDetecting) {
      doComposite(uploadedPhoto, selectedId, poseRegions);
    } else if (!uploadedPhoto) {
      setTryOnUrl(null);
    }
  }, [uploadedPhoto, selectedId, cacheReady, poseDetecting, poseRegions, doComposite]);

  const garment    = GARMENTS.find(g => g.id === selectedId)!;
  const fallbackUrl = gender === "man" ? garment.fallbackM : garment.fallbackF;
  const bmi         = weight / Math.pow(height / 100, 2);

  function readFile(file: File, cb: (url: string) => void) {
    setPhotoError(null);

    // Reject HEIC/HEIF — browsers can't decode them natively
    const isHeic =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      /\.(heic|heif)$/i.test(file.name);
    if (isHeic) {
      setPhotoError("iPhone HEIC photos aren't supported. Open the photo in Photos → Share → Save as JPEG, then upload the JPEG.");
      return;
    }

    const r = new FileReader();
    r.onload = e => {
      const dataUrl = e.target?.result as string;
      // Detect unknown binary type that browsers also can't render
      if (dataUrl.startsWith("data:application/octet-stream")) {
        setPhotoError("This photo format isn't supported. Please upload a JPEG or PNG file.");
        return;
      }
      cb(dataUrl);
    };
    r.readAsDataURL(file);
  }

  /* ── AI photorealistic try-on ── */
  async function runAiTryOn() {
    if (!uploadedPhoto) return;
    setAiLoading(true);
    setAiError(null);
    setBillingError(false);

    try {
      const g = GARMENTS.find(x => x.id === selectedId)!;

      const compressed = await new Promise<string>(resolve => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, 768 / Math.max(img.width, img.height));
          const c = document.createElement("canvas");
          c.width  = Math.round(img.width  * scale);
          c.height = Math.round(img.height * scale);
          c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL("image/jpeg", 0.85));
        };
        img.src = uploadedPhoto;
      });

      // Send the raw garment product image (white background) to Replicate.
      // IDM-VTON is trained on flat product photos — sending a transparent-background
      // garment causes it to lose clothing boundaries and distort the body shape.
      const garmentResp = await fetch(g.image);
      const garmentBlob = await garmentResp.blob();
      const garmentBase64 = await new Promise<string>((res, rej) => {
        const fr = new FileReader();
        fr.onload  = () => res(fr.result as string);
        fr.onerror = rej;
        fr.readAsDataURL(garmentBlob);
      });

      let garmentMaskImage: string | undefined;
      const maskRegion = g.type === "tops" ? poseRegions?.tops : poseRegions?.bottoms;
      if (poseRegions?.detected && maskRegion) {
        const refImg = await loadImage(uploadedPhoto);
        const origW  = refImg.naturalWidth  || refImg.width  || 768;
        const origH  = refImg.naturalHeight || refImg.height || 1024;
        const sc     = Math.min(1, 1024 / Math.max(origW, origH));
        const mW     = Math.round(origW * sc);
        const mH     = Math.round(origH * sc);

        const mc   = document.createElement("canvas");
        mc.width   = mW; mc.height = mH;
        const mCtx = mc.getContext("2d")!;

        mCtx.fillStyle = "#000";
        mCtx.fillRect(0, 0, mW, mH);

        const mx = Math.max(0,  maskRegion.x * sc);
        const my = Math.max(0,  maskRegion.y * sc);
        const mw = Math.min(mW - mx, maskRegion.w * sc);
        const mh = Math.min(mH - my, maskRegion.h * sc);

        if (mw > 0 && mh > 0) {
          const r  = Math.min(mw, mh) * 0.08;
          mCtx.fillStyle = "#fff";
          mCtx.beginPath();
          mCtx.roundRect(mx, my, mw, mh, r);
          mCtx.fill();
          garmentMaskImage = mc.toDataURL("image/png");
          console.log("[mask] region mask generated:", g.type, Math.round(mw), "×", Math.round(mh), "within", mW, "×", mH);
        }
      }

      const ctrl  = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 100_000);
      const resp  = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          personImage:  compressed,
          garmentImage: garmentBase64,
          garmentName:  `${g.name}, size ${size}${g.type === "bottoms" ? `, waist ${waistSize}in` : ""}, for a ${height} cm ${weight} kg ${gender}`,
          ...(garmentMaskImage ? { garmentMaskImage } : {}),
        }),
      }).finally(() => clearTimeout(timer));

      const data = await resp.json();

      if (resp.status === 402) { setBillingError(true); return; }
      if (!resp.ok) throw new Error(data.error || "AI generation failed");

      // Apply client-side body restoration (face sharpness + hem alignment)
      setAiLoading(false);
      setAiEnhancing(true);
      let finalUrl = data.resultUrl;
      try {
        finalUrl = await restoreBodyRegions(
          data.resultUrl,
          uploadedPhoto,
          poseRegions,
          g.type,
        );
      } catch (e) {
        console.warn("[enhance] body restore failed, using raw result:", e);
        finalUrl = data.resultUrl;
      } finally {
        setAiEnhancing(false);
      }

      // Guard: discard result if the user switched garments while AI was running
      if (selectedIdRef.current !== g.id) return;
      setAiResultUrl(finalUrl);
      setTryOnUrl(finalUrl);
      setTryOnMode("ai");
    } catch (err: any) {
      if (err.name === "AbortError") {
        setAiError("Timed out — please try again");
      } else {
        setAiError(err.message || "Something went wrong");
      }
    } finally {
      setAiLoading(false);
      setAiEnhancing(false);
    }
  }

  /* ════════════════════════════════════════════════════════════ */
  return (
    <MobileLayout>
      <div className="h-full flex flex-col bg-background">

        {/* ═══ STEP 1: Profile Setup ══════════════════════════ */}
        {step === 1 && (
          <div className="flex-1 flex flex-col overflow-y-auto">
            <header className="flex items-center gap-3 px-5 pt-4 pb-2 shrink-0">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setLocation("/")}>
                <ChevronLeft size={22} />
              </Button>
              <div>
                <h1 className="text-lg font-bold leading-tight">Your Profile</h1>
                <p className="text-xs text-muted-foreground">Upload your photo for instant try-on</p>
              </div>
            </header>

            <div className="flex-1 px-5 pb-4 space-y-5">

              {/* Upload photo */}
              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  Your Photo <span className="text-primary font-bold">★ Required for Try-On</span>
                </p>
                {uploadedPhoto ? (
                  <div className="flex items-center gap-3 p-3 rounded-2xl border border-primary/40 bg-primary/5">
                    <div className="w-14 rounded-xl overflow-hidden border border-border shrink-0" style={{ height: 72 }}>
                      <img src={uploadedPhoto} alt="You" className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-600 flex items-center gap-1">
                        <Check size={14} /> Photo ready
                      </p>
                      <p className="text-xs text-muted-foreground">Try-on updates instantly as you pick outfits</p>
                    </div>
                    <button onClick={() => { setUploadedPhoto(null); setTryOnUrl(null); }}
                      className="text-muted-foreground hover:text-destructive p-1">
                      <RotateCcw size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <label className="flex-1 flex items-center justify-center gap-1.5 h-12 rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 cursor-pointer text-sm font-semibold text-primary hover:bg-primary/10 transition-colors" data-testid="label-upload-photo">
                      <Camera size={16} /> Upload Photo
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, setUploadedPhoto); }} />
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-1.5 h-12 rounded-2xl border-2 border-dashed border-border bg-secondary/30 cursor-pointer text-sm text-muted-foreground hover:bg-secondary/60 transition-colors" data-testid="label-camera-photo">
                      <ImageIcon size={16} /> Take Photo
                      <input type="file" accept="image/jpeg,image/png,image/webp" capture="user" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, setUploadedPhoto); }} />
                    </label>
                  </div>
                )}

                {/* Body scan status — visible while/after pose detection runs */}
                {uploadedPhoto && poseStatus !== "idle" && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground" data-testid="status-body-scan">
                    {poseStatus === "detecting" ? (
                      <>
                        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span>Scanning your body…</span>
                      </>
                    ) : poseStatus === "done" ? (
                      <>
                        <Check size={12} className="text-green-600 shrink-0" />
                        <span className="text-green-700">Body scan complete</span>
                      </>
                    ) : (
                      <>
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                        <span>Using standard fit</span>
                      </>
                    )}
                  </div>
                )}

                {/* HEIC / unsupported format error */}
                {photoError && (
                  <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-3 py-2.5">
                    <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800">{photoError}</p>
                  </div>
                )}
              </section>

              {/* Gender */}
              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Gender</p>
                <div className="flex gap-2">
                  {(["man", "woman"] as Gender[]).map(g => (
                    <button key={g} onClick={() => setGender(g)} data-testid={`button-gender-${g}`}
                      className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold border-2 transition-all capitalize ${gender === g ? "border-primary bg-primary text-white" : "border-border"}`}>
                      {g === "man" ? "👨 Man" : "👩 Woman"}
                    </button>
                  ))}
                </div>
              </section>

              {/* Height */}
              <section>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <Ruler size={12} /> Height
                  </p>
                  <span className="text-sm font-bold text-primary">{height} cm</span>
                </div>
                <input type="range" min={140} max={210} value={height} onChange={e => setHeight(+e.target.value)}
                  className="w-full accent-primary" data-testid="slider-height" />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                  <span>140 cm</span><span>175 cm</span><span>210 cm</span>
                </div>
              </section>

              {/* Weight */}
              <section>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <Weight size={12} /> Weight
                  </p>
                  <span className="text-sm font-bold text-primary">{weight} kg
                    <span className="text-[10px] text-muted-foreground font-normal ml-1">· BMI {bmi.toFixed(1)}</span>
                  </span>
                </div>
                <input type="range" min={40} max={150} value={weight} onChange={e => setWeight(+e.target.value)}
                  className="w-full accent-primary" data-testid="slider-weight" />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                  <span>40 kg</span><span>95 kg</span><span>150 kg</span>
                </div>
              </section>

              {/* Waist Size – bottoms only */}
              {garment.type === "bottoms" && (
                <section>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                      <Ruler size={12} /> Waist Size
                    </p>
                    <span className="text-sm font-bold text-primary">{waistSize} in</span>
                  </div>
                  <input type="range" min={24} max={48} value={waistSize} onChange={e => setWaistSize(+e.target.value)}
                    className="w-full accent-primary" data-testid="slider-waist-size" />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                    <span>24 in</span><span>36 in</span><span>48 in</span>
                  </div>
                </section>
              )}

              {/* Size */}
              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Shirt size={12} /> Clothing Size
                </p>
                <div className="flex gap-2">
                  {SIZES.map(s => (
                    <button key={s} onClick={() => setSize(s)} data-testid={`button-size-${s}`}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${size === s ? "border-primary bg-primary text-white" : "border-border"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </section>

              {/* Skin tone */}
              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Skin Tone</p>
                <div className="flex gap-3">
                  {SKIN_TONES.map(t => (
                    <button key={t.key} onClick={() => setSkinTone(t.key)} data-testid={`button-skintone-${t.key}`}
                      className={`w-9 h-9 rounded-full border-4 transition-all ${skinTone === t.key ? "border-primary scale-110 shadow-md" : "border-border"}`}
                      style={{ backgroundColor: t.color }} />
                  ))}
                </div>
              </section>
            </div>

            <div className="px-5 pb-6 shrink-0">
              <Button className="w-full h-12 rounded-full text-base font-bold shadow-lg shadow-primary/20 gap-2"
                onClick={() => setStep(2)} data-testid="button-start-tryon">
                <Sparkles size={18} />
                {uploadedPhoto ? "Start Try-On →" : "Browse Outfits →"}
              </Button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: Try-On ═════════════════════════════════ */}
        {step === 2 && (
          <div className="flex-1 flex flex-col min-h-0">

            <header className="flex items-center gap-2 px-4 pt-3 pb-2 shrink-0">
              <Button variant="ghost" size="icon" className="rounded-full shrink-0" onClick={() => setStep(1)}>
                <ChevronLeft size={22} />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-base font-bold truncate">Virtual Try-On</h1>
                <p className="text-xs text-muted-foreground">{garment.name} · Size {size}</p>
              </div>
              <button onClick={() => setSaved(s => !s)} data-testid="button-save-outfit"
                className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border shrink-0 transition-all
                  ${saved ? "bg-red-50 border-red-200 text-red-500" : "border-border text-muted-foreground"}`}>
                <Heart size={12} fill={saved ? "currentColor" : "none"} />
                {saved ? "Saved" : "Save"}
              </button>
            </header>

            {/* ── Main display ── */}
            <div className="mx-4 rounded-3xl overflow-hidden border border-border/30 shadow-xl relative shrink-0"
              style={{ aspectRatio: "3/4", maxHeight: "50vh" }}>

              {/* Image layer */}
              {tryOnUrl ? (
                <img src={tryOnUrl} alt="Try-On"
                  className={`w-full h-full ${tryOnMode === "ai" ? "object-contain" : "object-cover object-top"} transition-opacity duration-200 ${compositing ? "opacity-60" : "opacity-100"}`} />
              ) : (
                <img src={fallbackUrl} alt={garment.name}
                  className="w-full h-full object-cover object-top" />
              )}

              {/* Pose-detecting overlay */}
              {poseDetecting && !compositing && !aiLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="bg-white/95 backdrop-blur rounded-2xl px-5 py-3 flex flex-col items-center gap-2 shadow-xl">
                    <ScanLine className="w-6 h-6 text-primary animate-pulse" />
                    <p className="text-xs font-bold text-foreground">Detecting body…</p>
                    <p className="text-[10px] text-muted-foreground">Aligning outfit to your shape</p>
                  </div>
                </div>
              )}

              {/* Canvas compositing shimmer */}
              {compositing && !aiLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="bg-white/90 backdrop-blur rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-semibold text-foreground">Fitting…</span>
                  </div>
                </div>
              )}

              {/* AI generation loading overlay */}
              {aiLoading && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                    <Loader2 className="w-7 h-7 text-white animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-sm">Generating AI image…</p>
                    <p className="text-white/70 text-xs mt-0.5">Usually 30–90 seconds</p>
                    <div className="mt-2 flex items-center justify-center gap-1 text-white/60">
                      <Clock size={11} />
                      <span className="text-xs font-mono">{elapsed}s</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Garment name badge */}
              <div className="absolute top-3 left-3 bg-black/55 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5">
                <img src={garment.image} alt="" className="w-4 h-4 object-contain" />
                <span className="text-white text-[10px] font-semibold">{garment.name}</span>
              </div>

              {/* Result mode badge */}
              {tryOnUrl && !compositing && !aiLoading && !poseDetecting && (
                <div className={`absolute top-3 right-3 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1
                  ${tryOnMode === "ai"
                    ? "bg-violet-600/90"
                    : poseStatus === "done"
                      ? "bg-emerald-600/90"
                      : "bg-primary/90"}`}>
                  {tryOnMode === "ai"
                    ? <><Sparkles size={10} className="text-yellow-300" /><span className="text-white text-[10px] font-bold">Final Try-On</span></>
                    : poseStatus === "done"
                      ? <><ScanLine size={10} className="text-white" /><span className="text-white text-[10px] font-bold">Body-fit</span></>
                      : <><Sparkles size={10} className="text-yellow-300" /><span className="text-white text-[10px] font-bold">Preview</span></>
                  }
                </div>
              )}

              {/* Price + Cart */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div className="bg-white/95 backdrop-blur rounded-2xl px-3 py-2 shadow-lg">
                  <p className="text-[9px] text-muted-foreground">Price</p>
                  <p className="text-base font-bold text-primary leading-none">{garment.price}</p>
                  <p className="text-[9px] text-muted-foreground">Size: {size}</p>
                </div>
                <button className="bg-primary text-white rounded-2xl px-4 py-2.5 text-xs font-bold shadow-lg active:scale-95 transition-transform"
                  data-testid="button-add-to-cart">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* No photo hint */}
            {!uploadedPhoto && (
              <div className="mx-4 mt-2 shrink-0">
                <button onClick={() => setStep(1)}
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-2xl border-2 border-dashed border-primary/30 text-primary text-xs font-semibold hover:bg-primary/5 transition-colors"
                  data-testid="button-upload-photo-hint">
                  <Camera size={13} /> Upload your photo for instant try-on
                </button>
              </div>
            )}

            {/* ── AI Generate button + messages ── */}
            {uploadedPhoto && (
              <div className="mx-4 mt-2 shrink-0 space-y-1.5">
                {/* Billing error */}
                {billingError && (
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-3 py-2.5">
                    <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                    <div className="text-xs text-amber-800 space-y-0.5">
                      <p className="font-semibold">Replicate account needs credits.</p>
                      <p>Add <strong>at least $5</strong> at{" "}
                        <a href="https://replicate.com/account/billing#billing" target="_blank" rel="noreferrer"
                          className="underline font-semibold">replicate.com/billing</a>{" "}
                        to unlock AI generation. The instant canvas preview still works above.</p>
                    </div>
                  </div>
                )}

                {/* Generic error */}
                {aiError && !billingError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-3 py-2">
                    <AlertCircle size={13} className="text-red-500 shrink-0" />
                    <p className="text-xs text-red-700 font-medium">{aiError}</p>
                  </div>
                )}

                {/* Generate button */}
                <button onClick={runAiTryOn} disabled={aiLoading || aiEnhancing}
                  data-testid="button-generate-ai"
                  className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl font-bold text-sm
                    bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200
                    active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                  {aiLoading ? (
                    <><Loader2 size={15} className="animate-spin" /> Generating… {elapsed}s</>
                  ) : aiEnhancing ? (
                    <><Loader2 size={15} className="animate-spin" /> Enhancing face &amp; hem…</>
                  ) : (
                    <><Wand2 size={15} /> Generate Photorealistic Try-On</>
                  )}
                </button>
                {!aiLoading && !aiEnhancing && (
                  <p className="text-center text-[10px] text-muted-foreground leading-snug">
                    AI cloth warping · lighting match · body fit · usually 30–90 sec
                  </p>
                )}

                {/* View Full Preview button — shown after AI result is ready */}
                {aiResultUrl && !aiLoading && (
                  <button onClick={() => setPreviewOpen(true)}
                    data-testid="button-view-preview"
                    className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl font-bold text-sm
                      bg-emerald-600 text-white shadow-lg shadow-emerald-200 active:scale-95 transition-all">
                    <Maximize2 size={15} /> View Full Preview
                  </button>
                )}
              </div>
            )}

            {/* Cache loading bar (only while initial preload is in progress) */}
            {!cacheReady && (
              <div className="mx-4 mt-2 shrink-0">
                <div className="h-1 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-primary rounded-full animate-pulse w-3/4" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 text-center">Preloading outfit images…</p>
              </div>
            )}

            {/* Outfit picker */}
            <div className="shrink-0 mt-2 px-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">Pick an Outfit</h3>
                <span data-testid="text-garment-count" className="text-xs text-muted-foreground">
                  {GARMENTS.filter(g => g.type === garmentFilter).length} items
                </span>
              </div>

              {/* Tops / Bottoms filter toggle */}
              <div className="flex gap-1.5 mb-2.5">
                {(["tops", "bottoms"] as GarmentType[]).map(cat => (
                  <button key={cat} onClick={() => {
                    setGarmentFilter(cat);
                    const current = GARMENTS.find(g => g.id === selectedId);
                    if (current?.type !== cat) {
                      const first = GARMENTS.find(g => g.type === cat);
                      if (first) setSelectedId(first.id);
                    }
                  }}
                    data-testid={`button-filter-${cat}`}
                    className={`flex-1 h-8 rounded-full text-xs font-semibold border-2 transition-all
                      ${garmentFilter === cat
                        ? "bg-primary border-primary text-white shadow-sm"
                        : "bg-background border-border/50 text-muted-foreground"}`}>
                    {cat === "tops" ? "Tops" : "Bottoms"}
                  </button>
                ))}
              </div>

              <div className="flex gap-2.5 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
                {GARMENTS.filter(g => g.type === garmentFilter).map(g => (
                  <div key={g.id}
                    onClick={() => { setSelectedId(g.id); setGarmentFilter(g.type); }}
                    data-testid={`card-garment-${g.id}`}
                    className={`relative flex-shrink-0 w-[68px] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all active:scale-95
                      ${selectedId === g.id ? "border-primary shadow-md shadow-primary/25 scale-105" : "border-border/40"}`}
                    style={{ aspectRatio: "3/4" }}>
                    <img src={gender === "man" ? g.fallbackM : g.fallbackF}
                      alt={g.name}
                      className="w-full h-full object-cover object-top bg-secondary/30" />
                    {g.tag && (
                      <div className="absolute top-1 left-1 bg-primary text-white text-[7px] font-bold px-1 py-0.5 rounded-full">
                        {g.tag}
                      </div>
                    )}
                    {selectedId === g.id && (
                      <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                        <Check size={9} className="text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 py-1.5">
                      <p className="text-white text-[8px] font-semibold truncate">{g.name}</p>
                      <p className="text-white/70 text-[8px]">{g.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Size bar */}
            <div className="shrink-0 px-4 mt-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium shrink-0">Size:</span>
                <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
                  {SIZES.map(s => (
                    <button key={s} onClick={() => setSize(s)} data-testid={`button-size-${s}`}
                      className={`flex-shrink-0 w-9 h-8 rounded-lg text-xs font-bold border-2 transition-all
                        ${size === s ? "border-primary bg-primary text-white" : "border-border"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="px-4 pb-4 mt-2 flex gap-2.5 shrink-0">
              <Button variant="outline" className="flex-1 rounded-full gap-1.5 h-11 border-2 text-sm"
                onClick={() => setStep(1)}>
                <RotateCcw size={14} /> Edit Profile
              </Button>
              <Button className="flex-1 rounded-full gap-1.5 h-11 shadow-lg shadow-primary/20 text-sm">
                <Share2 size={14} /> Share Look
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════
          FULLSCREEN PREVIEW MODAL — with zoom + pan
      ══════════════════════════════════════════════════════════ */}
      {previewOpen && aiResultUrl && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col"
          data-testid="modal-preview">

          {/* ── Top toolbar ── */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur shrink-0 border-b border-white/10">
            <div>
              <p className="text-white text-sm font-bold">Final Try-On Preview</p>
              <p className="text-white/50 text-[10px]">{garment.name} · {Math.round(zoom * 100)}% zoom</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Zoom out */}
              <button onClick={() => { setZoom(z => Math.max(1, parseFloat((z - 0.5).toFixed(1)))); setPan({ x: 0, y: 0 }); }}
                disabled={zoom <= 1}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white disabled:opacity-30 active:bg-white/20"
                data-testid="button-zoom-out">
                <ZoomOut size={16} />
              </button>
              {/* Zoom label */}
              <span className="text-white text-xs font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
              {/* Zoom in */}
              <button onClick={() => setZoom(z => Math.min(5, parseFloat((z + 0.5).toFixed(1))))}
                disabled={zoom >= 5}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white disabled:opacity-30 active:bg-white/20"
                data-testid="button-zoom-in">
                <ZoomIn size={16} />
              </button>
              {/* Reset */}
              <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white active:bg-white/20"
                data-testid="button-zoom-reset">
                <RefreshCw size={14} />
              </button>
              {/* Close */}
              <button onClick={() => setPreviewOpen(false)}
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white active:bg-white/40"
                data-testid="button-close-preview">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ── Image viewport ── */}
          <div className="flex-1 overflow-hidden relative select-none"
            style={{ cursor: zoom > 1 ? (isPanning ? "grabbing" : "grab") : "default" }}

            /* Mouse drag-to-pan */
            onMouseDown={e => {
              if (zoom <= 1) return;
              e.preventDefault();
              setIsPanning(true);
              panStart.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
            }}
            onMouseMove={e => {
              if (!isPanning) return;
              const dx = (e.clientX - panStart.current.mx) / zoom;
              const dy = (e.clientY - panStart.current.my) / zoom;
              setPan({ x: panStart.current.px + dx, y: panStart.current.py + dy });
            }}
            onMouseUp={() => setIsPanning(false)}
            onMouseLeave={() => setIsPanning(false)}

            /* Touch drag-to-pan */
            onTouchStart={e => {
              if (zoom <= 1 || e.touches.length !== 1) return;
              setIsPanning(true);
              panStart.current = { mx: e.touches[0].clientX, my: e.touches[0].clientY, px: pan.x, py: pan.y };
            }}
            onTouchMove={e => {
              if (!isPanning || e.touches.length !== 1) return;
              const dx = (e.touches[0].clientX - panStart.current.mx) / zoom;
              const dy = (e.touches[0].clientY - panStart.current.my) / zoom;
              setPan({ x: panStart.current.px + dx, y: panStart.current.py + dy });
            }}
            onTouchEnd={() => setIsPanning(false)}

            /* Scroll / pinch-to-zoom */
            onWheel={e => {
              e.preventDefault();
              const delta = e.deltaY > 0 ? -0.25 : 0.25;
              setZoom(z => Math.min(5, Math.max(1, parseFloat((z + delta).toFixed(2)))));
              if (zoom + delta <= 1) setPan({ x: 0, y: 0 });
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <img
                ref={imgRef}
                src={aiResultUrl}
                alt="Final Try-On Result"
                draggable={false}
                data-testid="img-preview-result"
                style={{
                  transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                  transformOrigin: "center center",
                  transition: isPanning ? "none" : "transform 0.15s ease",
                  maxWidth:  "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  userSelect: "none",
                  WebkitUserDrag: "none" as any,
                }}
              />
            </div>

            {/* Pan hint — show only when zoomed in and not yet panning */}
            {zoom > 1 && !isPanning && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur rounded-full px-3 py-1.5 flex items-center gap-1.5 pointer-events-none">
                <Move size={11} className="text-white/70" />
                <span className="text-white/70 text-[10px] font-medium">Drag to pan</span>
              </div>
            )}
          </div>

          {/* ── Bottom: side-by-side comparison strip ── */}
          <div className="shrink-0 bg-black/80 border-t border-white/10 px-4 py-3">
            <p className="text-white/50 text-[10px] uppercase tracking-wider mb-2 font-semibold">Before / After</p>
            <div className="flex gap-3">
              {/* Original */}
              <div className="flex-1 rounded-2xl overflow-hidden border border-white/15" style={{ aspectRatio: "3/4", maxHeight: 120 }}>
                {uploadedPhoto && <img src={uploadedPhoto} alt="Original" className="w-full h-full object-cover object-top" />}
                <div className="absolute bottom-1 left-1 bg-black/60 rounded-full px-2 py-0.5">
                  <span className="text-white text-[8px] font-bold">Original</span>
                </div>
              </div>
              {/* AI result */}
              <div className="flex-1 rounded-2xl overflow-hidden border-2 border-emerald-500/60 relative" style={{ aspectRatio: "3/4", maxHeight: 120 }}>
                <img src={aiResultUrl} alt="Try-On" className="w-full h-full object-contain bg-black" />
                <div className="absolute bottom-1 left-1 bg-emerald-600/90 rounded-full px-2 py-0.5">
                  <span className="text-white text-[8px] font-bold">Try-On</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </MobileLayout>
  );
}
