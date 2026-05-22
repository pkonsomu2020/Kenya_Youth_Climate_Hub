const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: __dirname + "/.env" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function fixFinalEvents() {
  // 1. Remove the church event
  const { data: churchData, error: churchError } = await supabase
    .from("events_live")
    .update({ is_approved: false })
    .ilike("title", "%Eco-Diakonia%")
    .select("id, title");

  if (churchError) {
    console.error("Error removing church event:", churchError.message);
  } else {
    console.log(`Removed ${churchData?.length} church events`);
  }
}

fixFinalEvents();
