import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Settings, CreditCard, Bell, ChevronRight, LogOut, Crown } from "lucide-react";

export default function Profile() {
  return (
    <MobileLayout title="Profile">
      <div className="p-6 pt-2 space-y-8">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-xl">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-background">
              <Crown size={14} />
            </div>
          </div>
          <h2 className="text-xl font-bold">Alex Johnson</h2>
          <p className="text-muted-foreground">alex@example.com</p>
        </div>

        <div className="bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown size={16} className="text-yellow-300" />
                <span className="font-bold text-yellow-300">Premium Member</span>
              </div>
              <p className="text-sm text-white/80">Unlimited try-ons & HD saves</p>
            </div>
            <Button variant="secondary" size="sm" className="rounded-full bg-white/20 hover:bg-white/30 text-white border-0">
              Manage
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg px-2">Settings</h3>
          <div className="bg-secondary/30 rounded-3xl overflow-hidden border border-border/50">
            <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-foreground shadow-sm">
                  <Settings size={18} />
                </div>
                <span className="font-medium">Account Preferences</span>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </button>
            <div className="h-[1px] bg-border/50 ml-16" />
            <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-foreground shadow-sm">
                  <Bell size={18} />
                </div>
                <span className="font-medium">Notifications</span>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </button>
            <div className="h-[1px] bg-border/50 ml-16" />
            <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-foreground shadow-sm">
                  <CreditCard size={18} />
                </div>
                <span className="font-medium">Payment Methods</span>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <Button variant="ghost" className="w-full rounded-full h-14 text-destructive hover:text-destructive hover:bg-destructive/10 gap-2">
          <LogOut size={18} />
          Log Out
        </Button>
      </div>
    </MobileLayout>
  );
}