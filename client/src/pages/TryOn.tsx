import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  ChevronLeft, Check, Camera, Image as ImageIcon,
  RotateCcw, Share2, Heart, Ruler, Weight, Shirt,
  Sparkles, Loader2, AlertCircle
} from "lucide-react";
import { useLocation } from "wouter";

import garment1 from "@/assets/images/tshirt-black.png";
import garment2 from "@/assets/images/tshirt-white.png";
import garment3 from "@/assets/images/tshirt-grey.png";
import garment4 from "@/assets/images/tshirt-red.png";
import garment5 from "@/assets/images/tshirt-blue.png";
import garment6 from "@/assets/images/tshirt-graphic.png";

/* ── Outfit catalogue ─────────────────────────────────────── */
const GARMENTS = [
  { id: 1, image: garment1, name: "Black T-Shirt",   price: "₹599", tag: "Bestseller",
    fallbackM: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=600&q=80" },
  { id: 2, image: garment2, name: "White T-Shirt",   price: "₹499", tag: "New",
    fallbackM: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1485231183945-fffde7ae021e?w=600&q=80" },
  { id: 3, image: garment3, name: "Grey T-Shirt",    price: "₹549", tag: "",
    fallbackM: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80" },
  { id: 4, image: garment4, name: "Red T-Shirt",     price: "₹649", tag: "Hot",
    fallbackM: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" },
  { id: 5, image: garment5, name: "Blue T-Shirt",    price: "₹599", tag: "",
    fallbackM: "https://images.unsplash.com/photo-1473621038790-b778b4de3b84?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=600&q=80" },
  { id: 6, image: garment6, name: "Graphic T-Shirt", price: "₹799", tag: "Trending",
    fallbackM: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
type Size = typeof SIZES[number];
type Gender = "man" | "woman";

const SKIN_TONES = [
  { key: "fair",   color: "#FDDBB4" },
  { key: "light",  color: "#E8B88A" },
  { key: "medium", color: "#C68642" },
  { key: "tan",    color: "#A0522D" },
  { key: "dark",   color: "#4A2912" },
];

/* Convert an image src to base64 data URL (for garment assets) */
async function imageToBase64(src: string): Promise<string> {
  const resp = await fetch(src);
  const blob = await resp.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/* ════════════════════════════════════════════════════════════ */
export default function TryOn() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<1 | 2>(1);

  /* ── profile state ── */
  const [gender, setGender]     = useState<Gender>("man");
  const [height, setHeight]     = useState(170);
  const [weight, setWeight]     = useState(70);
  const [size, setSize]         = useState<Size>("M");
  const [skinTone, setSkinTone] = useState("medium");
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  /* ── try-on state ── */
  const [selectedId, setSelectedId] = useState(1);
  const [saved, setSaved]           = useState(false);
  const [aiResult, setAiResult]     = useState<string | null>(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const bmi     = weight / Math.pow(height / 100, 2);
  const garment = GARMENTS.find(g => g.id === selectedId)!;
  const fallbackUrl = gender === "man" ? garment.fallbackM : garment.fallbackF;

  /* ── helpers ── */
  function readFile(file: File, cb: (url: string) => void) {
    const r = new FileReader();
    r.onload = e => cb(e.target?.result as string);
    r.readAsDataURL(file);
  }

  async function runAiTryOn(garmentId: number) {
    if (!uploadedPhoto) return;
    setLoading(true);
    setError(null);
    setAiResult(null);

    try {
      const g = GARMENTS.find(x => x.id === garmentId)!;
      const garmentBase64 = await imageToBase64(g.image);

      const resp = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personImage: uploadedPhoto,
          garmentImage: garmentBase64,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Failed");
      setAiResult(data.resultUrl);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function selectGarment(id: number) {
    setSelectedId(id);
    setSaved(false);
    setAiResult(null);
    setError(null);
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
                <p className="text-xs text-muted-foreground">Upload your photo for AI try-on</p>
              </div>
            </header>

            <div className="flex-1 px-5 pb-4 space-y-5">

              {/* Upload photo */}
              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  Your Photo <span className="text-primary font-bold">★ Required for AI try-on</span>
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
                      <p className="text-xs text-muted-foreground">AI will dress you in any outfit</p>
                    </div>
                    <button onClick={() => { setUploadedPhoto(null); setAiResult(null); }}
                      className="text-muted-foreground hover:text-destructive p-1">
                      <RotateCcw size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <label className="flex-1 flex items-center justify-center gap-1.5 h-12 rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 cursor-pointer text-sm font-semibold text-primary hover:bg-primary/10 transition-colors">
                      <Camera size={15} /> Camera
                      <input type="file" accept="image/*" capture="environment" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, setUploadedPhoto); }} />
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-1.5 h-12 rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 cursor-pointer text-sm font-semibold text-primary hover:bg-primary/10 transition-colors">
                      <ImageIcon size={15} /> Gallery
                      <input type="file" accept="image/*" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, setUploadedPhoto); }} />
                    </label>
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Best results: full-body photo, good lighting, plain background
                </p>
              </section>

              {/* Gender */}
              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Gender</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["man", "woman"] as Gender[]).map(g => (
                    <button key={g} onClick={() => setGender(g)}
                      className={`py-3 rounded-2xl text-sm font-semibold border-2 transition-all ${gender === g ? "border-primary bg-primary text-white" : "border-border bg-secondary/40"}`}>
                      {g === "man" ? "👨 Man" : "👩 Woman"}
                    </button>
                  ))}
                </div>
              </section>

              {/* Height */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <Ruler size={11} /> Height
                  </p>
                  <span className="text-sm font-bold text-primary">{height} cm</span>
                </div>
                <input type="range" min={140} max={200} value={height} onChange={e => setHeight(+e.target.value)}
                  className="w-full accent-primary h-2 rounded-full" />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>140</span><span>200 cm</span>
                </div>
              </section>

              {/* Weight */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <Weight size={11} /> Weight
                  </p>
                  <span className="text-sm font-bold text-primary">{weight} kg</span>
                </div>
                <input type="range" min={40} max={130} value={weight} onChange={e => setWeight(+e.target.value)}
                  className="w-full accent-primary h-2 rounded-full" />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>40</span><span>130 kg</span>
                </div>
              </section>

              {/* Size */}
              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <Shirt size={11} /> Clothing Size
                </p>
                <div className="flex gap-2">
                  {SIZES.map(s => (
                    <button key={s} onClick={() => setSize(s)}
                      className={`flex-1 h-10 rounded-xl text-sm font-bold border-2 transition-all ${size === s ? "border-primary bg-primary text-white" : "border-border bg-secondary/40"}`}>
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

              {/* Summary */}
              <section className="rounded-3xl border border-border/50 bg-secondary/30 p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Profile Summary</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-background rounded-2xl p-2.5 border border-border/40">
                    <p className="text-lg font-bold text-primary">{bmi.toFixed(1)}</p>
                    <p className="text-[10px] text-muted-foreground">BMI</p>
                  </div>
                  <div className="bg-background rounded-2xl p-2.5 border border-border/40">
                    <p className="text-lg font-bold text-primary">{size}</p>
                    <p className="text-[10px] text-muted-foreground">Size</p>
                  </div>
                  <div className="bg-background rounded-2xl p-2.5 border border-border/40">
                    <p className="text-base font-bold text-primary">{gender === "man" ? "Male" : "Female"}</p>
                    <p className="text-[10px] text-muted-foreground">Gender</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="px-5 pb-6 shrink-0">
              <Button className="w-full rounded-full h-13 text-base shadow-lg shadow-primary/20 gap-2"
                onClick={() => { setStep(2); setAiResult(null); setError(null); }}>
                <Sparkles size={18} />
                {uploadedPhoto ? "Start AI Try-On" : "Browse Outfits"}
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
                <h1 className="text-base font-bold truncate">
                  {uploadedPhoto ? "AI Virtual Try-On" : "Outfit Preview"}
                </h1>
                <p className="text-xs text-muted-foreground">{garment.name} · Size {size}</p>
              </div>
              <button onClick={() => setSaved(s => !s)}
                className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border shrink-0 transition-all ${saved ? "bg-red-50 border-red-200 text-red-500" : "border-border text-muted-foreground"}`}>
                <Heart size={12} fill={saved ? "currentColor" : "none"} />
                {saved ? "Saved" : "Save"}
              </button>
            </header>

            {/* ── Main display ── */}
            <div className="mx-4 rounded-3xl overflow-hidden border border-border/30 shadow-xl relative shrink-0"
              style={{ aspectRatio: "3/4", maxHeight: "50vh" }}>

              {/* Result / Loading / Error / Fallback */}
              {loading ? (
                <div className="w-full h-full bg-secondary/50 flex flex-col items-center justify-center gap-4">
                  {uploadedPhoto && (
                    <img src={uploadedPhoto} alt="You" className="absolute inset-0 w-full h-full object-cover object-top opacity-30 blur-sm" />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-base text-foreground">AI is fitting the outfit…</p>
                      <p className="text-xs text-muted-foreground mt-1">This takes ~30 seconds</p>
                    </div>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="w-full h-full bg-secondary/50 flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <AlertCircle className="w-10 h-10 text-destructive" />
                  <p className="font-semibold text-sm">AI try-on failed</p>
                  <p className="text-xs text-muted-foreground">{error}</p>
                  <Button size="sm" onClick={() => runAiTryOn(selectedId)} className="rounded-full gap-1.5">
                    <RotateCcw size={13} /> Retry
                  </Button>
                  <p className="text-[10px] text-muted-foreground">Showing demo below</p>
                  <img src={fallbackUrl} alt="Demo" className="absolute inset-0 w-full h-full object-cover object-top -z-10 opacity-50" />
                </div>
              ) : aiResult ? (
                <img src={aiResult} alt="AI Try-On Result" className="w-full h-full object-cover object-top" />
              ) : (
                <img src={fallbackUrl} alt={garment.name} className="w-full h-full object-cover object-top" />
              )}

              {/* Overlay badges */}
              {!loading && (
                <>
                  <div className="absolute top-3 left-3 bg-black/55 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5">
                    <img src={garment.image} alt="" className="w-4 h-4 object-contain" />
                    <span className="text-white text-[10px] font-semibold">{garment.name}</span>
                  </div>
                  {aiResult && (
                    <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                      <Sparkles size={10} className="text-yellow-300" />
                      <span className="text-white text-[10px] font-bold">AI Result</span>
                    </div>
                  )}
                </>
              )}

              {/* Price + CTA */}
              {!loading && (
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div className="bg-white/95 backdrop-blur rounded-2xl px-3 py-2 shadow-lg">
                    <p className="text-[9px] text-muted-foreground">Price</p>
                    <p className="text-base font-bold text-primary leading-none">{garment.price}</p>
                    <p className="text-[9px] text-muted-foreground">Size: {size}</p>
                  </div>
                  <button className="bg-primary text-white rounded-2xl px-4 py-2.5 text-xs font-bold shadow-lg active:scale-95 transition-transform">
                    Add to Cart
                  </button>
                </div>
              )}
            </div>

            {/* AI Try-On button (only when photo uploaded) */}
            {uploadedPhoto && !loading && (
              <div className="mx-4 mt-2 shrink-0">
                <Button
                  className="w-full rounded-full h-11 gap-2 shadow-md shadow-primary/20"
                  onClick={() => runAiTryOn(selectedId)}
                  disabled={loading}
                >
                  <Sparkles size={16} />
                  {aiResult ? "Regenerate AI Try-On" : "Generate AI Try-On"}
                </Button>
              </div>
            )}

            {/* No photo hint */}
            {!uploadedPhoto && (
              <div className="mx-4 mt-2 shrink-0">
                <button onClick={() => setStep(1)}
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-2xl border-2 border-dashed border-primary/30 text-primary text-xs font-semibold hover:bg-primary/5 transition-colors">
                  <Camera size={13} /> Upload your photo for AI try-on
                </button>
              </div>
            )}

            {/* Outfit picker */}
            <div className="shrink-0 mt-2 px-4">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-sm font-semibold">Try Another Outfit</h3>
                <span className="text-xs text-muted-foreground">{GARMENTS.length} items</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
                {GARMENTS.map(g => (
                  <div key={g.id}
                    onClick={() => selectGarment(g.id)}
                    className={`relative flex-shrink-0 w-[68px] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all active:scale-95 ${selectedId === g.id ? "border-primary shadow-md shadow-primary/25 scale-105" : "border-border/40"}`}
                    style={{ aspectRatio: "3/4" }}>
                    <img
                      src={gender === "man" ? g.fallbackM : g.fallbackF}
                      alt={g.name}
                      className="w-full h-full object-cover object-top bg-secondary/30"
                    />
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
                    <button key={s} onClick={() => setSize(s)}
                      className={`flex-shrink-0 w-9 h-8 rounded-lg text-xs font-bold border-2 transition-all ${size === s ? "border-primary bg-primary text-white" : "border-border"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="px-4 pb-4 mt-2 flex gap-2.5 shrink-0">
              <Button variant="outline" className="flex-1 rounded-full gap-1.5 h-11 border-2 text-sm" onClick={() => setStep(1)}>
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
