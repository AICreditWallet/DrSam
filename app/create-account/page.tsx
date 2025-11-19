import Link from "next/link";
import Image from "next/image";

export default function CreateAccount() {
  return (
    <div className="account-root">
      <div className="account-shell">
        {/* header */}
        <header className="account-header">
          <div className="account-brand">
            <div className="logo-wrapper">
              <Image
                src="/logo.png"
                alt="Dr. Sam Logo"
                width={44}
                height={44}
                className="logo-image"
              />
            </div>
            <div>
              <p className="account-eyebrow">Create account</p>
              <h1 className="account-title">How would you like to join?</h1>
            </div>
          </div>

          <Link href="/" className="account-close">
            ✕
          </Link>
        </header>

        {/* cards */}
        <main className="account-main">
          <p className="account-subtitle">
            Choose whether you’re a patient looking for care or a doctor joining
            the Dr. Sam network.
          </p>

          <div className="account-card-row">
            {/* Patient card */}
            <Link href="/signup/patient" className="account-card">
              <div className="account-chip">For you</div>
              <div className="account-emoji">🧑</div>
              <h2 className="account-card-title">Patient</h2>
              <p className="account-card-text">
                Book appointments, Video chat with doctors, and manage your health in
                one place.
              </p>
              <span className="account-card-cta">Continue as patient →</span>
            </Link>

            {/* Doctor card */}
            <Link href="/signup/doctor" className="account-card account-card-alt">
              <div className="account-chip">For clinicians</div>
              <div className="account-emoji">🩺</div>
              <h2 className="account-card-title">Doctor</h2>
              <p className="account-card-text">
                Join as a UK-registered doctor to consult patients securely
                through Dr. Sam.
              </p>
              <span className="account-card-cta">Continue as doctor →</span>
            </Link>
          </div>

          <p className="account-footer-note">
            Already have an account?{" "}
            <Link href="/" className="account-link">
              Sign in
            </Link>
          </p>
        </main>
      </div>
    </div>
  );
}