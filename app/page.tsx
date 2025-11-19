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
      <div className="app-shell home-hero">
        {/* Top gradient header */}
        <header className="header-hero">
          <div className="header-top">
            {/* Brand + logo */}
            <div className="brand">
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
                <div className="brand-subtitle">Your personal Doctor</div>
              </div>
            </div>

            {/* Top-right buttons */}
            <div className="top-buttons">
              <Link href="/signin" className="btn-outline">
                Sign in
              </Link>

              <Link href="/create-account" className="btn-filled">
                Create account
              </Link>
            </div>
          </div>

          <div className="hero-text-block">
            <h1 className="hero-heading">Consult a doctor instantly.</h1>

            {/* AI chat strip */}
<section className="home-ai-chat">
  <div className="home-ai-chat-main">
    <div className="home-ai-chat-icon" aria-hidden="true">
      🤖
    </div>

    <div className="home-ai-chat-copy">
      <p className="home-ai-chat-title">Ask Dr. Sam (AI)</p>
      <p className="home-ai-chat-subtitle">
        Get quick, general medical information – not a diagnosis.
      </p>
    </div>
  </div>

  <form
    className="home-ai-chat-form"
    onSubmit={(e) => {
      e.preventDefault();
      // For now we don’t actually send anywhere – just a UI shell.
      // Later you can wire this up to a real AI endpoint.
    }}
  >
    <input
      className="home-ai-chat-input"
      type="text"
      placeholder="Ask a health question…"
    />
    <button type="submit" className="home-ai-chat-button">
      Chat
    </button>
  </form>

  <p className="home-ai-chat-disclaimer">
    For general information only. This is not personal medical advice.  
    If you feel unwell or unsafe, please contact a doctor or emergency services.
  </p>
</section>

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
