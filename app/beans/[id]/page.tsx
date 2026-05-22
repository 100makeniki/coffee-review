import { supabase } from '../../lib/supabase'
import BeanComments from './BeanComments'

export default async function BeanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: bean } = await supabase
    .from('beans')
    .select('*')
    .eq('id', id)
    .single()

  if (!bean) return <div>豆が見つかりませんでした</div>

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

      <main className="max-w-3xl mx-auto px-8 py-12">
        <div className="bg-white rounded-xl shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-amber-900">{bean.name}</h2>
          <p className="text-gray-500 mt-1">{bean.brand} / {bean.roast}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { label: '味', score: bean.score_taste },
              { label: 'コスパ', score: bean.score_cospa },
              { label: 'エスプレッソ', score: bean.score_espresso },
              { label: 'ラテ', score: bean.score_latte },
              { label: '総合', score: bean.score_total },
            ].map(({ label, score }) => (
              <div key={label} className="bg-amber-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-lg mt-1">{'★'.repeat(score)}{'☆'.repeat(5 - score)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="font-bold text-amber-900 mb-2">レビュー</h3>
            <p className="text-gray-700 leading-relaxed">{bean.review}</p>
          </div>
        </div>

        <BeanComments beanId={Number(id)} />
      </main>
    </div>
  )
}