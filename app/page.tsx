import { supabase } from './lib/supabase'

export default async function Home() {
  const { data: beans } = await supabase
    .from('beans')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-amber-50">
      {/* ヘッダー */}
      <header className="bg-amber-900 text-white py-6 px-8">
        <h1 className="text-3xl font-bold">☕ 素人コーヒー豆レビュー</h1>
        <p className="text-amber-200 mt-1">「なんか美味い」レベルの正直な感想を集めた場所</p>
      </header>

      {/* ナビゲーション */}
      <nav className="bg-amber-800 text-white px-8 py-3 flex gap-6 text-sm">
        <a href="/" className="hover:text-amber-200">トップ</a>
        <a href="/beans" className="hover:text-amber-200">豆一覧</a>
        <a href="/ranking" className="hover:text-amber-200">ランキング</a>
        <a href="/board" className="hover:text-amber-200">掲示板</a>
      </nav>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">最近レビューした豆</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {beans?.map((bean) => (
            <div key={bean.id} className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold text-amber-900">{bean.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{bean.brand} / {bean.roast}</p>
              <div className="mt-4 flex gap-4 text-sm">
                <span>味 {'★'.repeat(bean.score_taste)}{'☆'.repeat(5 - bean.score_taste)}</span>
                <span>コスパ {'★'.repeat(bean.score_cospa)}{'☆'.repeat(5 - bean.score_cospa)}</span>
              </div>
              <p className="mt-3 text-gray-600 text-sm">{bean.review}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}