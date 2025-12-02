import { createClient } from '@supabase/supabase-js';

// Pegando as chaves do arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('ATENÇÃO: Faltam as chaves do Supabase no arquivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);