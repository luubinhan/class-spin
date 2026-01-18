# ClassSpin AI Coding Instructions

## Project Overview
ClassSpin is a **standalone, frontend-only** React spinning wheel app for randomly selecting students. No backend, no API calls, no external services—just browser-based interactions with localStorage and Web Audio API.

## Architecture

### Tech Stack
- **React 19** with TypeScript + Vite
- **Tailwind CSS** via CDN (in `index.html`, not npm)
- **Canvas API** for wheel rendering (`components/Wheel.tsx`)
- **Web Audio API** for sound effects (`utils/audio.ts`)
- **LocalStorage** for persisting student names

### Key Components
```
App.tsx              # Main app logic, state management, winner modal
components/Wheel.tsx # Canvas-based spinning wheel with physics
components/Confetti.tsx # Canvas-based particle effects
utils/audio.ts       # Web Audio API for tick/win sounds
utils/constants.ts   # Wheel colors, default names
types.ts            # WheelItem, GameState enum
```

## Critical Patterns

### State Management
All state lives in `App.tsx` using React hooks—no Redux/Context needed:
- `inputText`: Synced with localStorage (key: `class_spin_picker_entries`)
- `items`: Derived from `inputText.split('\n')` via useEffect
- `gameState`: Enum cycling IDLE → SPINNING → CELEBRATING
- Use `useCallback` for `handleSpin` to safely reference in event listeners

### Canvas Animation
- **Wheel.tsx**: Uses `requestAnimationFrame` with velocity-based deceleration (`velocityRef.current *= 0.985`)
- Winner determined by rotation angle at **9 o'clock position** (`POINTER_ANGLE = Math.PI`)
- Tick sounds triggered when winner index changes during spin
- Always cleanup animation frames in `useEffect` return

### Styling Approach
- Tailwind utility classes directly in JSX (no separate CSS files)
- Custom styles in `<style>` tag in `index.html` (font-family, scrollbar hiding)
- Dynamic inline styles for wheel segment colors: `style={{ backgroundColor: winner?.color }}`

## Development Workflow

### Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run preview      # Preview production build
```

### Module Resolution
- ES modules with import maps in `index.html` (CDN imports for React/Lucide)
- Path alias: `@/*` maps to project root (`tsconfig.json`, `vite.config.ts`)
- No Node.js polyfills needed—runs entirely in browser

### Adding Features
1. **New audio effects**: Extend `audioManager` in `utils/audio.ts` (use Web Audio oscillators)
2. **Visual changes**: Edit canvas drawing logic in `Wheel.tsx` `drawWheel()` function
3. **New modal/UI**: Follow pattern in `App.tsx` winner modal (fixed positioning, backdrop, animations)

## Important Conventions

### No External Dependencies
- **Do NOT** add API integrations, authentication, or backend calls
- **Do NOT** install Tailwind via npm (it's CDN-loaded)
- Keep dependencies minimal—check `package.json` before adding libraries

### LocalStorage Key
Always use `STORAGE_KEY = 'class_spin_picker_entries'` for persistence (defined in `App.tsx`)

### Keyboard Shortcuts
`Ctrl+Enter` (or `Cmd+Enter`) triggers spin—implemented via global `keydown` listener in `App.tsx`

### Color System
Use predefined `WHEEL_COLORS` array from `utils/constants.ts` (9 colors cycling via modulo)

## Common Tasks

**Add new student names programmatically:**
```typescript
setInputText(prevText => prevText + '\nNewName')
```

**Change spin duration:** Adjust velocity decay factor in `Wheel.tsx` line 126 (`velocityRef.current *= 0.985`)

**Modify winner selection logic:** Edit `POINTER_ANGLE` constant in `Wheel.tsx` (currently `Math.PI` = left side)

**Debug canvas rendering:** Add `console.log` in `drawWheel()` function—it runs on every frame while spinning
