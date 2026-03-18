"use server";

import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import type { ActionResult } from "@/actions/auth";

export async function registerAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    province: formData.get("province"),
    housingType: formData.get("housingType"),
    specialNeeds: formData.getAll("specialNeeds"),
    phone: formData.get("phone") || undefined,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos no válidos";
    return { success: false, error: firstError };
  }

  const { name, email, password, province, housingType, specialNeeds, phone } =
    parsed.data;

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "Ya existe una cuenta con ese email" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      province,
      housingType: housingType as "BASEMENT" | "GROUND_FLOOR" | "HIGH_FLOOR" | "COUNTRY_HOUSE",
      specialNeeds: specialNeeds as ("WHEELCHAIR" | "DEPENDENT" | "PETS")[],
      phone: phone ?? null,
    },
  });

  return { success: true };
}
