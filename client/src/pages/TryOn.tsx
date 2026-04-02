import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Upload, Sparkles, ChevronLeft, Check, Camera,
  Image as ImageIcon, RotateCcw, Share2, Heart,
  Ruler, Weight, Shirt
} from "lucide-react";
import { useLocation } from "wouter";

import garment1 from "@/assets/images/tshirt-black.png";
import garment2 from "@/assets/images/tshirt-white.png";
import garment3 from "@/assets/images/tshirt-grey.png";
import garment4 from "@/assets/images/tshirt-red.png";
import garment5 from "@/assets/images/tshirt-blue.png";
import garment6 from "@/assets/images/tshirt-graphic.png";

/* ─── Catalogue ───────────────────────────────────────────── */
const GARMENTS = [
  { id: 1, image: garment1, name: "Black T-Shirt",   price: "₹599", tag: "Bestseller" },
  { id: 2, image: garment2, name: "White T-Shirt",   price: "₹499", tag: "New"        },
  { id: 3, image: garment3, name: "Grey T-Shirt",    price: "₹549", tag: ""           },
  { id: 4, image: garment4, name: "Red T-Shirt",     price: "₹649", tag: "Hot"        },
  { id: 5, image: garment5, name: "Blue T-Shirt",    price: "₹599", tag: ""           },
  { id: 6, image: garment6, name: "Graphic T-Shirt", price: "₹799", tag: "Trending"   },
];

/* ─── Avatars with precise shoulder / torso anchor points ─── */
// shoulderY   : fraction from top where shirt collar/shoulder starts
// shoulderFrac: shirt width as fraction of canvas width (matches avatar's shoulder span)
// torsoHeight : fraction of canvas height the torso occupies (shoulder→hip)
type Gender = "man" | "woman";
type FitType = "slim" | "regular" | "plus";

interface AvatarDef {
  url: string; label: string;
  shoulderY: number; shoulderFrac: number; torsoHeight: number;
}

const AVATARS: Record<Gender, Record<FitType, AvatarDef>> = {
  man: {
    slim: {
      url: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",
      label: "Slim",    shoulderY: 0.16, shoulderFrac: 0.62, torsoHeight: 0.32,
    },
    regular: {
      url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80",
      label: "Regular", shoulderY: 0.18, shoulderFrac: 0.68, torsoHeight: 0.33,
    },
    plus: {
      url: "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=600&q=80",
      label: "Plus",    shoulderY: 0.17, shoulderFrac: 0.74, torsoHeight: 0.34,
    },
  },
  woman: {
    slim: {
      url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
      label: "Slim",    shoulderY: 0.17, shoulderFrac: 0.57, torsoHeight: 0.30,
    },
    regular: {
      url: "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=600&q=80",
      label: "Regular", shoulderY: 0.18, shoulderFrac: 0.62, torsoHeight: 0.31,
    },
    plus: {
      url: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80",
      label: "Plus",    shoulderY: 0.17, shoulderFrac: 0.68, torsoHeight: 0.32,
    },
  },
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
type Size = typeof SIZES[number];

const SKIN_TONES = [
  { key: "fair",   color: "#FDDBB4" },
  { key: "light",  color: "#E8B88A" },
  { key: "medium", color: "#C68642" },
  { key: "tan",    color: "#A0522D" },
  { key: "dark",   color: "#4A2912" },
] as const;

/* BMI → fit type */
function fitFromBMI(bmi: number): FitType {
  if (bmi < 20) return "slim";
  if (bmi < 27) return "regular";
  return "plus";
}
/* size → shoulder-width scale multiplier relative to M */
const SIZE_SCALE: Record<Size, number> = {
  XS: 0.88, S: 0.94, M: 1.00, L: 1.06, XL: 1.12, XXL: 1.18,
};

/* ─── Canvas renderer ────────────────────────────────────── */
function renderTryOn(
  canvas: HTMLCanvasElement,
  avatarImg: HTMLImageElement,
  garmentImg: HTMLImageElement,
  avatarDef: AvatarDef,
  sizeScale: number,
  uploaded: boolean,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;

  // --- draw avatar (cover-crop from top) ---
  const aW = avatarImg.naturalWidth, aH = avatarImg.naturalHeight;
  const avatarAspect = aW / aH;
  const canvasAspect = W / H;
  let sx = 0, sy = 0, sw = aW, sh = aH;
  if (avatarAspect > canvasAspect) {
    sw = aH * canvasAspect;
    sx = (aW - sw) / 2;
  } else {
    sh = aW / canvasAspect;
    // keep top-aligned so face is always visible
    sy = 0;
  }
  ctx.drawImage(avatarImg, sx, sy, sw, sh, 0, 0, W, H);

  // --- compute garment placement ---
  const def = uploaded
    ? { shoulderY: 0.27, shoulderFrac: 0.68, torsoHeight: 0.32 }
    : avatarDef;

  const gW = W * def.shoulderFrac * sizeScale;
  const gX = (W - gW) / 2;
  const gY = H * def.shoulderY;
  // keep garment aspect ratio but clamp to torso height
  const maxGH = H * def.torsoHeight;
  const naturalAspect = garmentImg.naturalWidth / garmentImg.naturalHeight;
  const gH = Math.min(gW / naturalAspect, maxGH);

  ctx.drawImage(garmentImg, gX, gY, gW, gH);
}

/* ══════════════════════════════════════════════════════════ */
export default function TryOn() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<1 | 2>(1);

  /* ── measurements ── */
  const [gender, setGender]     = useState<Gender>("man");
  const [height, setHeight]     = useState(170);   // cm
  const [weight, setWeight]     = useState(70);    // kg
  const [size, setSize]         = useState<Size>("M");
  const [skinTone, setSkinTone] = useState("medium");
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  /* ── try-on ── */
  const [selectedId, setSelectedId] = useState(1);
  const [saved, setSaved]           = useState(false);
  const [rendering, setRendering]   = useState(false);

  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const avatarImgRef  = useRef<HTMLImageElement | null>(null);
  const garmentImgRef = useRef<HTMLImageElement | null>(null);

  /* ── derived ── */
  const bmi       = weight / Math.pow(height / 100, 2);
  const fitType   = fitFromBMI(bmi);
  const avatarDef = AVATARS[gender][fitType];
  const avatarUrl = uploadedPhoto ?? avatarDef.url;
  const garment   = GARMENTS.find(g => g.id === selectedId)!;
  const sizeScale = SIZE_SCALE[size];

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const av     = avatarImgRef.current;
    const gm     = garmentImgRef.current;
    if (!canvas || !av?.complete || !gm?.complete) return;
    setRendering(false);
    renderTryOn(canvas, av, gm, avatarDef, sizeScale, !!uploadedPhoto);
  }, [avatarDef, sizeScale, uploadedPhoto]);

  /* load avatar */
  useEffect(() => {
    if (step !== 2) return;
    setRendering(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => { avatarImgRef.current = img; redraw(); };
    img.onerror = () => setRendering(false);
    img.src = avatarUrl;
  }, [avatarUrl, step, redraw]);

  /* load garment */
  useEffect(() => {
    if (step !== 2) return;
    setRendering(true);
    const img = new Image();
    img.onload  = () => { garmentImgRef.current = img; redraw(); };
    img.onerror = () => setRendering(false);
    img.src = garment.image;
  }, [garment.image, step, redraw]);

  /* redraw when sizeScale / avatarDef change */
  useEffect(() => { if (step === 2) redraw(); }, [sizeScale, avatarDef, redraw, step]);

  /* ─────────────────── UI ─────────────────────────────── */
  return (
    <MobileLayout>
      <div className="h-full flex flex-col bg-background">

        {/* ═══ STEP 1 : Measurements & Avatar ═══════════════ */}
        {step === 1 && (
          <div className="flex-1 flex flex-col overflow-y-auto">
            <header className="flex items-center gap-3 px-5 pt-4 pb-2 shrink-0">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setLocation("/")}>
                <ChevronLeft size={22} />
              </Button>
              <div>
                <h1 className="text-lg font-bold leading-tight">Your Digital Avatar</h1>
                <p className="text-xs text-muted-foreground">We fit clothes to your exact body</p>
              </div>
            </header>

            <div className="flex-1 px-5 pb-4 space-y-5">

              {/* Upload own photo */}
              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Upload Your Photo</p>
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center gap-1.5 h-11 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 cursor-pointer text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                    <Camera size={14} /> Camera
                    <input type="file" accept="image/*" capture="environment" className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0]; if (!f) return;
                        const r = new FileReader();
                        r.onload = ev => setUploadedPhoto(ev.target?.result as string);
                        r.readAsDataURL(f);
                      }} />
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-1.5 h-11 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 cursor-pointer text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                    <ImageIcon size={14} /> Gallery
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0]; if (!f) return;
                        const r = new FileReader();
                        r.onload = ev => setUploadedPhoto(ev.target?.result as string);
                        r.readAsDataURL(f);
                      }} />
                  </label>
                  {uploadedPhoto && (
                    <button onClick={() => setUploadedPhoto(null)}
                      className="h-11 w-11 rounded-2xl border-2 border-border flex items-center justify-center text-muted-foreground hover:text-destructive">
                      <RotateCcw size={14} />
                    </button>
                  )}
                </div>
                {uploadedPhoto && (
                  <p className="mt-1.5 text-xs text-green-600 font-medium flex items-center gap-1">
                    <Check size={12} /> Your photo will be used as avatar
                  </p>
                )}
              </section>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-medium">or enter measurements</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Gender */}
              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Gender</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["man", "woman"] as Gender[]).map(g => (
                    <button key={g} onClick={() => setGender(g)}
                      className={`py-3 rounded-2xl text-sm font-semibold capitalize border-2 transition-all ${gender === g ? "border-primary bg-primary text-white" : "border-border bg-secondary/40"}`}>
                      {g === "man" ? "👨 Man" : "👩 Woman"}
                    </button>
                  ))}
                </div>
              </section>

              {/* Height */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <Ruler size={12} /> Height
                  </p>
                  <span className="text-sm font-bold text-primary">{height} cm</span>
                </div>
                <input type="range" min={140} max={200} value={height}
                  onChange={e => setHeight(+e.target.value)}
                  className="w-full accent-primary h-2 rounded-full" />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>140 cm</span><span>200 cm</span>
                </div>
              </section>

              {/* Weight */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <Weight size={12} /> Weight
                  </p>
                  <span className="text-sm font-bold text-primary">{weight} kg</span>
                </div>
                <input type="range" min={40} max={130} value={weight}
                  onChange={e => setWeight(+e.target.value)}
                  className="w-full accent-primary h-2 rounded-full" />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>40 kg</span><span>130 kg</span>
                </div>
              </section>

              {/* Clothing Size */}
              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <Shirt size={12} /> Clothing Size
                </p>
                <div className="flex gap-2 flex-wrap">
                  {SIZES.map(s => (
                    <button key={s} onClick={() => setSize(s)}
                      className={`w-12 h-10 rounded-xl text-sm font-bold border-2 transition-all ${size === s ? "border-primary bg-primary text-white" : "border-border bg-secondary/40"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </section>

              {/* Skin Tone */}
              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Skin Tone</p>
                <div className="flex gap-3">
                  {SKIN_TONES.map(t => (
                    <button key={t.key} onClick={() => setSkinTone(t.key)}
                      style={{ backgroundColor: t.color }}
                      className={`w-10 h-10 rounded-full border-4 transition-all ${skinTone === t.key ? "border-primary scale-110 shadow-lg" : "border-transparent"}`} />
                  ))}
                </div>
              </section>

              {/* BMI + avatar preview */}
              <section className="bg-secondary/40 rounded-3xl p-4 border border-border/50">
                <p className="text-xs font-semibold text-muted-foreground mb-3">Your Body Profile</p>
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-22 rounded-xl overflow-hidden border border-border flex-shrink-0" style={{ height: 88 }}>
                    <img src={avatarDef.url} alt="avatar" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">BMI</span>
                      <span className="font-bold">{bmi.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Body Type</span>
                      <span className="font-bold capitalize">{fitType}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Avatar</span>
                      <span className="font-bold">{gender === "man" ? "Male" : "Female"} · {avatarDef.label}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Shirt Size</span>
                      <span className="font-bold">{size}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="px-5 pb-6 shrink-0">
              <Button className="w-full rounded-full h-13 text-base shadow-lg shadow-primary/20 gap-2"
                onClick={() => setStep(2)}>
                <Sparkles size={18} /> Start Virtual Try-On
              </Button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2 : Live Try-On ══════════════════════════ */}
        {step === 2 && (
          <div className="flex-1 flex flex-col min-h-0">
            <header className="flex items-center gap-3 px-4 pt-3 pb-2 shrink-0">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setStep(1)}>
                <ChevronLeft size={22} />
              </Button>
              <div className="flex-1">
                <h1 className="text-lg font-bold leading-tight">Virtual Try-On</h1>
                <p className="text-xs text-muted-foreground">Tap any outfit to try it on instantly</p>
              </div>
              <button onClick={() => setSaved(s => !s)}
                className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${saved ? "bg-red-50 border-red-200 text-red-500" : "border-border text-muted-foreground"}`}>
                <Heart size={12} fill={saved ? "currentColor" : "none"} />
                {saved ? "Saved" : "Save"}
              </button>
            </header>

            {/* Canvas – avatar + outfit composited */}
            <div className="relative mx-4 rounded-3xl overflow-hidden bg-secondary/20 border border-border/30 shadow-xl shrink-0"
              style={{ aspectRatio: "3/4", maxHeight: "50vh" }}>
              {rendering && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/50 z-10 gap-3">
                  <Sparkles className="text-primary w-8 h-8 animate-pulse" />
                  <p className="text-xs text-muted-foreground font-medium">Fitting outfit to your body…</p>
                </div>
              )}
              <canvas ref={canvasRef} width={420} height={560} className="w-full h-full" />

              {/* Badges */}
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                <Sparkles size={11} className="text-yellow-400" />
                <span className="text-white text-[10px] font-semibold">AI Fitted</span>
              </div>
              <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                <span className="text-white text-[10px] font-medium">{garment.name}</span>
                <span className="bg-primary/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{size}</span>
              </div>

              {/* Price + CTA */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-2xl px-3 py-2 shadow-lg">
                <p className="text-[9px] text-muted-foreground leading-none mb-0.5">Price</p>
                <p className="text-base font-bold text-primary leading-none">{garment.price}</p>
              </div>
              <button className="absolute bottom-3 right-3 bg-primary text-white rounded-2xl px-4 py-2.5 text-xs font-bold shadow-lg active:scale-95 transition-transform">
                Add to Cart
              </button>
            </div>

            {/* Outfit picker strip */}
            <div className="shrink-0 mt-3 px-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">Pick an Outfit</h3>
                <span className="text-xs text-muted-foreground">{GARMENTS.length} items</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
                {GARMENTS.map(g => (
                  <div key={g.id}
                    onClick={() => { setSelectedId(g.id); setSaved(false); }}
                    className={`relative flex-shrink-0 w-[72px] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all active:scale-95 ${selectedId === g.id ? "border-primary shadow-md shadow-primary/25 scale-105" : "border-border/50"}`}
                    style={{ aspectRatio: "3/4" }}>
                    <img src={g.image} alt={g.name} className="w-full h-full object-cover bg-secondary/30" />
                    {g.tag && (
                      <div className="absolute top-1 left-1 bg-primary text-white text-[7px] font-bold px-1 py-0.5 rounded-full">{g.tag}</div>
                    )}
                    {selectedId === g.id && (
                      <div className="absolute inset-0 bg-primary/10">
                        <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                          <Check size={9} className="text-white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 to-transparent px-1.5 py-1.5">
                      <p className="text-white text-[8px] font-semibold leading-tight truncate">{g.name}</p>
                      <p className="text-white/70 text-[8px]">{g.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Size quick-change */}
            <div className="shrink-0 px-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium shrink-0">Size:</span>
                <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
                  {SIZES.map(s => (
                    <button key={s} onClick={() => setSize(s)}
                      className={`flex-shrink-0 w-9 h-8 rounded-lg text-xs font-bold border transition-all ${size === s ? "border-primary bg-primary text-white" : "border-border"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 mt-3 flex gap-2.5 shrink-0">
              <Button variant="outline" className="flex-1 rounded-full gap-1.5 h-11 border-2 text-sm"
                onClick={() => setStep(1)}>
                <RotateCcw size={14} /> Edit Avatar
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
