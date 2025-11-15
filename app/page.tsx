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
              <div className="brand-text-sub">
                Friendly AI that connects you to real doctors
              </div>
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

        {/* Main content */}
        <main className="hero">
          <div className="hero-header">
            <div className="hero-title-group">
              <div className="eyebrow">Find a doctor</div>
              <div className="hero-title">
                Speak to a UK-registered doctor in minutes
              </div>
              <p className="hero-subtitle">
                Choose the type of help you need. Dr. Sam collects your symptoms and
                connects you to the right clinician.
              </p>
            </div>

            <div className="hero-pills">
              <span className="pill">NHS-grade doctors</span>
              <span className="pill">24/7 triage</span>
              <span className="pill">Secure &amp; private</span>
            </div>
          </div>

          {/* Doctor / service cards */}
          <section className="cards-row" aria-label="Doctor categories">
            <article className="card">
              <div>
                <div className="card-badge">Today</div>
                <h2 className="card-title">GP consultation</h2>
                <p className="card-text">
                  Video or chat with a general practitioner for everyday concerns,
                  prescriptions and advice.
                </p>
              </div>
              <div className="card-footer">
                <div className="avatar-stack" aria-hidden="true">
                  <div className="avatar" />
                  <div className="avatar" />
                </div>
                <span className="card-cta">Book now →</span>
              </div>
            </article>

            <article className="card">
              <div>
                <div className="card-badge">Fast</div>
                <h2 className="card-title">Urgent advice</h2>
                <p className="card-text">
                  Not an emergency but can’t wait for a routine appointment? Get
                  same-day medical guidance.
                </p>
              </div>
              <div className="card-footer">
                <div className="avatar-stack" aria-hidden="true">
                  <div className="avatar" />
                  <div className="avatar" />
                </div>
                <span className="card-cta">Check availability →</span>
              </div>
            </article>

            <article className="card">
              <div>
                <div className="card-badge">Specialists</div>
                <h2 className="card-title">Mental health</h2>
                <p className="card-text">
                  Talk confidentially with a clinician about stress, anxiety, low
                  mood and sleep.
                </p>
              </div>
              <div className="card-footer">
                <div className="avatar-stack" aria-hidden="true">
                  <div className="avatar" />
                  <div className="avatar" />
                </div>
                <span className="card-cta">See options →</span>
              </div>
            </article>

            <article className="card">
              <div>
                <div className="card-badge">Anytime</div>
                <h2 className="card-title">Ask Dr. Sam</h2>
                <p className="card-text">
                  Describe your symptoms to our AI assistant. Your doctor reviews the
                  summary before your appointment.
                </p>
              </div>
              <div className="card-footer">
                <div className="avatar-stack" aria-hidden="true">
                  <div className="avatar" />
                  <div className="avatar" />
                </div>
                <span className="card-cta">Start AI triage →</span>
              </div>
            </article>
          </section>

          {/* Emergency & appointment buttons */}
          <section className="bottom-cta-row" aria-label="Key actions">
            <button className="btn-emergency" type="button">
              <span className="icon-dot" />
              <span>Emergency? Call 999 / NHS 111</span>
            </button>

            <button className="btn-appointment" type="button">
              <span>Book an appointment</span>
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
