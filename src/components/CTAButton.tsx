// Botão primário: laranja da marca com texto branco (decisão do dono).
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
  primary:
    "bg-terra-600 text-white hover:bg-terra-700 active:bg-terra-800 shadow-sm shadow-terra-900/10 focus-visible:outline-terra-800",
  secondary:
    "bg-white text-terra-800 border border-terra-200 hover:bg-terra-50 focus-visible:outline-terra-800",
  // Sobre fundo escuro/foto: o véu night-900/30 garante texto branco ≥ 4,5:1.
  ghost:
    "bg-night-900/30 text-white border border-white/50 hover:bg-white/20 focus-visible:outline-terra-300",
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
