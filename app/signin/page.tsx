"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      // ✅ Sign in successful – go to doctor dashboard
      router.push("/doctor/dashboard");
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
              <p className="auth-eyebrow">Doctor sign in</p>
              <h1 className="auth-title">Welcome back to Dr. Sam</h1>
              <p className="auth-subtitle">
                Sign in to view your dashboard, appointments and messages.
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
                autoComplete="current-password"
                className="auth-input"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button
              type="submit"
              className="auth-submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="auth-footer-note">
            Don’t have a doctor account yet?{" "}
            <Link href="/signup/doctor" className="account-link">
              Create account
            </Link>
          </p>
        </main>
      </div>
    </div>
  );
}
