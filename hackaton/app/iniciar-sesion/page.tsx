import Link from "next/link";

export default function IniciarSesionPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_24%),linear-gradient(180deg,_#eff6ff_0%,_#f8fafc_55%,_#fff7ed_100%)] px-6 py-10 text-slate-900">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-2">
        <section className="mx-auto w-full max-w-2xl rounded-[2rem] border border-sky-100 bg-white/85 p-8 shadow-[0_25px_80px_rgba(59,130,246,0.12)] backdrop-blur sm:p-10">
          <Link href="/" className="text-sm text-slate-500 transition hover:text-slate-900">
            Volver al inicio
          </Link>
          <div className="mt-8 space-y-4">
            <span className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-medium text-sky-900">
              Acceso seguro
            </span>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Inicia sesion para continuar con tu operativa.
            </h1>
            <p className="max-w-md text-base leading-8 text-slate-600">
              Esta vista funciona como punto de entrada comun. Despues puedes redirigir segun el rol a cliente o backoffice.
            </p>
          </div>

        </section>

        <section className="mx-auto w-full max-w-2xl rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_25px_80px_rgba(15,23,42,0.28)] sm:p-10">
          <form className="grid gap-5">
            <label className="grid gap-2 text-sm font-medium text-slate-200">
              Correo electronico
              <input
                type="email"
                placeholder="usuario@dominio.es"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white/10"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-200">
              Contraseña
              <input
                type="password"
                placeholder="Introduce tu contraseña"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white/10"
              />
            </label>

            <div className="flex items-center justify-between gap-4 text-sm text-slate-300">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4" />
                Recordar sesion
              </label>
              <Link href="/registro" className="transition hover:text-white">
                Crear nueva cuenta
              </Link>
            </div>

            <div className="flex justify-center pt-3">
              <Link
                href="/cliente"
                className="min-w-48 rounded-2xl bg-sky-400 px-6 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Iniciar sesion
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}