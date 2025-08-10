"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface AnimatedGridBackgroundProps {
  className?: string;
}

// Seeded random function for consistent results
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const AnimatedGridBackground: React.FC<AnimatedGridBackgroundProps> = ({ className = '' }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [dotData, setDotData] = useState<Array<{isHighlight: boolean, animationDelay: number, scale: number, opacity: number}>>([]);

  useEffect(() => {
    setIsClient(true);
    
    // Generate dot data on client side only
    const rows = 20;
    const cols = 30;
    const newDotData = [];
    
    for (let i = 0; i < rows * cols; i++) {
      const seed = i * 123.456; // Use index as seed for consistency
      newDotData.push({
        isHighlight: seededRandom(seed) > 0.85,
        animationDelay: seededRandom(seed + 1) * 2,
        scale: seededRandom(seed + 2) * 0.8 + 0.2,
        opacity: seededRandom(seed + 3) * 0.7 + 0.3
      });
    }
    
    setDotData(newDotData);
  }, []);

  useEffect(() => {
    if (!gridRef.current || !isClient || dotData.length === 0) return;

    const dots = dotsRef.current;
    
    // Animate dots with staggered timing
    dots.forEach((dot, index) => {
      if (dot && dotData[index]) {
        const data = dotData[index];
        
        gsap.set(dot, {
          scale: 0.1,
          opacity: 0.3,
        });
        
        // Pulsing animation
        gsap.to(dot, {
          scale: data.scale,
          opacity: data.opacity,
          duration: 2 + seededRandom(index * 456.789) * 3,
          delay: data.animationDelay,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        });
        
        // Floating animation
        gsap.to(dot, {
          y: (seededRandom(index * 789.123) - 0.5) * 20,
          x: (seededRandom(index * 321.654) - 0.5) * 20,
          duration: 4 + seededRandom(index * 987.321) * 4,
          delay: data.animationDelay * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });

    // Cleanup function
    return () => {
      gsap.killTweensOf(dots);
    };
  }, [isClient, dotData]);

  // Generate grid dots
  const generateDots = () => {
    if (!isClient || dotData.length === 0) {
      return null; // Don't render anything on server side
    }
    
    const dots = [];
    const rows = 20;
    const cols = 30;
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const key = `${i}-${j}`;
        const index = i * cols + j;
        const data = dotData[index];
        
        if (data) {
          dots.push(
            <div
              key={key}
              ref={(el) => {
                if (el) dotsRef.current[index] = el;
              }}
              className={`absolute w-1 h-1 rounded-full transition-all duration-300 ${
                data.isHighlight 
                  ? 'bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg shadow-blue-500/20' 
                  : 'bg-slate-600/40'
              }`}
              style={{
                left: `${(j / (cols - 1)) * 100}%`,
                top: `${(i / (rows - 1)) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        }
      }
    }
    return dots;
  };

  return (
    <div 
      ref={gridRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 1 }}
    >
      {/* Animated grid dots */}
      <div className="relative w-full h-full">
        {isClient && generateDots()}
      </div>
      
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-900/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/5 via-transparent to-purple-900/5" />
      
      {/* Moving light rays */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent animate-pulse" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute left-0 top-1/4 w-full h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};

export default AnimatedGridBackground;