import Link from "next/link";

const pedidos = [
  { id: "PED-1042", estado: "En reparto", total: "48,90 EUR" },
  { id: "PED-1031", estado: "Preparando", total: "22,50 EUR" },
  { id: "PED-0998", estado: "Entregado", total: "81,20 EUR" },
];

const destacados = [
  "Recomendaciones segun tu historial",
  "Cupones y promociones activas",
  "Seguimiento rapido de pedidos",
];

export default function ClientePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f0fdf4_45%,_#eff6ff_100%)] px-6 py-10 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="rounded-[2rem] bg-slate-950 px-8 py-7 text-white shadow-[0_25px_80px_rgba(15,23,42,0.22)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Link href="/" className="text-sm text-slate-300 transition hover:text-white">
                Volver al inicio
              </Link>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Panel de cliente</h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300">
                Vista pensada para el usuario final: resumen de pedidos, accesos rapidos y acciones frecuentes de la cuenta.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-white/10 px-5 py-4">
              <p className="text-sm text-slate-300">Cuenta activa</p>
              <p className="mt-1 text-2xl font-bold">Lucia Garcia</p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-[0_15px_50px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Mis pedidos</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-950">Actividad reciente</h2>
              </div>
              <Link href="/iniciar-sesion" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Cambiar sesion
              </Link>
            </div>

            <div className="mt-6 grid gap-4">
              {pedidos.map((pedido) => (
                <article
                  key={pedido.id}
                  className="grid gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 md:grid-cols-[1fr_auto_auto] md:items-center"
                >
                  <div>
                    <p className="text-sm text-slate-500">Pedido</p>
                    <p className="text-xl font-bold text-slate-950">{pedido.id}</p>
                  </div>
                  <p className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700">
                    {pedido.estado}
                  </p>
                  <p className="text-lg font-semibold text-slate-950">{pedido.total}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <section className="rounded-[2rem] bg-emerald-300 p-6 text-slate-950 shadow-[0_15px_50px_rgba(16,185,129,0.16)]">
              <p className="text-sm uppercase tracking-[0.18em] text-emerald-950/70">Resumen</p>
              <p className="mt-3 text-5xl font-black">3</p>
              <p className="mt-2 text-base font-medium">Pedidos activos esta semana</p>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-[0_15px_50px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Accesos rapidos</p>
              <div className="mt-4 grid gap-3">
                {destacados.map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}