const doctors = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
];

export default function Home() {
  return (
    <div className="page">
      <div className="shell">
        {/* Top bar */}
        <header className="topbar">
          <div className="brand">
            <div className="logo-circle" aria-hidden="true">
              ☺
            </div>
            <div>
              <div className="brand-text-main">Dr. Sam</div>
              <div className="brand-text-sub">Talk to real UK doctors</div>
            </div>
          </div>

          <div className="auth-buttons">
            <button className="btn btn-ghost" type="button">
              Sign in
            </button>
            <button className="btn btn-primary" type="button">
              Sign up
            </button>
          </div>
        </header>

        {/* Hero */}
        <main className="hero-minimal">
          <div className="hero-title-group">
            <div className="eyebrow">Dr. Sam</div>
            <h1 className="hero-title">See a doctor in minutes.</h1>
            <p className="hero-subtitle">
              Simple, safe access to UK-registered doctors from your phone.
            </p>
          </div>

          {/* Pills */}
          <div className="hero-pills">
            <span className="pill">NHS-grade doctors</span>
            <span className="pill">Secure chat & video</span>
            <span className="pill">24/7 triage</span>
          </div>

          {/* Horizontal doctor strip */}
          <section
            className="doctor-strip"
            aria-label="Browse available doctors"
          >
            <div className="doctor-strip-header">
              <span className="strip-title">Available doctors</span>
              <span className="strip-hint">Scroll to browse</span>
            </div>

            <div className="doctor-list">
              {doctors.map((doctor) => (
                <article className="doctor-card" key={doctor.id}>
                  <div className="doctor-photo" />
                  <div className="doctor-info-locked">
                    <span className="lock-dot" />
                    <span className="lock-text">Sign in to view details</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Fixed bottom bar */}
      <div className="bottom-fixed-bar">
        <div className="bottom-fixed-inner">
          <button className="btn-emergency" type="button">
            <span className="icon-dot" />
            <span>Emergency? Call 999 / NHS 111</span>
          </button>

          <button className="btn-appointment" type="button">
            Book an appointment
          </button>
        </div>
      </div>
    </div>
  );
}
