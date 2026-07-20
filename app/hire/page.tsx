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

export default function HireTalentPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const response = await fetch("/api/providers");
        const data = await response.json();
        setProviders(data);
      } catch (error) {
        console.error("Failed to load providers:", error);
      }
    };
    loadProviders();
  }, []);

  const allServices = Array.from(new Set(providers.flatMap((p) => p.providerServices)));

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch = !searchQuery || 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.providerBio.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesService = !selectedService || 
      provider.providerServices.includes(selectedService);
    
    return matchesSearch && matchesService;
  });

  const handleContactClick = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowContactModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Hire Talent</h1>
        <p className="mt-1 text-sm text-slate-600">Find and hire skilled professionals for your projects</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or bio..."
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
          <div className="sm:w-64">
            <label className="block text-sm font-medium text-slate-700 mb-1">Service Type</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="">All Services</option>
              {allServices.map((service) => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
        </div>
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
              onClick={() => handleContactClick(provider)}
              className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Contact Provider
            </button>
          </div>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-slate-500">No providers found matching your criteria.</p>
        </div>
      )}

      {showContactModal && selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Contact Provider</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                {selectedProvider.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{selectedProvider.name}</p>
                <p className="text-xs text-slate-500">{selectedProvider.email}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Message</label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Describe your project or task..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(`Message sent to ${selectedProvider.name}!`);
                    setShowContactModal(false);
                  }}
                  className="flex-1 rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
