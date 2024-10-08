import type { HTMLAttributes, ReactNode } from "react"
import { Heading, type HeadingProps } from "~/components/ui/heading"
import { Prose } from "~/components/ui/prose"
import { type VariantProps, cva, cx } from "~/utils/cva"

const introVariants = cva({
  base: "flex w-full flex-col gap-y-2",

  variants: {
    alignment: {
      start: "items-start text-start",
      center: "items-center text-center",
      end: "items-end text-end",
    },
  },

  defaultVariants: {
    alignment: "start",
  },
})

type IntroProps = Omit<HTMLAttributes<HTMLElement>, "title" | "prefix"> &
  VariantProps<typeof introVariants> & {
    title?: ReactNode
    description?: ReactNode
  }

const Intro = ({ children, className, alignment, title, description, ...props }: IntroProps) => {
  return (
    <div className={cx(introVariants({ alignment, className }))} {...props}>
      {title && <IntroTitle>{title}</IntroTitle>}
      {description && <IntroDescription>{description}</IntroDescription>}
      {children}
    </div>
  )
}

const IntroTitle = ({
  className,
  size = "h1",
  ...props
}: HTMLAttributes<HTMLElement> & HeadingProps) => {
  return (
    <div className={cx("relative", className)}>
      <Heading size={size} {...props} />
      <div className="absolute -bottom-2 inset-x-0 h-8 bg-gradient-to-t from-background/40 to-transparent pointer-events-none select-none" />
    </div>
  )
}

const IntroDescription = ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <Prose className={cx("max-w-2xl", className)} {...props}>
      <h2 className="!text-base !font-normal !tracking-normal !text-foreground/70 md:!text-lg">
        {children}
      </h2>
    </Prose>
  )
}

export { Intro, IntroTitle, IntroDescription }
