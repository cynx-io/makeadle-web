import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getJanusBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_JANUS_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_JANUS_BASE_URL is not set");
  }
  return baseUrl;
}
