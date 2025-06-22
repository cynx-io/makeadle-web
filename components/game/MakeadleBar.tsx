"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function MakeadleBar() {
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoHide = () => {
    // Clear existing timeout first
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Set new timeout to hide after 3s
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, 3000);
  };

  useEffect(() => {
    // Initial auto-hide after 3s
    startAutoHide();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 20) {
        setVisible(true);
        startAutoHide(); // Restart the hide timer after showing
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={`sticky top-0 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      } w-full bg-slate-950 font-semibold text-xs px-7 py-3 flex items-end`}
    >
      <Link href={"/"} className="hover:brightness-75">
        <span className="text-orange-400 text-lg ml-1 leading-none">Makeadle</span>
        <span className="leading-none">.com</span>
      </Link>
    </div>
  );
}
