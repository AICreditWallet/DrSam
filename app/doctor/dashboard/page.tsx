"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DoctorDashboard() {
  const router = useRouter();

  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState("Doctor");
  const [doctorSpecialty, setDoctorSpecialty] = useState<string | null>(null);

  // 👉 Check that the doctor is logged in and load basic profile info
  useEffect(() => {
    async function loadDoctor() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/signin");
        return;
      }

      const { data } = await supabase
        .from("doctors")
        .select("full_name, specialty")
        .eq("id", session.user.id)
        .maybeSingle();

      if (data?.full_name) setDoctorName(data.full_name);
      if (data?.specialty) setDoctorSpecialty(data.specialty);

      setLoading(false);
    }

    loadDoctor();
  }, [router]);

  // 👉 Log out handler
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="auth-root">
        <div className="auth-shell">
          <main className="auth-main">
            <p className="info-text">Loading your dashboard…</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-root">
      <div className="dashboard-shell">
        {/* HEADER */}
        <header className="dashboard-header">
          <div className="dashboard-brand">
            <div className="logo-wrapper">
              <Image
                src="/logo.png"
                alt="Dr. Sam logo"
                width={44}
                height={44}
                className="logo-image"
              />
            </div>
            <div>
              <p className="dashboard-eyebrow">Doctor dashboard</p>
              <h1 className="dashboard-title">Good to see you, {doctorName}.</h1>
              <p className="dashboard-subtitle">
                {doctorSpecialty
                  ? `You’re set up as: ${doctorSpecialty}.`
                  : "Manage your profile, appointments and availability in one place."}
              </p>
            </div>
          </div>

          <div className="dashboard-actions">
            {/* Edit profile opens the onboarding/profile form */}
            <button
              type="button"
              className="btn-outline"
              onClick={() => router.push("/doctor/onboarding")}
            >
              Edit profile
            </button>

            {/* Go online toggle */}
            <button
              type="button"
              className={isOnline ? "btn-primary" : "btn-outline"}
              onClick={() => setIsOnline(!isOnline)}
            >
              {isOnline ? "Online" : "Go online"}
            </button>

            {/* Log out */}
            <button
              type="button"
              className="btn-text"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="dashboard-main">
          {/* Left column – upcoming appointments, alerts, etc. */}
          <section className="dashboard-column">
            <div className="dashboard-card">
              <h2 className="card-title">Today&apos;s overview</h2>
              <p className="card-subtitle">
                When you go online, new requests and emergencies will appear
                here in real time.
              </p>

              <div className="pill-row">
                <span className="pill">0 new appointment requests</span>
                <span className="pill pill-soft">0 emergencies</span>
                <span className="pill pill-soft">0 messages</span>
              </div>

              <div className="empty-state">
                <p className="empty-title">No appointments yet.</p>
                <p className="empty-text">
                  Once patients start booking, you’ll see your schedule here.
                </p>
              </div>
            </div>

            <div className="dashboard-card">
              <h2 className="card-title">Future appointments</h2>
              <p className="card-subtitle">
                Accepted bookings will appear in your timeline.
              </p>

              <div className="empty-state">
                <p className="empty-title">Nothing scheduled.</p>
                <p className="empty-text">
                  You can refine how and when you see patients from your
                  profile and availability settings.
                </p>
              </div>
            </div>
          </section>

          {/* Right column – inbox + payouts summary */}
          <section className="dashboard-column">
            <div className="dashboard-card">
              <h2 className="card-title">Messages</h2>
              <p className="card-subtitle">
                Patients with a booking can message you about symptoms or
                change their time.
              </p>

              <div className="empty-state">
                <p className="empty-title">No messages yet.</p>
                <p className="empty-text">
                  You’ll be able to review medical documents and chat securely
                  with patients here.
                </p>
              </div>
            </div>

            <div className="dashboard-card">
              <h2 className="card-title">Payouts</h2>
              <p className="card-subtitle">
                Add your bank details so you can receive payments from
                completed appointments.
              </p>

              <div className="payout-row">
                <div>
                  <p className="payout-label">Current balance</p>
                  <p className="payout-amount">£0.00</p>
                  <p className="payout-hint">
                    This will update as you start seeing patients.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => router.push("/doctor/billing")}
                >
                  Add bank details
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER / BACK TO HOME LINK IF NEEDED */}
        <footer className="dashboard-footer">
          <Link href="/" className="footer-link">
            ← Back to home
          </Link>
        </footer>
      </div>
    </div>
  );
}
