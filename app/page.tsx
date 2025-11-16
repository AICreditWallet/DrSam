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
      <div className="app-shell">
        {/* Top gradient header */}
        <header className="header-hero">
          <div className="header-top">
            <div className="brand">
             <img
  src="/logo.svg"
  alt="Dr. Sam Logo"
  className="logo-image"
/>

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
          </div>

          <div className="hero-text-block">
            <p className="eyebrow">Today</p>
            <h1 className="hero-heading">See a UK doctor in minutes.</h1>

            <button className="hero-prompt" type="button">
              <span className="hero-emoji">🙂</span>
              <span>How are you feeling today?</span>
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="home-main">
          {/* Tags */}
          <div className="chip-row">
            <span className="chip chip-active">GP</span>
            <span className="chip">Mental health</span>
            <span className="chip">Women’s health</span>
          </div>

          {/* Doctors row */}
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
                  <div className="doctor-photo">
                    <div className="doctor-avatar-large">
                      <span>{doc.initials}</span>
                    </div>
                  </div>

                  <div className="doctor-footer">
                    <span className="doctor-tag">{doc.tag}</span>
                    <span className="doctor-locked">
                      Sign in to view details
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* How it works card – short text */}
          <section className="info-card">
            <div className="info-dot" />
            <div>
              <p className="info-title">How it works</p>
              <p className="info-text">
                Describe your symptoms, we match you with the right doctor.
              </p>
            </div>
          </section>
        </main>
      </div>

      {/* Fixed bottom actions */}
      <div className="bottom-fixed">
        <div className="bottom-inner">
          <button className="btn-emergency" type="button">
            <span className="emergency-dot" />
            <span>Emergency</span>
          </button>

          <button className="btn-book" type="button">
            Book an appointment
          </button>
        </div>
      </div>
    </div>
  );
}
