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
    const parsed: any = JSON.parse(feesJson);

    // Try a few reasonable keys from your earlier config
    const candidates = [
      parsed.emergency_default,
      parsed.emergency,
      parsed.weekend_night_emergency,
      parsed.home_visit_emergency,
    ].filter(Boolean);

    if (candidates.length > 0) {
      return `Emergency from ${candidates[0]}`;
    }
  } catch {
    // ignore JSON errors – we’ll just hide the fee text
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
        .eq("emergency_on", true)
        .order("full_name", { ascending: true });

      if (error) {
        console.error(error);
        setError("We couldn't load emergency doctors just now.");
      } else {
        setDoctors((data || []) as EmergencyDoctor[]);
      }

      setLoading(false);
    }

    loadEmergencyDoctors();
  }, []);

  return (
    <div className="app-root emergency-root">
      <div className="app-shell emergency-shell">
        {/* Header */}
        <header className="emergency-header">
          <div className="emergency-header-top">
            <Link href="/" className="emergency-back">
              ← Home
            </Link>
            <div className="emergency-title-block">
              <h1 className="emergency-title">Emergency doctors</h1>
              <p className="emergency-subtitle">
                Connect with a doctor who has emergency availability right now.
              </p>
            </div>
          </div>

          {/* 111 / 999 info */}
          <div className="emergency-warning">
            <p className="emergency-warning-main">
              If you are in immediate danger, please call{" "}
              <a href="tel:999" className="emergency-link-strong">
                999
              </a>{" "}
              now.
            </p>
            <p className="emergency-warning-secondary">
              For urgent medical help that is not life-threatening, call{" "}
              <a href="tel:111" className="emergency-link">
                NHS 111
              </a>
              .
            </p>
          </div>
        </header>

        {/* Main content */}
        <main className="emergency-main">
          {loading && (
            <div className="emergency-state">Loading available doctors…</div>
          )}

          {error && <div className="emergency-error">{error}</div>}

          {!loading && !error && doctors.length === 0 && (
            <div className="emergency-state">
              No doctors have emergency available right now.
            </div>
          )}

          {!loading && !error && doctors.length > 0 && (
            <section
              className="emergency-doctor-section"
              aria-label="Doctors available for emergency"
            >
              <div className="emergency-doctor-scroll">
                {doctors.map((doc) => {
                  const feeText = getEmergencyFeeText(doc.fees);

                  return (
                    <article key={doc.id} className="emergency-card">
                      <div className="emergency-card-top">
                        <div className="emergency-avatar">
                          {doc.avatar_url ? (
                            <Image
                              src={doc.avatar_url}
                              alt={doc.full_name || "Doctor"}
                              width={64}
                              height={64}
                              className="emergency-avatar-img"
                            />
                          ) : (
                            <div className="emergency-avatar-fallback">
                              {(doc.full_name || "Dr")
                                .split(" ")
                                .map((part) => part[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="emergency-card-info">
                          <div className="emergency-card-name">
                            {doc.full_name || "Doctor"}
                          </div>
                          {doc.specialty && (
                            <div className="emergency-card-specialty">
                              {doc.specialty}
                            </div>
                          )}
                          {feeText && (
                            <div className="emergency-card-fee">
                              {feeText}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Message box – UI only for now */}
                      <div className="emergency-message-block">
                        <label className="emergency-message-label">
                          Briefly describe what’s happening
                        </label>
                        <textarea
                          className="emergency-message-input"
                          rows={3}
                          placeholder="E.g. sudden chest pain, breathing difficulty, high fever…"
                        />
                        <button
                          type="button"
                          className="emergency-message-send"
                          onClick={() => {
                            alert(
                              "This is a preview. Messaging will be connected to your doctor account in the next step."
                            );
                          }}
                        >
                          Message doctor
                        </button>
                        <p className="emergency-fee-note">
                          You’ll be charged according to this doctor’s
                          emergency rate.
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
