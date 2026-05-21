import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM_EMAIL = "bookings@kenyayouthclimatehub.org";
const ADMIN_EMAIL = "pkinara840@gmail.com";

// ── POST — new booking ────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, organization, date, start_time, end_time, space_type, purpose } = body;

    if (!name || !email || !phone || !date || !start_time || !end_time || !space_type || !purpose) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Save to Supabase
    const { data, error } = await supabase
      .from("bookings")
      .insert([{ name, email, phone, organization, date, start_time, end_time, space_type, purpose, status: "pending" }])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
    }

    // 2. Email the user — booking received confirmation
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: `Booking Request Received — Kenya Youth Climate Hub`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
            <div style="background:#059669;padding:24px 32px;border-radius:12px 12px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">Booking Request Received</h1>
              <p style="color:rgba(255,255,255,.8);margin:6px 0 0;font-size:14px">National Climate Change Resource Centre</p>
            </div>
            <div style="background:#fff;padding:28px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
              <p style="margin:0 0 16px">Hi <strong>${name}</strong>,</p>
              <p style="margin:0 0 20px;color:#4b5563">Thank you for your booking request. We have received it and our team will review and confirm availability shortly.</p>

              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin-bottom:20px">
                <h3 style="margin:0 0 12px;font-size:14px;color:#059669;text-transform:uppercase;letter-spacing:.05em">Booking Details</h3>
                <table style="width:100%;font-size:14px;border-collapse:collapse">
                  <tr><td style="padding:4px 0;color:#6b7280;width:40%">Space Type</td><td style="padding:4px 0;font-weight:600">${space_type}</td></tr>
                  <tr><td style="padding:4px 0;color:#6b7280">Date</td><td style="padding:4px 0;font-weight:600">${new Date(date + "T00:00:00").toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</td></tr>
                  <tr><td style="padding:4px 0;color:#6b7280">Time</td><td style="padding:4px 0;font-weight:600">${start_time} – ${end_time}</td></tr>
                  <tr><td style="padding:4px 0;color:#6b7280">Organization</td><td style="padding:4px 0;font-weight:600">${organization || "N/A"}</td></tr>
                  <tr><td style="padding:4px 0;color:#6b7280">Purpose</td><td style="padding:4px 0;font-weight:600">${purpose}</td></tr>
                  <tr><td style="padding:4px 0;color:#6b7280">Status</td><td style="padding:4px 0"><span style="background:#fef9c3;color:#854d0e;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">PENDING REVIEW</span></td></tr>
                </table>
              </div>

              <p style="margin:0 0 8px;color:#4b5563;font-size:14px">You will receive another email once your booking is approved or rejected.</p>
              <p style="margin:0;color:#4b5563;font-size:14px">For enquiries, contact us at <a href="mailto:info@kenyayouthclimatehub.org" style="color:#059669">info@kenyayouthclimatehub.org</a></p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
              <p style="margin:0;font-size:12px;color:#9ca3af">Kenya Youth Climate Hub · National Climate Change Resource Centre, Along Ngong Road, Nairobi</p>
            </div>
          </div>
        `,
      });
    } catch (e) { console.error("User confirmation email failed:", e); }

    // 3. Email the admin — new booking notification
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `🔔 New Space Booking Request — ${name} (${space_type})`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
            <div style="background:#0f172a;padding:24px 32px;border-radius:12px 12px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">New Booking Request</h1>
              <p style="color:rgba(255,255,255,.5);margin:6px 0 0;font-size:13px">Action required — review in Admin Hub</p>
            </div>
            <div style="background:#fff;padding:28px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin-bottom:20px">
                <table style="width:100%;font-size:14px;border-collapse:collapse">
                  <tr><td style="padding:4px 0;color:#6b7280;width:40%">Name</td><td style="padding:4px 0;font-weight:600">${name}</td></tr>
                  <tr><td style="padding:4px 0;color:#6b7280">Email</td><td style="padding:4px 0;font-weight:600">${email}</td></tr>
                  <tr><td style="padding:4px 0;color:#6b7280">Phone</td><td style="padding:4px 0;font-weight:600">${phone}</td></tr>
                  <tr><td style="padding:4px 0;color:#6b7280">Organization</td><td style="padding:4px 0;font-weight:600">${organization || "N/A"}</td></tr>
                  <tr><td style="padding:4px 0;color:#6b7280">Space Type</td><td style="padding:4px 0;font-weight:600">${space_type}</td></tr>
                  <tr><td style="padding:4px 0;color:#6b7280">Date</td><td style="padding:4px 0;font-weight:600">${date}</td></tr>
                  <tr><td style="padding:4px 0;color:#6b7280">Time</td><td style="padding:4px 0;font-weight:600">${start_time} – ${end_time}</td></tr>
                  <tr><td style="padding:4px 0;color:#6b7280">Purpose</td><td style="padding:4px 0;font-weight:600">${purpose}</td></tr>
                </table>
              </div>
              <a href="https://kenyayouthclimatehub.org/admin-hub/booking-space" style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">
                Review in Admin Hub →
              </a>
            </div>
          </div>
        `,
      });
    } catch (e) { console.error("Admin notification email failed:", e); }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Booking POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── GET — list bookings ───────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "100");

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
