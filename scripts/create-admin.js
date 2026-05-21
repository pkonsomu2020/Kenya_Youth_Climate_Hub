/**
 * One-time script to create the KYCH admin user in Supabase Auth.
 * Run with: node scripts/create-admin.js
 *
 * Reads credentials from environment variables — never hardcode them here.
 * Set these in your .env file before running:
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_KEY=...
 *   ADMIN_EMAIL=...
 *   ADMIN_PASSWORD=...
 */

require("dotenv").config();

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY   = process.env.SUPABASE_SERVICE_KEY;
const ADMIN_EMAIL   = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!SUPABASE_URL || !SERVICE_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("✗ Missing required environment variables.");
  console.error("  Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD in your .env file.");
  process.exit(1);
}

async function createAdmin() {
  console.log("Creating admin user in Supabase Auth...\n");

  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
    },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { role: "admin", name: "KYCH Admin" },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    if (data.msg?.includes("already been registered") || data.code === "email_exists") {
      console.log("✓ Admin user already exists — nothing to do.");
      return;
    }
    console.error("✗ Failed to create admin user:");
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }

  console.log("✓ Admin user created successfully!");
  console.log(`  Email:   ${ADMIN_EMAIL}`);
  console.log(`  User ID: ${data.id}`);
  console.log("\nYou can now log in at https://kenyayouthclimatehub.org/admin-hub/login");
}

createAdmin().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
