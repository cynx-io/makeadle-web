"use client";

import { useEffect } from "react";

export default function DynamicFavicon() {
  useEffect(() => {
    const updateFavicon = () => {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const faviconPath = isDarkMode ? "/favicon.ico" : "/favicon.ico";

      // Update existing favicon links
      const faviconLinks = document.querySelectorAll(
        'link[rel="icon"], link[rel="shortcut icon"]',
      );
      faviconLinks.forEach((link) => {
        (link as HTMLLinkElement).href = faviconPath + "?v=" + Date.now();
      });

      // If no favicon links exist, create one
      if (faviconLinks.length === 0) {
        const favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.type = "image/x-icon";
        favicon.href = faviconPath;
        document.head.appendChild(favicon);
      }
    };

    // Initial favicon set
    updateFavicon();

    // Listen for theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => updateFavicon();

    // Modern way to add listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return null; // This component doesn't render anything
}
