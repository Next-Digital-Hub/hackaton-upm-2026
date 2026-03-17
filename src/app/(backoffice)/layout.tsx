import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/features/sign-out-button";
import { MobileNav } from "@/components/features/mobile-nav";
import { SkipNav } from "@/components/features/skip-nav";

const adminNavItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/alerts", label: "Alertas" },
  {
    label: "Historial",
    links: [
      { href: "/admin/history/weather", label: "Meteorológico" },
      { href: "/admin/history/llm", label: "Consultas IA" },
      { href: "/admin/history/alerts", label: "Alertas" },
    ],
  },
];

export default async function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SkipNav />
      <header className="relative border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/admin" className="text-lg font-semibold">
            MeteoAlert <span className="text-xs text-orange-600">Admin</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-4 md:flex" aria-label="Navegación de administración">
            <Link href="/admin" className="text-sm hover:underline">
              Dashboard
            </Link>
            <Link href="/admin/alerts" className="text-sm hover:underline">
              Alertas
            </Link>
            <div className="group relative">
              <span className="cursor-default text-sm hover:underline" role="button" tabIndex={0} aria-haspopup="true">
                Historial ▾
              </span>
              <div className="invisible absolute left-0 top-full z-50 mt-1 w-48 rounded-md border bg-white py-1 shadow-lg group-hover:visible group-focus-within:visible">
                <Link
                  href="/admin/history/weather"
                  className="block px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Meteorológico
                </Link>
                <Link
                  href="/admin/history/llm"
                  className="block px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Consultas IA
                </Link>
                <Link
                  href="/admin/history/alerts"
                  className="block px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Alertas
                </Link>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-500 sm:inline">{session.user.email}</span>
            <SignOutButton />
            <MobileNav items={adminNavItems} />
          </div>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-7xl p-4">{children}</main>
    </div>
  );
}
