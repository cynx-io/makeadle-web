// app/g/[slug]/sitemap.ts (This example generates a single sitemap for ALL topics)
import { MetadataRoute } from "next";
import { topicServerClient } from "@/lib/janus/server-client/plato"; // Adjust path as needed
import { newJanusServerError } from "@/lib/janus/server-client/error"; // Adjust path as needed

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.makeadle.com";

  const topicsResp = await topicServerClient
    .paginateTopic({}) // Assuming you have a way to list all topics
    .catch((err) => {
      console.error(
        "Failed to fetch topics for sitemap:",
        newJanusServerError(err).handle(),
      );
      return { topics: [] }; // Return empty array on error
    });

  const topics = topicsResp?.topics || [];

  return topics.map((topic) => ({
    url: `${baseUrl}/g/${topic.slug}`,
    lastModified: new Date(), // Use a timestamp if available
    changeFrequency: "daily", // Or 'weekly', 'monthly' based on how often topics change
    priority: 0.7, // A bit lower than homepage, but still important
  }));
}
