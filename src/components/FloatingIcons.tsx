import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Minus, 
  Divide, 
  Percent, 
  Monitor, 
  Cpu, 
  Microscope, 
  Binary, 
  FunctionSquare as Function, 
  Sigma, 
  Laptop, 
  Calculator 
} from 'lucide-react';

interface FloatingIconProps {
  scrollY: number;
}

export const FloatingIcons: React.FC<FloatingIconProps> = ({ scrollY }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate random positions for icons
  const generateRandomPositions = (count: number) => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      positions.push({
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        scale: 0.8 + Math.random() * 0.4
      });
    }
    return positions;
  };

  const iconConfigs = [
    { Icon: Plus, size: 14, color: 'text-apple-blue-500' },
    { Icon: Minus, size: 16, color: 'text-purple-500' },
    { Icon: Monitor, size: 18, color: 'text-red-500' },
    { Icon: Microscope, size: 20, color: 'text-green-500' },
    { Icon: Binary, size: 14, color: 'text-yellow-500' },
    { Icon: Function, size: 16, color: 'text-indigo-500' },
    { Icon: Divide, size: 12, color: 'text-pink-500' },
    { Icon: Cpu, size: 18, color: 'text-cyan-500' },
    { Icon: Sigma, size: 16, color: 'text-orange-500' },
    { Icon: Calculator, size: 18, color: 'text-teal-500' },
    { Icon: Laptop, size: 20, color: 'text-rose-500' },
    { Icon: Percent, size: 14, color: 'text-violet-500' }
  ];

  // Create multiple instances of each icon with random positions
  const icons = iconConfigs.flatMap((config, i) => {
    const positions = generateRandomPositions(3); // Create 3 instances of each icon
    return positions.map((pos, j) => ({
      ...config,
      initialX: pos.x,
      initialY: pos.y,
      scale: pos.scale,
      moveX: (Math.random() - 0.5) * 0.2, // Random movement between -0.1 and 0.1
      moveY: (Math.random() - 0.5) * 0.2,
      rotate: (Math.random() - 0.5) * 0.4,
      delay: (i * 3 + j) * 0.1, // Stagger the animations
      opacity: 0.4 + Math.random() * 0.2 // Random opacity between 0.4 and 0.6
    }));
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {icons.map((icon, index) => {
        const { Icon, initialX, initialY, moveX, moveY, size, color, rotate, delay, opacity, scale } = icon;
        
        // Calculate movement based on scroll and mouse position
        const scrollFactor = scrollY * 0.002;
        const mouseFactor = 0.02;
        const mouseX = (mousePosition.x - window.innerWidth / 2) * mouseFactor;
        const mouseY = (mousePosition.y - window.innerHeight / 2) * mouseFactor;
        
        const translateX = Math.sin((scrollFactor) + index) * 30 + (scrollY * moveX) + mouseX;
        const translateY = Math.cos((scrollFactor) + index) * 30 + (scrollY * moveY) + mouseY;
        const rotation = Math.sin((scrollFactor) + index) * 30 + (scrollY * rotate);
        const currentScale = scale + Math.sin((scrollY * 0.003) + index + delay) * 0.3;

        return (
          <div
            key={index}
            className={`absolute transition-all duration-700 ease-out ${color} dark:${color.replace('500', '400')}`} style={{
              left: initialX,
              top: initialY,
              opacity: opacity,
              transform: `translate(${translateX}px, ${translateY}px) scale(${currentScale}) rotate(${rotation}deg)`,
              transitionDelay: `${delay}s`,
              filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.1))'
            }}
          >
            <Icon 
              size={size} 
              strokeWidth={1.5}
              className="animate-pulse"
            />
          </div>
        );
      })}
    </div>
  );
};