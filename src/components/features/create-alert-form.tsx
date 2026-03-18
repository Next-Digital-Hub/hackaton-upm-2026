"use client";

import { useState } from "react";
import { createAlertAction } from "@/actions/alerts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import type { CreateAlertInput } from "@/lib/validations";

interface CreateAlertFormProps {
  onCreated?: () => void;
}

export function CreateAlertForm({ onCreated }: CreateAlertFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const input: CreateAlertInput = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      severity: formData.get("severity") as "LOW" | "MODERATE" | "SEVERE" | "EXTREME",
    };

    try {
      const result = await createAlertAction(input);
      if (result.success) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
        onCreated?.();
      } else {
        setError(result.error ?? "Error al crear la alerta");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear nueva alerta</CardTitle>
        <CardDescription>
          La alerta se enviará como notificación a todos los ciudadanos registrados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-300 bg-green-50 text-green-800">
              <CheckCircle2 className="size-4" />
              <AlertDescription>
                Alerta creada y enviada a todos los ciudadanos
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ej: Alerta por lluvias torrenciales en Valencia"
              required
              minLength={3}
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe la situación y las medidas a tomar..."
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severidad</Label>
            <select
              id="severity"
              name="severity"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Selecciona severidad</option>
              <option value="LOW">Baja</option>
              <option value="MODERATE">Moderada</option>
              <option value="SEVERE">Grave</option>
              <option value="EXTREME">Extrema</option>
            </select>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            <Send className="mr-2 size-4" />
            {isSubmitting ? "Creando alerta..." : "Emitir alerta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
