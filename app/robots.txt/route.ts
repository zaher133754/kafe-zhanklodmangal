import { site } from "@/lib/site";

export const dynamic = "force-static";

const robotsTxt = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /api/",
  "",
  "User-agent: Yandex",
  "Allow: /",
  "Disallow: /api/",
  "Clean-param: ysclid&utm_source&utm_medium&utm_campaign&utm_term&utm_content&gclid /",
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
