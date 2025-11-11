# Fitness Trainer Reservation System

## Tech Stack

**Frontend (client/):**
- React Native + Expo (Bare Workflow)
- TypeScript
- Redux Toolkit
- Nativewind

**Backend (api/):**
- NestJS
- Firebase (Modular v2)
- TypeScript

---

## Setup

### Install Dependencies
```bash
pnpm install:all
```

---

## Development

### Start Backend + Frontend
```bash
# Backend + Metro Bundler
pnpm dev

# Backend + iOS Simulator
pnpm dev:ios

# Backend + Android Emulator
pnpm dev:android

# Backend + iOS Device
pnpm client:ios:device

# Backend + Android Device
pnpm client:android:device
```

### Individual Services
```bash
# Backend only
pnpm api

# Frontend Metro only
pnpm client

# iOS only
pnpm client:ios

# Android only
pnpm client:android
```

---

## Clean & Rebuild

### Clean Cache
```bash
# Clean all (client + api)
pnpm clean

# Clean everything + node_modules
pnpm clean:all

# Clean client only
pnpm clean:client

# Clean specific platforms
cd client && pnpm clean:metro
cd client && pnpm clean:android
cd client && pnpm clean:ios
cd client && pnpm clean:pods
```

### Rebuild
```bash
# Full rebuild (everything from scratch)
pnpm rebuild

# Rebuild client only
pnpm rebuild:client

# Rebuild specific platform
cd client && pnpm rebuild:android
cd client && pnpm rebuild:ios
```

---

## Client Scripts
```bash
cd client

# Development
pnpm start              # Start Metro
pnpm start:clean        # Start Metro with clean cache

# Run on devices
pnpm android            # Android Emulator
pnpm android:device     # Android Physical Device
pnpm ios                # iOS Simulator
pnpm ios:device         # iOS Physical Device

# Clean
pnpm clean              # Clean all caches
pnpm clean:metro        # Metro cache only
pnpm clean:android      # Android build cache
pnpm clean:ios          # iOS build cache
pnpm clean:pods         # Reinstall pods

# Rebuild
pnpm rebuild:android    # Clean + run Android
pnpm rebuild:ios        # Clean pods + run iOS

# Other
pnpm setup              # Full setup with prebuild
pnpm lint               # Run linter
```

---

## API Scripts
```bash
cd api

# Development
pnpm start:dev          # Start with watch mode
pnpm start              # Start production

# Clean
pnpm clean              # Clean dist and cache
```

---

## Troubleshooting

### Metro Bundler Issues
```bash
cd client && pnpm start:clean
```

### Android Build Issues
```bash
cd client && pnpm rebuild:android
```

### iOS Build Issues
```bash
cd client && pnpm clean:pods
```

### Full Reset
```bash
pnpm clean:all && pnpm install:all
```

---

## Prerequisites

- Node.js 18+
- pnpm
- Xcode (for iOS)
- Android Studio (for Android)
- Ruby + CocoaPods (for iOS)
