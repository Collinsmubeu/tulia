"use client";

import { useActionState } from "react";
import { signupAction } from "@/actions/signup-action";

interface SignupFormProps {
  onSwitch: () => void;
}

export default function SignupForm({ onSwitch }: SignupFormProps) {
  const [state, formAction, isPending] = useActionState(signupAction, {
    message: "",
    type: "",
  });

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
