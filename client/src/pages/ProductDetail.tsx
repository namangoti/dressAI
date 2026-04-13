import MobileLayout from "@/components/layout/MobileLayout";
import { useLocation, useParams, Link } from "wouter";
import { ArrowLeft, Star, ShoppingCart, Wand2, Heart, Share2, Truck, RotateCcw, Shield } from "lucide-react";
import { PRODUCTS, SIZES, type Size } from "@/lib/garments";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cartContext";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const productId = parseInt(params.id || "0");
  const product = PRODUCTS.find(p => p.id === productId);
  const [selectedSize, setSelectedSize] = useState<Size>("M");
  const [liked, setLiked] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  if (!product) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <p className="text-lg font-bold mb-2">Product not found</p>
          <Link href="/">
            <Button data-testid="button-back-home">Back to Home</Button>
          </Link>
        </div>
      </MobileLayout>
    );
  }

  const handleAddToCart = () => {
    addItem({
      garmentId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.image,
      type: product.type,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedSize}) added to your cart`,
    });
  };

  const handleTryOn = () => {
    const garmentType = product.type === "bottoms" ? "bottoms" : "tops";
    setLocation(`/try-on?garment=${product.id}&filter=${garmentType}`);
  };

  return (
    <MobileLayout>
      <div className="pb-4">
        <div className="relative">
          <div className="aspect-[3/4] bg-muted/30 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              data-testid="img-product-detail"
            />
          </div>
          <button
            onClick={() => {
              if (window.history.length > 1) window.history.back();
              else setLocation("/");
            }}
            className="absolute top-3 left-3 bg-background/80 backdrop-blur rounded-full p-2 shadow-md"
            data-testid="button-back-product"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className="bg-background/80 backdrop-blur rounded-full p-2 shadow-md"
              data-testid="button-like-product"
            >
              <Heart size={18} className={liked ? "fill-red-500 text-red-500" : ""} />
            </button>
            <button
              className="bg-background/80 backdrop-blur rounded-full p-2 shadow-md"
              data-testid="button-share-product"
            >
              <Share2 size={18} />
            </button>
          </div>
          {product.tag && (
            <span className="absolute bottom-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
              {product.tag}
            </span>
          )}
        </div>

        <div className="px-4 pt-4 space-y-4">
          <div>
            <h1 className="text-xl font-bold" data-testid="text-product-detail-name">{product.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">({product.reviews.toLocaleString()} reviews)</span>
            </div>
            <p className="text-2xl font-bold text-primary mt-2" data-testid="text-product-detail-price">{product.price}</p>
            <p className="text-xs text-green-600 font-medium mt-0.5">Inclusive of all taxes</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Select Size</h3>
            <div className="flex gap-2 flex-wrap">
              {SIZES.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`min-w-[44px] h-10 rounded-xl border-2 text-sm font-semibold transition-colors ${
                    selectedSize === s
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-foreground hover:border-primary/50"
                  }`}
                  data-testid={`button-size-${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {product.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Colors</h3>
              <div className="flex gap-2">
                {product.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-border"
                    style={{ backgroundColor: color }}
                    data-testid={`color-swatch-${i}`}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold mb-1.5">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-product-description">
              {product.description}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Material: {product.material}</p>
          </div>

          <div className="flex gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Truck size={14} /> <span>Free Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RotateCcw size={14} /> <span>Easy Returns</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield size={14} /> <span>Genuine</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-16 bg-background border-t border-border/50 px-4 py-3 flex gap-3">
        {product.tryOnEnabled && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleTryOn}
            data-testid="button-try-on"
          >
            <Wand2 size={16} className="mr-2" />
            Try On
          </Button>
        )}
        <Button
          className="flex-1"
          onClick={handleAddToCart}
          data-testid="button-add-to-cart-detail"
        >
          <ShoppingCart size={16} className="mr-2" />
          Add to Cart
        </Button>
      </div>
    </MobileLayout>
  );
}
