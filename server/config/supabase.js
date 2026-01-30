import process from 'process'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY


let supabase = null
if (url && key) {
  supabase = createClient(url, key)
}

export default supabase
