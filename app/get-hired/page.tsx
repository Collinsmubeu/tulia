"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/hooks/useAuth";

interface Provider {
  id: string;
  name: string;
  email: string;
  providerBio: string;
  providerServices: string[];
}

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
}

export default function GetHiredPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"providers" | "services">("providers");

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [providersRes, servicesRes] = await Promise.all([
          fetch("/api/providers"),
          fetch("/api/services"),
        ]);
        const providersData = await providersRes.json();
        const servicesData = await servicesRes.json();
        setProviders(providersData);
        setServices(servicesData);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
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

  const filteredServices = services.filter((service) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      service.name.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Get Hired</h1>
        <p className="mt-1 text-sm text-slate-600">Browse available providers and services</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search providers, services, or skills..."
          className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("providers")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === "providers"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Providers ({filteredProviders.length})
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === "services"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Services ({filteredServices.length})
        </button>
      </div>

      {activeTab === "providers" && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProviders.map((provider) => (
            <div key={provider.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-lg">
                  {provider.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{provider.name}</h3>
                  <p className="text-xs text-slate-500">{provider.providerServices.length} services</p>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-4 line-clamp-3">{provider.providerBio || "No bio provided"}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {provider.providerServices.map((service) => (
                  <span
                    key={service}
                    className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
                  >
                    {service}
                  </span>
                ))}
              </div>

              <button
                onClick={() => alert(`Contact ${provider.name} at ${provider.email}`)}
                className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Hire Now
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "services" && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <div key={service.id} className={`group relative overflow-hidden rounded-2xl border ${service.border} ${service.bg} p-6 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1`}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-white shadow-sm">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} text-white shadow-md`}>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={service.icon} />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{service.name}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{service.description}</p>
              <div className={`mt-4 h-1 w-12 rounded-full bg-gradient-to-r ${service.color} transition-all duration-300 group-hover:w-full`} />
            </div>
          ))}
        </div>
      )}

      {activeTab === "providers" && filteredProviders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-slate-500">No providers found matching your criteria.</p>
        </div>
      )}

      {activeTab === "services" && filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-slate-500">No services found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
