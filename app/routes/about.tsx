import { type MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Featured } from "~/partials/Featured"
import { Intro } from "~/components/Intro"
import { Markdown } from "~/components/Markdown"
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: () => <BreadcrumbsLink to="/about" label="About Us" />,
}

export const meta: MetaFunction<typeof loader> = ({ matches, data, location }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    location,
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = () => {
  const meta = {
    title: "About Us",
    description: `${SITE_NAME} is a community driven list of open source alternatives to proprietary software and applications.`,
  }

  return json({ meta })
}

export default function AboutPage() {
  const { meta } = useLoaderData<typeof loader>()

  const content = `
  ## What is OpenAlternative?

  [OpenAlternative](${SITE_URL} "${SITE_TAGLINE}") is a community driven list of open source alternatives to proprietary software and applications. The goal of the site is to be your first stop when researching for a new open source service to help you grow your business. It will help you find alternatives and reviews of the products you already use.

  ## How did OpenAlternative get started?

  The project started as a weekend project to learn a new technology and try something new and fun from scratch. It gained a lot of traction early on ([100k unique visitors](https://kulp.in/launch) in one week, [#1 on Hacker News](https://news.ycombinator.com/item?id=39639386)) so it was clear that there was a need for a site like this.

  I’ve always been a fan of open source software and I’ve always wanted to contribute to the community in some way. I thought that creating a list of open source alternatives to proprietary software and applications would be a great way to give back to the community.

  ## Tools Used

  * [Remix](https://remix.run) – Web framework
  * [GitHub](https://github.com) – Repository data
  * [Airtable](https://kulp.in/airtable) – Database
  * [Screen Studio](https://kulp.in/screenstudio) – Screen recording for marketing videos
  * [Typefully](https://kulp.in/typefully) – Twitter scheduling/analytics
  * [ScreenshotOne](https://kulp.in/screenshotone) – Generating website screenshots

  ## Contribute

  If you have any suggestions for open source alternatives to proprietary software and applications, feel free to contribute to the list. You can also contribute by suggesting new categories or improving the website. The source code is available on [GitHub](https://github.com/piotrkulpinski/openalternative).

  Enjoy and feel free to contribute!

  ## About the Author

  I’m a software developer and entrepreneur. I’ve been building web applications for over 15 years. I’m passionate about open source software and I love to contribute to the community in any way I can.

  Some of my other projects:

  * [Chipmunk Theme](https://chipmunktheme.com/?utm_source=Chipmunk+Theme&utm_medium=web&utm_campaign=Family "Build directory websites in WordPress") – WordPress theme for building directory websites
  * [Superstash](https://superstash.co/?utm_source=Chipmunk+Theme&utm_medium=web&utm_campaign=Family "No-code directory website builder") – No-code directory website builder

  I’m always looking for new projects to work on and new people to collaborate with. Feel free to reach out to me if you have any questions or suggestions.

  – [Piotr Kulpinski](https://x.com/piotrkulpinski)
  `

  return (
    <>
      <Intro {...meta} />
      <Featured />
      <Markdown>{content}</Markdown>
    </>
  )
}
