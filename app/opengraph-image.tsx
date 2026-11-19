import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "#161310",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: 18,
            background: "linear-gradient(135deg, #D9875A 0%, #B85C3E 100%)",
            color: "#FBF4ED",
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 36,
          }}
        >
          AO
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#D9875A",
            fontWeight: 600,
            marginBottom: 18,
          }}
        >
          Ayokunle Ogunfidodo
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 54,
            lineHeight: 1.15,
            fontWeight: 700,
            color: "#FBF4ED",
            maxWidth: 950,
          }}
        >
          Full-Stack Software Engineer, transitioning into AI/ML Engineering
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#B8AFA3",
            marginTop: 30,
          }}
        >
          React · Next.js · TypeScript · AI-powered products
        </div>
      </div>
    ),
    { ...size },
  );
}
