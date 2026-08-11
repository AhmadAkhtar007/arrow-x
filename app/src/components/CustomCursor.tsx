'use client';

import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHovered = useRef(false);
  const isMouseDown = useRef(false);
  const isVisible = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let isRunning = false;

    const render = () => {
      const lerp = 0.25;
      const dx = mousePos.current.x - ringPos.current.x;
      const dy = mousePos.current.y - ringPos.current.y;
      
      ringPos.current.x += dx * lerp;
      ringPos.current.y += dy * lerp;

      if (ringRef.current) {
        const scale = isMouseDown.current ? 0.75 : isHovered.current ? 1.4 : 1;
        const opacity = isHovered.current ? '0.9' : '0.4';
        const borderColor = isHovered.current ? 'var(--theme-accent, #10b981)' : 'rgba(255, 255, 255, 0.4)';
        
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.style.opacity = opacity;
        ringRef.current.style.borderColor = borderColor;
      }

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1 || isHovered.current) {
        rafId.current = requestAnimationFrame(render);
      } else {
        isRunning = false;
      }
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        rafId.current = requestAnimationFrame(render);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible.current) {
        isVisible.current = true;
        setHasMoved(true);
      }
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      startLoop();
    };

    const onMouseDown = () => {
      isMouseDown.current = true;
      startLoop();
    };

    const onMouseUp = () => {
      isMouseDown.current = false;
      startLoop();
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const tag = target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        if (dotRef.current) dotRef.current.style.opacity = '0';
        if (ringRef.current) ringRef.current.style.opacity = '0';
        isHovered.current = false;
        return;
      } else {
        if (dotRef.current) dotRef.current.style.opacity = '1';
      }

      if (target.closest('button, a, [role="button"], .cursor-pointer, .product-card')) {
        isHovered.current = true;
      } else {
        isHovered.current = false;
      }
      startLoop();
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (!mounted || !hasMoved) return null;

  return (
    <>
      {/* Precision Micro Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />

      {/* Trailing Aero Ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] w-9 h-9 rounded-full border border-white/40 backdrop-blur-[1px] will-change-transform transition-[border-color,opacity] duration-150"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
    </>
  );
};
