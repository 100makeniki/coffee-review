import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import CommentsClient from './CommentsClient'

const ADMIN_PASSWORD = 'coffee0409'
const COOKIE_NAME = 'admin_auth'

export default async function AdminBeansPage() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(COOKIE_NAME)
  if (authCookie?.value !== ADMIN_PASSWORD) {
    redirect('/admin')
  }

  const { data: comments } = await supabase
    .from('bean_comments')
    .select('*, beans(name)')
    .order('created_at', { ascending: false })

  return <CommentsClient comments={comments ?? []} />
}
