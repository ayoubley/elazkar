import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Amiri_Quran } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-arabic",
  display: "swap",
});

const amiriQuran = Amiri_Quran({
  subsets: ["arabic"],
  weight: ["400"],
  variable: "--font-amiri-quran",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "الأذكــار | أذكار الصباح والمساء والأدعية والقرآن الكريم",
    template: "%s | الأذكــار",
  },
  description:
    "منصة إسلامية عربية متخصصة في أذكار الصباح والمساء، أذكار النوم، الأدعية المأثورة، والقرآن الكريم بتجربة قراءة هادئة وسريعة ومريحة للعين.",
  keywords: [
    "الأذكار",
    "الأذكــار",
    "أذكار الصباح",
    "أذكار المساء",
    "أذكار النوم",
    "أدعية",
    "القرآن الكريم",
    "حصن المسلم",
  ],
  authors: [{ name: "الأذكــار" }],
  creator: "الأذكــار",
  publisher: "الأذكــار",
  metadataBase: new URL("https://alazkar.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "الأذكــار | أذكار الصباح والمساء والأدعية والقرآن الكريم",
    description:
      "منصة إسلامية عربية متخصصة في أذكار الصباح والمساء وأدعية اليوم والليلة والقرآن الكريم.",
    type: "website",
    locale: "ar_SA",
    siteName: "الأذكــار",
  },
  twitter: {
    card: "summary_large_image",
    title: "الأذكــار",
    description: "أذكار الصباح والمساء والأدعية والقرآن الكريم بتجربة قراءة هادئة ومريحة.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#041A2F" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${ibmArabic.variable} ${amiriQuran.variable}`}
    >
      <body className="min-h-screen flex flex-col font-arabic bg-site text-primary selection:bg-accent/20 selection:text-primary">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Header />
          <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
