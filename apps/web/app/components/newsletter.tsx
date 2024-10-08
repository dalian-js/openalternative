import { useFetcher, useLocation } from "@remix-run/react"
import { type ComponentProps, type HTMLAttributes, useId } from "react"
import { Button } from "~/components/ui/button"
import { ErrorMessage } from "~/components/ui/forms/error-message"
import { Input } from "~/components/ui/forms/input"
import { H5 } from "~/components/ui/heading"
import { Stack } from "~/components/ui/stack"
import type { action } from "~/routes/api.subscribe"
import { cx } from "~/utils/cva"

type ButtonProps = ComponentProps<typeof Button>
type InputProps = ComponentProps<typeof Input>

type NewsletterProps = HTMLAttributes<HTMLElement> & {
  title?: string
  description?: string
  medium?: string
  placeholder?: string
  size?: InputProps["size"]
  buttonProps?: ButtonProps
}

export const Newsletter = ({
  children,
  title,
  description,
  medium = "subscribe_form",
  placeholder = "Your email here...",
  size = "md",
  buttonProps = { size: "sm", children: "Subscribe" },
  ...props
}: NewsletterProps) => {
  const id = useId()
  const { key } = useLocation()
  const { data, state, Form } = useFetcher<typeof action>({ key: `${id}-${key}` })
  const isLargeSize = size === "lg"

  return (
    <Stack
      size="lg"
      direction="column"
      className={cx("items-stretch", isLargeSize ? "max-w-96" : "max-w-64")}
      asChild
    >
      <section {...props}>
        {title && (
          <H5 as="strong" className="px-0.5 font-medium">
            {title}
          </H5>
        )}

        {description && <p className="-mt-2 px-0.5 text-sm text-muted first:mt-0">{description}</p>}

        {data?.type !== "success" && (
          <Form method="POST" action="/api/subscribe" className={cx("relative w-full")} noValidate>
            <input type="hidden" name="utm_medium" value={medium} />

            <Input
              type="email"
              name="email"
              placeholder={placeholder}
              data-1p-ignore
              required
              size={size}
              className={isLargeSize ? "pr-28" : "pr-24"}
            />

            <Button
              isPending={state !== "idle"}
              className={cx("absolute inset-y-1 right-1", isLargeSize && "text-sm/tight min-w-24")}
              {...buttonProps}
            />
          </Form>
        )}

        {data?.type === "error" && (
          <>
            <ErrorMessage errors={data.error.formErrors} className="-mt-1" />

            {Object.values(data.error.fieldErrors).map((errors, index) => (
              <ErrorMessage key={index} errors={errors} className="-mt-1" />
            ))}
          </>
        )}

        {data?.type === "success" && <p className="text-sm text-green-600">{data.message}</p>}

        {children}
      </section>
    </Stack>
  )
}
