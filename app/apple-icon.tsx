import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1C1A14",
        }}
      >
        {/* Gold top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "#C9A800",
          }}
        />
        <div
          style={{
            fontSize: 68,
            fontWeight: 900,
            color: "#F5F1E8",
            letterSpacing: "-2px",
            lineHeight: 1,
            fontFamily: "serif",
          }}
        >
          WW2
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 400,
            color: "#C9A800",
            letterSpacing: "3px",
            marginTop: 10,
            fontFamily: "sans-serif",
            textTransform: "uppercase",
          }}
        >
          & ALL THAT
        </div>
      </div>
    ),
    { ...size }
  );
}
