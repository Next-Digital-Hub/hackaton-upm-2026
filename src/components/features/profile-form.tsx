"use client";

import { useActionState, useState } from "react";
import { updateProfileAction } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { PROVINCES, HOUSING_TYPES, SPECIAL_NEEDS } from "@/config/constants";

type ProfileData = {
  name: string;
  email: string;
  province: string;
  housingType: string;
  specialNeeds: string[];
  phone?: string | null;
};

export function ProfileForm({ user }: { user: ProfileData }) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    null
  );
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(
    user.specialNeeds
  );

  function toggleNeed(need: string) {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Tu perfil</CardTitle>
        <CardDescription>
          Actualiza tus datos para recibir recomendaciones personalizadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          {state?.error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {state?.success && (
            <Alert>
              <CheckCircle2 className="size-4 text-green-600" />
              <AlertDescription>Perfil actualizado correctamente</AlertDescription>
            </Alert>
          )}

          {/* Email (read-only) */}
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email}
              disabled
              className="bg-muted"
            />
          </div>

          {/* Name */}
          <div className="grid gap-1.5">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user.name}
              required
              minLength={2}
            />
          </div>

          {/* Province */}
          <div className="grid gap-1.5">
            <Label htmlFor="province">Provincia</Label>
            <select
              id="province"
              name="province"
              required
              defaultValue={user.province}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Housing Type */}
          <div className="grid gap-1.5">
            <Label htmlFor="housingType">Tipo de vivienda</Label>
            <select
              id="housingType"
              name="housingType"
              required
              defaultValue={user.housingType}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              {Object.entries(HOUSING_TYPES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Special Needs */}
          <fieldset className="grid gap-2">
            <legend className="text-sm font-medium">
              Necesidades especiales
            </legend>
            {Object.entries(SPECIAL_NEEDS).map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2.5 rounded-md border border-input px-3 py-2 text-sm transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="checkbox"
                  name="specialNeeds"
                  value={key}
                  checked={selectedNeeds.includes(key)}
                  onChange={() => toggleNeed(key)}
                  className="size-4 rounded border-input accent-primary"
                />
                {label}
              </label>
            ))}
          </fieldset>

          {/* Phone */}
          <div className="grid gap-1.5">
            <Label htmlFor="phone">
              Teléfono{" "}
              <span className="font-normal text-muted-foreground">
                (opcional)
              </span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={user.phone ?? ""}
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
