import type { SponsoringOne } from "~/services.server/api"
import { addUTMTracking } from "~/utils/helpers"

export const SITE_URL = import.meta.env.NEXT_PUBLIC_SITE_URL
export const SITE_EMAIL = import.meta.env.NEXT_PUBLIC_SITE_EMAIL
export const SITE_NAME = "OpenAlternative"
export const SITE_TAGLINE = "Open Source Alternatives to Popular Software"
export const SITE_DESCRIPTION =
  "OpenAlternative is a community-driven list of open source alternatives to proprietary software and applications. Discover the best tools for your needs."

export const SITE_STATS = {
  visitors: 40000,
  tools: 260,
  subscribers: 1400,
  stars: 1600,
}

export const ALPHABET = "abcdefghijklmnopqrstuvwxyz"

export const TWITTER_URL = "https://x.com/ossalternative"
export const TWITTER_AUTHOR_URL = "https://x.com/piotrkulpinski"
export const GITHUB_URL = "https://github.com/piotrkulpinski/openalternative"
export const CLIMATE_URL = "https://go.openalternative.co/climate"

export const FEATURED_ALTERNATIVES = [
  "monday",
  "notion",
  "airtable",
  "typeform",
  "teamwork",
  "todoist",
  "kissmetrics",
]

export const DAY_IN_MS = 1000 * 60 * 60 * 24
export const LATEST_TOOLS_TRESHOLD = new Date(new Date().setDate(new Date().getDate() - 7))
export const TOPICS_PER_PAGE = 150
export const SUBMISSION_POSTING_RATE = 3

export const SPONSORING_PRICE = 15
export const SPONSORING_PREMIUM_TRESHOLD = 30

export const FAMILY_LINKS = [
  {
    title: "Superstash",
    href: "https://superstash.co",
    description: "No-code directory website builder",
  },
  {
    title: "Chipmunk Theme",
    href: "https://chipmunktheme.com",
    description: "Build directory websites in WordPress",
  },
]

export const HOSTING_SPONSOR: SponsoringOne = {
  name: "Easypanel",
  description:
    "Use an intuitive interface to deploy applications, manage databases, and provision SSL certificates.",
  website: "https://easypanel.io",
  faviconUrl: "https://easypanel.io/img/favicon.ico",
}

export const BANNER_SPONSOR: SponsoringOne = {
  name: "Polar",
  description: "An open source Lemon Squeezy alternative with 20% lower fees",
  website: addUTMTracking("https://polar.sh", { source: "openalternative.co" }),
  faviconUrl: "https://s3.us-east-1.amazonaws.com/openalternative/polar/favicon.png",
}

export const JSON_HEADERS =
  import.meta.env.NODE_ENV === "development"
    ? {
        "Cache-Control": "public, max-age=3600, s-maxage=7200 stale-while-revalidate=3.154e7",
      }
    : undefined
