import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ozkayzvnvcdbgikdhsmy.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_cb6K_p9fcIW22nZx-xfcNQ_2fU70VpU';

export const supabase = createClient(supabaseUrl, supabaseKey);
