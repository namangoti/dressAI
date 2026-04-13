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

export type GarmentType = "tops" | "bottoms";
export type CatalogCategory = "tshirts" | "shirts" | "jeans" | "trousers" | "dresses" | "tops" | "sneakers" | "formal-shoes" | "sports-shoes" | "casual-shoes" | "sandals" | "loafers";

export interface Product {
  id: number;
  image: string;
  name: string;
  price: string;
  tag: string;
  type: GarmentType;
  category: CatalogCategory;
  description: string;
  tryOnEnabled: boolean;
  fallbackM: string;
  fallbackF: string;
  rating: number;
  reviews: number;
  colors: string[];
  material: string;
}

export const PRODUCTS: Product[] = [
  { id: 1,  image: garment1,  name: "Black T-Shirt",      price: "₹599",   tag: "Bestseller", type: "tops",    category: "tshirts",
    description: "Classic black crew-neck t-shirt made from 100% premium cotton. Comfortable everyday wear with a relaxed fit.",
    tryOnEnabled: true, rating: 4.5, reviews: 2341, colors: ["#000000", "#333333"], material: "100% Cotton",
    fallbackM: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=600&q=80" },
  { id: 2,  image: garment2,  name: "White T-Shirt",      price: "₹499",   tag: "New",        type: "tops",    category: "tshirts",
    description: "Essential white t-shirt with a clean finish. Perfect layering piece or standalone summer staple.",
    tryOnEnabled: true, rating: 4.3, reviews: 1892, colors: ["#FFFFFF", "#F5F5DC"], material: "100% Cotton",
    fallbackM: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1485231183945-fffde7ae021e?w=600&q=80" },
  { id: 3,  image: garment3,  name: "Grey T-Shirt",       price: "₹549",   tag: "",           type: "tops",    category: "tshirts",
    description: "Versatile grey melange t-shirt with a soft hand feel. Goes with everything in your wardrobe.",
    tryOnEnabled: true, rating: 4.2, reviews: 987, colors: ["#808080", "#A9A9A9"], material: "Cotton Blend",
    fallbackM: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80" },
  { id: 4,  image: garment4,  name: "Red T-Shirt",        price: "₹649",   tag: "Hot",        type: "tops",    category: "tshirts",
    description: "Bold red t-shirt that makes a statement. Pre-shrunk fabric with reinforced stitching for durability.",
    tryOnEnabled: true, rating: 4.4, reviews: 1456, colors: ["#DC143C", "#B22222"], material: "100% Cotton",
    fallbackM: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" },
  { id: 5,  image: garment5,  name: "Blue T-Shirt",       price: "₹599",   tag: "",           type: "tops",    category: "tshirts",
    description: "Cool blue t-shirt with a modern fit. Breathable fabric perfect for casual outings.",
    tryOnEnabled: true, rating: 4.1, reviews: 765, colors: ["#4169E1", "#1E90FF"], material: "Cotton Blend",
    fallbackM: "https://images.unsplash.com/photo-1473621038790-b778b4de3b84?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=600&q=80" },
  { id: 6,  image: garment6,  name: "Graphic T-Shirt",    price: "₹799",   tag: "Trending",   type: "tops",    category: "tshirts",
    description: "Eye-catching graphic tee with unique artwork. Stand out from the crowd with this bold design.",
    tryOnEnabled: true, rating: 4.6, reviews: 3210, colors: ["#2F4F4F", "#696969"], material: "100% Cotton",
    fallbackM: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80" },
  { id: 7,  image: garment7,  name: "Classic Blue Jeans",  price: "₹1,299", tag: "Bestseller", type: "bottoms", category: "jeans",
    description: "Timeless blue denim jeans with a straight fit. Mid-rise waist with classic 5-pocket styling.",
    tryOnEnabled: true, rating: 4.7, reviews: 4512, colors: ["#4682B4", "#6495ED"], material: "98% Cotton, 2% Elastane",
    fallbackM: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80" },
  { id: 8,  image: garment8,  name: "Black Slim Jeans",   price: "₹1,199", tag: "New",        type: "bottoms", category: "jeans",
    description: "Sleek black slim-fit jeans for a modern look. Stretch denim for all-day comfort.",
    tryOnEnabled: true, rating: 4.5, reviews: 2890, colors: ["#000000", "#1C1C1C"], material: "95% Cotton, 5% Elastane",
    fallbackM: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&q=80" },
  { id: 9,  image: garment9,  name: "Blue Denim Jeans",   price: "₹1,099", tag: "",           type: "bottoms", category: "jeans",
    description: "Authentic blue denim with a relaxed fit. Washed finish for a lived-in feel from day one.",
    tryOnEnabled: true, rating: 4.3, reviews: 1567, colors: ["#6495ED", "#4169E1"], material: "100% Cotton Denim",
    fallbackM: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80" },
  { id: 10, image: garment10, name: "Khaki Chinos",       price: "₹999",   tag: "Hot",        type: "bottoms", category: "trousers",
    description: "Smart-casual khaki chinos with a tapered leg. Wrinkle-resistant fabric for a polished look.",
    tryOnEnabled: true, rating: 4.4, reviews: 1234, colors: ["#C3B091", "#D2B48C"], material: "98% Cotton, 2% Elastane",
    fallbackM: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    fallbackF: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80" },

  { id: 11, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80", name: "Linen Casual Shirt", price: "₹1,499", tag: "New", type: "tops", category: "shirts",
    description: "Breathable linen shirt perfect for summer. Relaxed collar with a comfortable loose fit.",
    tryOnEnabled: false, rating: 4.3, reviews: 456, colors: ["#F5F5DC", "#FAF0E6"], material: "100% Linen",
    fallbackM: "", fallbackF: "" },
  { id: 12, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80", name: "Formal White Shirt", price: "₹1,299", tag: "Bestseller", type: "tops", category: "shirts",
    description: "Crisp white formal shirt with a slim fit. Perfect for office or special occasions.",
    tryOnEnabled: false, rating: 4.6, reviews: 1890, colors: ["#FFFFFF"], material: "100% Cotton Poplin",
    fallbackM: "", fallbackF: "" },
  { id: 13, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=400&q=80", name: "Checked Flannel Shirt", price: "₹1,199", tag: "", type: "tops", category: "shirts",
    description: "Warm flannel shirt with a classic check pattern. Brushed cotton for a soft, cozy feel.",
    tryOnEnabled: false, rating: 4.2, reviews: 678, colors: ["#8B0000", "#2F4F4F"], material: "100% Brushed Cotton",
    fallbackM: "", fallbackF: "" },
  { id: 14, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80", name: "Denim Shirt", price: "₹1,399", tag: "Trending", type: "tops", category: "shirts",
    description: "Classic denim shirt with snap buttons. Versatile piece that works tucked or untucked.",
    tryOnEnabled: false, rating: 4.4, reviews: 912, colors: ["#4682B4", "#5F9EA0"], material: "100% Cotton Denim",
    fallbackM: "", fallbackF: "" },

  { id: 15, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80", name: "White Sneakers", price: "₹2,499", tag: "Bestseller", type: "tops", category: "sneakers",
    description: "Clean white leather sneakers with cushioned insole. Timeless design goes with any outfit.",
    tryOnEnabled: false, rating: 4.7, reviews: 5670, colors: ["#FFFFFF"], material: "Genuine Leather",
    fallbackM: "", fallbackF: "" },
  { id: 16, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", name: "Running Shoes", price: "₹3,499", tag: "Hot", type: "tops", category: "sports-shoes",
    description: "Lightweight running shoes with responsive cushioning. Breathable mesh upper for maximum comfort.",
    tryOnEnabled: false, rating: 4.5, reviews: 3456, colors: ["#FF4500", "#000000"], material: "Mesh & Synthetic",
    fallbackM: "", fallbackF: "" },
  { id: 17, image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&q=80", name: "Oxford Formal Shoes", price: "₹3,999", tag: "", type: "tops", category: "formal-shoes",
    description: "Elegant leather Oxford shoes with brogue detailing. Handcrafted for a premium finish.",
    tryOnEnabled: false, rating: 4.6, reviews: 1230, colors: ["#8B4513", "#000000"], material: "Genuine Leather",
    fallbackM: "", fallbackF: "" },
  { id: 18, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80", name: "Canvas Casual Shoes", price: "₹1,299", tag: "New", type: "tops", category: "casual-shoes",
    description: "Relaxed canvas shoes for everyday wear. Lightweight and easy to slip on.",
    tryOnEnabled: false, rating: 4.2, reviews: 890, colors: ["#F5F5DC", "#4682B4"], material: "Canvas & Rubber",
    fallbackM: "", fallbackF: "" },
  { id: 19, image: "https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&q=80", name: "Leather Loafers", price: "₹2,799", tag: "Trending", type: "tops", category: "loafers",
    description: "Classic penny loafers in supple leather. Versatile enough for work or weekend.",
    tryOnEnabled: false, rating: 4.4, reviews: 1456, colors: ["#8B4513", "#D2691E"], material: "Genuine Leather",
    fallbackM: "", fallbackF: "" },
  { id: 20, image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=80", name: "Leather Sandals", price: "₹999", tag: "", type: "tops", category: "sandals",
    description: "Comfortable leather sandals with padded footbed. Perfect for beach or casual outings.",
    tryOnEnabled: false, rating: 4.1, reviews: 567, colors: ["#D2B48C", "#8B4513"], material: "Genuine Leather",
    fallbackM: "", fallbackF: "" },

  { id: 21, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d44?w=400&q=80", name: "Floral Summer Dress", price: "₹1,799", tag: "Trending", type: "tops", category: "dresses",
    description: "Light and breezy floral print dress for sunny days. Flattering A-line silhouette.",
    tryOnEnabled: false, rating: 4.5, reviews: 2340, colors: ["#FFB6C1", "#FFA07A"], material: "100% Viscose",
    fallbackM: "", fallbackF: "" },
  { id: 22, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80", name: "Wrap Midi Dress", price: "₹2,299", tag: "Bestseller", type: "tops", category: "dresses",
    description: "Elegant wrap dress with a midi length. Flattering fit with adjustable tie waist.",
    tryOnEnabled: false, rating: 4.6, reviews: 3120, colors: ["#000000", "#8B0000"], material: "Polyester Blend",
    fallbackM: "", fallbackF: "" },

  { id: 23, image: "https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=400&q=80", name: "Crop Top", price: "₹599", tag: "Hot", type: "tops", category: "tops",
    description: "Trendy crop top with a modern cut. Pair with high-waisted jeans or skirts.",
    tryOnEnabled: false, rating: 4.3, reviews: 1890, colors: ["#FF69B4", "#FFD700"], material: "Cotton Blend",
    fallbackM: "", fallbackF: "" },
  { id: 24, image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400&q=80", name: "Peplum Blouse", price: "₹899", tag: "", type: "tops", category: "tops",
    description: "Feminine peplum blouse with a flattering waistline. Elegant enough for work or dinner.",
    tryOnEnabled: false, rating: 4.4, reviews: 987, colors: ["#F5F5DC", "#000080"], material: "Polyester Crepe",
    fallbackM: "", fallbackF: "" },
];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type Size = typeof SIZES[number];

export const CATEGORY_LABELS: Record<string, { label: string; categories: CatalogCategory[] }> = {
  "shirts":         { label: "Shirts",         categories: ["shirts"] },
  "tshirts":        { label: "T-Shirts",       categories: ["tshirts"] },
  "basic-tees":     { label: "Basic T-Shirts", categories: ["tshirts"] },
  "basic-t-shirts": { label: "Basic T-Shirts", categories: ["tshirts"] },
  "graphic-tees":   { label: "Graphic Tees",   categories: ["tshirts"] },
  "polo-shirts":    { label: "Polo Shirts",    categories: ["tshirts"] },
  "colorful-tees":  { label: "Colorful Tees",  categories: ["tshirts"] },
  "casual-shirts":  { label: "Casual Shirts",  categories: ["shirts"] },
  "jeans":          { label: "Jeans",          categories: ["jeans"] },
  "trousers":       { label: "Trousers",       categories: ["trousers"] },
  "shorts":         { label: "Shorts",         categories: ["trousers"] },
  "dresses":        { label: "Dresses",        categories: ["dresses"] },
  "tops":           { label: "Tops & Shirts",  categories: ["tops", "tshirts"] },
  "tops-shirts":    { label: "Tops & Shirts",  categories: ["tops", "shirts", "tshirts"] },
  "co-ords":        { label: "Co-Ords",        categories: ["tops", "dresses"] },
  "skirts":         { label: "Skirts",         categories: ["dresses"] },
  "sneakers":       { label: "Sneakers",       categories: ["sneakers"] },
  "running-shoes":  { label: "Running Shoes",  categories: ["sports-shoes"] },
  "formal-shoes":   { label: "Formal Shoes",   categories: ["formal-shoes"] },
  "formal":         { label: "Formal Shoes",   categories: ["formal-shoes"] },
  "casual-sneakers":{ label: "Casual Sneakers",categories: ["casual-shoes", "sneakers"] },
  "sports-shoes":   { label: "Sports Shoes",   categories: ["sports-shoes"] },
  "sports":         { label: "Sports Shoes",   categories: ["sports-shoes"] },
  "loafers":        { label: "Loafers",        categories: ["loafers"] },
  "sandals":        { label: "Sandals",        categories: ["sandals"] },
  "fashion":        { label: "Fashion",        categories: ["tshirts", "shirts", "jeans", "trousers", "dresses", "tops"] },
  "footwear":       { label: "Footwear",       categories: ["sneakers", "sports-shoes", "formal-shoes", "casual-shoes", "loafers", "sandals"] },
  "casual":         { label: "Casual Wear",    categories: ["tshirts", "shirts", "jeans", "trousers"] },
  "ethnic":         { label: "Ethnic Wear",    categories: ["dresses", "tops"] },
  "essentials":     { label: "Essentials",     categories: ["tshirts", "jeans"] },
  "western":        { label: "Western Wear",   categories: ["tshirts", "shirts", "jeans", "trousers", "dresses"] },
  "fusion":         { label: "Fusion Wear",    categories: ["tops", "dresses"] },
};

export function getProductsByCategory(slug: string): Product[] {
  const mapping = CATEGORY_LABELS[slug];
  if (!mapping) return PRODUCTS;
  return PRODUCTS.filter(p => mapping.categories.includes(p.category));
}

export function getCategoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug]?.label || slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}
