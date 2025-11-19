"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PatientSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/patient/onboarding`
          : undefined;

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        console.error(error);
        setError("We couldn't send the link. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-card">
        {/* Header */}
        <header className="auth-header">
          <div>
            <p className="auth-eyebrow">Patient sign up</p>
            <h1 className="auth-title">Create your patient account</h1>
            <p className="auth-subtitle">
              Enter your email and we’ll send you a secure sign-in link to
              finish setting up your profile.
            </p>
          </div>

          <Link href="/" className="auth-close">
            ✕
          </Link>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Email address
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              placeholder="you@example.com"
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          {status === "sent" && (
            <p className="auth-success">
              Check your inbox for a link from Dr. Sam. Tap it to continue to
              your patient onboarding.
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending link…" : "Send magic link"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link href="/signin" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}