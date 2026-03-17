import Link from "next/link";

const metricas = [
  { label: "Pedidos nuevos", value: "128", tone: "bg-amber-200 text-amber-950" },
  { label: "Incidencias", value: "07", tone: "bg-rose-200 text-rose-950" },
  { label: "Stock critico", value: "14", tone: "bg-sky-200 text-sky-950" },
];

const tareas = [
  "Validar altas de usuarios pendientes",
  "Revisar pedidos bloqueados por pago",
  "Actualizar el catalogo destacado de la semana",
  "Supervisar cambios de stock del almacen central",
];

export default function BackofficePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_48%,_#fff1f2_100%)] px-6 py-10 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="grid gap-6 rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_25px_80px_rgba(15,23,42,0.25)] lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-4">
            <Link href="/" className="text-sm text-slate-300 transition hover:text-white">
              Volver al inicio
            </Link>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Vista operativa</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Panel Backoffice</h1>
            </div>
            <p className="max-w-3xl text-base leading-8 text-slate-300">
              Esta pantalla concentra supervision interna: pedidos, incidencias, stock y tareas del equipo de gestion.
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-white/10 px-5 py-4">
            <p className="text-sm text-slate-300">Responsable activo</p>
            <p className="mt-1 text-2xl font-bold">Equipo Backoffice</p>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              {metricas.map((metrica) => (
                <article
                  key={metrica.label}
                  className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-[0_15px_50px_rgba(15,23,42,0.08)]"
                >
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{metrica.label}</p>
                  <div className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${metrica.tone}`}>
                    Supervisar hoy
                  </div>
                  <p className="mt-4 text-5xl font-black text-slate-950">{metrica.value}</p>
                </article>
              ))}
            </div>

            <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-[0_15px_50px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Tareas prioritarias</p>
              <div className="mt-4 grid gap-3">
                {tareas.map((tarea) => (
                  <div key={tarea} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
                    {tarea}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-[0_15px_50px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Centro de control</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-950">Actividad del dia</h2>
              </div>
              <Link href="/iniciar-sesion" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Cambiar sesion
              </Link>
            </div>

            <div className="mt-6 grid gap-4">
              <article className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Pedidos</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-4xl font-black">46 pendientes</p>
                    <p className="mt-2 text-sm text-slate-300">11 requieren validacion manual de pago</p>
                  </div>
                  <button className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                    Abrir cola de revision
                  </button>
                </div>
              </article>

              <div className="grid gap-4 md:grid-cols-2">
                <article className="rounded-[1.5rem] bg-amber-50 p-6">
                  <p className="text-sm uppercase tracking-[0.18em] text-amber-900/70">Stock</p>
                  <p className="mt-3 text-2xl font-bold text-slate-950">14 productos bajo minimo</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Recomendado: lanzar reposicion para almacen A1 y revisar proveedor principal.
                  </p>
                </article>
                <article className="rounded-[1.5rem] bg-sky-50 p-6">
                  <p className="text-sm uppercase tracking-[0.18em] text-sky-900/70">Usuarios</p>
                  <p className="mt-3 text-2xl font-bold text-slate-950">9 registros pendientes</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Hay nuevas altas que necesitan asignacion de permisos y validacion interna.
                  </p>
                </article>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}