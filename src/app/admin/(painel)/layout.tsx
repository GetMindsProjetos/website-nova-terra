import type { ReactNode } from "react";
import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import Sidebar from "@/components/admin/Sidebar";

export const metadata = {
  title: "Painel Admin | Igreja Nova Terra",
  robots: { index: false, follow: false },
};

export default function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[rgb(255_251_249)]">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-terra-100 bg-white px-6 py-4">
        <Link
          href="/admin"
          className="font-serif text-lg font-semibold text-night-900"
        >
          Painel Nova Terra
        </Link>
        <LogoutButton />
      </header>
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 sm:flex-row">
        <Sidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </main>
    </div>
  );
}
