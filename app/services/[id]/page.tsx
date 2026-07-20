"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getStoredUser } from "@/hooks/useAuth";

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
}

interface Provider {
  id: string;
  name: string;
  email: string;
  providerBio?: string;
  location?: string;
  phone?: string;
  experience?: string;
  hourlyRate?: string;
  availability?: string;
  profileImage?: string;
  providerServices?: string[];
}

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.push("/");
      return;
    }

    const serviceId = params.id as string;

    // Load service info
    fetch("/api/services")
      .then((res) => res.json())
      .then((services: Service[]) => {
        const found = services.find((s) => s.id === serviceId);
        setService(found || null);
      });

    // Load all providers and filter by this service
    fetch("/api/providers")
      .then((res) => res.json())
      .then((allProviders: Provider[]) => {
        const filtered = allProviders.filter(
          (p) => p.providerServices && p.providerServices.includes(serviceId)
        );
        setProviders(filtered);
      })
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Service not found</h2>
          <button
            onClick={() => router.push("/services")}
            className="mt-4 text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push("/services")}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Services
      </button>

      {/* Service header */}
      <div className={`rounded-2xl border ${service.border} ${service.bg} p-8`}>
        <div className="flex items-center gap-4">
          <div className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} text-white shadow-md`}>
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={service.icon} />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{service.name}</h1>
            <p className="mt-1 text-slate-600">{service.description}</p>
          </div>
        </div>
      </div>

      {/* Providers list */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Available Doctors & Providers
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No providers yet</h3>
            <p className="text-sm text-slate-500">
              No doctors or providers have linked this service to their profile yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => router.push(`/profile/${provider.id}`)}
              >
                <div className="flex items-center gap-4 mb-4">
                  {provider.profileImage ? (
                    <img
                      src={provider.profileImage}
                      alt={provider.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
                      {provider.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{provider.name}</h3>
                    {provider.location && (
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {provider.location}
                      </p>
                    )}
                  </div>
                </div>

                {provider.providerBio && (
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{provider.providerBio}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  {provider.experience && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {provider.experience}
                    </span>
                  )}
                  {provider.hourlyRate && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ${provider.hourlyRate}/hr
                    </span>
                  )}
                  {provider.availability && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      provider.availability === "available"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {provider.availability}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
