"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/hooks/useAuth";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isProvider: boolean;
  providerBio: string;
  providerServices: string[];
}

export default function TasksPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const loadProviders = async () => {
      const response = await fetch("/api/providers");
      const data = await response.json();
      setProviders(data);
    };
    loadProviders();
  }, []);

  const filteredProviders = providers.filter((provider) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      provider.name.toLowerCase().includes(query) ||
      provider.providerBio.toLowerCase().includes(query) ||
      provider.providerServices.some((s) => s.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Find Services</h1>
        <p className="mt-1 text-sm text-slate-600">Browse and request services from providers</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search providers or services..."
          className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProviders.map((provider) => (
          <div key={provider.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg">
                {provider.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{provider.name}</h3>
                <p className="text-xs text-slate-500">{provider.providerServices.length} services offered</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{provider.providerBio || "No bio provided"}</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {provider.providerServices.map((service) => (
                <span
                  key={service}
                  className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700"
                >
                  {service}
                </span>
              ))}
            </div>

            <button
              onClick={() => alert(`Contact ${provider.name} at ${provider.email}`)}
              className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Contact Provider
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
