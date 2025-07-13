"use client";

import Image from "next/image";

export type Props = {
  src: string | undefined;
  alt: string;
};

export default function TitleImage({ src, alt }: Props) {
  return (
    <Image
      src={src || "/img/invalid.png"}
      alt={alt}
      width={600}
      height={200}
      className="mt-[5vh] transition-all duration-300 ease-in-out hover:scale-110 hover:brightness-125 cursor-pointer hover:animate-bounce"
      style={{
        filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))",
        animation: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.animation = "shake 0.5s ease-in-out";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.animation = "none";
      }}
    />
  );
}
