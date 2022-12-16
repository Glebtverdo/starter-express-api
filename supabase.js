const {createClient} = require('@supabase/supabase-js')
supabase = createClient(process.env.SB_URL, process.env.SB_KEY)

module.exports = supabase