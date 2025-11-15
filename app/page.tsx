const doctors = [
  { id: 1, initials: "AK", tag: "GP" },
  { id: 2, initials: "JW", tag: "Derm" },
  { id: 3, initials: "RM", tag: "Mental" },
  { id: 4, initials: "LS", tag: "Peds" },
  { id: 5, initials: "TT", tag: "GP" },
];

export default function Home() {
  return (
    <div className="app-root">
      {/* main glass card */}
      <div className="app-shell">
        {/* top bar */}
        <header className="topbar">
          <div className="brand">
            <div className="logo-circle" aria-hidden="true">
              ☺
            </div>
            <div>
              <div className="brand-title">Dr. Sam</div>
              <div className="brand-subtitle">Hello, let’s get you seen</div>
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

        {/* hero section */}
        <main className="home-main">
          <section className="hero-block">
            <p className="eyebrow">Today</p>
            <h1 className="hero-heading">See a UK doctor in minutes.</h1>
            <p className="hero-text">
              Simple, safe access to real doctors by chat or video.
            </p>

            <div className="chip-row">
              <span className="chip">GP</span>
              <span className="chip">Mental health</span>
              <span className="chip">Women’s health</span>
            </div>
          </section>

          {/* doctor carousel */}
          <section
            className="doctor-section"
            aria-label="Available doctors preview"
          >
            <div className="section-header">
              <span className="section-title">Available now</span>
              <span className="section-link">Sign in to see all</span>
            </div>

            <div className="doctor-scroll">
              {doctors.map((doc) => (
                <article className="doctor-card" key={doc.id}>
                  <div className="doctor-avatar">
                    <span>{doc.initials}</span>
                  </div>
                  <div className="doctor-overlay">
                    <span className="doctor-tag">{doc.tag}</span>
                    <span className="doctor-locked">
                      Sign in to view details
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* info bubble */}
          <section className="info-card">
            <div className="info-dot" />
            <div>
              <p className="info-title">How it works</p>
              <p className="info-text">
                Tell Dr. Sam what’s wrong, we match you to the right UK-registered
                doctor. Your details stay private and secure.
              </p>
            </div>
          </section>
        </main>
      </div>

      {/* fixed bottom bar (web-app style) */}
      <div className="bottom-fixed">
        <div className="bottom-inner">
          <button className="btn-emergency" type="button">
            <span className="emergency-dot" />
            <span>Emergency? Call 999 / NHS 111</span>
          </button>

          <button className="btn-book" type="button">
            Book an appointment
          </button>
        </div>
      </div>
    </div>
  );
}
