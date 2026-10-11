import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — same mark, larger canvas. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#c96142",
          borderRadius: 40,
        }}
      >
        <svg width="118" height="118" viewBox="0 0 22 22" fill="none">
          <circle
            cx="11"
            cy="11"
            r="6.2"
            stroke="#fff9f4"
            strokeWidth="2.2"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
