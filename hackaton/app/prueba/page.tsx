"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type DocData = { id: string; [key: string]: unknown };

export default function PruebaFirebase() {
  const [docs, setDocs] = useState<DocData[]>([]);
  const [estado, setEstado] = useState<"cargando" | "ok" | "error">("cargando");
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDocs(collection(db, "usuarios"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setDocs(data);
        setEstado("ok");
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setMensajeError(msg);
        setEstado("error");
      }
    };
    cargar();
  }, []);

  return (
    <main className="mx-auto max-w-4xl p-8 font-mono">
      <h1 className="mb-6 text-3xl font-black">Prueba de Firebase</h1>

      {estado === "cargando" && (
        <p className="text-slate-500">Conectando con Firestore...</p>
      )}

      {estado === "ok" && (
        <div className="space-y-4">
          <p className="font-bold text-emerald-700">
            Conexion correcta. Documentos en coleccion &quot;usuarios&quot;: {docs.length}
          </p>
          <pre className="overflow-x-auto rounded-xl bg-slate-100 p-4 text-sm">
            {JSON.stringify(docs, null, 2)}
          </pre>
        </div>
      )}

      {estado === "error" && (
        <div className="rounded-xl bg-red-50 p-4">
          <p className="font-bold text-red-700">Error al conectar con Firebase</p>
          <pre className="mt-2 text-sm text-red-600">{mensajeError}</pre>
          <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-slate-700">
            <li>Revisa que existe el archivo <code>.env.local</code> en la carpeta <code>hackaton/</code></li>
            <li>Comprueba que las variables <code>NEXT_PUBLIC_FIREBASE_*</code> estan bien copiadas</li>
            <li>Verifica que el proyecto de Firebase existe y Firestore esta activado</li>
          </ul>
        </div>
      )}
    </main>
  );
}
