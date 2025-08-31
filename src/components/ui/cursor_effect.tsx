'use client';

import { useState, useEffect } from 'react';

function Effect() {

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

  return (
    <div className="fixed inset-0 opacity-20">
      <div 
        className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/50 to-blue-500/30 rounded-full blur-3xl"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transition: 'all 0.3s ease-out'
        }}
      />
    </div>
  )
}

export default Effect;