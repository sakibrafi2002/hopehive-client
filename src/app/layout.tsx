import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { headers } from "next/headers";
import { Footer } from "@/components/Footer";
import { Navbar, type NavbarUser } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { auth } from "@/lib/auth";
import { SITE, THEME_KEY, THEMES } from "@/lib/constants";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Runs before the first paint so a dark-mode visitor never sees a flash of the light theme.
const themeScript = `(function(){try{var k=${JSON.stringify(THEME_KEY)};var l=${JSON.stringify(THEMES.light)};var d=${JSON.stringify(
  THEMES.dark,
)};var t=localStorage.getItem(k);if(t!==l&&t!==d){t=window.matchMedia("(prefers-color-scheme: dark)").matches?d:l}document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme",${JSON.stringify(
  THEMES.light,
)})}})();`;

async function getInitialUser(): Promise<NavbarUser | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return null;
    return { name: session.user.name, email: session.user.email, image: session.user.image ?? null };
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialUser = await getInitialUser();

  return (
    <html
      lang="en"
      data-theme={THEMES.light}
      suppressHydrationWarning
      className={`${fraunces.variable} ${jakarta.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="flex min-h-screen flex-col">
          <Navbar initialUser={initialUser} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Providers />
      </body>
    </html>
  );
}
