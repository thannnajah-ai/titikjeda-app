# 002 — Add Cinematic Memory Saved Overlay

- **Status**: TODO
- **Commit**: 15532a3
- **Severity**: MEDIUM
- **Category**: 8. Missed opportunities
- **Estimated scope**: 1 file (src/pages/BilikKonsultasi.jsx)

## Problem

Ending the session just pushes a plain chat message `[Sesi Diakhiri. Ingatan disimpan...]`. This is the core magic of the app (the AI remembering you), and it happens rarely. It deserves a moment of delight and celebration.

## Target

When the summary is generated, render a full-screen, blurred overlay over the chat that displays "Memori Disimpan" with a glowing brain icon, entering smoothly.

```jsx
// target inside BilikKonsultasi.jsx
<AnimatePresence>
  {isEndingSession && (
    <motion.div 
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-stone-950/60 rounded-xl"
    >
      <motion.div 
        initial={{ scale: 0.8, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
        className="flex flex-col items-center bg-stone-900 border border-stone-800 p-8 rounded-2xl shadow-2xl"
      >
        <span className="text-4xl mb-4 animate-pulse">🧠</span>
        <h3 className="text-xl font-bold text-stone-100">Memori Disimpan</h3>
        <p className="text-sm text-stone-400 mt-2">AI akan mengingat percakapan ini besok.</p>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

## Repo conventions to follow

- Framer Motion `AnimatePresence` for unmounting elements.
- Tailwind for absolute positioning over the chat area.

## Steps

1. Add state `const [isEndingSession, setIsEndingSession] = useState(false);`
2. In `handleEndSession`, set `setIsEndingSession(true)` when the process starts, and remove it after 3 seconds with a `setTimeout`.
3. Render the overlay inside the main chat container using the target code above.

## Boundaries

- Do NOT touch `useChatStore`.
- Only modify `BilikKonsultasi.jsx` layout.

## Verification

- **Mechanical**: npm run dev.
- **Feel check**: Click "Akhiri Sesi".
  - Ensure the overlay blurs the background beautifully.
  - Ensure the spring bounce feels rewarding.
- **Done when**: The saving process feels like a magical moment rather than a dry chat message.
