'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Comment = {
  id: number
  name: string
  content: string
  created_at: string
}

export default function BeanComments({ beanId }: { beanId: number }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchComments = async () => {
    const { data } = await supabase
      .from('bean_comments')
      .select('*')
      .eq('bean_id', beanId)
      .order('created_at', { ascending: false })
    if (data) setComments(data)
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const handleSubmit = async () => {
    if (!content.trim()) return
    setLoading(true)
    await supabase.from('bean_comments').insert({
      bean_id: beanId,
      name: name.trim() || '名無しさん',
      content: content.trim(),
    })
    setName('')
    setContent('')
    await fetchComments()
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-xl shadow p-8">
      <h3 className="font-bold text-amber-900 mb-6">みんなのコメント</h3>
      <div className="mb-8">
        <input
          type="text"
          placeholder="名前（省略可）"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-amber-200 rounded-lg px-4 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <textarea
          placeholder="この豆についてコメントする..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full border border-amber-200 rounded-lg px-4 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-amber-700 text-white px-6 py-2 rounded-lg text-sm hover:bg-amber-600 disabled:opacity-50"
        >
          {loading ? '送信中...' : '投稿する'}
        </button>
      </div>
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-400 text-sm">まだコメントがありません。最初のコメントを書いてみてください！</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="border-t border-amber-100 pt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-amber-900 text-sm">{comment.name}</span>
              <span className="text-xs text-gray-400">
                {new Date(comment.created_at).toLocaleString('ja-JP')}
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}