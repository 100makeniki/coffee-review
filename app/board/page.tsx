'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Post = {
  id: number
  name: string
  content: string
  created_at: string
}

export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('board_posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setPosts(data)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSubmit = async () => {
    if (!content.trim()) return
    setLoading(true)
    await supabase.from('board_posts').insert({
      name: name.trim() || '名無しさん',
      content: content.trim(),
    })
    setName('')
    setContent('')
    await fetchPosts()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-amber-900 text-white py-6 px-8">
        <h1 className="text-3xl font-bold">☕ 素人コーヒー豆レビュー</h1>
        <p className="text-amber-200 mt-1">「なんか美味い」レベルの正直な感想を集めた場所</p>
      </header>

      <nav className="bg-amber-800 text-white px-8 py-3 flex gap-6 text-sm">
        <a href="/" className="hover:text-amber-200">トップ</a>
        <a href="/beans" className="hover:text-amber-200">豆一覧</a>
        <a href="/ranking" className="hover:text-amber-200">ランキング</a>
        <a href="/board" className="hover:text-amber-200">掲示板</a>
      </nav>

      <main className="max-w-2xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">総合掲示板</h2>

        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h3 className="font-bold text-amber-900 mb-4">投稿する</h3>
          <input
            type="text"
            placeholder="名前（省略可）"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-amber-200 rounded-lg px-4 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <textarea
            placeholder="コメントを入力..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
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
          {posts.length === 0 && (
            <p className="text-gray-400 text-sm text-center">まだ投稿がありません</p>
          )}
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-amber-900 text-sm">{post.name}</span>
                <span className="text-xs text-gray-400">
                  {new Date(post.created_at).toLocaleString('ja-JP')}
                </span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{post.content}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}