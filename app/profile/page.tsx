"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getStoredUser } from "@/hooks/useAuth";
import { updateProfileAction } from "@/actions/profile-action";


interface StoredUser {
  id?: string;
  name: string;
  email: string;
  role: string;
  isProvider?: boolean;
  providerBio?: string;
  providerServices?: string[];
  location?: string;
  phone?: string;
  experience?: string;
  hourlyRate?: string;
  availability?: string;
  profileImage?: string;
}


interface ServiceOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const storedUser = getStoredUser();
  
  const [user, setUser] = useState<StoredUser | null>(storedUser as StoredUser | null);

  const [name, setName] = useState<string>(storedUser?.name || "");
  const [location, setLocation] = useState<string>(storedUser?.location || "");
  const [phone, setPhone] = useState<string>(storedUser?.phone || "");
  const [experience, setExperience] = useState<string>(storedUser?.experience || "");
  const [hourlyRate, setHourlyRate] = useState<string>(storedUser?.hourlyRate || "");
  const [availability, setAvailability] = useState<string>(storedUser?.availability || "available");
  const [isProvider, setIsProvider] = useState<boolean>(
    Boolean((storedUser as unknown as { isProvider?: boolean } | null)?.isProvider) ||
      storedUser?.role === "provider" ||
      false
  );
  const [providerBio, setProviderBio] = useState<string>(storedUser?.providerBio || "");
  const [providerServices, setProviderServices] = useState<string[]>(storedUser?.providerServices || []);
  const [serviceCatalog, setServiceCatalog] = useState<ServiceOption[]>([]);
  const [message, setMessage] = useState<{ text: string; type: string } | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);


  const profileImageFromStorage = (() => {
    const u = storedUser as unknown as { profileImage?: unknown } | null;
    const v = u?.profileImage;
    return typeof v === "string" ? v : null;
  })();

  const [profileImage, setProfileImage] = useState<string | undefined>(
    profileImageFromStorage ?? undefined
  );



  // Fetch service catalog on mount
  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((services: ServiceOption[]) => setServiceCatalog(services))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!storedUser) {
      router.push("/");
    }
  }, [router, storedUser]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!user.id) {
      setMessage({ text: "User id missing. Please log in again.", type: "error" });
      return;
    }

    const result = await updateProfileAction(user.id, {

      name,
      isProvider,
      providerBio,
      providerServices,
      location,
      phone,
      experience,
      hourlyRate,
      availability,
      profileImage: profileImage ?? undefined,
    });

    if (result.type === "success") {
      setMessage({ text: "Profile updated successfully!", type: "success" });
      const updatedUser = { ...user, name, isProvider, providerBio, providerServices, location, phone, experience, hourlyRate, availability, profileImage };
      localStorage.setItem("tulia_auth", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
    } else {
      setMessage({ text: result.message, type: "error" });
    }
  };

  const toggleService = (serviceId: string) => {
    setProviderServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Map service IDs to names for display
  const serviceName = (id: string) =>
    serviceCatalog.find((s) => s.id === id)?.name ?? id;

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600">
          <div className="absolute inset-0 bg-black/10" />
        </div>
        
        <div className="relative px-6 pb-6">
          <div className="absolute -top-16 left-6">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white p-1 shadow-lg">
              {profileImage ? (
                <div className="relative h-full w-full">
                  <Image
                    src={profileImage}
                    alt="Profile"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-4xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-20">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                <p className="text-sm text-slate-500">{user.email}</p>
                {isProvider && (
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 mt-2">
                    Service Provider
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`rounded-lg p-4 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile Picture</h2>
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-slate-400">{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <label className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Upload Photo
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="+254 700 000 000"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Provider Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  id="isProvider"
                  type="checkbox"
                  checked={isProvider}
                  onChange={(e) => setIsProvider(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isProvider" className="text-sm font-medium text-slate-700">
                  I want to offer services / tasks
                </label>
              </div>

              {isProvider && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio / Description</label>
                    <textarea
                      value={providerBio}
                      onChange={(e) => setProviderBio(e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      placeholder="Tell clients about your experience and skills..."
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Experience Level</label>
                      <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      >
                        <option value="">Select experience</option>
                        <option value="beginner">Beginner (0-2 years)</option>
                        <option value="intermediate">Intermediate (2-5 years)</option>
                        <option value="expert">Expert (5+ years)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate (KSH)</label>
                      <input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        placeholder="500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Availability</label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="available">Available for work</option>
                      <option value="busy">Busy</option>
                      <option value="part-time">Part-time only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Services You Offer
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      Choose from the platform service catalog below. Your profile will appear when clients browse these services.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto">
                      {serviceCatalog.map((svc) => {
                        const selected = providerServices.includes(svc.id);
                        return (
                          <label
                            key={svc.id}
                            className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition ${
                              selected
                                ? "border-blue-400 bg-blue-50"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => toggleService(svc.id)}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${svc.color} text-white`}>
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={svc.icon} />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-slate-900 truncate">{svc.name}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                    {providerServices.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {providerServices.map((sid) => (
                          <span
                            key={sid}
                            className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                          >
                            {serviceName(sid)}
                            <button
                              type="button"
                              onClick={() => toggleService(sid)}
                              className="text-blue-400 hover:text-blue-600"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">About</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {providerBio || "No bio provided yet. Click Edit Profile to add a bio."}
              </p>
              {(location || phone) && (
                <div className="mt-4 space-y-2">
                  {location && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {location}
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {phone}
                    </div>
                  )}
                </div>
              )}
            </div>

            {isProvider && providerServices.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">Services Offered</h2>
                <div className="flex flex-wrap gap-2">
                  {providerServices.map((sid) => (
                    <span
                      key={sid}
                      className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                    >
                      {serviceName(sid)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isProvider && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {experience && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Experience</h3>
                    <p className="text-lg font-semibold text-slate-900 capitalize">{experience}</p>
                  </div>
                )}
                {hourlyRate && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Hourly Rate</h3>
                    <p className="text-lg font-semibold text-slate-900">KSH {hourlyRate}</p>
                  </div>
                )}
                {availability && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Availability</h3>
                    <p className="text-lg font-semibold text-slate-900 capitalize">{availability.replace("-", " ")}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Info</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-medium text-slate-900">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">Role:</span>
                  <span className="font-medium text-slate-900 capitalize">{user.role}</span>
                </div>
                {isProvider && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500">Status:</span>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      Active Provider
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
