export const SITE_URL = import.meta.env.VITE_SITE_URL
export const SITE_EMAIL = import.meta.env.VITE_SITE_EMAIL
export const SITE_NAME = "OpenAlternative"
export const SITE_TAGLINE = "Open Source Alternatives to Popular Software"
export const SITE_DESCRIPTION =
  "OpenAlternative is a community-driven list of open source alternatives to proprietary software and applications. Discover the best tools for your needs."

export const RSS_URL = `${SITE_URL}/rss.xml`
export const TWITTER_URL = "https://twitter.com/intent/user?screen_name=ossalternative"
export const GITHUB_URL = "https://github.com/piotrkulpinski/openalternative"

export const LATEST_TOOLS_TRESHOLD = new Date(new Date().setDate(new Date().getDate() - 7))
export const TOPICS_PER_PAGE = 150

export const DAY_IN_MS = 1000 * 60 * 60 * 24

export const BASE_SPONSORING_PRICE = 12

export const JSON_HEADERS =
  import.meta.env.NODE_ENV === "development"
    ? {
        "Cache-Control": "public, max-age=3600, s-maxage=7200 stale-while-revalidate=3.154e7",
      }
    : undefined
