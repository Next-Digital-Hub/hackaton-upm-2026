"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Send } from "lucide-react";

export default function CrearAlertaPage() {
  const [form, setForm] = useState({
    nombre: "",
    fechaHora: "",
    ciudad: "",
    descripcion: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Alerta Creada:", form);
    alert("¡Alerta meteorológica enviada con éxito!");
    // Aquí conectarías con tu lógica de backend
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-native-600 p-4">
      <Card className="w-full max-w-lg shadow-lg bg-zinc-600">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-600 h-6 w-6" />
            <CardTitle >Crear Alerta Meteorológica</CardTitle>
          </div>
          <CardDescription className="text-white-500">
            Completa los datos para emitir un aviso oficial a la población.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Título de la Alerta</Label>
              <Input 
                id="nombre" 
                placeholder="Ej: Tormenta Eléctrica Nivel Rojo" 
                required 
                value={form.nombre}
                onChange={(e) => setForm({...form, nombre: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Ciudad */}
              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad / Región</Label>
                <Input 
                  id="ciudad" 
                  placeholder="Ej: Madrid" 
                  required 
                  value={form.ciudad}
                  onChange={(e) => setForm({...form, ciudad: e.target.value})}
                />
              </div>

              {/* Fecha y Hora */}
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha y Hora</Label>
                <Input 
                  id="fecha" 
                  type="datetime-local" 
                  required 
                  value={form.fechaHora}
                  onChange={(e) => setForm({...form, fechaHora: e.target.value})}
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción del fenómeno</Label>
              <Textarea 
                id="descripcion" 
                placeholder="Detalla los riesgos y recomendaciones..." 
                className="min-h-[100px] text-color-white"
                required 
                value={form.descripcion}
                onChange={(e) => setForm({...form, descripcion: e.target.value})}
              />
            </div>
          </CardContent>

          <CardFooter className="bg-zinc-600">
            <Button type="submit" className="w-full gap-2 bg-zinc-600 hover:bg-black">
              <Send className="h-4 w-4" /> Emitir Alerta
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}