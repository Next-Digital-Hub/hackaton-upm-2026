import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/features/sign-out-button";

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
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <h1 className="text-lg font-semibold">
            MeteoAlert <span className="text-xs text-orange-600">Admin</span>
          </h1>
          <nav className="flex items-center gap-4">
            <a href="/admin" className="text-sm hover:underline">
              Dashboard
            </a>
            <a href="/admin/alerts" className="text-sm hover:underline">
              Alertas
            </a>
            <a
              href="/admin/history/weather"
              className="text-sm hover:underline"
            >
              Historial
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{session.user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4">{children}</main>
    </div>
  );
}
