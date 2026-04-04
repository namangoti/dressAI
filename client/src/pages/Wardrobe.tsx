import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter } from "lucide-react";

import garment1 from "@/assets/images/tshirt-black.png";
import garment2 from "@/assets/images/tshirt-white.png";
import garment3 from "@/assets/images/tshirt-grey.png";
import garment4 from "@/assets/images/tshirt-red.png";
import garment5 from "@/assets/images/tshirt-blue.png";
import garment6 from "@/assets/images/tshirt-graphic.png";
import garment7 from "@/assets/images/mens-jeans.png";
import garment8 from "@/assets/images/jeans-black-slim.png";
import garment9 from "@/assets/images/jeans-blue-denim.png";
import garment10 from "@/assets/images/trousers-khaki-chino.png";

export default function Wardrobe() {
  const items = [
    { id: 1,  type: "top",    image: garment1,  name: "Black T-Shirt" },
    { id: 2,  type: "top",    image: garment2,  name: "White T-Shirt" },
    { id: 3,  type: "top",    image: garment3,  name: "Grey T-Shirt" },
    { id: 4,  type: "top",    image: garment4,  name: "Red T-Shirt" },
    { id: 5,  type: "top",    image: garment5,  name: "Blue T-Shirt" },
    { id: 6,  type: "top",    image: garment6,  name: "Graphic T-Shirt" },
    { id: 7,  type: "bottom", image: garment7,  name: "Classic Blue Jeans" },
    { id: 8,  type: "bottom", image: garment8,  name: "Black Slim Jeans" },
    { id: 9,  type: "bottom", image: garment9,  name: "Blue Denim Jeans" },
    { id: 10, type: "bottom", image: garment10, name: "Khaki Chinos" },
  ];

  const ItemCard = ({ item }: { item: typeof items[0] }) => (
    <div key={item.id} data-testid={`card-wardrobe-${item.id}`}
      className="relative rounded-3xl overflow-hidden aspect-square border border-border/50 shadow-sm group">
      <img src={item.image} alt={item.name}
        className="w-full h-full object-cover transition-transform group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
        <span className="text-white font-medium text-sm">{item.name}</span>
      </div>
    </div>
  );

  return (
    <MobileLayout title="My Wardrobe">
      <div className="p-6 pt-2 space-y-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search items..."
              data-testid="input-wardrobe-search"
              className="w-full h-12 bg-secondary/50 border-0 rounded-2xl pl-10 pr-4 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-border/50 bg-secondary/50">
            <Filter size={18} />
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full h-12 bg-secondary/30 rounded-2xl p-1 mb-6">
            <TabsTrigger value="all"     className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
            <TabsTrigger value="tops"    className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">Tops</TabsTrigger>
            <TabsTrigger value="bottoms" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">Bottoms</TabsTrigger>
            <TabsTrigger value="dresses" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">Dresses</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-2 gap-4 pb-4">
              {items.map(item => <ItemCard key={item.id} item={item} />)}
            </div>
          </TabsContent>

          <TabsContent value="tops" className="mt-0">
            <div className="grid grid-cols-2 gap-4 pb-4">
              {items.filter(i => i.type === "top").map(item => <ItemCard key={item.id} item={item} />)}
            </div>
          </TabsContent>

          <TabsContent value="bottoms" className="mt-0">
            <div className="grid grid-cols-2 gap-4 pb-4">
              {items.filter(i => i.type === "bottom").map(item => <ItemCard key={item.id} item={item} />)}
            </div>
          </TabsContent>

          <TabsContent value="dresses" className="mt-0">
            <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
              <p className="text-muted-foreground text-sm">No dresses in your wardrobe yet.</p>
              <Button variant="outline" size="sm" className="rounded-full gap-1.5 mt-2">
                <Plus size={14} /> Add dress
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}
