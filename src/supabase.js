import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Permet de lancer l'app (et tester l'echiquier) meme sans cles configurees.
export const isSupabaseConfigured = Boolean(url && key)

export const supabase = isSupabaseConfigured
  ? createClient(url, key)
  : null

// --- Helpers auth ---
export async function getUser() {
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  return data?.user ?? null
}

export async function signInWithPassword(email, password) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUp(email, password) {
  return supabase.auth.signUp({ email, password })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export function onAuthChange(cb) {
  if (!supabase) return { unsubscribe() {} }
  const { data } = supabase.auth.onAuthStateChange((_e, session) => cb(session?.user ?? null))
  return data.subscription
}

// --- Acces aux parties ---
export async function listGames() {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getGame(id) {
  const { data, error } = await supabase.from('games').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function insertGame(game) {
  const user = await getUser()
  if (!user) throw new Error('Non connecte')
  const { data, error } = await supabase
    .from('games')
    .insert({ ...game, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteGame(id) {
  const { error } = await supabase.from('games').delete().eq('id', id)
  if (error) throw error
}
