"use client";

import { useActionState, useEffect } from "react";
import { loginAction } from "@/actions/login-action";

interface LoginFormProps {
  onLogin: (user: { name: string; email: string; role: string }) => void;
  onSwitch: () => void;
}

export default function LoginForm({ onLogin, onSwitch }: LoginFormProps) {
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
