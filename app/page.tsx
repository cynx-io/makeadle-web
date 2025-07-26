import { Topic } from "@/proto/janus/plato/object_pb";
import { topicServerClient } from "@/lib/janus/server-client/plato";
import { newJanusServerError } from "@/lib/janus/server-client/error";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import MakeadleBar from "@/components/game/MakeadleBar";
import { LandingGallery } from "@/components/landing/LandingGallery";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingStats } from "@/components/landing/LandingStats";
import { LandingFeatures } from "@/components/landing/LandingFeatures";

export const metadata: Metadata = {
  title: "Makeadle - Create and Play Custom Word Games",
  description:
    "Create your own DLE games or play community-created word puzzles. Join thousands of players enjoying custom wordle-style games on Makeadle.",
  keywords: [
    "wordle",
    "word games",
    "puzzle games",
    "dle",
    "custom games",
    "brain training",
  ],
  openGraph: {
    title: "Makeadle - Create and Play Custom Word Games",
    description:
      "Create your own DLE games or play community-created word puzzles.",
    type: "website",
    url: "https://makeadle.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Makeadle - Create and Play Custom Word Games",
    description:
      "Create your own DLE games or play community-created word puzzles.",
  },
};

export default async function Home() {
  const topicResp = await topicServerClient.paginateTopic({}).catch((err) => {
    console.error("Error fetching topics:", err);
    newJanusServerError(err).handle();
  });

  if (!topicResp) {
    return notFound();
  }

  const topics = topicResp.topics;
  if (!topics || topics.length === 0) {
    return notFound();
  }

  return (
    <div className="font-inter bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="fixed top-0 left-0 z-50 w-full">
        <MakeadleBar />
      </div>

      <main className="w-full pt-16 pb-8">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
          <LandingHero
            image={{ src: "icon.png", alt: "Makeadle logo" }}
            heading="Create & Play Custom Word Games"
            badge="🎮 New Platform"
            description="Design your own DLE games or challenge yourself with community-created word puzzles. Join thousands of players in the ultimate word game experience!"
            buttons={{
              primary: { text: "Start Creating", url: "/dashboard" },
              secondary: { text: "Play Now", url: "/g/mobiledle" },
            }}
          />
        </section>

        {/* Stats Section */}
        <section className="px-4 sm:px-6 lg:px-20 py-16">
          <LandingStats />
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 lg:px-20 py-16 bg-white/50 backdrop-blur-sm">
          <LandingFeatures />
        </section>

        {/* Games Gallery */}
        <section className="px-4 sm:px-6 lg:px-20 py-16">
          <LandingGallery
            heading="Popular DLE Games"
            url="/explore"
            items={topics.map((topic: Topic) => ({
              title: topic.title,
              description: topic.description,
              image: topic.bannerUrl ?? "/img/invalid.png",
              link: `/g/${topic.slug}`,
              id: topic.id.toString(),
              summary:
                topic.description ||
                "Challenge yourself with this exciting word game!",
              slug: topic.slug,
              url: `/g/${topic.slug}`,
            }))}
          />
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-20 py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Create Your Own Game?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join our community of creators and players. Build engaging word
              games that challenge minds and bring people together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Creating
              </Link>
              <Link
                href="/g/mobiledle"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Browse Games
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 text-center bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Makeadle</h3>
              <p className="text-sm opacity-80">
                Create and play custom word games
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Create Game
                  </Link>
                </li>
                <li>
                  <Link
                    href="/explore"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Browse Games
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:opacity-100 transition-opacity"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link
                    href="/help"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-sm opacity-80">
              &copy; {new Date().getFullYear()} Makeadle. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
