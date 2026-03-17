import Link from "next/link";

export default function Home() {
  const routes = [
    {
      href: "/registro",
      title: "Registro",
      description: "Alta de nuevos usuarios con datos personales y preferencias.",
    },
    {
      href: "/iniciar-sesion",
      title: "Iniciar sesion",
      description: "Acceso de usuarios existentes mediante email y contrasena.",
    },
    {
      href: "/cliente",
      title: "Vista cliente",
      description: "Panel para revisar pedidos, favoritos y recomendaciones.",
    },
    {
      href: "/backoffice",
      title: "Vista backoffice",
      description: "Panel operativo para supervision de ventas, stock e incidencias.",
    },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(246,191,38,0.2),_transparent_35%),linear-gradient(180deg,_#fff9ef_0%,_#fffefb_42%,_#eef4ff_100%)] px-6 py-10 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-center gap-10">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-5">
            <span className="inline-flex w-fit rounded-full border border-amber-300 bg-white/80 px-4 py-1 text-sm font-medium text-amber-900 shadow-sm backdrop-blur">
              Tienda UPM · acceso y roles
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-black tracking-tight text-balance sm:text-6xl">
                Panel base para registro, login y vistas por tipo de usuario.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                He dejado una portada simple para navegar entre las pantallas que necesitas y poder iterar luego sobre el flujo real de la tienda.
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-[2rem] border border-slate-200 bg-white/75 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-white">
              <span className="text-sm uppercase tracking-[0.2em] text-slate-300">Estado</span>
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-sm font-medium text-emerald-300">
                listo para demo
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl bg-amber-100 p-4">
                <p className="text-sm text-amber-900">Usuarios</p>
                <p className="mt-2 text-3xl font-bold">2 perfiles</p>
              </div>
              <div className="rounded-2xl bg-sky-100 p-4">
                <p className="text-sm text-sky-900">Accesos</p>
                <p className="mt-2 text-3xl font-bold">2 flujos</p>
              </div>
              <div className="rounded-2xl bg-emerald-100 p-4">
                <p className="text-sm text-emerald-900">Navegacion</p>
                <p className="mt-2 text-3xl font-bold">4 paginas</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="group rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 shadow-[0_15px_50px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
            >
              <div className="flex h-full flex-col justify-between gap-6">
                <div className="space-y-3">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                    {route.href.replace("/", "") || "inicio"}
                  </p>
                  <h2 className="text-2xl font-bold text-slate-950">{route.title}</h2>
                  <p className="text-base leading-7 text-slate-600">{route.description}</p>
                </div>
                <span className="text-sm font-semibold text-slate-950 transition group-hover:translate-x-1">
                  Abrir pantalla
                </span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
