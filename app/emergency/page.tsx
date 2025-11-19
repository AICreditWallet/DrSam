"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type EmergencyDoctor = {
  id: string;
  full_name: string | null;
  specialty: string | null;
  avatar_url: string | null;
  fees: string | null;
};

function getEmergencyFeeText(feesJson: string | null): string | null {
  if (!feesJson) return null;
  try {
    const parsed = JSON.parse(feesJson);
    // if your fees JSON looks different, adjust this path
    if (parsed?.emergency) return parsed.emergency;
  } catch (err) {
    console.error("Error parsing fees JSON", err);
  }
  return null;
}

export default function EmergencyPage() {
  const [doctors, setDoctors] = useState<EmergencyDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEmergencyDoctors() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("doctors")
        .select("id, full_name, specialty, avatar_url, fees, emergency_on")
        .eq("emergency_on", true);

      if (error) {
        console.error(error);
        setError("We couldn't load available emergency doctors right now.");
        setLoading(false);
        return;
      }

      const mapped =
        (data ?? []).map((row: any) => ({
          id: row.id,
          full_name: row.full_name,
          specialty: row.specialty,
          avatar_url: row.avatar_url,
          fees: getEmergencyFeeText(row.fees),
        })) ?? [];

      setDoctors(mapped);
      setLoading(false);
    }

    loadEmergencyDoctors();
  }, []);

  return (
    <div className="emerg-root">
      <header className="emerg-header">
        <Link href="/" className="emerg-back">
          ← Home
        </Link>

        <div>
          <h1 className="emerg-title">Emergency doctors</h1>
          <p className="emerg-subtitle">
            Connect with a doctor who is available for emergency care right now.
          </p>
        </div>
      </header>

      <section className="emerg-warning">
        <p className="emerg-warning-main">
          If you are in immediate danger, please call{" "}
          <a href="tel:999">999</a> now.
        </p>
        <p className="emerg-warning-secondary">
          For urgent medical help that is not life-threatening, call{" "}
          <a href="tel:111">NHS 111</a>.
        </p>
      </section>

      <main className="emerg-main">
        {loading && <p className="emerg-status">Loading emergency doctors…</p>}
        {error && (
          <p className="emerg-status emerg-status-error">{error}</p>
        )}

        {!loading && !error && doctors.length === 0 && (
          <p className="emerg-status">
            No doctors have emergency availability right now. If you’re worried
            about your symptoms, please call <a href="tel:111">111</a>.
          </p>
        )}

        {doctors.length > 0 && (
          <section aria-label="Doctors with emergency availability">
            <div className="emerg-doctor-scroll">
              {doctors.map((doc) => (
                <article key={doc.id} className="emerg-card">
                  <div className="emerg-card-header">
                    <div className="emerg-avatar-wrap">
                      <div className="emerg-avatar">
                        {doc.avatar_url ? (
                          <Image
                            src={doc.avatar_url}
                            alt={doc.full_name ?? "Doctor"}
                            fill
                            sizes="64px"
                          />
                        ) : (
                          <span className="emerg-avatar-initials">
                            {doc.full_name
                              ?.split(" ")
                              .map((p) => p[0])
                              .join("") ?? "Dr"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h2 className="emerg-card-name">
                        {doc.full_name ?? "Doctor"}
                      </h2>
                      <p className="emerg-card-specialty">
                        {doc.specialty ?? "GP"}
                      </p>
                    </div>
                  </div>

                  <label className="emerg-input-label">
                    Briefly describe what’s happening
                    <textarea
                      className="emerg-textarea"
                      placeholder="E.g. sudden chest pain, trouble breathing, high fever…"
                    />
                  </label>

                  <button type="button" className="emerg-message-btn">
                    Message doctor
                  </button>

                  <p className="emerg-fee-note">
                    You’ll be charged according to this doctor’s emergency rate
                    {doc.fees ? ` (${doc.fees})` : ""}.
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
