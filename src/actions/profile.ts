"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { profileSchema } from "@/lib/validations";
import type { ActionResult } from "@/actions/auth";

export async function updateProfileAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "No autenticado" };
  }

  const raw = {
    name: formData.get("name"),
    province: formData.get("province"),
    housingType: formData.get("housingType"),
    specialNeeds: formData.getAll("specialNeeds"),
    phone: formData.get("phone") || undefined,
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos no válidos";
    return { success: false, error: firstError };
  }

  const { name, province, housingType, specialNeeds, phone } = parsed.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      province,
      housingType: housingType as "BASEMENT" | "GROUND_FLOOR" | "HIGH_FLOOR" | "COUNTRY_HOUSE",
      specialNeeds: specialNeeds as ("WHEELCHAIR" | "DEPENDENT" | "PETS")[],
      phone: phone ?? null,
    },
  });

  return { success: true };
}
