import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Upload, Sparkles, ChevronLeft, Check, Camera, Image as ImageIcon } from "lucide-react";
import { useLocation } from "wouter";

export default function TryOn() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1); // 1: photo, 2: garment, 3: generating, 4: result
  
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<number | null>(null);
  
  // Mock data
  const models = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
  ];
  
  const garments = [
    { id: 1, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80", name: "Yellow Dress" },
    { id: 2, image: "https://images.unsplash.com/photo-1550639525-c97d455acf70?w=400&q=80", name: "Red Top" },
    { id: 3, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80", name: "Denim Jacket" },
    { id: 4, image: "https://images.unsplash.com/photo-1588117260148-b47818741c74?w=400&q=80", name: "Summer Skirt" },
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

  const resultImage = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"; // Using the dress image as mockup result

  return (
    <MobileLayout>
      <div className="p-6 h-full flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center gap-4 pt-2 mb-6">
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
          <div className="flex-1 space-y-8 flex flex-col pb-6">
            <div className="flex-1 min-h-[250px] border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-secondary/30">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload size={32} className="text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Upload a photo</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-[250px]">For best results, use a full-body photo with good lighting and simple background.</p>
              
              <div className="flex gap-4 w-full">
                <Button variant="outline" className="flex-1 rounded-2xl gap-2 h-12 border-primary/20 hover:bg-primary/5">
                  <Camera size={18} /> Camera
                </Button>
                <Button variant="outline" className="flex-1 rounded-2xl gap-2 h-12 border-primary/20 hover:bg-primary/5">
                  <ImageIcon size={18} /> Gallery
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">Or use a model</h3>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-2">
                {models.map((m, i) => (
                  <div 
                    key={i} 
                    className={`relative w-32 h-44 rounded-2xl overflow-hidden shrink-0 cursor-pointer border-2 transition-all ${selectedModel === m ? 'border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background' : 'border-transparent'}`}
                    onClick={() => setSelectedModel(m)}
                  >
                    <img src={m} alt={`Model ${i+1}`} className="w-full h-full object-cover" />
                    {selectedModel === m && (
                      <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 shadow-md">
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6">
              <Button 
                className="w-full rounded-full h-14 text-lg shadow-lg shadow-primary/25"
                disabled={!selectedModel}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col space-y-6 pb-6">
            {/* Show selected model small */}
            <div className="flex gap-4 items-center bg-secondary/50 p-3 rounded-2xl border border-border/50">
              <div className="w-12 h-16 rounded-lg overflow-hidden">
                <img src={selectedModel || ""} className="w-full h-full object-cover" alt="Selected" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Selected Photo</p>
                <p className="text-xs text-muted-foreground">Ready for styling</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-xs">Change</Button>
            </div>

            <div className="flex-1">
              <h3 className="font-semibold mb-4 text-lg">Choose from Wardrobe</h3>
              <div className="grid grid-cols-2 gap-4 pb-4 overflow-y-auto">
                {garments.map((g) => (
                  <div 
                    key={g.id} 
                    className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all aspect-[3/4] ${selectedGarment === g.id ? 'border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background' : 'border-transparent'}`}
                    onClick={() => setSelectedGarment(g.id)}
                  >
                    <img src={g.image} alt={g.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                      <span className="text-white font-medium text-sm">{g.name}</span>
                    </div>
                    {selectedGarment === g.id && (
                      <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 shadow-md">
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button 
              className="w-full rounded-full h-14 text-lg mt-auto shadow-lg shadow-primary/25 gap-2 shrink-0"
              disabled={!selectedGarment}
              onClick={() => setStep(3)}
            >
              <Sparkles size={20} />
              Try it on
            </Button>
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