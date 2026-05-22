import { cookies } from 'next/headers'
import LoginForm from './LoginForm'
import AdminClient from './AdminClient'
import { supabase } from '../lib/supabase'

const ADMIN_PASSWORD = 'coffee0409'
const COOKIE_NAME = 'admin_auth'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(COOKIE_NAME)
  const isAuthenticated = authCookie?.value === ADMIN_PASSWORD

  if (!isAuthenticated) {
    return <LoginForm />
  }

  const { data: beans } = await supabase
    .from('beans')
    .select('*')
    .order('created_at', { ascending: false })

  return <AdminClient beans={beans ?? []} />
}
