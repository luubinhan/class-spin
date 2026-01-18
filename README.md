# ClassSpin 🎡

A beautiful, interactive spinning wheel application for randomly selecting students or items in the classroom. Built with React, TypeScript, and Canvas API for smooth animations and an engaging user experience.

![ClassSpin Demo](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## ✨ Features

- **🎯 Random Selection** - Fair, randomized picking with physics-based spinning animation
- **🎨 Colorful Interface** - Vibrant wheel segments with automatic color assignment
- **🔊 Sound Effects** - Tick sounds during spin and celebratory chimes when a winner is selected
- **💾 Auto-Save** - Student names persist in browser localStorage
- **⌨️ Keyboard Shortcuts** - Quick spin with `Ctrl+Enter` or `Cmd+Enter`
- **🎊 Celebration Modal** - Confetti animation and winner announcement
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices
- **🚀 No Backend Required** - Fully client-side, no API calls or server needed

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/class-spin.git
   cd class-spin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

## 📖 Usage

1. **Add Student Names**: Enter names in the text area (one per line)
2. **Spin the Wheel**: Click the "SPIN" button in the center or press `Ctrl+Enter`
3. **View Winner**: A modal appears with confetti and the selected name
4. **Remove or Keep**: Choose to remove the winner from the list or keep them for the next spin

## 🛠️ Technical Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe code
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS (CDN-loaded)
- **Canvas API** - Hardware-accelerated wheel rendering
- **Web Audio API** - Browser-native sound synthesis
- **LocalStorage** - Persistent data storage

## 📂 Project Structure

```
class-spin/
├── App.tsx                  # Main application logic and state management
├── components/
│   ├── Wheel.tsx            # Canvas-based spinning wheel with physics
│   └── Confetti.tsx         # Particle effects animation
├── utils/
│   ├── audio.ts             # Web Audio API sound manager
│   └── constants.ts         # Color palette and default names
├── types.ts                 # TypeScript interfaces and enums
├── index.html               # HTML entry point with Tailwind CDN
├── index.tsx                # React app bootstrap
└── vite.config.ts           # Vite configuration
```

## 🎨 Customization

### Change Wheel Colors
Edit `utils/constants.ts`:
```typescript
export const WHEEL_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  // Add more colors...
];
```

### Adjust Spin Speed
Modify the velocity decay in `components/Wheel.tsx`:
```typescript
velocityRef.current *= 0.985; // Lower = faster stop, Higher = longer spin
```

### Change Winner Selection Point
Edit `POINTER_ANGLE` in `components/Wheel.tsx`:
```typescript
const POINTER_ANGLE = Math.PI; // Math.PI = 9 o'clock (left side)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with React and TypeScript
- Icons from [Lucide React](https://lucide.dev/)
- Inspired by classroom random picker tools

---

Made with ❤️ for teachers and educators