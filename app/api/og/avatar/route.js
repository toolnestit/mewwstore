import { ImageResponse } from "@vercel/og";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("q") || "U";
  const letter = email[0].toUpperCase();

  function randomColor() {
    const colors = [
      "#EF4444",
      "#F59E0B",
      "#10B981",
      "#3B82F6",
      "#6366F1",
      "#8B5CF6",
      "#EC4899",
      "#14B8A6",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const bg = randomColor();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 170,
          fontWeight: "extrabold",
          color: "white",
          background: bg,
        }}
      >
        {letter}
      </div>
    ),
    {
      width: 300,
      height: 300,
    }
  );
}
