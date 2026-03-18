"use server";

import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validations";
import { AuthError } from "next-auth";

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function loginAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos no válidos";
    return { success: false, error: firstError };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { role: true },
  });

  const redirectTo = user?.role === "ADMIN" ? "/admin" : "/dashboard";

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      console.error("[loginAction] AuthError type:", error.type);
      console.error("[loginAction] AuthError cause:", error.cause);
      console.error("[loginAction] AuthError message:", error.message);
      console.error("[loginAction] AuthError stack:", error.stack);
      if (error.type === "CredentialsSignin") {
        return { success: false, error: "Email o contraseña incorrectos" };
      }
      return { success: false, error: "Error de autenticación" };
    }
    // NEXT_REDIRECT throws an error that must be re-thrown
    throw error;
  }

  return { success: true };
}
