"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { registerAction } from "@/actions/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, CloudLightning } from "lucide-react";
import { PROVINCES, HOUSING_TYPES, SPECIAL_NEEDS } from "@/config/constants";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  function toggleNeed(need: string) {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  }

  if (state?.success) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <CheckCircle2 className="size-10 text-green-600" />
            <p className="text-lg font-medium">¡Cuenta creada con éxito!</p>
            <p className="text-sm text-muted-foreground">
              Redirigiendo al inicio de sesión...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <CloudLightning className="size-5" />
        </div>
        <CardTitle className="text-xl">Crear cuenta</CardTitle>
        <CardDescription>
          Regístrate para recibir alertas meteorológicas
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

          {/* Name */}
          <div className="grid gap-1.5">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              name="name"
              placeholder="Juan García"
              required
              minLength={2}
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="confirmPassword">Confirmar</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Province */}
          <div className="grid gap-1.5">
            <Label htmlFor="province">Provincia</Label>
            <select
              id="province"
              name="province"
              required
              defaultValue=""
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              <option value="" disabled>
                Selecciona tu provincia
              </option>
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
              defaultValue=""
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              <option value="" disabled>
                Selecciona tipo de vivienda
              </option>
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
              Necesidades especiales{" "}
              <span className="font-normal text-muted-foreground">
                (opcional)
              </span>
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

          {/* Phone (optional) */}
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
              placeholder="+34 600 000 000"
              autoComplete="tel"
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Inicia sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
