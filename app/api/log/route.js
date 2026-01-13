export async function GET(request) {
  try {
    const url = new URL(request.url);
    const fetchData = url.searchParams.get("fetch");

    if (fetchData) {
      const decodedData = decodeURIComponent(fetchData);

      // Try parsing JSON
      try {
        const parsedData = JSON.parse(decodedData);
      } catch (err) {}
    } else {
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "error", message: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
