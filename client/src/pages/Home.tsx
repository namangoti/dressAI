import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Sparkles, ChevronRight, Search, Bell, Heart, User, MapPin, ChevronDown } from "lucide-react";
import { Link } from "wouter";

import garment1 from "@/assets/images/tshirt-black.png";
import garment2 from "@/assets/images/tshirt-white.png";
import garment3 from "@/assets/images/tshirt-grey.png";
import garment4 from "@/assets/images/tshirt-red.png";
import garment5 from "@/assets/images/tshirt-blue.png";

export default function Home() {
  const recentTryOns = [
    { id: 1, image: garment1, title: "Black T-Shirt Look" },
    { id: 2, image: garment2, title: "White T-Shirt Look" },
    { id: 3, image: garment3, title: "Grey T-Shirt Look" },
  ];

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <header className="space-y-4 pt-2">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/80">
            <MapPin size={14} />
            <span className="truncate max-w-[250px]">Deliver to Delad Village - Surat, Sayan, 394130, Guja...</span>
            <ChevronDown size={14} />
          </div>

          {/* Search and Icons */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold italic text-lg tracking-tighter">M</div>
              <input 
                type="text" 
                placeholder='"Shirts"' 
                className="w-full h-10 bg-secondary/30 border border-border/50 rounded-full pl-10 pr-10 text-sm focus:outline-none"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            </div>
            <div className="flex items-center gap-3.5 text-foreground">
              <Bell size={20} className="stroke-[1.5]" />
              <Heart size={20} className="stroke-[1.5]" />
              <User size={20} className="stroke-[1.5]" />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full h-auto bg-transparent p-0 justify-between border-b border-border/30 rounded-none pb-0">
              <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-2 px-2 font-medium">All</TabsTrigger>
              <TabsTrigger value="men" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-2 px-2 font-medium text-muted-foreground">Men</TabsTrigger>
              <TabsTrigger value="women" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-2 px-2 font-medium text-muted-foreground">Women</TabsTrigger>
              <TabsTrigger value="kids" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-2 px-2 font-medium text-muted-foreground">Kids</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Categories */}
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pt-2 pb-1">
            {[
              { name: "Fashion", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=100&q=80" },
              { name: "Footwear", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&q=80" },
            ].map((cat, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
                <div className={`w-16 h-16 rounded-[18px] overflow-hidden border ${i === 0 ? 'border-primary p-0.5' : 'border-border/50'}`}>
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-secondary">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className={`text-[10px] font-medium ${i === 0 ? 'text-primary' : 'text-foreground'}`}>{cat.name}</span>
              </div>
            ))}
          </div>
        </header>

        <section>
          {/* Banner ad area similar to reference */}
          <div className="bg-[#FFE5B4] border border-[#FFD58F] rounded-xl p-4 mb-6 flex justify-between items-center shadow-sm">
            <h2 className="text-xl font-extrabold text-[#D9381E] uppercase tracking-wider">FLAT ₹300 OFF</h2>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase text-foreground/80 mb-0.5">USE CODE</span>
              <div className="bg-black text-white px-2 py-1 rounded text-xs font-bold tracking-wider">
                DRESSAI300
              </div>
            </div>
          </div>
          
          <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-2">New try-on experience</h2>
              <p className="text-sm text-muted-foreground mb-4 max-w-[200px]">Mix and match items with our AI fitting room.</p>
              <Link href="/try-on">
                <Button className="rounded-full shadow-lg shadow-primary/20 gap-2">
                  <Sparkles size={16} />
                  Start Try-on
                </Button>
              </Link>
            </div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-[url('https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=200&q=80')] bg-cover bg-center rounded-tl-3xl shadow-xl border-l border-t border-white/20" />
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-lg">Recent Looks</h3>
            <Button variant="ghost" size="sm" className="text-xs h-8 text-muted-foreground">View all</Button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-4">
            <Link href="/try-on">
              <div className="w-24 h-32 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground gap-2 shrink-0 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <Plus size={24} />
                <span className="text-xs font-medium">New</span>
              </div>
            </Link>
            
            {recentTryOns.map((item) => (
              <div key={item.id} className="relative w-24 h-32 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-border/50">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-2 right-2 text-[10px] font-medium text-white line-clamp-1">{item.title}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-bold text-lg mb-4">Outfit Recommendations</h3>
          <div className="space-y-3">
            <Card className="border-0 shadow-sm bg-secondary/50 rounded-2xl overflow-hidden">
              <CardContent className="p-3 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white overflow-hidden shrink-0">
                  <img src={garment4} alt="Outfit" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Red Casual</h4>
                  <p className="text-xs text-muted-foreground">Based on your favorites</p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full shrink-0">
                  <ChevronRight size={18} />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm bg-secondary/50 rounded-2xl overflow-hidden">
              <CardContent className="p-3 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white overflow-hidden shrink-0">
                  <img src={garment5} alt="Outfit" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Blue Essential</h4>
                  <p className="text-xs text-muted-foreground">Trending styles</p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full shrink-0">
                  <ChevronRight size={18} />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </MobileLayout>
  );
}