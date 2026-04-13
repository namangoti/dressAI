import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, ImagePlus, User, Briefcase, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cartContext";

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function MobileLayout({ children, title }: MobileLayoutProps) {
  const [location] = useLocation();
  const { totalItems } = useCart();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Briefcase, label: "Briefcase", href: "/wardrobe" },
    { icon: ImagePlus, label: "Try On", href: "/try-on" },
    { icon: ShoppingCart, label: "Cart", href: "/cart", badge: totalItems },
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
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-0.5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
              data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className={`relative p-1 rounded-full transition-colors ${isActive ? "bg-primary/10" : "hover:bg-muted"}`}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {"badge" in item && item.badge > 0 && (
                    <span
                      className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[8px] font-bold min-w-[14px] h-[14px] rounded-full flex items-center justify-center px-0.5"
                      data-testid="badge-cart-count"
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}