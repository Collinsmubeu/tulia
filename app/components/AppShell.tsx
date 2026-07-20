"use client";

import { useState, useEffect } from "react"; // 1. Import useEffect
import { useRouter, usePathname } from "next/navigation";

import Navbar from "./Navbar";
import Footer from "./Footer";
import AuthSlider from "@/components/auth/AuthSlider";
import Sidebar from "./Sidebar";
import { getStoredUser } from "@/hooks/useAuth";


export default function AppShell({ children, footerMessage }: { children: React.ReactNode; footerMessage?: string }) {
  const router = useRouter();
  
  // 2. Add a 'mounted' state to track if the component is ready
  const [mounted, setMounted] = useState(false);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 3. Initialize to FALSE (safe default)
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null); // 4. Initialize to NULL
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 5. Load user data ONLY after mounting on the client
  useEffect(() => {
    const storedUser = getStoredUser();
    setMounted(true);

    if (storedUser) {
      // Avoid setState cascade warnings by updating related state together.
      setIsAuthenticated(true);
      setUser(storedUser);
    }
  }, []);


  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthMode(null);
    setUser(null);
    setSidebarOpen(false);
    localStorage.removeItem("tulia_auth");
    router.push("/");
  };

  const handleLogin = (userData: { name: string; email: string; role: string }) => {
    setIsAuthenticated(true);
    setAuthMode(null);
    setUser(userData);
    localStorage.setItem("tulia_auth", JSON.stringify(userData));
  };

  // 6. Prevent rendering until mounted to avoid SSR mismatch
  if (!mounted) {
    return null; // Or a simple loading spinner
  }

  return (
    <div className="flex min-h-screen">
      {isAuthenticated && user && (
        <>
          {/* Mobile backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm xl:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <Sidebar
            user={user}
            onLogout={handleLogout}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(false)}
          />
        </>
      )}

      <div className="flex flex-1 flex-col">
        <Navbar
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          onOpenAuth={setAuthMode}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>

        <Footer message={footerMessage} />
      </div>

      {authMode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setAuthMode(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AuthSlider onLogin={handleLogin} onClose={() => setAuthMode(null)} />
          </div>
        </div>
      )}
    </div>
  );
}   