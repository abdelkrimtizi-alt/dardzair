import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zbhssdoihsfxrgyjmoli.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_ZjSaf1cFFxLHgSwvfkO1GA_PRNDqF02";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
