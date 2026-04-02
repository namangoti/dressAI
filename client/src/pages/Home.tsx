import MobileLayout from "@/components/layout/MobileLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Bell, Heart, User, MapPin, ChevronDown, CreditCard } from "lucide-react";
import { Link } from "wouter";

// Mock data for categories and grids
const tabsData = {
  all: {
    categories: [
      { name: "Fashion", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150&q=80" },
      { name: "Footwear", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=150&q=80" },
    ],
    bannerText: "FLAT ₹300 OFF",
    code: "DRESSAI300",
    bannerImg: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&q=80",
    grid: [
      { name: "Shirts", img: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=200&q=80" },
      { name: "Casual Shoes", img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=200&q=80" },
      { name: "Jeans", img: "https://images.unsplash.com/photo-1542272604-78021008064a?w=200&q=80" },
      { name: "Sports Shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80" },
      { name: "T-Shirts", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80" },
      { name: "Kurta Sets", img: "https://images.unsplash.com/photo-1583391733958-d25e07fac0fa?w=200&q=80" },
    ]
  },
  men: {
    categories: [
      { name: "Casual", img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=150&q=80" },
      { name: "Ethnic", img: "https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=150&q=80" },
      { name: "Footwear", img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=150&q=80" },
      { name: "Sports", img: "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=150&q=80" },
      { name: "Essentials", img: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=150&q=80" },
    ],
    bannerText: "UNDER ₹499",
    code: "MEN499",
    bannerImg: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80",
    grid: [
      { name: "Watches", img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&q=80" },
      { name: "T-Shirts", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80" },
      { name: "Jeans", img: "https://images.unsplash.com/photo-1542272604-78021008064a?w=200&q=80" },
      { name: "Formal Shirts", img: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=200&q=80" },
      { name: "Shorts", img: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=200&q=80" },
      { name: "Shirts", img: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=200&q=80" },
    ]
  },
  women: {
    categories: [
      { name: "Western", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&q=80" },
      { name: "Ethnic", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150&q=80" },
      { name: "Fusion", img: "https://images.unsplash.com/photo-1485230895905-efdbac1ebdfb?w=150&q=80" },
      { name: "Footwear", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=150&q=80" },
    ],
    bannerText: "UNDER ₹499",
    code: "WOMEN499",
    bannerImg: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    grid: [
      { name: "Lingerie", img: "https://images.unsplash.com/photo-1620600100742-1e9d1502dc80?w=200&q=80" },
      { name: "Kurta Sets", img: "https://images.unsplash.com/photo-1583391733958-d25e07fac0fa?w=200&q=80" },
      { name: "Tops & Shirts", img: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=200&q=80" },
      { name: "Co-Ords", img: "https://images.unsplash.com/photo-1598522325055-611a3e63a8a3?w=200&q=80" },
      { name: "Dresses", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80" },
      { name: "T-Shirts", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=200&q=80" },
    ]
  },
  kids: {
    categories: [
      { name: "Girls", img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=150&q=80" },
      { name: "Boys", img: "https://images.unsplash.com/photo-1519238382025-06b2db3c467a?w=150&q=80" },
      { name: "Infants", img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=150&q=80" },
      { name: "Teens", img: "https://images.unsplash.com/photo-1544778107-1e5f03da0ce5?w=150&q=80" },
      { name: "Add-ons", img: "https://images.unsplash.com/photo-1560159828-5696e1a49f53?w=150&q=80" },
    ],
    bannerText: "40-80% OFF",
    code: "KIDS80",
    bannerImg: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=600&q=80",
    grid: [
      { name: "Party Wear", img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=200&q=80" },
      { name: "Dresses", img: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=200&q=80" },
      { name: "Winter Wear", img: "https://images.unsplash.com/photo-1544778107-1e5f03da0ce5?w=200&q=80" },
      { name: "Clothing Sets", img: "https://images.unsplash.com/photo-1519238382025-06b2db3c467a?w=200&q=80" },
      { name: "Kurta Sets", img: "https://images.unsplash.com/photo-1560159828-5696e1a49f53?w=200&q=80" },
      { name: "T-Shirts", img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=200&q=80" },
    ]
  }
};

export default function Home() {
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

          {/* Tabs setup wrapping the whole content */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full h-auto bg-transparent p-0 justify-between border-b border-border/30 rounded-none pb-0 mb-4">
              <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-2 px-2 font-medium text-muted-foreground">All</TabsTrigger>
              <TabsTrigger value="men" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-2 px-2 font-medium text-muted-foreground">Men</TabsTrigger>
              <TabsTrigger value="women" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-2 px-2 font-medium text-muted-foreground">Women</TabsTrigger>
              <TabsTrigger value="kids" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-2 px-2 font-medium text-muted-foreground">Kids</TabsTrigger>
            </TabsList>

            {Object.entries(tabsData).map(([tabKey, data]) => (
              <TabsContent key={tabKey} value={tabKey} className="space-y-6 mt-0">
                
                {/* Categories Row */}
                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1">
                  {data.categories.map((cat, i) => (
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

                <section>
                  {/* Promo Banner */}
                  <div className="bg-[#FFE5B4] border border-[#FFD58F] rounded-xl p-4 mb-4 flex justify-between items-center shadow-sm">
                    <h2 className="text-xl font-extrabold text-[#D9381E] uppercase tracking-wider">{data.bannerText}</h2>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold uppercase text-foreground/80 mb-0.5">USE CODE</span>
                      <div className="bg-black text-white px-2 py-1 rounded text-xs font-bold tracking-wider">
                        {data.code}
                      </div>
                    </div>
                  </div>

                  {/* Try-on Hero (simulating the big image area from reference) */}
                  <Link href="/try-on">
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-yellow-400 cursor-pointer shadow-md mb-4">
                      <img src={data.bannerImg} alt="Banner" className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 pb-6 text-center text-white">
                        <div className="flex justify-center gap-2 mb-2">
                          <div className="bg-white text-black px-2 py-1 rounded font-bold text-[10px] flex items-center">
                            DressAI <span className="ml-1 opacity-50">& More</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-medium tracking-wide">Perfect Fit Try-On</h3>
                        <p className="text-2xl font-extrabold">{data.bannerText}</p>
                      </div>
                    </div>
                  </Link>

                  {/* Bank Offer Strip */}
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-orange-100 rounded-lg p-3 flex items-center gap-3 mb-6">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white font-bold border border-white">VISA</div>
                      <div className="w-8 h-6 bg-orange-500 rounded flex items-center justify-center text-[8px] text-white font-bold border border-white">MC</div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">10% Savings*</h4>
                      <p className="text-[10px] text-muted-foreground">With Selected Credit Cards</p>
                    </div>
                  </div>

                  {/* Product Categories Grid */}
                  <div className="grid grid-cols-4 gap-x-3 gap-y-6">
                    {data.grid.map((item, i) => (
                      <Link key={i} href="/try-on" className="flex flex-col items-center gap-1.5 cursor-pointer group">
                        <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-b from-blue-50/50 to-pink-50/50 border border-border/40 p-1 transition-transform group-hover:scale-95">
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover rounded-xl mix-blend-multiply" />
                        </div>
                        <span className="text-[10px] font-medium text-center leading-tight truncate w-full px-1">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              </TabsContent>
            ))}
          </Tabs>
        </header>
      </div>
    </MobileLayout>
  );
}