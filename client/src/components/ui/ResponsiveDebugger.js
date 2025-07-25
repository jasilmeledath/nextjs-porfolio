/**
 * @fileoverview Mobile Responsiveness Debugger
 * @author Professional Developer
 * @created 2025-01-27
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';

export default function ResponsiveDebugger() {
  const [screenInfo, setScreenInfo] = useState({
    width: 0,
    height: 0,
    breakpoint: '',
    userAgent: ''
  });

  useEffect(() => {
    const updateScreenInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let breakpoint = '';
      if (width < 640) breakpoint = 'xs (mobile)';
      else if (width < 768) breakpoint = 'sm (small tablet)';
      else if (width < 1024) breakpoint = 'md (tablet)';
      else if (width < 1280) breakpoint = 'lg (desktop)';
      else breakpoint = 'xl (large desktop)';

      setScreenInfo({
        width,
        height,
        breakpoint,
        userAgent: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'
      });
    };

    updateScreenInfo();
    window.addEventListener('resize', updateScreenInfo);
    
    return () => window.removeEventListener('resize', updateScreenInfo);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white text-xs p-3 rounded-lg backdrop-blur-sm border border-gray-600 max-w-xs">
      <div className="font-mono space-y-1">
        <div>📱 {screenInfo.width} × {screenInfo.height}</div>
        <div>🎯 {screenInfo.breakpoint}</div>
        <div>🖥️ {screenInfo.userAgent}</div>
        <div className="flex space-x-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-red-500 sm:bg-yellow-500 md:bg-green-500 lg:bg-blue-500 xl:bg-purple-500"></div>
          <span className="text-xs opacity-75">Breakpoint indicator</span>
        </div>
      </div>
    </div>
  );
}
