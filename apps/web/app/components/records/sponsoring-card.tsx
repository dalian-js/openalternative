import { Link } from "@remix-run/react"
import { ArrowUpRightIcon } from "lucide-react"
import { posthog } from "posthog-js"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, type CardProps } from "~/components/ui/card"
import { Favicon } from "~/components/ui/favicon"
import { H4 } from "~/components/ui/heading"
import { Logo } from "~/components/ui/logo"
import type { SponsoringOne } from "~/services.server/api"
import { cx } from "~/utils/cva"
import { updateUrlWithSearchParams } from "~/utils/queryString"

type SponsoringCardProps = CardProps & {
  sponsoring: SponsoringOne | null
}

export const SponsoringCard = ({ className, sponsoring, ...props }: SponsoringCardProps) => {
  return (
    <Card className={cx("group/button", className)} asChild {...props}>
      <Link
        to={
          sponsoring?.website
            ? updateUrlWithSearchParams(sponsoring.website, { ref: "openalternative" })
            : "/sponsor"
        }
        target={sponsoring?.website ? "_blank" : "_self"}
        rel={sponsoring?.website ? "noopener noreferrer" : ""}
        onClick={() => posthog.capture("sponsoring_clicked", { url: sponsoring?.website })}
      >
        <Card.Header>
          {(sponsoring?.faviconUrl || sponsoring?.website) && (
            <Favicon
              src={
                sponsoring?.faviconUrl ||
                `https://www.google.com/s2/favicons?sz=128&domain_url=${sponsoring.website}`
              }
            />
          )}

          <H4 as="h3" className="truncate">
            {sponsoring?.name || "Sponsor OpenAlternative"}
          </H4>

          {sponsoring && (
            <Badge variant="outline" className="ml-auto">
              Ad
            </Badge>
          )}
        </Card.Header>

        <Card.Description className="mb-auto line-clamp-4">
          {sponsoring?.description ||
            "Reach out to our audience of professional open source/tech enthusiasts to boost your sales."}
        </Card.Description>

        <Button
          className="w-full pointer-events-none"
          suffix={sponsoring && <ArrowUpRightIcon />}
          asChild
        >
          <span>{sponsoring ? `Visit ${sponsoring.name}` : "Become a sponsor"}</span>
        </Button>

        {!sponsoring && (
          <Logo className="absolute -bottom-1/4 -right-1/4 -z-10 size-64 opacity-[3.5%] rotate-45 pointer-events-none transition group-hover/button:rotate-[60deg]" />
        )}
      </Link>
    </Card>
  )
}
