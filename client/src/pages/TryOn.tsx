import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  ChevronLeft, Check, Camera, Image as ImageIcon,
  RotateCcw, Share2, Heart, Ruler, Weight, Shirt, User, Sparkles
} from "lucide-react";
import { useLocation } from "wouter";

import garment1 from "@/assets/images/tshirt-black.png";
import garment2 from "@/assets/images/tshirt-white.png";
import garment3 from "@/assets/images/tshirt-grey.png";
import garment4 from "@/assets/images/tshirt-red.png";
import garment5 from "@/assets/images/tshirt-blue.png";
import garment6 from "@/assets/images/tshirt-graphic.png";

/* ── Outfit catalogue with real "worn" look photos per gender ─ */
const GARMENTS = [
  {
    id: 1, image: garment1, name: "Black T-Shirt", price: "₹599", tag: "Bestseller",
    wornMan:   "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
    wornWoman: "https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=600&q=80",
  },
  {
    id: 2, image: garment2, name: "White T-Shirt", price: "₹499", tag: "New",
    wornMan:   "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80",
    wornWoman: "https://images.unsplash.com/photo-1485231183945-fffde7ae021e?w=600&q=80",
  },
  {
    id: 3, image: garment3, name: "Grey T-Shirt", price: "₹549", tag: "",
    wornMan:   "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
    wornWoman: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
  },
  {
    id: 4, image: garment4, name: "Red T-Shirt", price: "₹649", tag: "Hot",
    wornMan:   "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
    wornWoman: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
  },
  {
    id: 5, image: garment5, name: "Blue T-Shirt", price: "₹599", tag: "",
    wornMan:   "https://images.unsplash.com/photo-1473621038790-b778b4de3b84?w=600&q=80",
    wornWoman: "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=600&q=80",
  },
  {
    id: 6, image: garment6, name: "Graphic T-Shirt", price: "₹799", tag: "Trending",
    wornMan:   "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
    wornWoman: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
  },
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

/* ════════════════════════════════════════════════════════════ */
export default function TryOn() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<1 | 2>(1);

  /* ── setup state ── */
  const [gender, setGender]         = useState<Gender>("man");
  const [height, setHeight]         = useState(170);
  const [weight, setWeight]         = useState(70);
  const [size, setSize]             = useState<Size>("M");
  const [skinTone, setSkinTone]     = useState("medium");
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  /* ── try-on state ── */
  const [selectedId, setSelectedId] = useState(1);
  const [saved, setSaved]           = useState(false);

  const bmi     = weight / Math.pow(height / 100, 2);
  const garment = GARMENTS.find(g => g.id === selectedId)!;
  const wornUrl = gender === "man" ? garment.wornMan : garment.wornWoman;

  function readFile(file: File, cb: (url: string) => void) {
    const r = new FileReader();
    r.onload = e => cb(e.target?.result as string);
    r.readAsDataURL(file);
  }

  /* ════════════════════════════════════════════════════════ */
  return (
    <MobileLayout>
      <div className="h-full flex flex-col bg-background">

        {/* ═══ STEP 1: Setup ═════════════════════════════════ */}
        {step === 1 && (
          <div className="flex-1 flex flex-col overflow-y-auto">
            <header className="flex items-center gap-3 px-5 pt-4 pb-2 shrink-0">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setLocation("/")}>
                <ChevronLeft size={22} />
              </Button>
              <div>
                <h1 className="text-lg font-bold leading-tight">Build Your Profile</h1>
                <p className="text-xs text-muted-foreground">Set your details for the best match</p>
              </div>
            </header>

            <div className="flex-1 px-5 pb-4 space-y-5">

              {/* Upload photo */}
              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Your Reference Photo <span className="normal-case font-normal">(optional)</span>
                </p>
                {uploadedPhoto ? (
                  <div className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-secondary/30">
                    <div className="w-14 h-18 rounded-xl overflow-hidden border border-border shrink-0" style={{ height: 72 }}>
                      <img src={uploadedPhoto} alt="You" className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-600 flex items-center gap-1"><Check size={14} /> Photo uploaded</p>
                      <p className="text-xs text-muted-foreground">Will appear alongside outfit preview</p>
                    </div>
                    <button onClick={() => setUploadedPhoto(null)} className="text-muted-foreground hover:text-destructive">
                      <RotateCcw size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <label className="flex-1 flex items-center justify-center gap-1.5 h-11 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 cursor-pointer text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                      <Camera size={14} /> Camera
                      <input type="file" accept="image/*" capture="environment" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, setUploadedPhoto); }} />
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-1.5 h-11 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 cursor-pointer text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                      <ImageIcon size={14} /> Gallery
                      <input type="file" accept="image/*" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, setUploadedPhoto); }} />
                    </label>
                  </div>
                )}
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
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Ruler size={11} /> Height</p>
                  <span className="text-sm font-bold text-primary">{height} cm</span>
                </div>
                <input type="range" min={140} max={200} value={height} onChange={e => setHeight(+e.target.value)}
                  className="w-full accent-primary h-2 rounded-full" />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>140 cm</span><span>200 cm</span>
                </div>
              </section>

              {/* Weight */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Weight size={11} /> Weight</p>
                  <span className="text-sm font-bold text-primary">{weight} kg</span>
                </div>
                <input type="range" min={40} max={130} value={weight} onChange={e => setWeight(+e.target.value)}
                  className="w-full accent-primary h-2 rounded-full" />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>40 kg</span><span>130 kg</span>
                </div>
              </section>

              {/* Clothing Size */}
              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1"><Shirt size={11} /> Clothing Size</p>
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

              {/* Profile summary */}
              <section className="rounded-3xl border border-border/50 bg-secondary/30 p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Your Profile Summary</p>
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
                    <p className="text-lg font-bold text-primary capitalize">{gender === "man" ? "Male" : "Female"}</p>
                    <p className="text-[10px] text-muted-foreground">Gender</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="px-5 pb-6 shrink-0">
              <Button className="w-full rounded-full h-13 text-base shadow-lg shadow-primary/20 gap-2"
                onClick={() => { setStep(2); setSaved(false); }}>
                <Sparkles size={18} /> Start Try-On
              </Button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: Try-On ════════════════════════════════ */}
        {step === 2 && (
          <div className="flex-1 flex flex-col min-h-0">

            <header className="flex items-center gap-2 px-4 pt-3 pb-2 shrink-0">
              <Button variant="ghost" size="icon" className="rounded-full shrink-0" onClick={() => setStep(1)}>
                <ChevronLeft size={22} />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-base font-bold truncate">{garment.name}</h1>
                <p className="text-xs text-muted-foreground">Size {size} · {gender === "man" ? "Male" : "Female"} · {height}cm</p>
              </div>
              <button onClick={() => setSaved(s => !s)}
                className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border shrink-0 transition-all ${saved ? "bg-red-50 border-red-200 text-red-500" : "border-border text-muted-foreground"}`}>
                <Heart size={12} fill={saved ? "currentColor" : "none"} />
                {saved ? "Saved" : "Save"}
              </button>
            </header>

            {/* ── With uploaded photo: side-by-side ── */}
            {uploadedPhoto ? (
              <div className="mx-4 flex gap-2 shrink-0" style={{ height: "46vh" }}>
                {/* Left: user's photo */}
                <div className="flex-1 rounded-3xl overflow-hidden border-2 border-primary shadow-lg relative">
                  <img src={uploadedPhoto} alt="You" className="w-full h-full object-cover object-top" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent pt-6 pb-2 text-center">
                    <span className="text-white text-[11px] font-bold flex items-center justify-center gap-1">
                      <User size={10} /> You
                    </span>
                  </div>
                </div>

                {/* Right: model wearing selected outfit */}
                <div className="flex-1 rounded-3xl overflow-hidden border border-border/40 shadow-lg relative">
                  <img
                    key={`${selectedId}-${gender}`}
                    src={wornUrl}
                    alt={garment.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                    <div className="bg-black/55 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                      <img src={garment.image} alt="" className="w-3 h-3 object-contain" />
                      <span className="text-white text-[9px] font-semibold truncate max-w-[60px]">{garment.name}</span>
                    </div>
                    <div className="bg-primary/90 rounded-full px-2 py-0.5">
                      <span className="text-white text-[9px] font-bold">Worn</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent pt-6 pb-2 text-center">
                    <span className="text-white text-[11px] font-bold flex items-center justify-center gap-1">
                      <Sparkles size={10} /> Outfit Look
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* ── No uploaded photo: full-width outfit look ── */
              <div className="mx-4 rounded-3xl overflow-hidden border border-border/30 shadow-xl relative shrink-0" style={{ aspectRatio: "3/4", maxHeight: "48vh" }}>
                <img
                  key={`${selectedId}-${gender}`}
                  src={wornUrl}
                  alt={garment.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-3 left-3 bg-black/55 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5">
                  <img src={garment.image} alt="" className="w-4 h-4 object-contain" />
                  <span className="text-white text-[10px] font-semibold">{garment.name}</span>
                </div>
                <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <span className="text-white text-[10px] font-bold">Wearing It</span>
                </div>
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
              </div>
            )}

            {/* Price + CTA bar (uploaded photo mode) */}
            {uploadedPhoto && (
              <div className="mx-4 mt-2 flex items-center gap-2 shrink-0">
                <div className="flex-1 bg-secondary/40 rounded-2xl px-3 py-2 border border-border/40">
                  <p className="text-[10px] text-muted-foreground">Selected</p>
                  <p className="text-sm font-bold">{garment.name} · {garment.price}</p>
                </div>
                <button className="bg-primary text-white rounded-2xl px-5 py-2.5 text-sm font-bold shadow-lg active:scale-95 transition-transform shrink-0">
                  Add to Cart
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
                    onClick={() => { setSelectedId(g.id); setSaved(false); setShowMyPhoto(false); }}
                    className={`relative flex-shrink-0 w-[68px] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all active:scale-95 ${selectedId === g.id ? "border-primary shadow-md shadow-primary/25 scale-105" : "border-border/40"}`}
                    style={{ aspectRatio: "3/4" }}>
                    <img
                      src={gender === "man" ? g.wornMan : g.wornWoman}
                      alt={g.name}
                      className="w-full h-full object-cover object-top bg-secondary/30"
                    />
                    {g.tag && (
                      <div className="absolute top-1 left-1 bg-primary text-white text-[7px] font-bold px-1 py-0.5 rounded-full">{g.tag}</div>
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

            {/* Actions */}
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
