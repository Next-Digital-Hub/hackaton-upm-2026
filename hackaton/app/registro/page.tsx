"use client";

import Link from "next/link";
import { useState } from "react";

import { provincias } from "./provincias";

const tiposVivienda = ["Piso", "Casa", "Residencia", "Otro"];

export default function RegistroPage() {
  const [tipoUsuario, setTipoUsuario] = useState("Cliente");

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,_#fff7ed_0%,_#fffbeb_40%,_#f0f9ff_100%)] px-6 py-10 text-slate-900">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex flex-col justify-between rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
          <div className="space-y-6">
            <Link href="/" className="inline-flex text-sm text-slate-300 transition hover:text-white">
              Volver al inicio
            </Link>
            <span className="inline-flex w-fit rounded-full border border-white/10 bg-white/10 px-4 py-1 text-sm font-medium text-amber-200">
              Alta de usuarios
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Crea tu cuenta y prepara tu espacio de compra.
              </h1>
              <p className="max-w-lg text-base leading-8 text-slate-300">
                Estos datos serán utilizados para personalizar tu experiencia, ofrecer recomendaciones relevantes y garantizar tu seguridad.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-[0_25px_80px_rgba(148,163,184,0.18)] backdrop-blur">
          <form className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Nombre
                <input
                  type="text"
                  placeholder="Lucia"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Apellidos
                <input
                  type="text"
                  placeholder="Garcia Ruiz"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Correo electronico
              <input
                type="email"
                placeholder="nombre@correo.com"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Contrasena
                <input
                  type="password"
                  placeholder="Minimo 8 caracteres"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Repetir contrasena
                <input
                  type="password"
                  placeholder="Repite la contrasena"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Telefono
                <input
                  type="tel"
                  placeholder="600 123 456"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Tipo de usuario
                <select
                  value={tipoUsuario}
                  onChange={(event) => setTipoUsuario(event.target.value)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
                >
                  <option>Cliente</option>
                  <option>Backoffice</option>
                </select>
              </label>
            </div>

            {tipoUsuario === "Backoffice" ? (
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Codigo de acceso Backoffice
                <input
                  type="text"
                  placeholder="Introduce el codigo recibido externamente"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
                />
              </label>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Tipo de vivienda
                <select className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white">
                  <option value="">Selecciona un tipo</option>
                  {tiposVivienda.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Provincia
                <select className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white">
                  <option value="">Selecciona una provincia</option>
                  {provincias.map((provincia) => (
                    <option key={provincia} value={provincia}>
                      {provincia}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Necesidades especiales
              <textarea
                placeholder="Indica alergias, requisitos de accesibilidad o cualquier necesidad relevante"
                rows={4}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
              />
            </label>

            <label className="flex items-start gap-3 rounded-2xl bg-amber-50 px-4 py-4 text-sm text-slate-700">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300" />
              <span>
                Acepto los terminos del servicio y autorizo el uso de mis datos para la gestion de pedidos y comunicaciones.
              </span>
            </label>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Crear cuenta
              </button>
              <Link
                href="/iniciar-sesion"
                className="rounded-2xl border border-slate-200 px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}