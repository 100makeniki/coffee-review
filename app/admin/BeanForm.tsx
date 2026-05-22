'use client'

import { useActionState, useEffect } from 'react'
import { addBeanAction, updateBeanAction, BeanFormState } from './actions'

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
}

type Props = {
  bean?: Bean // 編集時に渡す
  onCancel: () => void
  onSuccess: () => void
}

const ROAST_OPTIONS = ['ライト', 'ミディアム', 'ミディアムダーク', 'ダーク', 'フレンチ']

const SCORE_FIELDS: { key: keyof Pick<Bean, 'score_taste' | 'score_cospa' | 'score_espresso' | 'score_latte' | 'score_total'>; label: string }[] = [
  { key: 'score_taste', label: '味' },
  { key: 'score_cospa', label: 'コスパ' },
  { key: 'score_espresso', label: 'エスプレッソ' },
  { key: 'score_latte', label: 'ラテ' },
  { key: 'score_total', label: '総合' },
]

const initialState: BeanFormState = { error: null, success: false }

export default function BeanForm({ bean, onCancel, onSuccess }: Props) {
  const action = bean ? updateBeanAction : addBeanAction
  const [state, formAction, pending] = useActionState(action, initialState)

  useEffect(() => {
    if (state.success) {
      onSuccess()
    }
  }, [state.success, onSuccess])

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-amber-100">
          <h2 className="text-xl font-bold text-amber-900">
            {bean ? '豆を編集' : '豆を追加'}
          </h2>
        </div>

        <form action={formAction} className="px-6 py-4 flex flex-col gap-4">
          {bean && <input type="hidden" name="id" value={bean.id} />}

          {/* 名前 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">豆の名前 *</label>
            <input
              type="text"
              name="name"
              defaultValue={bean?.name}
              required
              placeholder="例: エチオピア イルガチェフェ"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* ブランド */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ブランド</label>
            <input
              type="text"
              name="brand"
              defaultValue={bean?.brand}
              placeholder="例: タリーズ"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* 焙煎 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">焙煎度</label>
            <select
              name="roast"
              defaultValue={bean?.roast ?? ''}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            >
              <option value="">選択してください</option>
              {ROAST_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* スコア */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">スコア（1〜5）</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {SCORE_FIELDS.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <select
                    name={key}
                    defaultValue={bean?.[key] ?? 3}
                    className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {'★'.repeat(n)}{'☆'.repeat(5 - n)} ({n})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* レビュー */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">レビュー</label>
            <textarea
              name="review"
              defaultValue={bean?.review}
              rows={4}
              placeholder="感想を書いてください"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>

          {state.error && (
            <p className="text-red-500 text-sm">{state.error}</p>
          )}

          <div className="flex gap-3 pt-2 pb-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 bg-amber-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-amber-800 disabled:opacity-60 transition-colors"
            >
              {pending ? '保存中...' : bean ? '更新する' : '追加する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
