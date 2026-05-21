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

// ── PATCH — approve or reject ─────────────────────────────────────────────────
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Update in Supabase
    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const isApproved = status === "approved";
    const statusLabel = isApproved ? "Approved ✅" : "Rejected ❌";
    const statusColor = isApproved ? "#059669" : "#dc2626";
    const statusBg    = isApproved ? "#ecfdf5"  : "#fef2f2";
    const statusText  = isApproved ? "#065f46"  : "#991b1b";

    const bookingDate = new Date(data.date + "T00:00:00").toLocaleDateString("en-KE", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    // ── Email to USER ──────────────────────────────────────────────────────
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: data.email,
        subject: `Your Booking has been ${isApproved ? "Approved" : "Rejected"} — Kenya Youth Climate Hub`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
            <div style="background:${statusColor};padding:24px 32px;border-radius:12px 12px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">Booking ${statusLabel}</h1>
              <p style="color:rgba(255,255,255,.8);margin:6px 0 0;font-size:14px">National Climate Change Resource Centre</p>
            </div>
            <div style="background:#fff;padding:28px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
              <p style="margin:0 0 16px">Hi <strong>${data.name}</strong>,</p>
              <p style="margin:0 0 20px;color:#4b5563">
                ${isApproved
                  ? "Great news! Your space booking request has been <strong>approved</strong>. We look forward to hosting you at the National Climate Change Resource Centre."
                  : "We regret to inform you that your space booking request has been <strong>rejected</strong>. Unfortunately, we are unable to accommodate your request at this time. Please try a different date or contact us for assistance."}
              </p>

              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin-bottom:20px">
                <h3 style="margin:0 0 12px;font-size:14px;color:${statusColor};text-transform:uppercase;letter-spacing:.05em">Booking Summary</h3>
                <table style="width:100%;font-size:14px;border-collapse:collapse">
                  <tr><td style="padding:4px 0;color:#6b7280;width:40%">Space Type</td><td style="padding:4px 0;font-weight:600">${data.space_type}</td></tr>
                  <tr><td style="padding:4px 0;color:#6b7280">Date</td><td style="padding:4px 0;font-weight:600">${bookingDate}</td></tr>
                  <tr><td style="padding:4px 0;color:#6b7280">Time</td><td style="padding:4px 0;font-weight:600">${data.start_time} – ${data.end_time}</td></tr>
                  <tr><td style="padding:4px 0;color:#6b7280">Purpose</td><td style="padding:4px 0;font-weight:600">${data.purpose}</td></tr>
                  <tr><td style="padding:4px 0;color:#6b7280">Status</td>
                    <td style="padding:4px 0">
                      <span style="background:${statusBg};color:${statusText};padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">${status.toUpperCase()}</span>
                    </td>
                  </tr>
                </table>
              </div>

              ${isApproved ? `
              <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:14px 18px;margin-bottom:20px">
                <p style="margin:0;font-size:14px;color:#065f46">
                  📍 <strong>Location:</strong> National Climate Change Resource Centre, Along Ngong Road, Nairobi<br>
                  🕐 Please arrive on time. Contact us if you need to reschedule.
                </p>
              </div>` : ""}

              <p style="margin:0;color:#4b5563;font-size:14px">For enquiries, contact us at <a href="mailto:info@kenyayouthclimatehub.org" style="color:#059669">info@kenyayouthclimatehub.org</a></p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
              <p style="margin:0;font-size:12px;color:#9ca3af">Kenya Youth Climate Hub · National Climate Change Resource Centre, Along Ngong Road, Nairobi</p>
            </div>
          </div>
        `,
      });
    } catch (e) { console.error("User status email failed:", e); }

    // ── Email to ADMIN (copy) ──────────────────────────────────────────────
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `[Admin Copy] Booking ${status.toUpperCase()} — ${data.name} (${data.date})`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
            <div style="background:#0f172a;padding:20px 28px;border-radius:12px 12px 0 0">
              <h2 style="color:#fff;margin:0;font-size:16px">Admin Copy — Booking ${statusLabel}</h2>
            </div>
            <div style="background:#fff;padding:24px 28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
              <p style="margin:0 0 12px;font-size:14px;color:#4b5563">You ${isApproved ? "approved" : "rejected"} the following booking:</p>
              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px">
                <table style="width:100%;font-size:14px;border-collapse:collapse">
                  <tr><td style="padding:3px 0;color:#6b7280;width:40%">Name</td><td style="padding:3px 0;font-weight:600">${data.name}</td></tr>
                  <tr><td style="padding:3px 0;color:#6b7280">Email</td><td style="padding:3px 0;font-weight:600">${data.email}</td></tr>
                  <tr><td style="padding:3px 0;color:#6b7280">Space</td><td style="padding:3px 0;font-weight:600">${data.space_type}</td></tr>
                  <tr><td style="padding:3px 0;color:#6b7280">Date</td><td style="padding:3px 0;font-weight:600">${data.date}</td></tr>
                  <tr><td style="padding:3px 0;color:#6b7280">Time</td><td style="padding:3px 0;font-weight:600">${data.start_time} – ${data.end_time}</td></tr>
                  <tr><td style="padding:3px 0;color:#6b7280">Status</td>
                    <td style="padding:3px 0">
                      <span style="background:${statusBg};color:${statusText};padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">${status.toUpperCase()}</span>
                    </td>
                  </tr>
                </table>
              </div>
              <p style="margin:16px 0 0;font-size:13px;color:#9ca3af">A notification has been sent to the user at ${data.email}.</p>
            </div>
          </div>
        `,
      });
    } catch (e) { console.error("Admin copy email failed:", e); }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}
