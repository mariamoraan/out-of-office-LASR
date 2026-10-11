import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Brand mark: single circle on terracotta. */
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
          background: "#c96142",
          borderRadius: 8,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
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
