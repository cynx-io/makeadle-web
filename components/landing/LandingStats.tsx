"use client";

import { useEffect, useState } from "react";
import { Users, Gamepad2, Trophy, Target } from "lucide-react";

const stats = [
  {
    id: "players",
    label: "Active Players",
    value: 15000,
    icon: Users,
    suffix: "+",
  },
  {
    id: "games",
    label: "Games Created",
    value: 500,
    icon: Gamepad2,
    suffix: "+",
  },
  {
    id: "puzzles",
    label: "Puzzles Solved",
    value: 250000,
    icon: Trophy,
    suffix: "+",
  },
  {
    id: "accuracy",
    label: "Success Rate",
    value: 78,
    icon: Target,
    suffix: "%",
  },
];

function AnimatedCounter({
  value,
  suffix = "",
}: {
  readonly value: number;
  readonly suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="text-3xl md:text-4xl font-bold text-blue-600">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function LandingStats() {
  return (
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Join Our Growing Community
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Thousands of players worldwide are already enjoying custom word games
          on Makeadle
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.id} className="text-center group">
            <div className="mb-4 flex justify-center">
              <div className="p-3 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors">
                <stat.icon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            <p className="text-gray-600 mt-2 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
