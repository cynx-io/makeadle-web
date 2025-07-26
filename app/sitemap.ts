import { MetadataRoute } from "next";
import { topicServerClient } from "@/lib/janus/server-client/plato";
import { newJanusServerError } from "@/lib/janus/server-client/error";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.makeadle.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic game pages
  let gamePages: MetadataRoute.Sitemap = [];

  try {
    const topicsResp = await topicServerClient.paginateTopic({});
    const topics = topicsResp?.topics || [];

    gamePages = topics.flatMap((topic) => [
      {
        url: `${baseUrl}/g/${topic.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      },
      // Add game mode pages
      {
        url: `${baseUrl}/g/${topic.slug}/wordle`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/g/${topic.slug}/audiodle`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/g/${topic.slug}/blurdle`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
    ]);
  } catch (err) {
    console.error(
      "Failed to fetch topics for sitemap:",
      newJanusServerError(err).handle(),
    );
  }

  return [...staticPages, ...gamePages];
}
