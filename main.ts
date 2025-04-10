import { news } from "./news.ts";

Deno.serve(async (request: Request) => {
  const { pathname } = new URL(request.url);
  if (pathname === "/news") {
    return new Response(await news(), {
      headers: {
        "Content-Type": "application/rss+xml",
      },
    });
  }
  return new Response("Not Found", { status: 404 });
});
