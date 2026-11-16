import {createSupabaseEdgeHandler} from '../../../server/supabase-edge.js';
import roster from '../../../data/champions.json' with {type:'json'};
Deno.serve(createSupabaseEdgeHandler({roster,env:{
 SUPABASE_URL:Deno.env.get('SUPABASE_URL'),
 SUPABASE_ANON_KEY:Deno.env.get('SUPABASE_ANON_KEY'),
 SUPABASE_SERVICE_ROLE_KEY:Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
 ALLOWED_ORIGINS:Deno.env.get('ALLOWED_ORIGINS')||'https://bpac888.github.io',
}}));
