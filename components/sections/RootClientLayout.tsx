"use client";

import FloatingIcon from "@/components/ui/FloatingIcon";
import { useEffect, useState, useRef } from "react";

export default function RootClientLayout() {
  // This is the eased scroll position
  const [scrollY, setScrollY] = useState(0);

  // Keep track of the target scroll position
  const targetScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      targetScrollY.current = window.scrollY / 2;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    let animationFrameId: number;

    // Easing function: linear interpolation (lerp)
    const ease = 0.05; // 0.1 means 10% closer per frame; smaller is slower easing

    const animate = () => {
      setScrollY((current) => {
        // Move current towards target by ease factor
        const diff = targetScrollY.current - current;
        if (Math.abs(diff) < 0.1) {
          // Close enough, snap to target
          return targetScrollY.current;
        }
        return current + diff * ease;
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div>
      <div className="fixed w-full h-full top-0 left-0 pointer-events-none z-0">
        <FloatingIcon
          className="top-1/8 left-1/8 -scale-x-100 -rotate-15"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          imageSrc="/img/icon3d_eth.png"
          width={150}
          height={150}
        />
        <FloatingIcon
          className="top-1/2 right-1/8 transform -translate-y-1/2"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          imageSrc="/img/icon3d_bitcoin.png"
        />
        <FloatingIcon
          className="bottom-1/8 left-1/10 -rotate-15"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          imageSrc="/img/icon3d_solana.png"
        />
      </div>
    </div>
  );
}
