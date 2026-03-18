"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
}

interface NavGroup {
  label: string;
  links: NavLink[];
}

type NavItem = NavLink | NavGroup;

function isGroup(item: NavItem): item is NavGroup {
  return "links" in item;
}

interface MobileNavProps {
  items: NavItem[];
}

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={open}
        aria-label={open ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <nav
          className="absolute left-0 right-0 top-16 z-50 border-b bg-white shadow-lg"
          aria-label="Menú móvil"
        >
          <div className="space-y-1 px-4 py-3">
            {items.map((item) =>
              isGroup(item) ? (
                <div key={item.label}>
                  <span className="block px-2 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {item.label}
                  </span>
                  {item.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
