"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PatientSignupPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);
    setError(null);
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/patient/dashboard`;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
          // store role so later you can tell doctor vs patient
          data: { role: "patient" },
        },
      });

      if (error) {
        console.error(error);
        setError("We couldn't send the sign-in link. Please try again.");
      } else {
        setStatus("Check your email for a magic link to continue.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-shell">
        <header className="auth-header">
          <div>
            <p className="auth-eyebrow">Create patient account</p>
            <h1 className="auth-title">Sign up as a patient</h1>
            <p className="auth-subtitle">
              Enter your email and we&apos;ll send you a secure sign-in link.
            </p>
          </div>

          <Link href="/" className="account-close">
            ✕
          </Link>
        </header>

        <main className="auth-main">
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-label">
              Email address
              <input
                className="auth-input"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            {error && <p className="auth-error">{error}</p>}
            {status && <p className="auth-status">{status}</p>}

            <button
              className="auth-button-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending link..." : "Send magic link"}
            </button>

            <p className="auth-footer-note">
              Already have an account?{" "}
              <Link href="/signin" className="account-link">
                Sign in
              </Link>
            </p>
          </form>
        </main>
      </div>
    </div>
  );
}