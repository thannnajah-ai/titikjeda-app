# 003 — Animate Void Submission with Upward Spring

- **Status**: TODO
- **Commit**: 15532a3
- **Severity**: LOW
- **Category**: 4. Physicality & origin
- **Estimated scope**: 1 file (src/pages/TheVoid.jsx)

## Problem

When clicking "Lepaskan", the text simply resets and appears in the list. The metaphor of the Void is "letting go" of burdens. The input should animate flying away into the void to give emotional closure.

## Target

When the form is submitted, animate the input form sliding up and fading out, then resetting back instantly invisibly before sliding back in.
Actually, it's simpler: We can just use a `motion.form` and animate its `y` property on submit using Framer Motion's `useAnimation`.

```jsx
// target
const controls = useAnimation();

const handlePost = async (e) => {
  e.preventDefault();
  if (!newPost.trim()) return;

  // Fly away animation
  await controls.start({ y: -100, opacity: 0, scale: 0.9, transition: { duration: 0.3, ease: "easeIn" } });
  
  // Submit logic...
  
  // Reset invisible
  controls.set({ y: 50, opacity: 0, scale: 0.9 });
  
  // Slide back in
  controls.start({ y: 0, opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.4, duration: 0.5 } });
};

// ...
<motion.form animate={controls} onSubmit={handlePost}>
```

## Repo conventions to follow

- Framer Motion `useAnimation` for imperative control.

## Steps

1. Import `useAnimation` from framer-motion in `TheVoid.jsx`.
2. Initialize `controls`.
3. Change the `<form>` to `<motion.form animate={controls}>`.
4. Update `handlePost` to await the fly-away animation before resetting state and triggering the fly-back.

## Boundaries

- Do NOT touch Supabase realtime logic.

## Verification

- **Mechanical**: npm run dev.
- **Feel check**: Type a post and click "Lepaskan".
  - Ensure the form shoots upward and fades out.
  - Ensure it comes back from below with a satisfying spring.
- **Done when**: The interaction feels like physically throwing something away.
