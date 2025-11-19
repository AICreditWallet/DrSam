"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type PatientRow = {
  full_name: string | null;
  avatar_url: string | null;
};

export default function PatientDashboard() {
  const router = useRouter();
  const [patient, setPatient] = useState<PatientRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setError("Please sign in to view your dashboard.");
        setLoading(false);
        return;
      }

      const { data: patientRow, error: patientError } = await supabase
        .from("patients")
        .select("full_name, avatar_url")
        .eq("id", data.user.id)
        .maybeSingle();

      if (patientError) {
        console.error(patientError);
        setError("We couldn't load your profile just now.");
        setLoading(false);
        return;
      }

      setPatient(patientRow as PatientRow);
      setLoading(false);
    }

    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-card">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div className="dashboard-title-block">
            <div className="avatar-circle small">
              {patient?.avatar_url ? (
                <Image
                  src={patient.avatar_url}
                  alt="Avatar"
                  width={48}
                  height={48}
                />
              ) : (
                <span className="avatar-initials">
                  {patient?.full_name?.[0] ?? "P"}
                </span>
              )}
            </div>
            <div>
              <h1 className="dashboard-title">
                Welcome back{patient?.full_name ? `, ${patient.full_name}` : ""}{" "}
              </h1>
              <p className="dashboard-subtitle">
                Book appointments or request urgent help quickly.
              </p>
            </div>
          </div>

          <button className="dash-btn-ghost" type="button" onClick={handleLogout}>
            Log out
          </button>
        </div>

        <div className="dashboard-actions">
          <button
            type="button"
            className="dash-btn-outline"
            onClick={() => router.push("/patient/onboarding")}
          >
            Edit profile
          </button>

          <button
            type="button"
            className="dash-btn-primary"
            onClick={() => router.push("/emergency")}
          >
            Emergency help
          </button>

          <button
            type="button"
            className="dash-btn-primary"
            onClick={() => alert("Later: normal booking flow")}
          >
            Book an appointment
          </button>
        </div>
      </div>
    </div>
  );
}