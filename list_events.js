const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: __dirname + "/.env" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function listEvents() {
  const { data, error } = await supabase
    .from("events_live")
    .select("id, title, event_date, source")
    .eq("is_approved", true)
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error.message);
    return;
  }

  console.log(`Found ${data.length} active events:`);
  data.forEach(e => {
    console.log(`- ${e.event_date ? e.event_date.split('T')[0] : 'No Date'}: ${e.title} (Source: ${e.source})`);
  });
}

listEvents();
