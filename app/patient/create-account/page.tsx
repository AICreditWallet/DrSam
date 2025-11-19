"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PatientCreateAccount() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus(null);
    setError(null);
    setLoading(true);

    const { origin } = window.location;

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${origin}/patient/onboarding`,
      },
    });

    setLoading(false);

    if (signInError) {
      console.error(signInError);
      setError("We couldn't send the link. Please try again.");
      return;
    }

    setStatus("Check your email for a secure sign-in link.");
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="auth-title">Create your patient account</h1>
        <p className="auth-subtitle">
          Enter your email to receive a secure link. No password needed.
        </p>

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

          {status && <p className="auth-status">{status}</p>}
          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-filled auth-submit"
          >
            {loading ? "Sending link..." : "Send sign-in link"}
          </button>
        </form>

        <button
          type="button"
          className="auth-link-button"
          onClick={() => router.push("/signin")}
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
}