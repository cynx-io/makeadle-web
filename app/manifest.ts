import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Makeadle - Create & Play Custom Word Games",
    short_name: "Makeadle",
    description:
      "Create your own DLE games or play community-created word puzzles. Join thousands of players in the ultimate word game experience!",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["games", "education", "entertainment"],
    lang: "en",
    orientation: "portrait-primary",
    scope: "/",
  };
}
