"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PatientRow = {
  id: string;
  full_name: string | null;
  date_of_birth: string | null;
  address: string | null;
  past_diagnoses: string | null;
  gp_address: string | null;
  avatar_url: string | null;
};

export default function PatientOnboarding() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [diagnoses, setDiagnoses] = useState("");
  const [gpAddress, setGpAddress] = useState("");

  // Load existing patient profile if it exists
  useEffect(() => {
    async function loadPatient() {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("We couldn't find a logged-in patient. Please sign in again.");
        setLoading(false);
        return;
      }

      const { data, error: patientError } = await supabase
        .from("patients")
        .select(
          "full_name, date_of_birth, address, past_diagnoses, gp_address"
        )
        .eq("id", user.id)
        .maybeSingle<PatientRow>();

      if (patientError) {
        console.error(patientError);
        setError("We couldn’t load your details just now.");
      } else if (data) {
        setFullName(data.full_name ?? "");
        setDob(data.date_of_birth ?? "");
        setAddress(data.address ?? "");
        setDiagnoses(data.past_diagnoses ?? "");
        setGpAddress(data.gp_address ?? "");
      }

      setLoading(false);
    }

    loadPatient();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("We couldn't find a logged-in patient. Please sign in again.");
      setSaving(false);
      return;
    }

    const { error: upsertError } = await supabase.from("patients").upsert(
      {
        id: user.id,
        full_name: fullName.trim() || null,
        date_of_birth: dob || null,
        address: address.trim() || null,
        past_diagnoses: diagnoses.trim() || null,
        gp_address: gpAddress.trim() || null,
      },
      { onConflict: "id" }
    );

    if (upsertError) {
      console.error(upsertError);
      setError("We couldn’t save your profile just now. Please try again.");
      setSaving(false);
      return;
    }

    router.push("/patient/dashboard");
  }

  return (
    <div className="patient-onboard-root">
      <div className="patient-onboard-shell">
        <header className="patient-onboard-header">
          <div className="patient-onboard-brand">
            <div className="logo-wrapper">
              <Image
                src="/logo.png"
                alt="Dr. Sam Logo"
                width={48}
                height={48}
                className="logo-image"
              />
            </div>
            <div>
              <p className="patient-onboard-eyebrow">Patient profile</p>
              <h1 className="patient-onboard-title">Set up your profile</h1>
              <p className="patient-onboard-subtitle">
                Add a few details so doctors can quickly understand your
                background.
              </p>
            </div>
          </div>
        </header>

        <main>
          <form className="patient-onboard-card" onSubmit={handleSubmit}>
            {/* Avatar */}
            <div className="patient-onboard-row">
              <div className="patient-avatar-circle">
                <span className="patient-avatar-initial">
                  {fullName ? fullName.charAt(0).toUpperCase() : "P"}
                </span>
              </div>
              <button
                type="button"
                className="patient-avatar-button"
                disabled
                title="Image upload coming soon"
              >
                Upload a photo
              </button>
            </div>

            <div className="patient-onboard-grid">
              {/* Full name */}
              <div className="patient-field">
                <label className="patient-label" htmlFor="full_name">
                  Full name
                </label>
                <input
                  id="full_name"
                  className="patient-input"
                  type="text"
                  placeholder="e.g. Tenzin Dolma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              {/* Date of birth */}
              <div className="patient-field">
                <label className="patient-label" htmlFor="dob">
                  Date of birth
                </label>
                <input
                  id="dob"
                  className="patient-input"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>

              {/* Address */}
              <div className="patient-field patient-field-span-2">
                <label className="patient-label" htmlFor="address">
                  Current address
                </label>
                <input
                  id="address"
                  className="patient-input"
                  type="text"
                  placeholder="House number, street, city, postcode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              {/* Past diagnoses */}
              <div className="patient-field patient-field-span-2">
                <label className="patient-label" htmlFor="diagnoses">
                  Past diagnoses <span className="patient-optional">(optional)</span>
                </label>
                <textarea
                  id="diagnoses"
                  className="patient-input patient-textarea"
                  placeholder="E.g. asthma, diabetes, previous operations…"
                  value={diagnoses}
                  onChange={(e) => setDiagnoses(e.target.value)}
                  rows={3}
                />
              </div>

              {/* GP address */}
              <div className="patient-field patient-field-span-2">
                <label className="patient-label" htmlFor="gp_address">
                  Current GP practice address{" "}
                  <span className="patient-optional">(optional)</span>
                </label>
                <input
                  id="gp_address"
                  className="patient-input"
                  type="text"
                  placeholder="Practice name, address, postcode"
                  value={gpAddress}
                  onChange={(e) => setGpAddress(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="patient-error">{error}</p>}

            <div className="patient-actions">
              <button
                type="submit"
                className="patient-save-btn"
                disabled={saving || loading}
              >
                {saving ? "Saving…" : "Save profile"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}