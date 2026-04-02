import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, ImagePlus, User, Briefcase } from "lucide-react";

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function MobileLayout({ children, title }: MobileLayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Briefcase, label: "Briefcase", href: "/wardrobe" },
    { icon: ImagePlus, label: "Try On", href: "/try-on" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-background max-w-md mx-auto relative overflow-hidden shadow-2xl">
      {title && (
        <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
          <h1 className="text-xl font-bold">{title}</h1>
        </header>
      )}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      <nav className="absolute bottom-0 w-full bg-background/90 backdrop-blur-xl border-t border-border/50 px-6 py-1.5 flex justify-between items-center z-20 font-light">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-0.5 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`p-1 rounded-full transition-colors ${isActive ? "bg-primary/10" : "hover:bg-muted"}`}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}