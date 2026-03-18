"use client";

import { useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function CitizenError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Citizen route error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg py-12">
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>Ha ocurrido un error</AlertTitle>
        <AlertDescription className="mt-2">
          <p>
            No se ha podido cargar esta página. Si el problema persiste, contacta
            con el administrador.
          </p>
          {error.digest && (
            <p className="mt-1 text-xs text-muted-foreground">
              Código: {error.digest}
            </p>
          )}
        </AlertDescription>
      </Alert>
      <Button onClick={reset} className="mt-4" variant="outline">
        Intentar de nuevo
      </Button>
    </div>
  );
}
