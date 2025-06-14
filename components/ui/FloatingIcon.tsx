import Image from "next/image";
import React from "react";

export default function FloatingIcon({
  className,
  style,
  width = 200,
  height = 200,
  imageSrc,
}: {
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  imageSrc: string;
}) {
  return (
    <div className={`absolute pointer-events-none ${className}`} style={style}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, transparent 70%)",
          filter: "blur(20px)",
          zIndex: 0,
        }}
      ></div>

      <div className="animate-float">
        <Image
          src={imageSrc}
          alt="Floating Icon"
          width={width}
          height={height}
        />
      </div>
    </div>
  );
}
