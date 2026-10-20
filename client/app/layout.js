import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import LayoutWrapper from "./LayoutWrapper";

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair'
});

const SITE_URL = "https://www.heritage-languageschool.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sigana African Heritage Language School | Learn African Languages Online",
    template: "%s | Sigana African Heritage Language School",
  },
  description: "Preserve your heritage by learning African languages online. Expert courses in Kikuyu, Dholuo, Ekegusii, Kalenjin, Kamba, Luhya, Meru, and Maasai. Start your language journey today.",
  keywords: [
    "Sigana",
    "Sigana African Heritage Language School",
    "African languages",
    "learn Kikuyu",
    "learn Dholuo",
    "learn Ekegusii",
    "learn Kalenjin",
    "Kenyan languages",
    "heritage language",
    "indigenous language school",
    "online language school",
    "African culture",
    "language preservation",
    "endangered languages Kenya",
    "mother tongue education",
    "learn Swahili",
  ],
  authors: [{ name: "Sigana African Heritage Language School" }],
  creator: "Sigana African Heritage Language School",
  publisher: "Sigana African Heritage Language School",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Sigana African Heritage Language School",
    title: "Sigana African Heritage Language School | Learn African Languages Online",
    description: "Preserve your heritage by learning African languages online. Expert courses in Kikuyu, Dholuo, Ekegusii, Kalenjin and more.",
    images: [
      {
        url: `${SITE_URL}/assets/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Sigana African Heritage Language School - Learn African Languages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sigana African Heritage Language School | Learn African Languages Online",
    description: "Preserve your heritage by learning African languages online. Expert courses in Kikuyu, Dholuo, Ekegusii, Kalenjin and more.",
    images: [`${SITE_URL}/assets/og-image.png`],
    creator: "@heritagela42918",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "3OK6_8vGYu61Yfe1cFWQ3aWNSuoKO6r-PHTN67MMe8k",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Sigana African Heritage Language School",
    alternateName: "Sigana",
    slogan: "Dawn of Dialects",
    description: "Kenyan-registered social enterprise preserving, documenting and teaching the indigenous and endangered languages of Kenya, East Africa and the African continent.",
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logo.png`,
    sameAs: [
      "https://www.facebook.com/share/18oGJu72nf/",
      "https://x.com/heritagela42918",
      "https://www.instagram.com/heritage_language_school",
      "https://www.tiktok.com/@heritage.languages",
      "https://www.youtube.com/@HeritageLanguageSchool",
      "https://www.linkedin.com/company/heritage-language-school/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+254746426925",
      contactType: "customer service",
      email: "heritagelanguageschool@gmail.com",
      availableLanguage: ["English", "Swahili"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "KE",
    },
    offers: {
      "@type": "Offer",
      category: "Language Courses",
      description: "Online courses in African languages including Kikuyu, Dholuo, Ekegusii, Kalenjin",
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={SITE_URL} />
        <meta name="theme-color" content="#854836" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/assets/logo.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-M7BHSRPK');`
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${playfair.variable} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M7BHSRPK"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`
          }}
        />
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
