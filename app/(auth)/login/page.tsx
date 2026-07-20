'use client'

import { useActionState } from 'react'
import { loginAction } from '@/actions/login-action'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, {
    message: '',
    type: '',
  })

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full border p-2 rounded"
        />
      </div>

      {state.message && (
        <p
          className={
            state.type === 'success'
              ? 'text-green-500 text-sm'
              : 'text-red-500 text-sm'
          }
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        {isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
