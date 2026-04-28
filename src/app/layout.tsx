import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Johana Matta — Makeup Artistry | San Pedro Sula, Honduras",
  description:
    "Johana Matta, maquillista profesional en San Pedro Sula, Honduras. Especialista en maquillaje nupcial, eventos sociales, graduaciones y consultoría de imagen. Más de 15 años de experiencia.",
  keywords: [
    "maquillista San Pedro Sula",
    "maquillista Honduras",
    "makeup artist Honduras",
    "maquillaje nupcial San Pedro Sula",
    "maquillaje de novia Honduras",
    "maquillaje graduación San Pedro Sula",
    "maquillaje para eventos Honduras",
    "Johana Matta",
    "Makeup Artistry Honduras",
    "maquillista profesional",
    "maquillaje a domicilio San Pedro Sula",
    "consultoría de imagen Honduras",
  ],
  icons: {
    shortcut: "/images/Johana Matta Logo 2018-01.png",
    apple: "/images/Johana Matta Logo 2018-01.png",
  },
  openGraph: {
    title: "Johana Matta — Makeup Artistry | San Pedro Sula",
    description: "Maquillista profesional en San Pedro Sula, Honduras. Nupcial, eventos y consultoría de imagen.",
    type: "website",
    locale: "es_HN",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Johana Matta — Makeup Artistry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Johana Matta — Makeup Artistry",
    description: "Maquillista profesional en San Pedro Sula, Honduras.",
    images: ["/images/hero.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "Johana Matta Makeup Artistry",
  description:
    "Maquillista profesional especializada en maquillaje nupcial, eventos sociales y consultoría de imagen en San Pedro Sula, Honduras.",
  url: "https://johanamatta.com",
  telephone: "+50431705489",
  email: "johanamatta.mkt@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Pedro Sula",
    addressRegion: "Cortés",
    addressCountry: "HN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 15.514029607303831,
    longitude: -88.03959877927751,
  },
  sameAs: ["https://instagram.com/johanamattamakeup"],
  priceRange: "$$",
  image: "https://johanamatta.com/images/hero.jpg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={outfit.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
