import type { Metadata } from "next";
import { Navigation } from "../src/components/Navigation";
import { Footer } from "../src/components/Footer";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://gyoichii.github.io"),
  title: {
    default: "Weihan Chen — Gameplay / Software Engineer",
    template: "%s — Weihan Chen",
  },
  description:
    "Gameplay systems, procedural environments, and software. Selected work by Weihan Chen in C++, Unreal Engine 5, Python, and FastAPI.",
  icons: { icon: "/favicon.png" },
  openGraph: {
    type: "website",
    title: "Weihan Chen — Gameplay / Software Engineer",
    description: "Gameplay systems, procedural environments, and software.",
    siteName: "Weihan Chen",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Weihan Chen — Gameplay / Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Weihan Chen — Gameplay / Software Engineer",
    description: "Gameplay systems. Procedural environments. Software.",
    images: ["/og.png"],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body id="top">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
