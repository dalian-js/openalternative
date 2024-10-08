import { prisma } from "~/services.server/prisma"
import { SITE_NAME, SITE_TAGLINE } from "~/utils/constants"
import { addUTMTracking } from "~/utils/helpers"

export const loader = async () => {
  const url = import.meta.env.NEXT_PUBLIC_SITE_URL ?? ""

  const tools = await prisma.tool.findMany({
    where: { publishedAt: { lte: new Date() } },
    orderBy: { publishedAt: "desc" },
    select: { id: true, name: true, slug: true, description: true, publishedAt: true },
    take: 50,
  })

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${SITE_NAME}</title>
      <description>${SITE_TAGLINE}</description>
      <link>${addUTMTracking(url, { source: "rss" })}</link>
      <language>en-us</language>
      <ttl>60</ttl>
      <atom:link href="${url}/rss.xml" rel="self" type="application/rss+xml" />
      ${tools
        .map(
          tool => `
      <item>
        <title><![CDATA[${tool.name}]]></title>
        <description><![CDATA[${tool.description}]]></description>
        <pubDate>${tool.publishedAt?.toUTCString()}</pubDate>
        <link>${addUTMTracking(`${url}/${tool.slug}`, { source: "rss" })}</link>
        <guid isPermaLink="false">${tool.id}</guid>
      </item>`,
        )
        .join("\n")}
    </channel>
  </rss>`

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=14400",
    },
  })
}
