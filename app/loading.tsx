import React from "react";

export default function Loading() {
  return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center z-50">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Main loading container */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Animated logo/icon placeholder */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl shadow-lg transform rotate-45 animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-orange-500 to-blue-500 rounded-2xl shadow-lg transform rotate-45 animate-ping opacity-30"></div>
        </div>

        {/* Loading dots */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Loading
          </h2>
          <p className="text-gray-600 text-sm animate-pulse">
            Preparing your experience...
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
        <div
          className="absolute top-3/4 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-ping opacity-60"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-1/2 left-3/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-2 h-2 bg-orange-400 rounded-full animate-ping opacity-60"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>
    </div>
  );
}
