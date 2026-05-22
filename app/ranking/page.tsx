import { supabase } from '../lib/supabase'

type RankingType = 'score_taste' | 'score_cospa' | 'score_espresso' | 'score_latte' | 'score_total'

const rankingTabs: { key: RankingType; label: string }[] = [
  { key: 'score_total', label: '総合' },
  { key: 'score_taste', label: '味' },
  { key: 'score_cospa', label: 'コスパ' },
  { key: 'score_espresso', label: 'エスプレッソ' },
  { key: 'score_latte', label: 'ラテ' },
]

export default async function RankingPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams
  const currentType: RankingType = (type as RankingType) || 'score_total'

  const { data: beans } = await supabase
    .from('beans')
    .select('*')
    .order(currentType, { ascending: false })

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
        <h2 className="text-2xl font-bold text-amber-900 mb-6">ランキング</h2>
        <div className="flex gap-2 mb-8 flex-wrap">
          {rankingTabs.map((tab) => (
            <a key={tab.key} href={`/ranking?type=${tab.key}`} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentType === tab.key ? 'bg-amber-900 text-white' : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-100'}`}>
              {tab.label}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {beans?.map((bean, index) => (
            <a key={bean.id} href={`/beans/${bean.id}`} className="bg-white rounded-xl shadow p-6 flex items-center gap-6 hover:bg-amber-50 transition-colors">
              <span className={`text-3xl font-bold w-10 text-center ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-gray-300'}`}>
                {index + 1}
              </span>
              <div className="flex-1">
                <h3 className="font-bold text-amber-900">{bean.name}</h3>
                <p className="text-sm text-gray-500">{bean.brand} / {bean.roast}</p>
              </div>
              <div className="text-right">
                <p className="text-lg">{'★'.repeat(bean[currentType])}{'☆'.repeat(5 - bean[currentType])}</p>
                <p className="text-xs text-gray-400 mt-1">{rankingTabs.find(t => t.key === currentType)?.label}</p>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}