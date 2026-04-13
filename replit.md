# DressAI — Virtual Outfit Try-On App

## Overview
A mobile-first virtual try-on eCommerce app (Myntra-style) where users upload a photo, configure a body profile, and see outfit previews composited onto themselves in real-time.

## Architecture
- **Frontend**: React + TypeScript + Tailwind CSS (Vite)
- **Backend**: Express.js + TypeScript (serves API + static files)
- **Database**: PostgreSQL via Drizzle ORM (schema in `shared/schema.ts`)
- **Port**: 5000 (full-stack, single server)

## Key Features
- **Instant canvas try-on**: garment PNGs preloaded/cached, composited onto uploaded photo client-side
- **Pose-based body alignment**: TensorFlow.js MoveNet detects 17 body keypoints; clothing is dynamically positioned and scaled to match detected shoulders, torso, hips, and ankles — not fixed coordinates
- **AI photorealistic generation**: optional `Generate AI Image` button calls Replicate API (`cuuupid/idm-vton`) for a realistic result (requires Replicate billing credits); `denoise_steps=15` for faster generation
- **HEIC/unsupported format detection**: clear error messages for iPhone HEIC files
- **Garment catalogue**: 14 try-on-enabled items (6 tops, 4 bottoms, 4 shoes) + 10 display-only products across shirts, shoes, dresses, etc.
- **Virtual shoe try-on**: Canvas-based shoe placement using ankle keypoints; width-first fit, no tilt/taper; AI generation disabled for shoes (IDM-VTON doesn't support footwear)
- **Multi-garment layering**: Outfit state tracks tops + bottoms + shoes simultaneously; composite layers in order (tops → bottoms → shoes); green dot indicators on inactive tabs with selected items

## Product Browsing Flow
- **Home → Category**: grid items and category circles link to `/catalog?category=<slug>` (e.g., `/catalog?category=jeans`)
- **Catalog page**: `/catalog?category=<slug>` — filtered product grid with sort options (Popular, Price Low/High, Newest)
- **Product detail**: `/product/:id` — full product info, size picker, Add to Cart, "Try On" button (if try-on-enabled)
- **Try On preselection**: Product Detail "Try On" navigates to `/try-on?garment=<id>&filter=<tops|bottoms>` which auto-selects the garment

## Shopping Cart
- **Client-side cart**: React context (`client/src/lib/cartContext.tsx`) with localStorage persistence
- **Cart page**: `/cart` route — shows items, quantity controls, remove, place order flow
- **Add to Cart**: button on TryOn page and ProductDetail page adds current garment (with selected size) to cart; shows toast confirmation
- **Cart badge**: bottom nav shows item count badge on the Cart icon
- **Order flow**: Place Order clears cart and shows confirmation screen

## File Structure
```
client/src/
  pages/TryOn.tsx          — main virtual try-on component
  pages/Home.tsx           — landing page with tab navigation
  pages/Catalog.tsx        — category product listing page
  pages/ProductDetail.tsx  — individual product detail page
  pages/Cart.tsx           — shopping cart page
  lib/garments.ts          — shared product catalog (24 items, category mappings)
  lib/poseDetector.ts      — TF.js MoveNet pose detection utility
  lib/cartContext.tsx       — cart React context + localStorage persistence
  assets/images/           — garment PNG assets
  components/layout/MobileLayout.tsx — bottom nav with cart badge

server/
  index.ts               — Express server setup (20MB body limit)
  routes.ts              — /api/tryon Replicate proxy endpoint (denoise_steps=15)
  storage.ts             — Drizzle storage interface

shared/
  schema.ts              — Drizzle schema + Zod types
```

## Pose Detection Flow
1. User uploads photo → `readFile()` validates format (rejects HEIC)
2. `detectPoseRegions(img)` runs MoveNet SINGLEPOSE_LIGHTNING (lazy-loaded)
3. Returns pixel-space `tops`, `bottoms`, and `shoes` `BodyRegion` objects (shoes region from ankle keypoints)
4. `composite()` uses these regions to place garments at exact shoulder/hip positions
5. Falls back to proportional estimates if no pose detected

## Dependencies Added
- `@tensorflow/tfjs-core`
- `@tensorflow/tfjs-backend-webgl`
- `@tensorflow-models/pose-detection`

## Replicate API
- Model: `cuuupid/idm-vton` (version `0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985`)
- Requires credits at replicate.com/billing
- 402 billing errors are caught and shown with a link to add credits
