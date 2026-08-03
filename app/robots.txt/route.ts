import { site } from "@/lib/site";

export const dynamic = "force-static";

const robotsTxt = [
  "User-agent: *",
  "Allow: /",
  "",
  "User-agent: Yandex",
  "Allow: /",
  "Clean-param: ysclid /",
  "",
  `Sitemap: ${site.url}/sitemap.xml`,
  ""
].join("\n");

export function GET() {
  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
