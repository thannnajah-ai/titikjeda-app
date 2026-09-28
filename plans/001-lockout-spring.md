# 001 — Dramatize Lockout Overlay with Spring Drop

- **Status**: TODO
- **Commit**: 15532a3
- **Severity**: HIGH
- **Category**: 8. Missed opportunities
- **Estimated scope**: 1 file (src/components/LockoutOverlay.jsx)

## Problem

The lockout screen is a high-emotion moment that just fades and scales up slowly (0.5s duration). This does not convey the gravity or the "shock" of being locked out.
Current code (`src/components/LockoutOverlay.jsx:21`):
```jsx
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
```

## Target

Use a dramatic spring drop with a bounce for the modal, and add a pulsing red warning glow to the Flame icon.
```jsx
// target
            initial={{ y: -50, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.4, delay: 0.1 }}
// icon target
            <Flame className="w-16 h-16 mx-auto mb-8 text-red-500 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
```

## Repo conventions to follow

- Framer motion for layout/springs.
- Tailwind for simple pulsing/shadows.

## Steps

1. Edit `src/components/LockoutOverlay.jsx` to replace the `motion.div` transition for the main modal content to use a heavy spring.
2. Edit the `<Flame />` icon to use `text-red-500 animate-pulse` instead of `text-stone-600` to indicate danger/warning.

## Boundaries

- Do NOT touch `src/store/useAppStore.js`.
- Do NOT change markup/structure — motion properties only.

## Verification

- **Mechanical**: npm run dev.
- **Feel check**: Click "Fast Forward 90m".
  - Ensure the screen slams down with a bouncy, heavy feel (spring).
  - Ensure the fire icon pulses menacingly.
- **Done when**: The animation is dramatically stronger than a simple scale up.
