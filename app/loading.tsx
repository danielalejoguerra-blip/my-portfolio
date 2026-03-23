"use client";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--background)">
      <div className="flex flex-col items-center gap-8">
        {/* Orbiting rings */}
        <div className="relative w-24 h-24">
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: "var(--gradient-start)",
              borderRightColor: "var(--gradient-mid)",
              animation: "spin 1.4s linear infinite",
            }}
          />
          {/* Middle ring */}
          <div
            className="absolute inset-3 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: "var(--gradient-mid)",
              borderLeftColor: "var(--gradient-end)",
              animation: "spin 1s linear infinite reverse",
            }}
          />
          {/* Inner pulsing dot */}
          <div
            className="absolute inset-8 rounded-full"
            style={{
              background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
              animation: "pulse-scale 1.4s ease-in-out infinite",
            }}
          />
        </div>

        {/* Animated dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: `var(--gradient-${i === 0 ? "start" : i === 1 ? "mid" : i === 2 ? "end" : "mid"})`,
                animation: `bounce-dot 1.2s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.7); opacity: 0.5; }
        }
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
