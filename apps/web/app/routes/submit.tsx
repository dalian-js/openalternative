import { Prisma } from "@prisma/client"
import {
  type ActionFunctionArgs,
  type MetaFunction,
  type TypedResponse,
  json,
} from "@remix-run/node"
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react"
import slugify from "@sindresorhus/slugify"
import { ArrowBigUpDashIcon } from "lucide-react"
import { z } from "zod"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { Checkbox } from "~/components/ui/forms/checkbox"
import { ErrorMessage } from "~/components/ui/forms/error-message"
import { Input } from "~/components/ui/forms/input"
import { Label } from "~/components/ui/forms/label"
import { Intro } from "~/components/ui/intro"
import { Prose } from "~/components/ui/prose"
import { Section } from "~/components/ui/section"
import { subscribeToBeehiiv } from "~/services.server/beehiiv"
import { prisma } from "~/services.server/prisma"
import { SITE_EMAIL, SITE_NAME, SUBMISSION_POSTING_RATE } from "~/utils/constants"
import { isRealEmail } from "~/utils/email"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: () => <BreadcrumbsLink to="/submit" label="Submit" />,
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
  const queueLength = await prisma.tool.count({
    where: { OR: [{ publishedAt: { gt: new Date() } }, { publishedAt: null }] },
  })

  const meta = {
    title: "Submit your Open Source Software",
    description: `Help us grow the list of open source alternatives to proprietary software. Contribute to ${SITE_NAME} by submitting a new open source alternative.`,
  }

  return json({ queueLength, meta })
}

const schema = z.object({
  submitterName: z.string().min(1, "Your name is required"),
  submitterEmail: z
    .string()
    .min(1, "Your email is required")
    .email("Invalid email address, please use a correct format.")
    .refine(isRealEmail, "Invalid email address, please use a real one."),
  submitterNote: z.string().max(200),
  name: z.string().min(1, "Name is required"),
  website: z.string().min(1, "Website is required").url(),
  repository: z
    .string()
    .min(1, "Repository is required")
    .url()
    .refine(
      url => /^https:\/\/github\.com\/([^/]+)\/([^/]+)(\/)?$/.test(url),
      "The repository must be a valid GitHub URL with owner and repo name.",
    ),
  newsletterOptIn: z.coerce.boolean().default(true),
})

type SubmitError = z.inferFlattenedErrors<typeof schema>

export type ActionState = TypedResponse<
  { type: "error"; error: SubmitError } | { type: "success"; toolName: string }
>

export const action = async ({ request }: ActionFunctionArgs): Promise<ActionState> => {
  const data = await request.formData()
  const parsed = await schema.safeParseAsync(Object.fromEntries(data.entries()))

  if (!parsed.success) {
    return json({ type: "error", error: parsed.error.flatten() })
  }

  // Destructure the parsed data
  const {
    name,
    website,
    repository,
    submitterName,
    submitterEmail,
    submitterNote,
    newsletterOptIn,
  } = parsed.data

  // Generate a slug
  const slug = slugify(name, { decamelize: false })

  // Save the tool to the database
  try {
    const tool = await prisma.tool.create({
      data: {
        name,
        slug,
        website,
        repository,
        submitterName,
        submitterEmail,
        submitterNote,
      },
    })

    if (newsletterOptIn) {
      try {
        const newsletterFormData = new FormData()
        newsletterFormData.append("email", submitterEmail)
        newsletterFormData.append("utm_medium", "submit_form")

        // Subscribe to the newsletter
        await subscribeToBeehiiv(newsletterFormData)
      } catch {}
    }

    // Return a success response with the tool name
    return json({
      type: "success",
      toolName: tool.name,
    })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta?.target) {
      const schemaKeys = Object.keys(schema.shape)
      const name = (e.meta?.target as string[]).find(t => schemaKeys.includes(t)) || "name"

      if (name && e.code === "P2002") {
        return json({
          type: "error",
          error: { formErrors: [`That ${name} has already been submitted.`], fieldErrors: {} },
        })
      }
    }

    throw e
  }
}

export default function SubmitPage() {
  const { formMethod, state } = useNavigation()
  const { queueLength, meta } = useLoaderData<typeof loader>()
  const data = useActionData<typeof action>()

  const params =
    data?.type === "success"
      ? new URLSearchParams({
          subject: `Expedite submission of ${data.toolName} — ${SITE_NAME}`,
          body: `Hi Team,\n\nI have recently submitted ${data.toolName} on ${SITE_NAME}.\n\nIs there a way to expedite the submission process?\n\nThanks!`,
        })
      : undefined

  return (
    <>
      <Intro {...meta} />

      <Section>
        {data?.type !== "success" && (
          <>
            <Section.Content>
              <Form
                method="POST"
                className="grid-auto-fill-sm grid gap-6 w-full max-w-2xl"
                noValidate
              >
                <div className="flex flex-col gap-1">
                  <Label htmlFor="submitterName" isRequired>
                    Your Name:
                  </Label>

                  <Input
                    type="text"
                    name="submitterName"
                    id="submitterName"
                    size="lg"
                    placeholder="John Doe"
                    data-1p-ignore
                    required
                  />

                  <ErrorMessage errors={data?.error.fieldErrors.submitterName} />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="submitterEmail" isRequired>
                    Your Email:
                  </Label>

                  <Input
                    type="url"
                    name="submitterEmail"
                    id="submitterEmail"
                    size="lg"
                    placeholder="john@doe.com"
                    required
                  />

                  <ErrorMessage errors={data?.error.fieldErrors.submitterEmail} />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="name" isRequired>
                    Name:
                  </Label>

                  <Input
                    type="text"
                    name="name"
                    id="name"
                    size="lg"
                    placeholder="PostHog"
                    data-1p-ignore
                    required
                  />
                  <ErrorMessage errors={data?.error.fieldErrors.name} />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="website" isRequired>
                    Website:
                  </Label>

                  <Input
                    type="url"
                    name="website"
                    id="website"
                    size="lg"
                    placeholder="https://posthog.com"
                    required
                  />

                  <ErrorMessage errors={data?.error.fieldErrors.website} />
                </div>

                <div className="col-span-full flex flex-col gap-1">
                  <Label htmlFor="repository" isRequired>
                    Repository:
                  </Label>

                  <Input
                    type="url"
                    name="repository"
                    id="repository"
                    size="lg"
                    placeholder="https://github.com/posthog/posthog"
                    required
                  />

                  <ErrorMessage errors={data?.error.fieldErrors.repository} />
                </div>

                <div className="col-span-full flex flex-col gap-1">
                  <Label htmlFor="submitterNote">Suggest an alternative:</Label>

                  <Input
                    name="submitterNote"
                    id="submitterNote"
                    size="lg"
                    placeholder="Which well-known tool is this an alternative to?"
                  />

                  <ErrorMessage errors={data?.error.fieldErrors.submitterNote} />
                </div>

                <div className="col-span-full flex items-center gap-2">
                  <Checkbox name="newsletterOptIn" id="newsletterOptIn" defaultChecked={true} />

                  <Label htmlFor="newsletterOptIn" className="text-sm font-normal">
                    I'd like to receive free email updates
                  </Label>

                  <ErrorMessage errors={data?.error.fieldErrors.newsletterOptIn} />
                </div>

                <div>
                  <Button
                    isPending={state !== "idle" && formMethod === "POST"}
                    className="min-w-32"
                  >
                    Submit
                  </Button>
                </div>

                <ErrorMessage errors={data?.error.formErrors} className="col-span-full" />
              </Form>
            </Section.Content>

            <Section.Sidebar>
              <Card>
                <Prose className="text-sm/normal">
                  <p>
                    <strong>Note:</strong> Submission alone does not guarantee a feature. Please
                    make sure the software you're submitting is:
                  </p>

                  <ul className="[&_li]:p-0 list-inside p-0">
                    <li>Open source</li>
                    <li>Free to use or can be self-hosted</li>
                    <li>Actively maintained</li>
                    <li>
                      An <Link to="/alternatives">alternative to proprietary software</Link>
                    </li>
                  </ul>
                </Prose>
              </Card>
            </Section.Sidebar>
          </>
        )}

        {data?.type === "success" && (
          <Section.Content>
            <Prose>
              <p>
                <strong>Thank you for submitting! We'll review your tool soon.</strong>
              </p>

              <p>
                <strong>Note:</strong> There are currently {queueLength} submissions in the queue.
                Considering our current posting rate, it may take up to{" "}
                {Math.ceil(queueLength / SUBMISSION_POSTING_RATE)} weeks to publish your submission.
              </p>

              <Button size="lg" className="not-prose mt-2" suffix={<ArrowBigUpDashIcon />} asChild>
                <a
                  href={`mailto:${SITE_EMAIL}?${params?.toString()}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Expedite submission of {data.toolName}
                </a>
              </Button>
            </Prose>
          </Section.Content>
        )}
      </Section>
    </>
  )
}
