import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sfwgikdpbmlevpahpsne.supabase.co';
const supabaseAnonKey = 'sb_publishable_1Bb_uQhJt_16RwtOo0E9nQ_qTmfUGD5';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);