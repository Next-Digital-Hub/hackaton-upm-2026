"use client";

import { AICardProps } from "@/lib/services/ServicioIA";
import { useEffect, useState } from "react";

export default function AICard(dataProps : AICardProps) {
  const data = dataProps.data;
  const [aiConsejo, setAiConsejo] = useState<string>("Generando consejo...");

  useEffect(() => {
    const getConsejo = async () => {
      if (!data) {
        setAiConsejo("Datos meteorológicos no disponibles para un consejo de IA.");
        return;
      }

      const system_prompt = "Eres un experto meteorólogo que da consejos prácticos y cercanos. Tu respuesta debe ser concisa (máximo 3-4 frases). Se claro, conciso y empieza con imperativo. Los consejos deben ir separados en nuevas líneas y deben empezar con '·'. NO UTILICES SIMBOLOS, NI ENCABEZADOS. La estructura del prompt debe ser la siguiente:· <consejo1> \\n · <consejo2> \\n ...";

      const user_prompt = `
      Hola, estoy en ${data.lugar}. 
      Hoy hace una media de ${data.tmed}°C, de minima ${data.tmin} y de maxima ${data.tmax} y han caído ${data.prec}mm de lluvia. 
      La humedad media es ${data.humedadMedia}
      Vivo en una ${data.tipoVivienda} y mi situación es: ${data.necesidadesEspeciales}.
      ¿Qué consejo me das?
    `;

      try {
        const response = await fetch(`${window.location.origin}/api/prompt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ system_prompt, user_prompt }),
          cache: "no-store"
        });

        if (!response.ok) {
          console.error("Error al llamar a la IA:", response.status);
          setAiConsejo("Error al obtener el consejo de la IA.");
          return;
        }

        const returnData = await response.json();
        setAiConsejo(returnData.response || "No se pudo generar un consejo.");
      } catch (error) {
        console.error("Error de red al llamar a la IA:", error);
        setAiConsejo("Problema de conexión con el servicio de IA.");
      }
    };

    getConsejo();
  }, [data]);

  return (
    <article className="rounded-[2rem] border border-sky-200 bg-gradient-to-br from-blue-900 to-indigo-900 p-6 text-white shadow-[0_15px_50px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Asistente IA</p>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">Consejo Meteorológico</h3>
      
      <p className="text-sm leading-relaxed text-blue-100 italic whitespace-pre-line">
        {aiConsejo}
      </p>

      {/* Aquí podrías añadir un icono relevante al consejo si lo parseas */}
      {/* <div>
        <Image src="/ai-icon.svg" alt="AI Icon" width={32} height={32} className="mt-4 opacity-75" />
      </div> */}
    </article>
  );
}