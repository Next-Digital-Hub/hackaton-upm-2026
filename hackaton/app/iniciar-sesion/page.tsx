import Link from "next/link";

export default function IniciarSesionPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_24%),linear-gradient(180deg,_#eff6ff_0%,_#f8fafc_55%,_#fff7ed_100%)] px-6 py-10 text-slate-900">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.88fr_1.12fr]">
        <section className="rounded-[2rem] border border-sky-100 bg-white/85 p-8 shadow-[0_25px_80px_rgba(59,130,246,0.12)] backdrop-blur">
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

          <div className="mt-10 grid gap-4">
            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-sm text-slate-300">Acceso recomendado</p>
              <p className="mt-2 text-2xl font-bold">Email + contrasena</p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-5">
              <p className="text-sm text-sky-900">Siguiente paso</p>
              <p className="mt-2 text-xl font-bold text-slate-950">Redireccion por rol</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_25px_80px_rgba(15,23,42,0.28)]">
          <form className="grid gap-5">
            <label className="grid gap-2 text-sm font-medium text-slate-200">
              Correo electronico
              <input
                type="email"
                placeholder="usuario@upm.es"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white/10"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-200">
              Contrasena
              <input
                type="password"
                placeholder="Introduce tu contrasena"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white/10"
              />
            </label>

            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2">
              <label className="flex items-center gap-3 text-sm text-slate-200">
                <input type="radio" name="destino" defaultChecked className="h-4 w-4" />
                Entrar como cliente
              </label>
              <label className="flex items-center gap-3 text-sm text-slate-200">
                <input type="radio" name="destino" className="h-4 w-4" />
                Entrar como backoffice
              </label>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm text-slate-300">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4" />
                Recordar sesion
              </label>
              <Link href="/registro" className="transition hover:text-white">
                Crear nueva cuenta
              </Link>
            </div>

            <div className="grid gap-3 pt-3 sm:grid-cols-2">
              <Link
                href="/cliente"
                className="rounded-2xl bg-sky-400 px-6 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Entrar como cliente
              </Link>
              <Link
                href="/backoffice"
                className="rounded-2xl border border-white/15 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Entrar como backoffice
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}