import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://iajclqnwknlbitbnflpz.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhamNscW53a25sYml0Ym5mbHB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMTA0MDgsImV4cCI6MjEwNTc4NjQwOH0.4KC_GbBpygl1zZUerSCHo4lULFky9jzujJE0y4VEaWg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
