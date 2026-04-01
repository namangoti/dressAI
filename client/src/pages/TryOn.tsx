import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Upload, Sparkles, ChevronLeft, Check, Camera, Image as ImageIcon } from "lucide-react";
import { useLocation } from "wouter";

import garment1 from "@/assets/images/garment-1.jpg";
import garment2 from "@/assets/images/garment-2.jpg";
import garment3 from "@/assets/images/garment-3.jpg";
import garment4 from "@/assets/images/garment-4.jpg";
import garment5 from "@/assets/images/garment-5.jpg";
import garment6 from "@/assets/images/garment-6.jpg";

import result1 from "@/assets/images/result-1.jpg";
import result2 from "@/assets/images/result-2.jpg";
import result3 from "@/assets/images/result-3.jpg";
import result4 from "@/assets/images/result-4.jpg";
import result5 from "@/assets/images/result-5.jpg";
import result6 from "@/assets/images/result-6.jpg";

export default function TryOn() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1); // 1: photo, 2: garment, 3: generating, 4: result
  
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<number | null>(null);
  
  // Mock data
  const models = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80", // Female
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80", // Male
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80", // Male 2
  ];
  
  const garments = [
    { id: 1, image: garment1, name: "Yellow Dress", result: result1 },
    { id: 2, image: garment2, name: "Red Top", result: result2 },
    { id: 3, image: garment3, name: "Denim Jacket", result: result3 },
    { id: 4, image: garment4, name: "Black T-Shirt", result: result4 },
    { id: 5, image: garment5, name: "White Shirt", result: result5 },
    { id: 6, image: garment6, name: "Grey Hoodie", result: result6 },
  ];

  // Auto transition from step 3 to 4
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        setStep(4);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const selectedGarmentData = garments.find(g => g.id === selectedGarment);
  const resultImage = selectedGarmentData ? selectedGarmentData.result : "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80";

  return (
    <MobileLayout>
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <header className="flex items-center gap-4 pt-2 mb-4 shrink-0">
          <Button variant="ghost" size="icon" className="rounded-full shrink-0" onClick={() => step > 1 ? setStep(step - 1) : setLocation("/")}>
            <ChevronLeft size={24} />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-center">
              {step === 1 && "Choose Photo"}
              {step === 2 && "Select Outfit"}
              {step === 3 && "Creating Magic..."}
              {step === 4 && "Your FitCheck"}
            </h1>
          </div>
          <div className="w-10 shrink-0" /> {/* Spacer */}
        </header>

        {/* Content based on step */}
        {step === 1 && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 min-h-[120px] max-h-[200px] border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center p-4 text-center bg-secondary/30 mb-4 shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Upload size={20} className="text-primary" />
              </div>
              <h3 className="font-bold text-sm mb-1">Upload a photo</h3>
              <p className="text-xs text-muted-foreground mb-3 max-w-[220px]">For best results, use a full-body photo with good lighting.</p>
              
              <div className="flex gap-2 w-full">
                <Button variant="outline" className="flex-1 rounded-2xl gap-1.5 h-9 border-primary/20 hover:bg-primary/5 text-xs">
                  <Camera size={14} /> Camera
                </Button>
                <Button variant="outline" className="flex-1 rounded-2xl gap-1.5 h-9 border-primary/20 hover:bg-primary/5 text-xs">
                  <ImageIcon size={14} /> Gallery
                </Button>
              </div>
            </div>

            <div className="shrink-0 mb-4">
              <h3 className="font-semibold mb-2 text-sm">Or use a model</h3>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-2">
                {models.map((m, i) => (
                  <div 
                    key={i} 
                    className={`relative w-20 h-28 rounded-xl overflow-hidden shrink-0 cursor-pointer border-2 transition-all ${selectedModel === m ? 'border-primary ring-2 ring-primary/20 ring-offset-1 ring-offset-background' : 'border-transparent'}`}
                    onClick={() => setSelectedModel(m)}
                  >
                    <img src={m} alt={`Model ${i+1}`} className="w-full h-full object-cover" />
                    {selectedModel === m && (
                      <div className="absolute top-1.5 right-1.5 bg-primary text-white rounded-full p-0.5 shadow-md">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-2 shrink-0 pb-4">
              <Button 
                className="w-full rounded-full h-12 text-base shadow-lg shadow-primary/25"
                disabled={!selectedModel}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col min-h-0 relative">
            {/* Show selected model small */}
            <div className="flex gap-4 items-center bg-secondary/50 p-3 rounded-2xl border border-border/50 shrink-0 mb-4 z-10">
              <div className="w-12 h-16 rounded-lg overflow-hidden">
                <img src={selectedModel || ""} className="w-full h-full object-cover" alt="Selected" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Selected Photo</p>
                <p className="text-xs text-muted-foreground">Ready for styling</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-xs">Change</Button>
            </div>

            <div className="flex-1 min-h-0 flex flex-col z-0">
              <h3 className="font-semibold mb-3 text-base shrink-0">Choose from Wardrobe</h3>
              <div className="flex-1 overflow-y-auto pr-2 pb-24 -mr-2">
                <div className="grid grid-cols-2 gap-3">
                  {garments.map((g) => (
                    <div 
                      key={g.id} 
                      className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all aspect-[3/4] ${selectedGarment === g.id ? 'border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background' : 'border-transparent'}`}
                      onClick={() => setSelectedGarment(g.id)}
                    >
                      <img src={g.image} alt={g.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
                        <span className="text-white font-medium text-xs">{g.name}</span>
                      </div>
                      {selectedGarment === g.id && (
                        <div className="absolute top-1.5 right-1.5 bg-primary text-white rounded-full p-0.5 shadow-md">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 pt-6 pb-2 bg-gradient-to-t from-background via-background/95 to-transparent z-20">
              <Button 
                className="w-full rounded-full h-12 text-base shadow-lg shadow-primary/25 gap-2"
                disabled={!selectedGarment}
                onClick={() => setStep(3)}
              >
                <Sparkles size={18} />
                Try it on
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-10 pb-20">
            <div className="relative w-56 h-80 rounded-3xl overflow-hidden shadow-2xl border border-primary/20">
              <img src={selectedModel || ""} className="w-full h-full object-cover opacity-60 grayscale" alt="Processing" />
              
              {/* Scanning effect */}
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary w-full shadow-[0_0_20px_rgba(var(--primary),1)] animate-[scan_2s_ease-in-out_infinite]" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="text-primary w-12 h-12 animate-pulse" />
              </div>
            </div>
            
            <div className="text-center space-y-3">
              <h3 className="font-bold text-2xl animate-pulse bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Analyzing shape...</h3>
              <p className="text-muted-foreground">Applying advanced AI styling perfectly to your body</p>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes scan {
                0% { top: 0; }
                50% { top: 100%; }
                100% { top: 0; }
              }
            `}} />
          </div>
        )}

        {step === 4 && (
          <div className="flex-1 flex flex-col space-y-6 pb-6">
            <div className="relative flex-1 min-h-[400px] rounded-3xl overflow-hidden shadow-2xl bg-secondary/20">
              <img src={resultImage} alt="Result" className="w-full h-full object-cover" />
              
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 border border-white/20">
                <Sparkles size={14} className="text-yellow-400" />
                <span className="text-white text-xs font-medium">AI Generated</span>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                <Button variant="secondary" className="flex-1 rounded-full h-14 bg-white/90 backdrop-blur text-black hover:bg-white border-0 font-medium">
                  Save to Wardrobe
                </Button>
                <Button className="flex-1 rounded-full h-14 shadow-lg shadow-primary/20 font-medium">
                  Share Look
                </Button>
              </div>
            </div>
            
            <Button variant="outline" className="w-full rounded-full h-14 text-lg border-2 border-primary/20 text-primary hover:bg-primary/5" onClick={() => setStep(2)}>
              Try another outfit
            </Button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}