import type { Metadata, Viewport } from "next"
import { SessionProvider } from "next-auth/react"
import type { PropsWithChildren } from "react"
import { Toaster } from "~/components/ui/toaster"
import { siteConfig } from "~/config/site"
import { env } from "~/env"
import { auth } from "~/services/auth"
import { cx } from "~/utils/cva"
import { fontMono, fontSans } from "~/utils/fonts"

import "./styles.css"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
}

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await auth()

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body
          className={cx(
            "flex flex-col min-h-screen w-full font-sans antialiased",
            fontSans.variable,
            fontMono.variable,
          )}
        >
          {children}
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  )
}
