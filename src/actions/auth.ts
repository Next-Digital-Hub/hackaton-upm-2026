"use server";

import { signIn } from "@/lib/auth";
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

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { success: false, error: "Email o contraseña incorrectos" };
      }
      return { success: false, error: "Error de autenticación" };
    }
    throw error;
  }

  return { success: true };
}
