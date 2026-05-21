export function Newsletter() {
  return (
    <section
      style={{
        background: "var(--green)",
        padding: "5rem 2.5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="s-label" style={{ color: "rgba(255,255,255,.4)", justifyContent: "center" }}>Stay Connected</div>
        <h2 style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "clamp(1.7rem,3.2vw,2.4rem)", color: "#fff", letterSpacing: "-.025em", marginBottom: ".6rem" }}>
          Stay in the Loop
        </h2>
        <p style={{ color: "rgba(255,255,255,.65)", fontSize: ".9rem", marginBottom: "1.75rem" }}>
          Weekly climate opportunities, news, challenge updates — straight to your inbox.
        </p>
        <form
          onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }}
          style={{ display: "flex", gap: ".4rem", maxWidth: 440, margin: "0 auto", flexWrap: "wrap" }}
        >
          <input
            type="email"
            required
            placeholder="your@email.com"
            style={{ flex: 1, minWidth: 200, padding: ".8rem 1.2rem", borderRadius: 100, border: "none", background: "rgba(255,255,255,.12)", color: "#fff", fontSize: ".85rem", outline: "none" }}
          />
          <button type="submit" className="btn-a" style={{ borderRadius: 100 }}>Subscribe →</button>
        </form>
      </div>
    </section>
  );
}
