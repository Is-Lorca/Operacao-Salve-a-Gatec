const { createClient } = require("@supabase/supabase-js");

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;

if (!url || !key) {
    throw new Error(
        "SUPABASE_URL ou SUPABASE_KEY não configuradas."
    );
}

const supabase = createClient(url, key);

module.exports = supabase;
