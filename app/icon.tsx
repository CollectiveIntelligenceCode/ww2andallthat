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
          background: "#1C1A14",
          borderRadius: 4,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 900,
            color: "#F5F1E8",
            letterSpacing: "-0.5px",
            fontFamily: "serif",
          }}
        >
          WW2
        </div>
      </div>
    ),
    { ...size }
  );
}
