"use client";
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

        {/* ========================= HEADER ========================= */}
        <header className="header-hero">

          {/* TOP BAR */}
          <div className="header-top">

            {/* LOGO + BRAND */}
            <div className="brand">
              <div className="logo-wrapper">
                <Image
                  src="/logo.png"
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

            {/* BUTTONS */}
            <div className="top-buttons">
              <Link href="/signin" className="btn-outline">
                Sign in
              </Link>

              <Link href="/create-account" className="btn-filled">
                Create account
              </Link>
            </div>
          </div>
<div className="top-buttons">
  <Link href="/signin" className="btn-outline">
    Doctor sign in
  </Link>

  <Link href="/create-account" className="btn-filled">
    Doctor account
  </Link>

  <Link href="/patient/create-account" className="btn-outline secondary">
    Patient account
  </Link>
</div>
          {/* HERO TEXT + PROMPT */}
          <div className="hero-text-block">
            <h1 className="hero-heading">Consult a doctor instantly.</h1>

            <button className="hero-prompt" type="button">
              <span className="hero-emoji">😊</span>
              <span>How are you feeling today? AI-Chat</span>
            </button>
          </div>
        </header>
        {/* ========================= END HEADER ========================= */}


        {/* ========================= MAIN ========================= */}
        <main className="home-main">

          {/* CATEGORY CHIPS */}
          <div className="chip-row">
            <span className="chip chip-active">GP</span>
            <span className="chip">Mental health</span>
            <span className="chip">Women’s health</span>
          </div>

          {/* DOCTOR LIST */}
          <section className="doctor-section" aria-label="Available doctors preview">
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
                    <span className="doctor-locked">Sign in to view details</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

        </main>
        {/* ========================= END MAIN ========================= */}


        {/* ========================= FIXED BOTTOM BUTTONS ========================= */}
        import Link from "next/link"; // this is already at top of home page

// ...

<div className="bottom-fixed">
  <div className="bottom-inner">
    <Link href="/emergency" className="btn-emergency">
      <span className="emergency-dot" />
      <span>Emergency</span>
    </Link>

    <button className="btn-book" type="button">
      Book an appointment
    </button>
  </div>
</div>


        {/* ============================================================ */}

      </div>
    </div>
  );
}
