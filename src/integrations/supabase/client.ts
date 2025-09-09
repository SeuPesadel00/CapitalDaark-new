// Este arquivo é gerado automaticamente. Não o edite diretamente.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bnaxtnrzkzuzrkxcjyxj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuYXh0bnJ6a3p1enJreGNqeXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzODQ5OTQsImV4cCI6MjA3MTk2MDk5NH0.KjmDe19yy65fEE0u2Io4Tj14RiSmRbsPUHQvg9EP_so";

// Importe o cliente supabase assim:
// importar { supabase } de "@/integrações/supabase/cliente";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});