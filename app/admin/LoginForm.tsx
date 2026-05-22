'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { error: null })

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-5xl">☕</span>
          <h1 className="text-2xl font-bold text-amber-900 mt-3">管理画面</h1>
          <p className="text-sm text-gray-500 mt-1">パスワードを入力してください</p>
        </div>

        <form action={action} className="flex flex-col gap-4">
          <input
            type="password"
            name="password"
            placeholder="パスワード"
            required
            className="border border-amber-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          {state.error && (
            <p className="text-red-500 text-sm text-center">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="bg-amber-900 text-white rounded-lg py-3 text-sm font-medium hover:bg-amber-800 disabled:opacity-60 transition-colors"
          >
            {pending ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-xs text-amber-600 hover:underline">
            ← サイトに戻る
          </a>
        </div>
      </div>
    </div>
  )
}
