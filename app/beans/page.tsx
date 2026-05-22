import { supabase } from '../lib/supabase'

export default async function BeansPage() {
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

      <main className="max-w-4xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">豆一覧（{beans?.length}件）</h2>

        <table className="w-full bg-white rounded-xl shadow overflow-hidden">
          <thead className="bg-amber-100 text-amber-900 text-sm">
            <tr>
              <th className="text-left px-6 py-3">豆の名前</th>
              <th className="text-left px-6 py-3">ブランド</th>
              <th className="text-left px-6 py-3">焙煎</th>
              <th className="text-center px-6 py-3">味</th>
              <th className="text-center px-6 py-3">コスパ</th>
              <th className="text-center px-6 py-3">総合</th>
            </tr>
          </thead>
          <tbody>
            {beans?.map((bean) => (
              <tr key={bean.id} className="border-t border-amber-100 hover:bg-amber-50 cursor-pointer">
                <td className="px-6 py-4 font-medium text-amber-900">
                  <a href={`/beans/${bean.id}`}>{bean.name}</a>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{bean.brand}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{bean.roast}</td>
                <td className="px-6 py-4 text-center text-sm">{'★'.repeat(bean.score_taste)}{'☆'.repeat(5 - bean.score_taste)}</td>
                <td className="px-6 py-4 text-center text-sm">{'★'.repeat(bean.score_cospa)}{'☆'.repeat(5 - bean.score_cospa)}</td>
                <td className="px-6 py-4 text-center text-sm">{'★'.repeat(bean.score_total)}{'☆'.repeat(5 - bean.score_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  )
}