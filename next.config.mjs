const isProd = process.env.NODE_ENV === "production";

// CSP entregue em modo Report-Only: o dono valida em `next start` (console e
// aba Network) e depois promove para `Content-Security-Policy`.
// 'unsafe-inline' em script-src é necessário hoje (bootstrap do Next e o
// snippet inline do gtag em layout.tsx); migrar para nonce exigiria render
// dinâmico em todas as páginas.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"} https://www.googletagmanager.com https://www.google-analytics.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com https://*.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://stats.g.doubleclick.net",
  // Embed do Google Maps em /fale-conosco
  "frame-src https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Ao promover para enforce, acrescentar "upgrade-insecure-requests" aqui
  // (o navegador a ignora e avisa no console em Report-Only).
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy-Report-Only", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  // Mantém window.opener em popups abertos pelo próprio site (login social
  // futuro) e isola de aberturas externas.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Mídia do Supabase Storage hoje é renderizada com <img> comum (não passa
    // pelo otimizador do next/image), então nenhum domínio remoto é liberado.
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
