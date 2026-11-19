import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
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
          background: "linear-gradient(135deg, #D9875A 0%, #B85C3E 100%)",
          color: "#FBF4ED",
          fontFamily: "sans-serif",
          fontSize: 32,
          fontWeight: 700,
          borderRadius: 14,
          letterSpacing: -1,
        }}
      >
        AO
      </div>
    ),
    { ...size },
  );
}
