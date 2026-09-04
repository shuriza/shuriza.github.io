import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/profile";

export const alt = "Portfolio M. Firdaus Suryaningrat";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const profile = await getProfile();

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#0a0a0f",
          color: "#e2e8f0",
          display: "flex",
          height: "100%",
          padding: "72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#22d3ee",
            borderRadius: "999px",
            height: "14px",
            left: "72px",
            position: "absolute",
            top: "72px",
            width: "14px",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "920px" }}>
          <div style={{ color: "#67e8f9", fontSize: "34px", letterSpacing: "6px" }}>
            &lt;SHURIZA /&gt;
          </div>
          <div style={{ fontSize: "82px", fontWeight: 700, lineHeight: 1.05, marginTop: "28px" }}>
            {profile.display_name}
          </div>
          <div style={{ color: "#cbd5e1", fontSize: "36px", marginTop: "28px" }}>
            {profile.role}
          </div>
          <div style={{ color: "#94a3b8", fontSize: "28px", marginTop: "44px" }}>
            Laravel | Next.js | TypeScript | MySQL
          </div>
        </div>
      </div>
    ),
    size,
  );
}
