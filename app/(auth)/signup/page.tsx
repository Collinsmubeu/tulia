'use client'

import { useActionState } from 'react'
import { signupAction } from '@/actions/signup-action'

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signupAction, {
    message: '',
    type: '',
  })

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full border p-2 rounded"
        />
      </div>
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
        className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        {isPending ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  )
}
