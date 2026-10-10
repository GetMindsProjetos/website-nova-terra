// Botões em vidro, sem borda. Primário: laranja da marca com texto branco
// (decisão do dono); secundário: vidro branco com texto terra-800.
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  className?: string;
};

const variants: Record<NonNullable<Props["variant"]>, string> = {
  primary: "btn-glass-accent text-white focus-visible:outline-night-900",
  secondary: "btn-glass text-terra-800 focus-visible:outline-night-900",
  // Sobre fundo escuro/foto: o véu night-900/30 garante texto branco ≥ 4,5:1.
  ghost:
    "bg-night-900/30 text-white backdrop-blur-sm hover:bg-night-900/45 focus-visible:outline-terra-300",
};

export default function CTAButton({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: Props) {
  const classes = `inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
