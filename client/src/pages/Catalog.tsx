import MobileLayout from "@/components/layout/MobileLayout";
import { useLocation, Link } from "wouter";
import { ArrowLeft, Star, SlidersHorizontal } from "lucide-react";
import { getProductsByCategory, getCategoryLabel, type Product } from "@/lib/garments";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

function useQueryParams() {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

export default function Catalog() {
  const [, setLocation] = useLocation();
  const params = useQueryParams();
  const categorySlug = params.get("category") || "tshirts";
  const label = getCategoryLabel(categorySlug);
  const products = useMemo(() => getProductsByCategory(categorySlug), [categorySlug]);
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high" | "newest">("popular");

  const sorted = useMemo(() => {
    const copy = [...products];
    switch (sortBy) {
      case "price-low":
        return copy.sort((a, b) => parseInt(a.price.replace(/[^\d]/g, "")) - parseInt(b.price.replace(/[^\d]/g, "")));
      case "price-high":
        return copy.sort((a, b) => parseInt(b.price.replace(/[^\d]/g, "")) - parseInt(a.price.replace(/[^\d]/g, "")));
      case "newest":
        return copy.sort((a, b) => (b.tag === "New" ? 1 : 0) - (a.tag === "New" ? 1 : 0));
      default:
        return copy.sort((a, b) => b.reviews - a.reviews);
    }
  }, [products, sortBy]);

  return (
    <MobileLayout>
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => setLocation("/")} className="p-1" data-testid="button-back-catalog">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold flex-1" data-testid="text-catalog-title">{label}</h1>
          <span className="text-xs text-muted-foreground">{sorted.length} items</span>
        </div>

        <div className="flex items-center gap-2 mb-4 overflow-x-auto hide-scrollbar">
          {(["popular", "price-low", "price-high", "newest"] as const).map(s => (
            <Button
              key={s}
              variant={sortBy === s ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy(s)}
              data-testid={`button-sort-${s}`}
            >
              {s === "popular" ? "Popular" : s === "price-low" ? "Price: Low" : s === "price-high" ? "Price: High" : "Newest"}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {sorted.map(product => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group"
              data-testid={`card-product-${product.id}`}
            >
              <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                <div className="relative aspect-[3/4] bg-muted/30 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    data-testid={`img-product-${product.id}`}
                  />
                  {product.tag && (
                    <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-full">
                      {product.tag}
                    </span>
                  )}
                  {product.tryOnEnabled && (
                    <span className="absolute top-2 right-2 bg-green-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                      Try On
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  <h3 className="text-xs font-semibold truncate" data-testid={`text-product-name-${product.id}`}>
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] text-muted-foreground">{product.rating} ({product.reviews.toLocaleString()})</span>
                  </div>
                  <p className="text-sm font-bold text-primary mt-1" data-testid={`text-product-price-${product.id}`}>
                    {product.price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-12">
            <SlidersHorizontal size={32} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No products found in this category</p>
            <Link href="/">
              <Button className="mt-4" data-testid="button-back-home">Back to Home</Button>
            </Link>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
