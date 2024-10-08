import { notFound } from "next/navigation"
import { ToolForm } from "~/app/(dashboard)/tools/_components/tool-form"
import { getAlternatives, getCategories, getToolById } from "~/app/(dashboard)/tools/_lib/queries"
import { H3 } from "~/components/ui/heading"

export default async function UpdateToolPage({ params }: { params: { id: string } }) {
  const [tool, alternatives, categories] = await Promise.all([
    getToolById(params.id),
    getAlternatives(),
    getCategories(),
  ])

  if (!tool) {
    return notFound()
  }

  return (
    <>
      <H3>Update tool</H3>

      <ToolForm tool={tool} alternatives={alternatives} categories={categories} className="mt-4" />
    </>
  )
}
