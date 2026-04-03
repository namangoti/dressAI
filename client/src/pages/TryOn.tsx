import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft, Check, Camera, Image as ImageIcon,
  RotateCcw, Share2, Heart, Ruler, Weight, Shirt, Sparkles,
} from "lucide-react";
import { useLocation } from "wouter";

import garment1 from "@/assets/images/tshirt-black.png";
import garment2 from "@/assets/images/tshirt-white.png";
import garment3 from "@/assets/images/tshirt-grey.png";
import garment4 from "@/assets/images/tshirt-red.png";
import garment5 from "@/assets/images/tshirt-blue.png";
import garment6 from "@/assets/images/tshirt-graphic.png";

/* ── Outfit catalogue ─────────────────────────────────────── */
type GarmentType = "tops" | "bottoms";
const GARMENTS = [
  { id: 1, image: garment1, name: "Black T-Shirt",   price: "₹599", tag: "Bestseller", type: "tops" as GarmentType,
    fallbackM: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=600&q=80" },
  { id: 2, image: garment2, name: "White T-Shirt",   price: "₹499", tag: "New",        type: "tops" as GarmentType,
    fallbackM: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1485231183945-fffde7ae021e?w=600&q=80" },
  { id: 3, image: garment3, name: "Grey T-Shirt",    price: "₹549", tag: "",           type: "tops" as GarmentType,
    fallbackM: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80" },
  { id: 4, image: garment4, name: "Red T-Shirt",     price: "₹649", tag: "Hot",        type: "tops" as GarmentType,
    fallbackM: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" },
  { id: 5, image: garment5, name: "Blue T-Shirt",    price: "₹599", tag: "",           type: "tops" as GarmentType,
    fallbackM: "https://images.unsplash.com/photo-1473621038790-b778b4de3b84?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=600&q=80" },
  { id: 6, image: garment6, name: "Graphic T-Shirt", price: "₹799", tag: "Trending",   type: "tops" as GarmentType,
    fallbackM: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80" },
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

/** Composite a pre-processed garment canvas onto a person data-URL. */
async function composite(
  personDataUrl: string,
  garmentCanvas: HTMLCanvasElement,
  type: GarmentType,
): Promise<string> {
  const person = await loadImage(personDataUrl);
  const pw = person.naturalWidth  || person.width  || 400;
  const ph = person.naturalHeight || person.height || 600;

  const out = document.createElement("canvas");
  out.width  = pw;
  out.height = ph;
  const ctx  = out.getContext("2d");
  if (!ctx) return personDataUrl; // fallback — return original photo

  ctx.drawImage(person, 0, 0, pw, ph);

  if (garmentCanvas.width > 0 && garmentCanvas.height > 0) {
    const yStart = type === "tops"    ? ph * 0.15 : ph * 0.46;
    const yEnd   = type === "bottoms" ? ph * 0.97 : ph * 0.60;
    const garH   = yEnd - yStart;
    const garW   = garH * (garmentCanvas.width / garmentCanvas.height);
    const garX   = (pw - garW) / 2;

    ctx.globalAlpha = 0.92;
    ctx.drawImage(garmentCanvas, garX, yStart, garW, garH);
    ctx.globalAlpha = 1;
  }

  return out.toDataURL("image/jpeg", 0.93);
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
  const [skinTone,     setSkinTone]     = useState("medium");
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  /* ── outfit state ── */
  const [selectedId, setSelectedId] = useState(1);
  const [saved,      setSaved]      = useState(false);
  const [tryOnUrl,   setTryOnUrl]   = useState<string | null>(null);
  const [compositing, setCompositing] = useState(false);

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

  /* Auto-composite whenever photo or garment changes */
  const doComposite = useCallback(async (photo: string, garmentId: number) => {
    const garmentCanvas = cache.current.get(garmentId);
    if (!garmentCanvas) return;
    const g = GARMENTS.find(x => x.id === garmentId)!;
    setCompositing(true);
    try {
      const result = await composite(photo, garmentCanvas, g.type);
      setTryOnUrl(result);
    } catch (err) {
      console.warn("[composite] failed:", err);
    } finally {
      setCompositing(false);
    }
  }, []);

  useEffect(() => {
    if (uploadedPhoto && cacheReady) {
      doComposite(uploadedPhoto, selectedId);
    } else {
      setTryOnUrl(null);
    }
  }, [uploadedPhoto, selectedId, cacheReady, doComposite]);

  const garment    = GARMENTS.find(g => g.id === selectedId)!;
  const fallbackUrl = gender === "man" ? garment.fallbackM : garment.fallbackF;
  const bmi         = weight / Math.pow(height / 100, 2);

  function readFile(file: File, cb: (url: string) => void) {
    const r = new FileReader();
    r.onload = e => cb(e.target?.result as string);
    r.readAsDataURL(file);
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
                      <input type="file" accept="image/*" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, setUploadedPhoto); }} />
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-1.5 h-12 rounded-2xl border-2 border-dashed border-border bg-secondary/30 cursor-pointer text-sm text-muted-foreground hover:bg-secondary/60 transition-colors" data-testid="label-camera-photo">
                      <ImageIcon size={16} /> Take Photo
                      <input type="file" accept="image/*" capture="user" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, setUploadedPhoto); }} />
                    </label>
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
                  className={`w-full h-full object-cover object-top transition-opacity duration-200 ${compositing ? "opacity-60" : "opacity-100"}`} />
              ) : (
                <img src={fallbackUrl} alt={garment.name}
                  className="w-full h-full object-cover object-top" />
              )}

              {/* Compositing shimmer */}
              {compositing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="bg-white/90 backdrop-blur rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-semibold text-foreground">Fitting…</span>
                  </div>
                </div>
              )}

              {/* Garment name badge */}
              <div className="absolute top-3 left-3 bg-black/55 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5">
                <img src={garment.image} alt="" className="w-4 h-4 object-contain" />
                <span className="text-white text-[10px] font-semibold">{garment.name}</span>
              </div>

              {/* Try-on badge */}
              {tryOnUrl && !compositing && (
                <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                  <Sparkles size={10} className="text-yellow-300" />
                  <span className="text-white text-[10px] font-bold">Try-On</span>
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
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-sm font-semibold">Pick an Outfit</h3>
                <span className="text-xs text-muted-foreground">{GARMENTS.length} items</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
                {GARMENTS.map(g => (
                  <div key={g.id} onClick={() => setSelectedId(g.id)}
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
    </MobileLayout>
  );
}
