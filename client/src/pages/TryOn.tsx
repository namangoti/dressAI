import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import { Upload, Sparkles, ChevronLeft, Check, Camera, Image as ImageIcon, RotateCcw, Share2, Heart } from "lucide-react";
import { useLocation } from "wouter";

import garment1 from "@/assets/images/tshirt-black.png";
import garment2 from "@/assets/images/tshirt-white.png";
import garment3 from "@/assets/images/tshirt-grey.png";
import garment4 from "@/assets/images/tshirt-red.png";
import garment5 from "@/assets/images/tshirt-blue.png";
import garment6 from "@/assets/images/tshirt-graphic.png";

const GARMENTS = [
  { id: 1, image: garment1, name: "Black T-Shirt", price: "₹599", tag: "Bestseller" },
  { id: 2, image: garment2, name: "White T-Shirt", price: "₹499", tag: "New" },
  { id: 3, image: garment3, name: "Grey T-Shirt", price: "₹549", tag: "" },
  { id: 4, image: garment4, name: "Red T-Shirt", price: "₹649", tag: "Hot" },
  { id: 5, image: garment5, name: "Blue T-Shirt", price: "₹599", tag: "" },
  { id: 6, image: garment6, name: "Graphic T-Shirt", price: "₹799", tag: "Trending" },
];

type Gender = "man" | "woman" | "child";
type BodyType = "slim" | "regular" | "athletic";
type SkinTone = "fair" | "light" | "medium" | "tan" | "dark";

interface AvatarConfig {
  url: string;
  // garment overlay calibration: where on the avatar the chest begins (0-1)
  torsoTop: number;
  // width of garment relative to avatar width (0-1)
  garmentWidthRatio: number;
  label: string;
}

// Full-body standing model avatars with torso calibration
const AVATARS: Record<Gender, Record<BodyType, AvatarConfig>> = {
  man: {
    slim: {
      url: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&q=80",
      torsoTop: 0.20,
      garmentWidthRatio: 0.70,
      label: "Slim Male",
    },
    regular: {
      url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=80",
      torsoTop: 0.20,
      garmentWidthRatio: 0.74,
      label: "Regular Male",
    },
    athletic: {
      url: "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=500&q=80",
      torsoTop: 0.19,
      garmentWidthRatio: 0.78,
      label: "Athletic Male",
    },
  },
  woman: {
    slim: {
      url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80",
      torsoTop: 0.21,
      garmentWidthRatio: 0.66,
      label: "Slim Female",
    },
    regular: {
      url: "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=500&q=80",
      torsoTop: 0.21,
      garmentWidthRatio: 0.70,
      label: "Regular Female",
    },
    athletic: {
      url: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=500&q=80",
      torsoTop: 0.20,
      garmentWidthRatio: 0.72,
      label: "Athletic Female",
    },
  },
  child: {
    slim: {
      url: "https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?w=500&q=80",
      torsoTop: 0.22,
      garmentWidthRatio: 0.65,
      label: "Child",
    },
    regular: {
      url: "https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?w=500&q=80",
      torsoTop: 0.22,
      garmentWidthRatio: 0.65,
      label: "Child",
    },
    athletic: {
      url: "https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?w=500&q=80",
      torsoTop: 0.22,
      garmentWidthRatio: 0.65,
      label: "Child",
    },
  },
};

const SKIN_TONES: Record<SkinTone, string> = {
  fair: "#FDDBB4",
  light: "#E8B88A",
  medium: "#C68642",
  tan: "#A0522D",
  dark: "#4A2912",
};

export default function TryOn() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<1 | 2>(1);

  // Avatar config
  const [gender, setGender] = useState<Gender>("man");
  const [bodyType, setBodyType] = useState<BodyType>("regular");
  const [skinTone, setSkinTone] = useState<SkinTone>("medium");
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  // Try-on state
  const [selectedGarmentId, setSelectedGarmentId] = useState<number>(1);
  const [isSaved, setIsSaved] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const avatarImgRef = useRef<HTMLImageElement | null>(null);
  const garmentImgRef = useRef<HTMLImageElement | null>(null);

  const avatarConfig = AVATARS[gender][bodyType];
  const avatarUrl = uploadedPhoto || avatarConfig.url;
  const selectedGarment = GARMENTS.find(g => g.id === selectedGarmentId)!;

  // Draw composited image on canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const avatarImg = avatarImgRef.current;
    const garmentImg = garmentImgRef.current;
    if (!avatarImg || !garmentImg) return;
    if (!avatarImg.complete || !garmentImg.complete) return;

    const W = canvas.width;
    const H = canvas.height;

    // Draw avatar (cover fill)
    const avatarAspect = avatarImg.naturalWidth / avatarImg.naturalHeight;
    const canvasAspect = W / H;
    let sx = 0, sy = 0, sw = avatarImg.naturalWidth, sh = avatarImg.naturalHeight;
    if (avatarAspect > canvasAspect) {
      sw = avatarImg.naturalHeight * canvasAspect;
      sx = (avatarImg.naturalWidth - sw) / 2;
    } else {
      sh = avatarImg.naturalWidth / canvasAspect;
      sy = 0; // align to top for portrait shots
    }
    ctx.drawImage(avatarImg, sx, sy, sw, sh, 0, 0, W, H);

    // Draw garment on torso
    const config = uploadedPhoto
      ? { torsoTop: 0.27, garmentWidthRatio: 0.72 }
      : avatarConfig;

    const gW = W * config.garmentWidthRatio;
    const gAspect = garmentImg.naturalWidth / garmentImg.naturalHeight;
    const gH = gW / gAspect;
    const gX = (W - gW) / 2;
    const gY = H * config.torsoTop;

    ctx.drawImage(garmentImg, gX, gY, gW, gH);
  }, [avatarConfig, uploadedPhoto]);

  // Load avatar image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = avatarUrl;
    img.onload = () => {
      avatarImgRef.current = img;
      drawCanvas();
    };
    avatarImgRef.current = img.complete ? img : null;
  }, [avatarUrl, drawCanvas]);

  // Load garment image
  useEffect(() => {
    const img = new Image();
    img.src = selectedGarment.image;
    img.onload = () => {
      garmentImgRef.current = img;
      drawCanvas();
    };
    if (img.complete) {
      garmentImgRef.current = img;
      drawCanvas();
    }
  }, [selectedGarment.image, drawCanvas]);

  // Redraw when canvas mounts (step 2)
  useEffect(() => {
    if (step === 2) {
      setTimeout(drawCanvas, 50);
    }
  }, [step, drawCanvas]);

  return (
    <MobileLayout>
      <div className="h-full flex flex-col">

        {/* ── STEP 1: Avatar Setup ── */}
        {step === 1 && (
          <div className="flex-1 flex flex-col overflow-y-auto">
            <header className="flex items-center gap-3 px-5 pt-4 pb-3 shrink-0">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setLocation("/")}>
                <ChevronLeft size={22} />
              </Button>
              <div className="flex-1">
                <h1 className="text-lg font-bold">Build Your Avatar</h1>
                <p className="text-xs text-muted-foreground">Set your body profile for the best fit</p>
              </div>
            </header>

            <div className="flex-1 px-5 pb-6 space-y-6">
              {/* Upload your own photo */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Your Photo</h3>
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 h-11 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 cursor-pointer text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                    <Camera size={15} /> Camera
                    <input type="file" accept="image/*" capture="environment" className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => setUploadedPhoto(ev.target?.result as string);
                        reader.readAsDataURL(file);
                      }} />
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-2 h-11 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 cursor-pointer text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                    <ImageIcon size={15} /> Gallery
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => setUploadedPhoto(ev.target?.result as string);
                        reader.readAsDataURL(file);
                      }} />
                  </label>
                  {uploadedPhoto && (
                    <button onClick={() => setUploadedPhoto(null)} className="h-11 w-11 rounded-2xl border-2 border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                      <RotateCcw size={15} />
                    </button>
                  )}
                </div>
                {uploadedPhoto && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-green-600 font-medium">
                    <Check size={13} /> Photo uploaded — using your photo as avatar
                  </div>
                )}
              </div>

              {/* Gender */}
              {!uploadedPhoto && (
                <>
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Gender</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {(["man", "woman", "child"] as Gender[]).map(g => (
                        <button
                          key={g}
                          onClick={() => { setGender(g); if (g === "child") setBodyType("regular"); }}
                          className={`py-3 rounded-2xl text-sm font-medium capitalize border-2 transition-all ${gender === g ? "border-primary bg-primary text-white" : "border-border bg-secondary/40 text-foreground"}`}
                        >
                          {g === "man" ? "👨 Man" : g === "woman" ? "👩 Woman" : "👦 Child"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Body Type */}
                  {gender !== "child" && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Body Type</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {(["slim", "regular", "athletic"] as BodyType[]).map(bt => (
                          <button
                            key={bt}
                            onClick={() => setBodyType(bt)}
                            className={`py-3 rounded-2xl text-sm font-medium capitalize border-2 transition-all ${bodyType === bt ? "border-primary bg-primary text-white" : "border-border bg-secondary/40 text-foreground"}`}
                          >
                            {bt === "slim" ? "🪶" : bt === "regular" ? "🧍" : "💪"}<br />
                            <span className="text-xs">{bt}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skin Tone */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Skin Tone</h3>
                    <div className="flex gap-3">
                      {(Object.entries(SKIN_TONES) as [SkinTone, string][]).map(([tone, color]) => (
                        <button
                          key={tone}
                          onClick={() => setSkinTone(tone)}
                          className={`w-10 h-10 rounded-full border-4 transition-all ${skinTone === tone ? "border-primary scale-110 shadow-lg" : "border-transparent"}`}
                          style={{ backgroundColor: color }}
                          title={tone}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Avatar preview */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Your Avatar Preview</h3>
                    <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-1">
                      {(Object.entries(AVATARS[gender]) as [BodyType, AvatarConfig][]).map(([bt, cfg]) => (
                        <div
                          key={bt}
                          onClick={() => setBodyType(bt)}
                          className={`relative w-20 h-28 rounded-2xl overflow-hidden shrink-0 cursor-pointer border-2 transition-all ${bodyType === bt ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-60"}`}
                        >
                          <img src={cfg.url} alt={cfg.label} className="w-full h-full object-cover object-top" />
                          {bodyType === bt && (
                            <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                              <Check size={10} className="text-white" />
                            </div>
                          )}
                          <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[9px] text-center py-0.5 capitalize">{bt}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="px-5 pb-6 shrink-0">
              <Button
                className="w-full rounded-full h-13 text-base shadow-lg shadow-primary/25 gap-2"
                onClick={() => setStep(2)}
              >
                <Sparkles size={18} />
                Start Virtual Try-On
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Live Try-On ── */}
        {step === 2 && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Header */}
            <header className="flex items-center gap-3 px-4 pt-3 pb-2 shrink-0">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setStep(1)}>
                <ChevronLeft size={22} />
              </Button>
              <div className="flex-1">
                <h1 className="text-lg font-bold">Virtual Try-On</h1>
                <p className="text-xs text-muted-foreground">Tap any outfit to try it instantly</p>
              </div>
              <button onClick={() => setIsSaved(s => !s)} className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${isSaved ? "bg-red-50 border-red-200 text-red-500" : "border-border text-muted-foreground"}`}>
                <Heart size={13} fill={isSaved ? "currentColor" : "none"} />
                {isSaved ? "Saved" : "Save"}
              </button>
            </header>

            {/* Canvas preview */}
            <div className="relative mx-4 rounded-3xl overflow-hidden bg-secondary/30 shadow-xl shrink-0" style={{ aspectRatio: "3/4", maxHeight: "52vh" }}>
              <canvas
                ref={canvasRef}
                width={420}
                height={560}
                className="w-full h-full object-cover"
              />

              {/* Overlay badges */}
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                <Sparkles size={12} className="text-yellow-400" />
                <span className="text-white text-[10px] font-medium">AI Try-On</span>
              </div>
              <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                <span className="text-white text-[10px] font-medium">{selectedGarment.name}</span>
              </div>

              {/* Price tag */}
              <div className="absolute bottom-3 left-3 bg-white rounded-xl px-3 py-1.5 shadow-lg">
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-sm font-bold text-primary">{selectedGarment.price}</p>
              </div>
              <button className="absolute bottom-3 right-3 bg-primary text-white rounded-xl px-4 py-2 text-xs font-bold shadow-lg">
                Add to Cart
              </button>
            </div>

            {/* Outfit picker */}
            <div className="shrink-0 mt-3 px-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">Choose Outfit</h3>
                <span className="text-xs text-muted-foreground">{GARMENTS.length} items</span>
              </div>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
                {GARMENTS.map(g => (
                  <div
                    key={g.id}
                    onClick={() => { setSelectedGarmentId(g.id); setIsSaved(false); }}
                    className={`relative flex-shrink-0 w-20 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${selectedGarmentId === g.id ? "border-primary shadow-md shadow-primary/20 scale-105" : "border-border/40"}`}
                    style={{ aspectRatio: "3/4" }}
                  >
                    <img src={g.image} alt={g.name} className="w-full h-full object-cover bg-secondary/50" />
                    {g.tag && (
                      <div className="absolute top-1 left-1 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">{g.tag}</div>
                    )}
                    {selectedGarmentId === g.id && (
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <div className="bg-primary rounded-full p-1">
                          <Check size={10} className="text-white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-1 py-1.5">
                      <p className="text-white text-[8px] font-medium leading-tight">{g.name}</p>
                      <p className="text-white/80 text-[8px]">{g.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 mt-3 flex gap-3 shrink-0">
              <Button variant="outline" className="flex-1 rounded-full gap-2 h-11 border-2" onClick={() => setStep(1)}>
                <RotateCcw size={15} /> Change Avatar
              </Button>
              <Button className="flex-1 rounded-full gap-2 h-11 shadow-lg shadow-primary/20">
                <Share2 size={15} /> Share Look
              </Button>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
