"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isCurrent } from "@/lib/site";

export default function FooterLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={className}
      aria-current={isCurrent(pathname, href) ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
