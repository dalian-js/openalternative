import { type MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { ToolRecord } from "~/components/records/tool-record"
import { BackButton } from "~/components/ui/back-button"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"
import { Grid } from "~/components/ui/grid"
import { Intro } from "~/components/ui/intro"
import { toolManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: () => <BreadcrumbsLink to="/latest" label="Latest" />,
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

export const loader = async () => {
  const tools = await prisma.tool.findMany({
    where: { publishedAt: { lte: new Date() } },
    orderBy: { publishedAt: "desc" },
    include: toolManyPayload,
    take: 36,
  })

  const meta = {
    title: "Recently added Open Source Software",
    description:
      "A collection of the latest open source tools added to the directory. Browse and discover new tools to use in your projects.",
  }

  return json({ meta, tools }, { headers: JSON_HEADERS })
}

export default function CategoriesPage() {
  const { meta, tools } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />

      <Grid>
        {tools.map(tool => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}

        {!tools?.length && <p className="col-span-full">No recent Open Source software found.</p>}
      </Grid>

      <BackButton to="/categories" />
    </>
  )
}
