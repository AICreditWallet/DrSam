import Link from "next/link";
import Image from "next/image";

export default function DoctorSignupComplete() {
  return (
    <div className="auth-root">
      <div className="auth-shell">
        <header className="auth-header">
          <div className="auth-brand">
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
              <p className="auth-eyebrow">Welcome back</p>
              <h1 className="auth-title">Email verified ✅</h1>
              <p className="auth-subtitle">
                Your doctor account is ready to complete. Add your details to
                start seeing patients.
              </p>
            </div>
          </div>
        </header>

        <main className="auth-main">
          <div className="auth-complete-card">
            <p className="auth-complete-title">Next steps</p>
            <ul className="auth-complete-list">
              <li>Add your name and GMC number</li>
              <li>Upload your practice or clinic details</li>
              <li>Set your availability and consultation type</li>
            </ul>

            <Link href="/" className="auth-submit auth-submit-link">
              Continue to Dr. Sam
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
