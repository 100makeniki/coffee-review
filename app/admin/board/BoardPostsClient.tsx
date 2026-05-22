'use client'

import { useActionState } from 'react'
import { deleteBoardPostAction, BeanFormState } from '../actions'

type Post = {
  id: number
  name: string
  content: string
  created_at: string
}

const initialState: BeanFormState = { error: null, success: false }

function DeletePostButton({ post }: { post: Post }) {
  const [state, formAction, pending] = useActionState(deleteBoardPostAction, initialState)

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm(`この投稿を削除しますか？\n「${post.content.slice(0, 30)}${post.content.length > 30 ? '…' : ''}」`)) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={post.id} />
      <button
        type="submit"
        disabled={pending}
        className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors font-medium whitespace-nowrap"
      >
        {pending ? '削除中' : '削除'}
      </button>
      {state.error && <p className="text-red-500 text-xs mt-1">{state.error}</p>}
    </form>
  )
}

export default function BoardPostsClient({ posts }: { posts: Post[] }) {
  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-amber-900 text-white py-5 px-8">
        <h1 className="text-2xl font-bold">☕ 管理画面</h1>
        <p className="text-amber-300 text-sm mt-0.5">掲示板管理</p>
      </header>

      <nav className="bg-amber-800 text-white px-8 py-2.5 flex gap-6 text-sm">
        <a href="/admin" className="hover:text-amber-200 transition-colors">← 豆の管理に戻る</a>
        <a href="/board" className="hover:text-amber-200 transition-colors">掲示板を見る</a>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-10">
        <h2 className="text-xl font-bold text-amber-900 mb-6">
          掲示板投稿一覧{' '}
          <span className="text-base font-normal text-gray-500">（{posts.length}件）</span>
        </h2>

        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p>まだ投稿がありません</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-amber-100 text-amber-900 text-xs">
                <tr>
                  <th className="text-left px-6 py-3">投稿者 / 日時</th>
                  <th className="text-left px-6 py-3">内容</th>
                  <th className="text-right px-6 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-t border-amber-50 hover:bg-amber-50/50 transition-colors">
                    <td className="px-6 py-4 align-top whitespace-nowrap">
                      <p className="font-medium text-amber-900 text-sm">{post.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(post.created_at).toLocaleString('ja-JP')}
                      </p>
                    </td>
                    <td className="px-6 py-4 align-top max-w-xs">
                      <p className="text-sm text-gray-700 leading-relaxed break-words">
                        {post.content}
                      </p>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex justify-end">
                        <DeletePostButton post={post} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
