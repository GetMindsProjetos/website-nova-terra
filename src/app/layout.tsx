import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FixedBackground from "@/components/FixedBackground";
import WhatsAppButton from "@/components/WhatsAppButton";
import SmoothScroll from "@/components/SmoothScroll";

// Pesos 400-700 (4 arquivos pré-carregados). 800 cai em 700; itálico é oblíquo sintético.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: "normal",
  display: "swap",
  variable: "--font-poppins",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f76309",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://igrejanovaterra.com.br"),
  title: {
    default: "Igreja Nova Terra | Icoaraci, Belém-PA",
    template: "%s | Igreja Nova Terra",
  },
  description:
    "A Igreja Nova Terra existe para ganhar, cuidar e capacitar vidas para o Reino de Deus, em Icoaraci, Belém-PA. Conheça as Redes, o projeto Casa Amarela e venha nos visitar.",
  formatDetection: { telephone: false },
  openGraph: {
    title: "Igreja Nova Terra",
    description:
      "Uma igreja em avivamento em Icoaraci, Belém-PA. Venha conhecer.",
    siteName: "Igreja Nova Terra",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/hero/fachada-desktop.webp",
        alt: "Fachada da Igreja Nova Terra, em Icoaraci, Belém-PA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Igreja Nova Terra",
    description:
      "Uma igreja em avivamento em Icoaraci, Belém-PA. Venha conhecer.",
    images: ["/hero/fachada-desktop.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className="flex min-h-screen flex-col bg-white font-sans text-night-900">
        <a
          href="#conteudo"
          className="sr-only rounded-md bg-night-900 px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-terra-600"
        >
          Pular para o conteúdo
        </a>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5CGBS4S5XB"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5CGBS4S5XB');
          `}
        </Script>
        <SmoothScroll />
        <FixedBackground />
        <Header />
        <main id="conteudo" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
