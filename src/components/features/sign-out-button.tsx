import { signOut } from "@/lib/auth";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <button
        type="submit"
        className="cursor-pointer text-sm text-gray-500 hover:text-gray-900 hover:underline"
      >
        Cerrar sesión
      </button>
    </form>
  );
}
