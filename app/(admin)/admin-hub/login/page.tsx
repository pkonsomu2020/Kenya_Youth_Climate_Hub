import { login } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;

  return (
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "var(--light)", padding: "1.5rem" }}>
      <div className="ah-panel" style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img src="/kych_logo.png" alt="KYCH Logo" style={{ height: "110px", width: "auto", margin: "0 auto 1rem" }} />
          <h1 style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.5rem", color: "var(--dark)" }}>Admin Login</h1>
          <p style={{ fontSize: ".88rem", color: "var(--muted-foreground)", marginTop: ".25rem" }}>Secure access to the KYCH CMS</p>
        </div>

        <form action={login} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label className="k-label">Email Address</label>
            <input name="email" type="email" className="k-input" required placeholder="Put your username" />
          </div>
          <div>
            <label className="k-label">Password</label>
            <input name="password" type="password" className="k-input" required placeholder="Put your password" />
          </div>

          {params?.error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", padding: ".75rem", borderRadius: 8, fontSize: ".82rem" }}>
              {params.error}
            </div>
          )}

          <button type="submit" className="btn-green" style={{ width: "100%", marginTop: ".5rem" }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
