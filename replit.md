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
- **AI photorealistic generation**: optional `Generate AI Image` button calls Replicate API (`cuuupid/idm-vton`) for a realistic result (requires Replicate billing credits)
- **HEIC/unsupported format detection**: clear error messages for iPhone HEIC files
- **Garment catalogue**: 6 T-shirts (extendable to bottoms/pants)

## File Structure
```
client/src/
  pages/TryOn.tsx        — main virtual try-on component
  pages/Home.tsx         — landing page
  lib/poseDetector.ts    — TF.js MoveNet pose detection utility
  assets/images/         — garment PNG assets

server/
  index.ts               — Express server setup (20MB body limit)
  routes.ts              — /api/tryon Replicate proxy endpoint
  storage.ts             — Drizzle storage interface

shared/
  schema.ts              — Drizzle schema + Zod types
```

## Pose Detection Flow
1. User uploads photo → `readFile()` validates format (rejects HEIC)
2. `detectPoseRegions(img)` runs MoveNet SINGLEPOSE_LIGHTNING (lazy-loaded)
3. Returns pixel-space `tops` and `bottoms` `BodyRegion` objects
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
