// Se tiene que reemplazar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
// en el archivo .env con los valores reales del proyecto.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.VITE_SUPABASE_URL  || '';
const supabaseKey  = process.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey)
