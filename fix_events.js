const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: __dirname + "/.env" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function fixEvents() {
  const titlesToFix = [
    "AI Everything Kenya x GITEX Kenya",
    "Andela x OpenAI Codex Champions Showcase",
    "Africa Soft Power Summit 2026"
  ];

  for (const title of titlesToFix) {
    const { data, error } = await supabase
      .from("events_live")
      .update({ event_date: "2026-05-19T00:00:00.000Z" })
      .ilike("title", `%${title}%`)
      .select("id, title, event_date");

    if (error) {
      console.error(`Error updating ${title}:`, error.message);
    } else {
      console.log(`Updated ${data.length} records for: ${title}`);
      console.log(data);
    }
  }

  // Then run the expirePastEvents logic to show it works
  console.log("Running expirePastEvents...");
  const { expirePastEvents } = require("./lib/services/eventStorage.js");
  const expiredCount = await expirePastEvents();
  console.log(`Expired count: ${expiredCount}`);
}

fixEvents();
