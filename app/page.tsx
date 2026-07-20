"use client";


const services = [
  { 
    name: "Medical Courier", 
    description: "Fast and reliable medical delivery services", 
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50",
    border: "border-rose-100"
  },
  { 
    name: "Mama Mboga Supplies", 
    description: "Fresh vegetables and provisions delivered", 
    icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
    color: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100"
  },
  { 
    name: "Urgent Errands Run", 
    description: "Quick errand services for your busy schedule", 
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    border: "border-amber-100"
  },
  { 
    name: "Global Talent Pool", 
    description: "Connect with skilled professionals worldwide", 
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M12 18h.01",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    border: "border-blue-100"
  },
  { 
    name: "Legal Advisory", 
    description: "Professional legal consultation and representation", 
    icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    border: "border-violet-100"
  },
  { 
    name: "Teaching & Tutoring", 
    description: "Expert tutors and educators for all subjects", 
    icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
    color: "from-cyan-500 to-teal-600",
    bg: "bg-cyan-50",
    border: "border-cyan-100"
  },
  { 
    name: "Accounting & Tax", 
    description: "Professional bookkeeping, tax, and financial planning", 
    icon: "M9 7h6m-6 4h6m-6 4h4m-9 4h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z",
    color: "from-slate-600 to-slate-800",
    bg: "bg-slate-50",
    border: "border-slate-200"
  },
  { 
    name: "Web Development", 
    description: "Custom websites, apps, and software solutions", 
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    color: "from-sky-500 to-blue-600",
    bg: "bg-sky-50",
    border: "border-sky-100"
  },
  { 
    name: "Graphic Design", 
    description: "Branding, logos, and creative design services", 
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    color: "from-fuchsia-500 to-pink-600",
    bg: "bg-fuchsia-50",
    border: "border-fuchsia-100"
  },
  { 
    name: "Real Estate", 
    description: "Property sales, rentals, and management", 
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10m-2 2l-2 2m0 0l-2-2",
    color: "from-teal-500 to-emerald-600",
    bg: "bg-teal-50",
    border: "border-teal-100"
  },
  { 
    name: "Event Planning", 
    description: "Weddings, corporate events, and parties", 
    icon: "M21 15.546c-.523 0-1.046-.15-1.546-.447a3.004 3.004 0 01-1.053 1.053c-.297.5-.447 1.023-.447 1.546 0 .523.15 1.046.447 1.546.297.5.748.916 1.053 1.053.523.297 1.046.447 1.546.447.523 0 1.046-.15 1.546-.447.5-.297.916-.748 1.053-1.053.297-.523.447-1.046.447-1.546 0-.523-.15-1.046-.447-1.546a3.004 3.004 0 01-1.053-1.053c-.297-.5-.447-1.023-.447-1.546zM12 12.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z",
    color: "from-pink-500 to-rose-600",
    bg: "bg-pink-50",
    border: "border-pink-100"
  },
  { 
    name: "Fitness Training", 
    description: "Personal training, yoga, and wellness coaching", 
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    color: "from-red-500 to-rose-600",
    bg: "bg-red-50",
    border: "border-red-100"
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mt-8">
          <h2 className="text-center text-2xl font-bold text-slate-900">Our Services</h2>
          <p className="mt-2 text-center text-sm text-slate-600">Explore what Tulia offers before you join</p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <div 
                key={index} 
                className={`service-card group relative rounded-2xl border ${service.border} ${service.bg} p-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-300/60`}
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} text-white shadow-md`}>

                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={service.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{service.name}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{service.description}</p>
                <div className={`absolute bottom-0 left-0 h-1 w-full bg-[#001f3f] transform -translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
