
import React, { useEffect, useRef, useState } from 'react';
import { WheelItem } from '../types';
import { audioManager } from '../utils/audio';

interface WheelProps {
  items: WheelItem[];
  spinning: boolean;
  onSpinEnd: (winnerIndex: number) => void;
}

const Wheel: React.FC<WheelProps> = ({ items, spinning, onSpinEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTickIndexRef = useRef(-1);
  const requestRef = useRef<number | undefined>(undefined);
  
  // The wheel rotates clockwise. The selection point is at 3 o'clock (0 radians).
  const POINTER_ANGLE = 0;
  
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, width, height);

    if (items.length === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.font = '20px Outfit';
      ctx.fillText('Add names to start!', centerX, centerY);
      return;
    }

    const anglePerSegment = (Math.PI * 2) / items.length;

    items.forEach((item, i) => {
      const startAngle = i * anglePerSegment + rotationRef.current;
      const endAngle = startAngle + anglePerSegment;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = 'white';
      ctx.font = `bold ${Math.max(12, 24 - items.length / 2)}px Outfit`;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      
      const displayText = item.text.length > 15 ? item.text.slice(0, 12) + '...' : item.text;
      ctx.fillText(displayText, radius - 40, 8); 
      ctx.restore();
    });

    // Draw center pin
    ctx.beginPath();
    ctx.arc(centerX, centerY, 45, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Calculate winner index logic based on POINTER_ANGLE
    let winnerIndex = Math.floor((POINTER_ANGLE - rotationRef.current) / anglePerSegment) % items.length;
    if (winnerIndex < 0) winnerIndex += items.length;

    if (winnerIndex !== lastTickIndexRef.current && velocityRef.current > 0.001) {
      audioManager.playTick();
      lastTickIndexRef.current = winnerIndex;
    }
  };

  const animate = (time: number) => {
    if (velocityRef.current > 0.001) {
      rotationRef.current += velocityRef.current;
      velocityRef.current *= 0.985;
      drawWheel();
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (spinning) {
        velocityRef.current = 0;
        const anglePerSegment = (Math.PI * 2) / items.length;
        let winnerIndex = Math.floor((POINTER_ANGLE - rotationRef.current) / anglePerSegment) % items.length;
        if (winnerIndex < 0) winnerIndex += items.length;
        onSpinEnd(winnerIndex);
      }
    }
  };

  useEffect(() => {
    if (spinning && velocityRef.current <= 0.001) {
      velocityRef.current = 0.3 + Math.random() * 0.4;
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [spinning]);

  useEffect(() => {
    drawWheel();
    return () => {
      if (requestRef.current !== undefined) cancelAnimationFrame(requestRef.current);
    };
  }, [items]);

  return (
    <div className="relative group flex items-center justify-center">
      {/* Pointer Arrow - Located at Right (3 o'clock) pointing LEFT */}
      <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
        <div 
          className="w-10 h-10 bg-white" 
          style={{ clipPath: 'polygon(100% 0%, 100% 100%, 0% 50%)' }}
        ></div>
      </div>
      
      {/* Outer Glow */}
      <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-3xl transition-all duration-700 pointer-events-none"></div>
      
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="max-w-full h-auto relative z-0"
      />
    </div>
  );
};

export default Wheel;
