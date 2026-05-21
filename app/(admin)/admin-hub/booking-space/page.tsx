"use client";

import { PageHead } from "@/components/admin/AdminUI";
import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Check, X, Trash2, Calendar, MapPin, Search } from "lucide-react";

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  date: string;
  start_time: string;
  end_time: string;
  space_type: string;
  purpose: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setBookings(json.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const updateBookingStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    } catch (err: any) {
      alert("Failed to update: " + err.message);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking permanently?")) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const filtered = bookings.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || b.organization?.toLowerCase().includes(q);
  });

  return (
    <>
      <PageHead
        title="Space Bookings"
        sub="Manage requests for the digital headquarters spaces."
        action={
          <button onClick={() => { setFetching(true); loadBookings().finally(() => setFetching(false)); }} disabled={fetching} className="btn-green"
            style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".82rem" }}>
            <RefreshCw size={14} style={{ animation: fetching ? "spin 1s linear infinite" : "none" }} />
            Refresh
          </button>
        }
      />

      <div style={{ display: "flex", gap: ".75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", marginLeft: "auto" }}>
          <Search size={14} style={{ position: "absolute", left: ".6rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bookings..."
            style={{ paddingLeft: "2rem", paddingRight: ".75rem", paddingTop: ".4rem", paddingBottom: ".4rem", border: "1px solid var(--border)", borderRadius: 8, fontSize: ".82rem", fontFamily: "inherit", width: 200 }} />
        </div>
      </div>

      {error && (
        <div style={{ padding: "1rem", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, marginBottom: "1rem", fontSize: ".85rem", color: "#991B1B" }}>
          <strong>API error:</strong> {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground)" }}>
          <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto .75rem", display: "block" }} />
          Loading bookings...
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
          {filtered.map((booking) => (
            <div key={booking.id} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: ".9rem 1rem", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }}>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap", marginBottom: ".4rem" }}>
                  <span style={{ fontSize: ".65rem", padding: ".15rem .45rem", background: "var(--cd)", color: "var(--muted-foreground)", borderRadius: 4, fontFamily: "var(--fm)", border: "1px solid var(--border)", fontWeight: 600 }}>{booking.space_type}</span>
                  <span style={{ fontSize: ".65rem", padding: ".15rem .45rem", borderRadius: 4, fontFamily: "var(--fm)", fontWeight: 600,
                      background: booking.status === "approved" ? "#ECFDF5" : booking.status === "rejected" ? "#FEF2F2" : "#FEF9C3",
                      color: booking.status === "approved" ? "#065F46" : booking.status === "rejected" ? "#991B1B" : "#854D0E" }}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>
                
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".9rem", color: "var(--dark)" }}>
                  {booking.name} <span style={{ fontWeight: 400, color: "var(--muted-foreground)", fontSize: ".8rem" }}>({booking.email} • {booking.phone})</span>
                </div>
                {booking.organization && (
                  <div style={{ fontSize: ".75rem", color: "var(--muted-foreground)", marginTop: ".1rem" }}>Org: {booking.organization}</div>
                )}
                
                <div style={{ fontSize: ".8rem", color: "var(--dark)", marginTop: ".5rem", background: "#F8FAFC", padding: ".5rem", borderRadius: 6, border: "1px solid #E2E8F0" }}>
                  <strong>Purpose:</strong> {booking.purpose}
                </div>

                <div style={{ display: "flex", gap: ".75rem", marginTop: ".6rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: ".75rem", color: "var(--green)", fontWeight: 600, display: "flex", alignItems: "center", gap: ".3rem" }}>
                    <Calendar size={12} /> {new Date(booking.date).toLocaleDateString()}
                  </span>
                  <span style={{ fontSize: ".75rem", color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: ".3rem" }}>
                    <MapPin size={12} /> {booking.start_time} - {booking.end_time}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: ".4rem", flexShrink: 0 }}>
                {booking.status !== "approved" && (
                  <button onClick={() => updateBookingStatus(booking.id, "approved")} title="Approve" style={{ padding: ".4rem .6rem", borderRadius: 6, border: "1px solid #A7F3D0", background: "#ECFDF5", color: "#065F46", cursor: "pointer", display: "flex", alignItems: "center", gap: ".3rem", fontSize: ".75rem", fontWeight: 600 }}>
                    <Check size={14} /> Approve
                  </button>
                )}
                {booking.status !== "rejected" && (
                  <button onClick={() => updateBookingStatus(booking.id, "rejected")} title="Reject" style={{ padding: ".4rem .6rem", borderRadius: 6, border: "1px solid #FECACA", background: "#FEF2F2", color: "#991B1B", cursor: "pointer", display: "flex", alignItems: "center", gap: ".3rem", fontSize: ".75rem", fontWeight: 600 }}>
                    <X size={14} /> Reject
                  </button>
                )}
                <button onClick={() => deleteBooking(booking.id)} title="Delete" style={{ padding: ".4rem .6rem", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", color: "var(--muted-foreground)", cursor: "pointer", display: "flex", alignItems: "center", gap: ".3rem", fontSize: ".75rem", fontWeight: 600, marginTop: ".5rem" }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted-foreground)" }}>
          <div style={{ fontFamily: "var(--fs)", fontWeight: 700, marginBottom: ".5rem" }}>No bookings found</div>
          <div style={{ fontSize: ".85rem", marginBottom: "1.25rem" }}>When users book a space, they will appear here.</div>
        </div>
      )}
    </>
  );
}
