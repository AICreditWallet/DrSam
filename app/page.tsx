import Image from "next/image";
import Link from "next/link";


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
      {/* Main shell */}
      <div className="app-shell">
        {/* Top gradient header */}
        <header className="header-hero">
          <div className="header-top">
            <div className="brand">
              {/* Logo */}
              <div className="logo-wrapper">
                <Image
                  src="/logo.png" // make sure public/logo.png exists
                  alt="Dr. Sam Logo"
                  width={56}
                  height={56}
                  className="logo-image"
                />
              </div>

              <div>
                <div className="brand-title">Dr. Sam</div>
                <div className="brand-subtitle">Your personal doctor</div>
              </div>
            </div>

            <div className="auth-buttons">
              <button className="btn btn-ghost" type="button">
                Sign in
              </button>
              <Link href="/create-account" className="btn-primary no-underline">
  Create account
</Link>


            </div>
          </div>

          <div className="hero-text-block">
            <h1 className="hero-heading">Consult a doctor instantly.</h1>

            <button className="hero-prompt" type="button">
              <span className="hero-emoji">🙂</span>
              <span>How are you feeling today?</span>
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="home-main">
          {/* Category chips */}
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

          {/* How it works */}
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

      {/* Fixed bottom buttons */}
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
