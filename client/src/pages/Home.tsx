import MobileLayout from "@/components/layout/MobileLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Bell, Heart, User, MapPin, ChevronDown, X, Navigation } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";

import garment1 from "@/assets/images/tshirt-black.png";
import garment2 from "@/assets/images/tshirt-white.png";
import garment3 from "@/assets/images/tshirt-grey.png";
import garment4 from "@/assets/images/tshirt-red.png";
import garment5 from "@/assets/images/tshirt-blue.png";
import mensShirt from "@/assets/images/mens-shirt.png";
import mensJeans from "@/assets/images/mens-jeans.png";
import womensDress from "@/assets/images/womens-dress.png";
import womensTop from "@/assets/images/womens-top.png";
import kidsTshirt from "@/assets/images/kids-tshirt.png";
import kidsDress from "@/assets/images/kids-dress.png";

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
      { name: "Shirts", img: mensShirt },
      { name: "Jeans", img: mensJeans },
      { name: "Dresses", img: womensDress },
      { name: "Tops", img: womensTop },
      { name: "Kids T-Shirts", img: kidsTshirt },
      { name: "Kids Dresses", img: kidsDress },
      { name: "Basic T-Shirts", img: garment2 },
      { name: "Colorful Tees", img: garment4 },
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
      { name: "Casual Shirts", img: mensShirt },
      { name: "Basic Tees", img: garment1 },
      { name: "Jeans", img: mensJeans },
      { name: "Graphic Tees", img: garment3 },
      { name: "Polo Shirts", img: garment5 },
      { name: "Shorts", img: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=200&q=80" },
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
      { name: "Dresses", img: womensDress },
      { name: "Tops & Shirts", img: womensTop },
      { name: "Basic Tees", img: garment2 },
      { name: "Co-Ords", img: "https://images.unsplash.com/photo-1598522325055-611a3e63a8a3?w=200&q=80" },
      { name: "Jeans", img: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=200&q=80" },
      { name: "Skirts", img: "https://images.unsplash.com/photo-1583496661160-c588c4af5d85?w=200&q=80" },
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
      { name: "Party Wear", img: kidsDress },
      { name: "T-Shirts", img: kidsTshirt },
      { name: "Winter Wear", img: "https://images.unsplash.com/photo-1544778107-1e5f03da0ce5?w=200&q=80" },
      { name: "Clothing Sets", img: "https://images.unsplash.com/photo-1519238382025-06b2db3c467a?w=200&q=80" },
      { name: "Jeans", img: "https://images.unsplash.com/photo-1604134914101-72c6861cb7e5?w=200&q=80" },
      { name: "Shorts", img: "https://images.unsplash.com/photo-1596230303867-b5cc55c0e1db?w=200&q=80" },
    ]
  }
};

// Custom hook to handle map centering
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function Home() {
  const [showLocationModal, setShowLocationLocationModal] = useState(false);
  const [locationStr, setLocationStr] = useState("Deliver to Delad Village - Surat, Sayan, 394130, Guja...");
  const [searchInput, setSearchInput] = useState("");
  const [step, setStep] = useState<"search" | "map" | "details">("search");
  const [mapCenter, setMapCenter] = useState<[number, number]>([21.1702, 72.8311]); // Default to Surat
  const [isSearching, setIsSearching] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    houseNo: "",
    street: "",
    landmark: "",
  });

  // Basic geocoding using Nominatim (OpenStreetMap)
  const searchLocation = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setStep("map");
      } else {
        alert("Location not found. Please try a different search or use pincode.");
      }
    } catch (error) {
      alert("Error searching location. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchLocation(searchInput);
    }
  };

  const handleMapConfirm = () => {
    setStep("details");
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = [addressDetails.houseNo, addressDetails.street, searchInput].filter(Boolean).join(", ");
    setLocationStr(`Deliver to ${fullAddress}`);
    setShowLocationLocationModal(false);
    setSearchInput("");
    setAddressDetails({ houseNo: "", street: "", landmark: "" });
    setStep("search");
  };

  const resetModal = () => {
    setShowLocationLocationModal(false);
    setStep("search");
    setSearchInput("");
    setAddressDetails({ houseNo: "", street: "", landmark: "" });
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6 relative">
        {/* Location Modal */}
        {showLocationModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4 sm:p-0">
            <div className={`bg-background w-full max-w-sm rounded-t-2xl sm:rounded-2xl space-y-0 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-200 overflow-hidden flex flex-col ${step === 'map' ? 'h-[85vh]' : 'max-h-[85vh]'}`}>
              
              {step === "map" ? (
                <>
                  <div className="absolute top-4 left-4 z-20">
                    <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full shadow-md bg-background" onClick={() => setStep("search")}>
                      <ChevronDown className="rotate-90" size={20} />
                    </Button>
                  </div>
                  
                  {/* Full-bleed Interactive Map Mockup */}
                  <div className="relative flex-1 bg-secondary/20 min-h-[300px]">
                    <MapContainer 
                      center={mapCenter} 
                      zoom={15} 
                      zoomControl={false}
                      className="w-full h-full z-0"
                    >
                      <ChangeView center={mapCenter} />
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker 
                        position={mapCenter}
                        icon={L.divIcon({
                          className: 'custom-marker',
                          html: `<div style="display:flex;flex-direction:column;align-items:center;">
                                   <div style="background:black;color:white;font-size:10px;font-weight:bold;padding:4px 8px;border-radius:999px;margin-bottom:4px;white-space:nowrap;box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1);">
                                     Order will be delivered here
                                     <div style="position:absolute;bottom:-4px;left:50%;transform:translateX(-50%) rotate(45deg);width:8px;height:8px;background:black;"></div>
                                   </div>
                                   <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="var(--color-primary)" stroke="var(--color-primary)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
                                 </div>`,
                          iconSize: [40, 60],
                          iconAnchor: [20, 60],
                        })}
                      />
                    </MapContainer>
                    
                    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] z-10"></div>

                    {/* Recenter Target Button */}
                    <div className="absolute bottom-6 right-4 z-20">
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="h-12 w-12 rounded-full shadow-lg bg-background text-primary" 
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                setMapCenter([position.coords.latitude, position.coords.longitude]);
                                setSearchInput(`Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`);
                              }
                            );
                          }
                        }}
                      >
                        <Navigation size={20} />
                      </Button>
                    </div>
                  </div>

                  {/* Bottom Sheet for Map */}
                  <div className="bg-background p-5 rounded-t-3xl -mt-4 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] relative">
                    <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-5"></div>
                    <div className="flex items-start gap-3 mb-5">
                      <MapPin className="text-primary mt-1 shrink-0" size={20} />
                      <div>
                        <h4 className="font-bold text-base mb-0.5">Select delivery location</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{searchInput || "Select a precise location on the map"}</p>
                      </div>
                    </div>
                    <Button className="w-full h-14 rounded-xl font-bold text-base shadow-md shadow-primary/20" onClick={handleMapConfirm}>
                      Confirm Location
                    </Button>
                  </div>
                </>
              ) : (
                <div className="p-5 flex-1 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4 sticky top-0 bg-background z-10 pb-2 border-b border-border/50">
                    <h3 className="font-bold text-lg">
                      {step === "search" ? "Choose your location" : "Enter complete address"}
                    </h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={resetModal}>
                      <X size={18} />
                    </Button>
                  </div>
                  
                  {step === "search" ? (
                    <div className="space-y-4">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-3 h-12 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary rounded-xl"
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                setMapCenter([position.coords.latitude, position.coords.longitude]);
                                setSearchInput(`Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`);
                                setStep("map");
                              },
                              (error) => {
                                alert("Location access denied. Please type your pincode below.");
                              }
                            );
                          } else {
                            alert("Geolocation is not supported by this browser.");
                          }
                        }}
                      >
                        <Navigation size={18} />
                        <span className="font-medium">Use my current location</span>
                      </Button>

                      <div className="relative py-2 flex items-center">
                        <div className="flex-grow border-t border-border/50"></div>
                        <span className="flex-shrink-0 mx-4 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">OR</span>
                        <div className="flex-grow border-t border-border/50"></div>
                      </div>

                      <form onSubmit={handleLocationSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-foreground/90">Search area, street, or pincode</label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input 
                              type="text" 
                              value={searchInput}
                              onChange={(e) => setSearchInput(e.target.value)}
                              placeholder="e.g., 394130 or Surat" 
                              className="w-full h-12 bg-secondary/30 border border-border rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                              autoFocus
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={!searchInput.trim()}>
                          Search Location
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <form onSubmit={handleFinalSubmit} className="space-y-5">
                      <div className="bg-secondary/30 p-3 rounded-xl flex items-start gap-3 border border-border/50">
                         <MapPin className="text-primary mt-0.5 shrink-0" size={16} />
                         <div>
                           <h5 className="text-xs font-semibold text-foreground">Selected Location</h5>
                           <p className="text-[11px] text-muted-foreground line-clamp-1">{searchInput}</p>
                         </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">House No., Building Name *</label>
                          <input 
                            type="text" 
                            required
                            value={addressDetails.houseNo}
                            onChange={(e) => setAddressDetails(prev => ({...prev, houseNo: e.target.value}))}
                            placeholder="e.g. Flat 4B, Shanti Niwas" 
                            className="w-full h-12 bg-secondary/20 border border-border rounded-xl px-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                            autoFocus
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">Road Name, Area, Colony *</label>
                          <input 
                            type="text" 
                            required
                            value={addressDetails.street}
                            onChange={(e) => setAddressDetails(prev => ({...prev, street: e.target.value}))}
                            placeholder="e.g. MG Road, Near Station" 
                            className="w-full h-12 bg-secondary/20 border border-border rounded-xl px-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">Landmark (Optional)</label>
                          <input 
                            type="text" 
                            value={addressDetails.landmark}
                            onChange={(e) => setAddressDetails(prev => ({...prev, landmark: e.target.value}))}
                            placeholder="e.g. Opposite City Mall" 
                            className="w-full h-12 bg-secondary/20 border border-border rounded-xl px-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                          />
                        </div>
                      </div>
                      <div className="pt-2 flex gap-3">
                        <Button type="submit" className="w-full h-14 rounded-xl font-bold text-base shadow-md shadow-primary/20" disabled={!addressDetails.houseNo || !addressDetails.street}>
                          Save Address
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <header className="space-y-4 pt-2">
          {/* Location */}
          <div 
            className="flex items-center gap-1.5 text-xs font-medium text-foreground/80 cursor-pointer hover:bg-secondary/50 p-1.5 rounded-lg w-max transition-colors" 
            onClick={() => setShowLocationLocationModal(true)}
          >
            <MapPin size={14} className="shrink-0" />
            <span className="truncate max-w-[250px]">{locationStr}</span>
            <ChevronDown size={14} className="shrink-0" />
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