'use client'

import { useState, useActionState, useCallback } from 'react'
import { logoutAction, deleteBeanAction, BeanFormState } from './actions'
import BeanForm from './BeanForm'

type Bean = {
  id: number
  name: string
  brand: string
  roast: string
  score_taste: number
  score_cospa: number
  score_espresso: number
  score_latte: number
  score_total: number
  review: string
  created_at: string
}

type Mode = 'list' | 'add' | 'edit'

const initialState: BeanFormState = { error: null, success: false }

function DeleteButton({ bean }: { bean: Bean }) {
  const [state, formAction, pending] = useActionState(deleteBeanAction, initialState)

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm(`「${bean.name}」を削除しますか？\nこの操作は取り消せません。`)) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={bean.id} />
      <button
        type="submit"
        disabled={pending}
        className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors font-medium"
      >
        {pending ? '削除中' : '削除'}
      </button>
      {state.error && <p className="text-red-500 text-xs mt-1">{state.error}</p>}
    </form>
  )
}

export default function AdminClient({ beans: initialBeans }: { beans: Bean[] }) {
  const [mode, setMode] = useState<Mode>('list')
  const [editTarget, setEditTarget] = useState<Bean | null>(null)

  const openAdd = () => {
    setEditTarget(null)
    setMode('add')
  }

  const openEdit = (bean: Bean) => {
    setEditTarget(bean)
    setMode('edit')
  }

  const closeForm = () => {
    setMode('list')
    setEditTarget(null)
  }

  const handleSuccess = useCallback(() => {
    setMode('list')
    setEditTarget(null)
  }, [])

  return (
    <div className="min-h-screen bg-amber-50">
      {/* ヘッダー */}
      <header className="bg-amber-900 text-white py-5 px-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">☕ 管理画面</h1>
          <p className="text-amber-300 text-sm mt-0.5">素人コーヒー豆レビュー</p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm border border-amber-500 text-amber-200 hover:bg-amber-800 px-4 py-2 rounded-lg transition-colors"
          >
            ログアウト
          </button>
        </form>
      </header>

      {/* ナビ */}
      <nav className="bg-amber-800 text-white px-8 py-2.5 flex gap-6 text-sm">
        <a href="/" className="hover:text-amber-200 transition-colors">← サイトトップ</a>
        <a href="/beans" className="hover:text-amber-200 transition-colors">豆一覧</a>
        <a href="/admin/beans" className="hover:text-amber-200 transition-colors">コメント管理</a>
        <a href="/admin/board" className="hover:text-amber-200 transition-colors">掲示板管理</a>
      </nav>

      <main className="max-w-5xl mx-auto px-8 py-10">
        {/* タイトルと追加ボタン */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-amber-900">
            豆の管理 <span className="text-base font-normal text-gray-500">（{initialBeans.length}件）</span>
          </h2>
          <button
            onClick={openAdd}
            className="bg-amber-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> 豆を追加
          </button>
        </div>

        {/* 豆リスト */}
        {initialBeans.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
            <p className="text-4xl mb-3">☕</p>
            <p>まだ豆が登録されていません</p>
            <button
              onClick={openAdd}
              className="mt-4 text-sm text-amber-700 hover:underline"
            >
              最初の豆を追加する →
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-amber-100 text-amber-900 text-xs">
                <tr>
                  <th className="text-left px-6 py-3">名前 / ブランド</th>
                  <th className="text-left px-6 py-3 hidden sm:table-cell">焙煎</th>
                  <th className="text-center px-4 py-3 hidden md:table-cell">味</th>
                  <th className="text-center px-4 py-3 hidden md:table-cell">コスパ</th>
                  <th className="text-center px-4 py-3">総合</th>
                  <th className="text-right px-6 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {initialBeans.map((bean) => (
                  <tr
                    key={bean.id}
                    className="border-t border-amber-50 hover:bg-amber-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-amber-900 text-sm">{bean.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{bean.brand}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                      {bean.roast}
                    </td>
                    <td className="px-4 py-4 text-center text-xs hidden md:table-cell">
                      {'★'.repeat(bean.score_taste)}{'☆'.repeat(5 - bean.score_taste)}
                    </td>
                    <td className="px-4 py-4 text-center text-xs hidden md:table-cell">
                      {'★'.repeat(bean.score_cospa)}{'☆'.repeat(5 - bean.score_cospa)}
                    </td>
                    <td className="px-4 py-4 text-center text-xs">
                      {'★'.repeat(bean.score_total)}{'☆'.repeat(5 - bean.score_total)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => openEdit(bean)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors font-medium"
                        >
                          編集
                        </button>
                        <DeleteButton bean={bean} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* モーダルフォーム */}
      {(mode === 'add' || mode === 'edit') && (
        <BeanForm
          bean={mode === 'edit' && editTarget ? editTarget : undefined}
          onCancel={closeForm}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}
