"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {supabase} from "@/lib/supabase";

type PatientRow = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

export default function PatientDashboard() {
  const router = useRouter();
  const [patient, setPatient] = useState<PatientRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPatient() {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/signin");
        return;
      }

      const { data, error: patientError } = await supabase
        .from("patients")
        .select("id, full_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (patientError) {
        console.error(patientError);
        setError("We couldn’t load your profile just now.");
      } else if (data) {
        setPatient(data as PatientRow);
      }

      setLoading(false);
    }

    loadPatient();
  }, [router]);

  function getInitials(name: string | null): string {
    if (!name) return "P";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase()
    );
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const displayName =
    patient?.full_name?.split(" ")[0] || "there"; // first name or “there”

  return (
    <div className="patient-root">
      <div className="patient-shell">
        {/* Top hero card */}
        <header className="patient-hero">
          <div className="patient-hero-main">
            <div className="patient-avatar">
              {patient?.avatar_url ? (
                <Image
                  src={patient.avatar_url}
                  alt={patient.full_name || "Patient avatar"}
                  width={64}
                  height={64}
                  className="patient-avatar-img"
                />
              ) : (
                <div className="patient-avatar-fallback">
                  {getInitials(patient?.full_name || null)}
                </div>
              )}
            </div>

            <div className="patient-hero-text">
              <p className="patient-pill">Patient dashboard</p>
              <h1 className="patient-title">Welcome back, {displayName}</h1>
              <p className="patient-subtitle">
                Book appointments or request urgent help quickly, all in one
                place.
              </p>
            </div>
          </div>

          <div className="patient-hero-actions">
            <button
              type="button"
              className="dash-btn dash-btn-outline"
              onClick={() => router.push("/patient/onboarding")}
            >
              Edit profile
            </button>
            <button
              type="button"
              className="dash-btn dash-btn-primary"
              onClick={() => router.push("/emergency")}
            >
              Emergency help
            </button>
            <button
              type="button"
              className="dash-btn dash-btn-secondary"
              onClick={() => router.push("/appointments")}
            >
              Book an appointment
            </button>
            <button
              type="button"
              className="dash-btn dash-btn-ghost"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </header>

        {/* Lower content – placeholder blocks you can fill later */}
        <main className="patient-main">
          {error && <p className="patient-error">{error}</p>}

          {loading ? (
            <div className="patient-card">Loading your dashboard…</div>
          ) : (
            <div className="patient-grid">
              <section className="patient-card">
                <h2 className="patient-card-title">Upcoming appointments</h2>
                <p className="patient-card-text">
                  You don’t have any appointments yet. When you book one, it
                  will show up here.
                </p>
              </section>

              <section className="patient-card">
                <h2 className="patient-card-title">Recent messages</h2>
                <p className="patient-card-text">
                  Messages with doctors will appear here once you start using
                  Dr. Sam.
                </p>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}