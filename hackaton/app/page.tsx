import Link from "next/link";

export default function Home() {
  const routes = [
    {
      href: "/registro",
      title: "Registro",
      description: "Alta de nuevos usuarios con ubicacion, vivienda y necesidades especiales.",
    },
    {
      href: "/iniciar-sesion",
      title: "Iniciar sesion",
      description: "Acceso a la plataforma para ciudadanos y personal de backoffice.",
    },
    {
      href: "/cliente",
      title: "Vista ciudadano",
      description: "Consulta la prevision, recibe alertas y obtiene recomendaciones personalizadas.",
    },
    {
      href: "/backoffice",
      title: "Vista backoffice",
      description: "Supervisa la prevision recibida, evalua alertas y gestiona el seguimiento operativo.",
    },
  ];

  const highlights = [
    {
      label: "Prevision activa",
      value: "API externa",
      description: "Consulta meteorologica centralizada para toda la aplicacion.",
    },
    {
      label: "Perfiles",
      value: "Ciudadano y backoffice",
      description: "Dos recorridos diferenciados segun el tipo de usuario.",
    },
    {
      label: "Personalizacion",
      value: "LLM + perfil",
      description: "Recomendaciones adaptadas a provincia, vivienda y necesidades especiales.",
    },
  ];

  const workflow = [
    "El ciudadano consulta la prevision y recibe recomendaciones de seguridad adaptadas a su perfil.",
    "Si existe una alerta activa, se muestra de forma visible y contextualizada en la aplicacion.",
    "Backoffice revisa la informacion meteorologica y decide si conviene emitir una alerta general.",
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.16),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eff6ff_38%,_#fffaf4_100%)] px-6 py-10 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col gap-10">
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-stretch">
          <div className="rounded-[2.25rem] bg-slate-950 p-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.24)] sm:p-10">
            <span className="inline-flex w-fit rounded-full border border-sky-300/20 bg-white/10 px-4 py-1 text-sm font-medium text-sky-200">
              Sistema de prediccion y alertas meteorologicas
            </span>
            <div className="mt-6 space-y-5">
              <h1 className="max-w-4xl text-5xl font-black tracking-tight text-balance sm:text-6xl">
                Obten recomendaciones personalizadas y alertas meteorologicas en un solo lugar.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Esta aplicacion conecta una API meteorologica externa con recomendaciones personalizadas y un flujo de supervision para backoffice.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/registro"
                className="rounded-2xl bg-sky-400 px-6 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Crear cuenta
              </Link>
              <Link
                href="/iniciar-sesion"
                className="rounded-2xl border border-white/15 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Acceder a la plataforma
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {highlights.map((item) => (
                <article key={item.label} className="rounded-[1.5rem] bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-300">{item.label}</p>
                  <p className="mt-3 text-2xl font-bold text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Resumen funcional</p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-950">Que hace la aplicacion</h2>
                </div>
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-900">
                  flujo definido
                </span>
              </div>

              <div className="mt-6 grid gap-4">
                {workflow.map((item, index) => (
                  <div key={item} className="grid grid-cols-[auto_1fr] gap-4 rounded-[1.5rem] bg-slate-50 p-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                      0{index + 1}
                    </span>
                    <p className="text-sm leading-7 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] bg-amber-100 p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-amber-900/70">Ciudadano</p>
                <p className="mt-3 text-2xl font-bold text-slate-950">Consulta y recomendaciones</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  La experiencia del usuario se adapta a provincia, tipo de vivienda y necesidades especiales.
                </p>
              </div>
              <div className="rounded-[1.75rem] bg-sky-100 p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-sky-900/70">Backoffice</p>
                <p className="mt-3 text-2xl font-bold text-slate-950">Supervision y alertas</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  La operativa interna revisa la prevision recibida y decide si emitir avisos generales.
                </p>
              </div>
            </section>
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Accesos</p>
              <h2 className="mt-1 text-3xl font-bold text-slate-950">Entradas principales del sistema</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Desde aqui puedes probar el alta de usuarios, el acceso y las dos vistas principales del proyecto.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
          </div>
        </section>
      </div>
    </main>
  );
}
