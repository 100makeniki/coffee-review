import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import BoardPostsClient from './BoardPostsClient'

const ADMIN_PASSWORD = 'coffee0409'
const COOKIE_NAME = 'admin_auth'

export default async function AdminBoardPage() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(COOKIE_NAME)
  if (authCookie?.value !== ADMIN_PASSWORD) {
    redirect('/admin')
  }

  const { data: posts } = await supabase
    .from('board_posts')
    .select('*')
    .order('created_at', { ascending: false })

  return <BoardPostsClient posts={posts ?? []} />
}
