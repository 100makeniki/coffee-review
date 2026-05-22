'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { supabase } from '../lib/supabase'

const ADMIN_PASSWORD = 'coffee0409'
const COOKIE_NAME = 'admin_auth'

async function checkAuth() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(COOKIE_NAME)
  if (authCookie?.value !== ADMIN_PASSWORD) {
    throw new Error('Unauthorized')
  }
}

export async function loginAction(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const password = formData.get('password') as string
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, ADMIN_PASSWORD, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 時間
      path: '/',
    })
    redirect('/admin')
  }
  return { error: 'パスワードが違います' }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  redirect('/admin')
}

export type BeanFormState = { error: string | null; success: boolean }

export async function addBeanAction(
  prevState: BeanFormState,
  formData: FormData
): Promise<BeanFormState> {
  await checkAuth()

  const bean = {
    name: formData.get('name') as string,
    brand: formData.get('brand') as string,
    roast: formData.get('roast') as string,
    score_taste: Number(formData.get('score_taste')),
    score_cospa: Number(formData.get('score_cospa')),
    score_espresso: Number(formData.get('score_espresso')),
    score_latte: Number(formData.get('score_latte')),
    score_total: Number(formData.get('score_total')),
    review: formData.get('review') as string,
  }

  const { error } = await supabase.from('beans').insert(bean)
  if (error) return { error: error.message, success: false }

  revalidatePath('/admin')
  revalidatePath('/beans')
  revalidatePath('/')
  return { error: null, success: true }
}

export async function updateBeanAction(
  prevState: BeanFormState,
  formData: FormData
): Promise<BeanFormState> {
  await checkAuth()

  const id = formData.get('id') as string
  const bean = {
    name: formData.get('name') as string,
    brand: formData.get('brand') as string,
    roast: formData.get('roast') as string,
    score_taste: Number(formData.get('score_taste')),
    score_cospa: Number(formData.get('score_cospa')),
    score_espresso: Number(formData.get('score_espresso')),
    score_latte: Number(formData.get('score_latte')),
    score_total: Number(formData.get('score_total')),
    review: formData.get('review') as string,
  }

  const { error } = await supabase.from('beans').update(bean).eq('id', id)
  if (error) return { error: error.message, success: false }

  revalidatePath('/admin')
  revalidatePath('/beans')
  revalidatePath('/')
  revalidatePath(`/beans/${id}`)
  return { error: null, success: true }
}

export async function deleteBeanAction(
  prevState: BeanFormState,
  formData: FormData
): Promise<BeanFormState> {
  await checkAuth()

  const id = formData.get('id') as string
  const { error } = await supabase.from('beans').delete().eq('id', id)
  if (error) return { error: error.message, success: false }

  revalidatePath('/admin')
  revalidatePath('/beans')
  revalidatePath('/')
  return { error: null, success: true }
}

export async function deleteCommentAction(
  prevState: BeanFormState,
  formData: FormData
): Promise<BeanFormState> {
  await checkAuth()

  const id = formData.get('id') as string
  const beanId = formData.get('bean_id') as string
  const { error } = await supabase.from('bean_comments').delete().eq('id', id)
  if (error) return { error: error.message, success: false }

  revalidatePath('/admin/beans')
  if (beanId) revalidatePath(`/beans/${beanId}`)
  return { error: null, success: true }
}
