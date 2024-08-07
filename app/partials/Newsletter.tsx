import { useFetcher, useLocation } from "@remix-run/react"
import { type ComponentProps, type HTMLAttributes, useEffect, useId } from "react"
import type { action } from "~/routes/api.subscribe"
import { Button } from "~/components/Button"
import { H5 } from "~/components/Heading"
import { Series } from "~/components/Series"
import { Input } from "~/components/forms/Input"
import { cx } from "~/utils/cva"
import { posthog } from "posthog-js"

type NewsletterProps = HTMLAttributes<HTMLElement> & {
  title?: string
  description?: string
  note?: string
  placeholder?: string
  size?: ComponentProps<typeof Input>["size"]
  buttonVariant?: ComponentProps<typeof Button>["variant"]
}

export const Newsletter = ({
  title,
  description,
  note,
  placeholder = "Enter your email...",
  size = "sm",
  buttonVariant,
  ...props
}: NewsletterProps) => {
  const id = useId()
  const { key } = useLocation()
  const { data, state, Form } = useFetcher<typeof action>({ key: `${id}-${key}` })

  useEffect(() => {
    data?.type === "success" && posthog.capture("subscribed")
  }, [data])

  return (
    <Series size="lg" direction="column" asChild>
      <section {...props}>
        {title && (
          <H5 as="strong" className="font-medium">
            {title}
          </H5>
        )}

        {description && <p className="-mt-2 text-sm text-muted">{description}</p>}

        {data?.type !== "success" && (
          <>
            <Form
              method="POST"
              action="/api/subscribe"
              className={cx("relative w-full", size === "sm" ? "max-w-64" : "max-w-96")}
              noValidate
            >
              <Input
                type="email"
                name="email"
                placeholder={placeholder}
                data-1p-ignore
                required
                size={size}
                className={size === "sm" ? "pr-24" : "pr-28"}
              />

              <Button
                size={size}
                variant={buttonVariant}
                isPending={state !== "idle"}
                className={cx(
                  "absolute inset-y-1 right-1",
                  size === "md" && "text-sm/tight min-w-24",
                )}
              >
                Subscribe
              </Button>
            </Form>

            {note && data?.type !== "error" && (
              <p className="-mt-1 px-1 text-xs text-muted">{note}</p>
            )}
          </>
        )}

        {data?.type === "error" && (
          <p className="-mt-1 text-xs text-red-600">{data.error.email?._errors[0]}</p>
        )}

        {data?.type === "success" && <p className="text-sm text-green-600">{data.message}</p>}
      </section>
    </Series>
  )
}
