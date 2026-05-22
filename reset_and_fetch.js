const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: __dirname + "/.env" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function resetAndFetch() {
  console.log("Wiping current events...");
  const { error } = await supabase
    .from("events_live")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all

  if (error) {
    console.error("Error wiping events:", error.message);
    return;
  }
  console.log("Events wiped. Starting fetch job...");
  
  const { runEventJob } = require("./lib/jobs/fetchEvents.js");
  await runEventJob();
}

resetAndFetch();
