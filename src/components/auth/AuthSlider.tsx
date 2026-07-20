"use client";

import { useState } from "react";
import { useActionState, useEffect } from "react";
import { loginAction } from "@/actions/login-action";
import { signupAction } from "@/actions/signup-action";

interface AuthSliderProps {
  onLogin: (user: { name: string; email: string; role: string }) => void;
  onClose: () => void;
}

export default function AuthSlider({ onLogin, onClose }: AuthSliderProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5">
      <div className="flex">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
            mode === "login"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
            mode === "signup"
              ? "border-b-2 border-emerald-600 text-emerald-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Sign Up
        </button>
      </div>

      <div className="p-8">
        {mode === "login" ? (
          <LoginForm onLogin={onLogin} onSwitch={() => setMode("signup")} />
        ) : (
          <SignupForm onSwitch={() => setMode("login")} />
        )}
        <button
          onClick={onClose}
          className="mt-6 w-full text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function LoginForm({ onLogin, onSwitch }: { onLogin: (user: { name: string; email: string; role: string }) => void; onSwitch: () => void }) {
  const [state, formAction, isPending] = useActionState(loginAction, {
    message: "",
    type: "",
  });

  useEffect(() => {
    if (state.type === "success" && state.user) {
      onLogin(state.user);
    }
  }, [state.type, state.user, onLogin]);

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
        <p className="mt-1 text-sm text-slate-600">Sign in to access your services</p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            placeholder="••••••••"
          />
        </div>

        {state.message && (
          <p
            className={`text-sm ${
              state.type === "success" ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-1 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <button
          onClick={onSwitch}
          className="font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Create account
        </button>
      </p>
    </div>
  );
}

function SignupForm({ onSwitch }: { onSwitch: () => void }) {
  const [state, formAction, isPending] = useActionState(signupAction, {
    message: "",
    type: "",
  });

  useEffect(() => {
    if (state.type === "success") {
      onSwitch();
    }
  }, [state.type, onSwitch]);

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Create account</h2>
        <p className="mt-1 text-sm text-slate-600">Join Tulia and get started today</p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Full Name</label>
          <input
            name="name"
            type="text"
            required
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            placeholder="••••••••"
          />
        </div>

        {state.message && (
          <p
            className={`text-sm ${
              state.type === "success" ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-1 w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="font-semibold text-emerald-600 transition hover:text-emerald-700"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
