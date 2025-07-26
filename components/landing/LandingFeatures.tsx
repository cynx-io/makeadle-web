"use client";

import {
  Palette,
  Users,
  Zap,
  BarChart3,
  Shield,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Palette,
    title: "Custom Game Creation",
    description:
      "Design unique word games with custom themes, categories, and difficulty levels. Express your creativity with unlimited possibilities.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Join a vibrant community of creators and players. Share your games, get feedback, and discover amazing content from others.",
  },
  {
    icon: Zap,
    title: "Instant Play",
    description:
      "No downloads required! Play games instantly in your browser with seamless performance across all devices.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Track your performance, view detailed statistics, and monitor your improvement over time with comprehensive analytics.",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description:
      "Family-friendly environment with moderation tools and secure gameplay. Perfect for players of all ages.",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description:
      "Fully responsive design that works perfectly on desktop, tablet, and mobile devices. Play anywhere, anytime.",
  },
];

export function LandingFeatures() {
  return (
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Why Choose Makeadle?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Powerful features designed to create the best word game experience for
          creators and players alike
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200"
          >
            <div className="mb-4">
              <div className="inline-flex p-3 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Create your first game in minutes or explore thousands of
            community-created puzzles
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Creating
            </Link>
            <Link
              href="/g/mobiledle"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Play Games
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
