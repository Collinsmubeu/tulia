"use client";

import { useMemo } from "react";
import Link from "next/link";

export default function Sidebar({
  user,
  onLogout,
  isOpen,
  onToggle,
}: {
  user: { name: string; email: string; role: string };
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const links = useMemo(
    () =>
      [
        { href: "/dashboard", label: "Dashboard" },
        ...(user.role === "provider" ? [{ href: "/doctor-dashboard", label: "Doctor Dashboard" }] : []),
        { href: "/profile", label: "Profile" },
        { href: "/services", label: "Services" },
      ],
    [user.role]
  );

  return (
    <aside
      className={
        "fixed left-0 top-0 z-40 h-full w-72 bg-white border-r border-slate-200 transform transition-transform " +
        (isOpen ? "translate-x-0" : "-translate-x-full") +
        " xl:translate-x-0 xl:static xl:z-auto"
      }
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4">
          <div>
            <div className="font-semibold text-slate-900">{user.name}</div>
            <div className="text-xs text-slate-500">{user.email}</div>
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <nav className="flex-1 px-4 pb-4 space-y-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={onToggle}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

