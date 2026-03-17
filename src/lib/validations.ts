import { z } from "zod/v4";
import { PROVINCES } from "@/config/constants";

// ─── Login ──────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.email("Email no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── Register ───────────────────────────────────────────────

export const registerSchema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.email("Email no válido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
    province: z.enum(PROVINCES as unknown as [string, ...string[]], {
      error: "Selecciona una provincia",
    }),
    housingType: z.enum(
      ["BASEMENT", "GROUND_FLOOR", "HIGH_FLOOR", "COUNTRY_HOUSE"],
      { error: "Selecciona un tipo de vivienda" }
    ),
    specialNeeds: z
      .array(z.enum(["WHEELCHAIR", "DEPENDENT", "PETS"]))
      .default([]),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// ─── Profile Update ─────────────────────────────────────────

export const profileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  province: z.enum(PROVINCES as unknown as [string, ...string[]], {
    error: "Selecciona una provincia",
  }),
  housingType: z.enum(
    ["BASEMENT", "GROUND_FLOOR", "HIGH_FLOOR", "COUNTRY_HOUSE"],
    { error: "Selecciona un tipo de vivienda" }
  ),
  specialNeeds: z
    .array(z.enum(["WHEELCHAIR", "DEPENDENT", "PETS"]))
    .default([]),
  phone: z.string().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

// ─── Alert Creation (Admin) ─────────────────────────────────

export const createAlertSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres").max(200, "El título es demasiado largo"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres").max(2000, "La descripción es demasiado larga"),
  severity: z.enum(["LOW", "MODERATE", "SEVERE", "EXTREME"], {
    error: "Selecciona un nivel de severidad",
  }),
});

export type CreateAlertInput = z.infer<typeof createAlertSchema>;
