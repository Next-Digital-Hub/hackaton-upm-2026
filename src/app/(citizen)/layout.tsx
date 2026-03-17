import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/features/sign-out-button";

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
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <h1 className="text-lg font-semibold">MeteoAlert</h1>
          <nav className="flex items-center gap-4">
            <a href="/dashboard" className="text-sm hover:underline">
              Dashboard
            </a>
            <a href="/history/weather" className="text-sm hover:underline">
              Historial
            </a>
            <a href="/profile" className="text-sm hover:underline">
              Perfil
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
