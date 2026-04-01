import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Sparkles, ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const recentTryOns = [
    { id: 1, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80", title: "Summer Casual" },
    { id: 2, image: "https://images.unsplash.com/photo-1550639525-c97d455acf70?w=400&q=80", title: "Evening Wear" },
    { id: 3, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80", title: "Work Look" },
  ];

  return (
    <MobileLayout>
      <div className="p-6 space-y-8">
        <header className="flex justify-between items-center pt-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">FitCheck</h1>
            <p className="text-muted-foreground">Welcome back, Alex</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </header>

        <section>
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
                  <img src="https://images.unsplash.com/photo-1550639525-c97d455acf70?w=150&q=80" alt="Outfit" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Sunny Weekend</h4>
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
                  <img src="https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=150&q=80" alt="Outfit" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Office Casual</h4>
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