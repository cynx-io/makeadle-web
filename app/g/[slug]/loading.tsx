import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center z-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(251,146,60,0.2),rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.2),rgba(255,255,255,0))]"></div>
      </div>

      {/* Main Loading Container */}
      <div className="relative flex flex-col items-center justify-center space-y-8">
        {/* Animated Logo/Icon */}
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-24 h-24 rounded-full border-4 border-transparent border-t-blue-400 border-r-orange-400 animate-spin"></div>

          {/* Inner Ring */}
          <div className="absolute inset-2 w-20 h-20 rounded-full border-4 border-transparent border-b-orange-400 border-l-blue-400 animate-spin animate-reverse"></div>

          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-orange-400 rounded-lg flex items-center justify-center animate-pulse">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white animate-pulse">
            Loading Topic...
          </h2>

          {/* Animated Dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-400 to-orange-400 rounded-full animate-pulse"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 ${i % 2 === 0 ? "bg-blue-400" : "bg-orange-400"} rounded-full opacity-60 animate-ping`}
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + i * 5}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: "2s",
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-8 text-center">
        <p className="text-slate-400 text-sm animate-pulse">
          Preparing your gaming experience...
        </p>
      </div>
    </div>
  );
}
