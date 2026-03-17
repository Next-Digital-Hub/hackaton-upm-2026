import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/features/sign-out-button";
import { MobileNav } from "@/components/features/mobile-nav";
import { SkipNav } from "@/components/features/skip-nav";

const citizenNavItems = [
  { href: "/dashboard", label: "Dashboard" },
  {
    label: "Historial",
    links: [
      { href: "/history/weather", label: "Meteorológico" },
      { href: "/history/llm", label: "Consultas IA" },
      { href: "/history/alerts", label: "Alertas" },
    ],
  },
  { href: "/profile", label: "Perfil" },
];

export default async function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SkipNav />
      <header className="relative border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/dashboard" className="text-lg font-semibold">
            MeteoAlert
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-4 md:flex" aria-label="Navegación principal">
            <Link href="/dashboard" className="text-sm hover:underline">
              Dashboard
            </Link>
            <div className="group relative">
              <span className="cursor-default text-sm hover:underline" role="button" tabIndex={0} aria-haspopup="true">
                Historial ▾
              </span>
              <div className="invisible absolute left-0 top-full z-50 mt-1 w-48 rounded-md border bg-white py-1 shadow-lg group-hover:visible group-focus-within:visible">
                <Link
                  href="/history/weather"
                  className="block px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Meteorológico
                </Link>
                <Link
                  href="/history/llm"
                  className="block px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Consultas IA
                </Link>
                <Link
                  href="/history/alerts"
                  className="block px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Alertas
                </Link>
              </div>
            </div>
            <Link href="/profile" className="text-sm hover:underline">
              Perfil
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-500 sm:inline">{session.user.email}</span>
            <SignOutButton />
            <MobileNav items={citizenNavItems} />
          </div>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-7xl p-4">{children}</main>
    </div>
  );
}
