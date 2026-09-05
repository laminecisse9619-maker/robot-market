import { createClient } from '@supabase/supabase-js'

// Côté serveur uniquement : on utilise la clé service_role (jamais exposée au
// navigateur) pour pouvoir enregistrer les demandes de devis/revendication
// même si les policies RLS restreignent la lecture aux admins.
const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabaseAdmin =
  supabaseUrl && serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null

export const isSupabaseAdminConfigured = Boolean(supabaseAdmin)
