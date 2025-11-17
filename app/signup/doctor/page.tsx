"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase"; // uses your existing Supabase client

export default function DoctorSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setIsLoading(true);

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/signup/doctor/complete`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setMessage(
        "Check your email to verify your account. Then come back here to finish your registration."
      );
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

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
              <p className="auth-eyebrow">Doctor sign up</p>
              <h1 className="auth-title">Create your doctor account</h1>
              <p className="auth-subtitle">
                Use your work email. We’ll send a verification link so you can
                complete your profile.
              </p>
            </div>
          </div>

          <Link href="/" className="account-close">
            ✕
          </Link>
        </header>

        <main className="auth-main">
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-label">
              Email
              <input
                type="email"
                autoComplete="email"
                className="auth-input"
                placeholder="you@clinic.co.uk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="auth-label">
              Password
              <input
                type="password"
                autoComplete="new-password"
                className="auth-input"
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {error && <p className="auth-error">{error}</p>}
            {message && <p className="auth-message">{message}</p>}

            <button
              type="submit"
              className="auth-submit"
              disabled={isLoading}
            >
              {isLoading ? "Sending link..." : "Send verification link"}
            </button>
          </form>

          <p className="auth-footer-note">
            Signing up as a patient instead?{" "}
            <Link href="/signup/patient" className="account-link">
              Create patient account
            </Link>
          </p>
        </main>
      </div>
    </div>
  );
}
