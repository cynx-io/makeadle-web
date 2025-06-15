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

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

// FIXED: Only convert keys, preserve values
export function keysToSnake<T>(obj: T): any {
  if (Array.isArray(obj)) {
    return obj.map(keysToSnake);
  } else if (obj !== null && typeof obj === "object") {
    return Object.entries(obj as Record<string, any>).reduce(
      (acc, [key, val]) => {
        const snakeKey = toSnakeCase(key);
        // Preserve values as-is, only convert keys
        acc[snakeKey] = val;
        return acc;
      },
      {} as Record<string, any>,
    );
  }
  // Return primitive values directly
  return obj;
}
