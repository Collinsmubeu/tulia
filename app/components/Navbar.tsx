"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavLinkItem {
  name: string;
  path: string;
  hasDropdown: boolean;
}

interface NavbarProps {
  onLogout: () => void;
  isAuthenticated: boolean;
  onOpenAuth: (mode: "login" | "signup") => void;
  onOpenSidebar: () => void;
}

function Navbar({ onLogout, isAuthenticated, onOpenAuth, onOpenSidebar }: NavbarProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const navLinks: NavLinkItem[] = [
    { name: "Home", path: "/", hasDropdown: true },
    { name: "Hire Talent", path: "/hire", hasDropdown: true },
    { name: "Get Hired", path: "/get-hired", hasDropdown: true },
    { name: "Community", path: "/community", hasDropdown: true },
  ];

  const isLinkActive = (path: string): boolean => pathname === path;

  const handleLogoutClick = () => {
    onLogout();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex h-24 w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex-shrink-0 flex items-center">
          <Image
            src="/tulialogo.png"
            alt="Tulia Logo"
            width={160}
            height={80}
            className="h-14 md:h-18 lg:h-20 w-auto object-contain transition-all duration-200"
            priority
          />
        </Link>

        <div className="hidden lg:flex flex-1 items-center justify-center max-w-[400px]">
          <div className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 shadow-sm">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            <button
              aria-label="Search"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-white shadow-sm transition hover:bg-pink-600"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-4">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
              onMouseLeave={() => link.hasDropdown && setActiveDropdown(null)}
            >
              <Link
                href={link.path}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  isLinkActive(link.path) ? "text-pink-500" : "text-slate-700 hover:text-pink-500"
                }`}
              >
                {link.name}
                {link.hasDropdown && (
                  <svg className="h-3 w-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </Link>

              {activeDropdown === link.name && (
                <div className="absolute left-0 top-full z-20 mt-1 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                  <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-pink-500">Popular</a>
                  <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-pink-500">New</a>
                  <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-pink-500">Following</a>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden sm:block text-center flex-1 lg:flex-none">
          <h1 className="text-lg md:text-xl xl:text-2xl font-bold tracking-tight text-emerald-600 whitespace-nowrap">
            LOCAL & FOREIGN SERVICES
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogoutClick}
                className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Log out
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth("signup")}
                  className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
                >
                  Sign up
                </button>
                <button
                  onClick={() => onOpenAuth("login")}
                  className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 cursor-pointer"
                >
                  Log in
                </button>
              </>
            )}
          </div>

          <button
            className="inline-flex xl:hidden items-center justify-center rounded-full border border-slate-200 p-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            onClick={() => {
              // Open the app sidebar from the navbar.
              onOpenSidebar();
              // Keep the existing mobile navbar panel behavior.
              setIsOpen(false);
            }}
            aria-label="Open sidebar"
          >
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white xl:hidden">
          <div className="space-y-4 px-6 py-5">
            <div className="sm:hidden text-center pb-2 border-b border-slate-100">
              <h1 className="text-lg font-bold text-emerald-600">LOCAL & FOREIGN SERVICES</h1>
            </div>

            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
            />

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`flex items-center justify-between rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium transition ${
                  isLinkActive(link.path) ? "text-pink-500" : "text-slate-700 hover:text-pink-500"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
                {link.hasDropdown && <span className="text-xs text-slate-400">▼</span>}
              </Link>
            ))}

            <div className="flex flex-col gap-2 pt-2 md:hidden">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogoutClick();
                  }}
                  className="rounded-full bg-slate-950 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Log out
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { setIsOpen(false); onOpenAuth("signup"); }}
                    className="rounded-full border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Sign up
                  </button>
                  <button
                    onClick={() => { setIsOpen(false); onOpenAuth("login"); }}
                    className="rounded-full bg-slate-950 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-slate-900"
                  >
                    Log in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;