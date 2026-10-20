import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "ScriptMønks — We write the scripts that run your ideas.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

const logoDataUrl = `data:image/png;base64,${readFileSync(
  path.join(process.cwd(), "public", "brand", "logo-full.png"),
).toString("base64")}`;

export default function OpengraphImage() {
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
          gap: 32,
          background: "#09181B",
          border: "8px solid #FF7A65",
        }}
      >
        <img
          src={logoDataUrl}
          width={282}
          height={154}
          style={{ display: "flex" }}
          alt=""
        />
        <div
          style={{
            display: "flex",
            color: "#F0F2E5",
            fontSize: 32,
            fontFamily: "monospace",
            letterSpacing: 2,
          }}
        >
          We write the scripts that run your ideas.
        </div>
      </div>
    ),
    size,
  );
}
