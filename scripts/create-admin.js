/**
 * One-time script to create the KYCH admin user in Supabase Auth.
 * Run with: node scripts/create-admin.js
 */

const SUPABASE_URL = "https://vtlsykfqhbifwumfaisl.supabase.co";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bHN5a2ZxaGJpZnd1bWZhaXNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODYyOTc5NCwiZXhwIjoyMDk0MjA1Nzk0fQ.HGPE_r4IaCusAAnX5Pivp1-U4uMWuz7QUjgVeI1QmeQ";

const ADMIN_EMAIL = "admin@kych.org";
const ADMIN_PASSWORD = "KYCH@2026!";

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
      email_confirm: true, // skip email verification
      user_metadata: {
        role: "admin",
        name: "KYCH Admin",
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    // If user already exists, that's fine
    if (data.msg?.includes("already been registered") || data.code === "email_exists") {
      console.log("✓ Admin user already exists — nothing to do.");
      return;
    }
    console.error("✗ Failed to create admin user:");
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }

  console.log("✓ Admin user created successfully!");
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log(`  User ID:  ${data.id}`);
  console.log("\nYou can now log in at https://kenyayouthclimatehub.org/admin-hub/login");
}

createAdmin().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
