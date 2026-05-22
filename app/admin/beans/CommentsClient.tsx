'use client'

import { useActionState, useState } from 'react'
import { deleteCommentAction, BeanFormState } from '../actions'

type Comment = {
  id: number
  bean_id: number
  name: string
  content: string
  created_at: string
  beans: { name: string } | null
}

const initialState: BeanFormState = { error: null, success: false }

function DeleteCommentButton({ comment }: { comment: Comment }) {
  const [state, formAction, pending] = useActionState(deleteCommentAction, initialState)

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm(`このコメントを削除しますか？\n「${comment.content.slice(0, 30)}${comment.content.length > 30 ? '…' : ''}」`)) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={comment.id} />
      <input type="hidden" name="bean_id" value={comment.bean_id} />
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

export default function CommentsClient({ comments }: { comments: Comment[] }) {
  const [filterBeanId, setFilterBeanId] = useState<number | null>(null)

  // ユニークな豆リストをフィルター用に生成
  const beanOptions = Array.from(
    new Map(
      comments
        .filter((c) => c.beans)
        .map((c) => [c.bean_id, c.beans!.name])
    ).entries()
  ).sort((a, b) => a[1].localeCompare(b[1], 'ja'))

  const filtered = filterBeanId
    ? comments.filter((c) => c.bean_id === filterBeanId)
    : comments

  return (
    <div className="min-h-screen bg-amber-50">
      {/* ヘッダー */}
      <header className="bg-amber-900 text-white py-5 px-8">
        <h1 className="text-2xl font-bold">☕ 管理画面</h1>
        <p className="text-amber-300 text-sm mt-0.5">コメント管理</p>
      </header>

      {/* ナビ */}
      <nav className="bg-amber-800 text-white px-8 py-2.5 flex gap-6 text-sm">
        <a href="/admin" className="hover:text-amber-200 transition-colors">← 豆の管理に戻る</a>
        <a href="/" className="hover:text-amber-200 transition-colors">サイトトップ</a>
      </nav>

      <main className="max-w-5xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-xl font-bold text-amber-900">
            コメント一覧{' '}
            <span className="text-base font-normal text-gray-500">
              （{filtered.length} / {comments.length} 件）
            </span>
          </h2>

          {/* 豆でフィルター */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">豆で絞り込み：</label>
            <select
              value={filterBeanId ?? ''}
              onChange={(e) => setFilterBeanId(e.target.value ? Number(e.target.value) : null)}
              className="border border-amber-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="">すべて</option>
              {beanOptions.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
            <p className="text-4xl mb-3">💬</p>
            <p>{filterBeanId ? 'この豆へのコメントはありません' : 'まだコメントがありません'}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-amber-100 text-amber-900 text-xs">
                <tr>
                  <th className="text-left px-6 py-3">投稿者 / 日時</th>
                  <th className="text-left px-6 py-3">豆</th>
                  <th className="text-left px-6 py-3">コメント</th>
                  <th className="text-right px-6 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((comment) => (
                  <tr key={comment.id} className="border-t border-amber-50 hover:bg-amber-50/50 transition-colors">
                    <td className="px-6 py-4 align-top">
                      <p className="font-medium text-amber-900 text-sm">{comment.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(comment.created_at).toLocaleString('ja-JP')}
                      </p>
                    </td>
                    <td className="px-6 py-4 align-top">
                      {comment.beans ? (
                        <a
                          href={`/beans/${comment.bean_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-amber-700 hover:underline"
                        >
                          {comment.beans.name}
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">（削除済み）</span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top max-w-xs">
                      <p className="text-sm text-gray-700 leading-relaxed break-words">
                        {comment.content}
                      </p>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex justify-end">
                        <DeleteCommentButton comment={comment} />
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
