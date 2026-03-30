import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #06b6d4 100%)",
        }}
      >
        <span
          style={{
            fontFamily: "sans-serif",
            fontWeight: 900,
            fontSize: "14px",
            color: "white",
            letterSpacing: "-0.5px",
          }}
        >
          DG
        </span>
      </div>
    ),
    size
  );
}
