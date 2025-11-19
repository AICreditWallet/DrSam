"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type PatientRow = {
  full_name: string | null;
  date_of_birth: string | null;
  address: string | null;
  past_diagnoses: string | null;
  gp_address: string | null;
  avatar_url: string | null;
};

export default function PatientOnboarding() {
  const router = useRouter();

  const [patient, setPatient] = useState<PatientRow | null>(null);
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [pastDx, setPastDx] = useState("");
  const [gpAddress, setGpAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadPatient() {
      setError(null);
      setStatus(null);

      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        console.error(error);
        setError("We couldn't find a logged-in patient. Please sign in again.");
        setLoading(false);
        return;
      }

      const { data: patientRow, error: patientError } = await supabase
        .from("patients")
        .select(
          "full_name, date_of_birth, address, past_diagnoses, gp_address, avatar_url"
        )
        .eq("id", data.user.id)
        .maybeSingle();

      if (patientError) {
        console.error(patientError);
        setError("We couldn't load your profile just now.");
        setLoading(false);
        return;
      }

      if (patientRow) {
        setPatient(patientRow as PatientRow);
        setFullName(patientRow.full_name ?? "");
        setDob(patientRow.date_of_birth ?? "");
        setAddress(patientRow.address ?? "");
        setPastDx(patientRow.past_diagnoses ?? "");
        setGpAddress(patientRow.gp_address ?? "");
        setAvatarUrl(patientRow.avatar_url ?? null);
      }

      setLoading(false);
    }

    loadPatient();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setStatus(null);

    const { data, error: userError } = await supabase.auth.getUser();

    if (userError || !data.user) {
      setError("We couldn't find a logged-in patient. Please sign in again.");
      setSaving(false);
      return;
    }

    const { error: upsertError } = await supabase
      .from("patients")
      .upsert(
        {
          id: data.user.id,
          full_name: fullName.trim(),
          date_of_birth: dob || null,
          address: address.trim() || null,
          past_diagnoses: pastDx.trim() || null,
          gp_address: gpAddress.trim() || null,
          avatar_url: avatarUrl,
        },
        { onConflict: "id" }
      );

    if (upsertError) {
      console.error(upsertError);
      setError("We couldn't save your profile. Please try again.");
      setSaving(false);
      return;
    }

    setStatus("Profile saved!");
    setSaving(false);
    router.push("/patient/dashboard");
  }

  if (loading) {
    return (
      <div className="onboarding-shell">
        <div className="onboarding-card">Loading your profile…</div>
      </div>
    );
  }

  return (
    <div className="onboarding-shell">
      <div className="onboarding-card">
        <h1 className="onboarding-title">Set up your profile</h1>
        <p className="onboarding-subtitle">
          Add your details so doctors can understand your background quickly.
        </p>

        <form onSubmit={handleSubmit} className="onboarding-form">
          {/* Avatar – optional, you can wire up upload later */}
          <div className="avatar-row">
            <div className="avatar-circle">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Your avatar"
                  width={72}
                  height={72}
                />
              ) : (
                <span className="avatar-placeholder">You</span>
              )}
            </div>
            <button
              type="button"
              className="avatar-button"
              onClick={() =>
                alert("Avatar uploads can be wired up later via Supabase Storage")
              }
            >
              Upload a photo
            </button>
          </div>

          <label className="field-label">
            Full name
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="field-input"
              placeholder="e.g. Tenzin Dolma"
            />
          </label>

          <label className="field-label">
            Date of birth
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="field-input"
            />
          </label>

          <label className="field-label">
            Current address
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="field-textarea"
              placeholder="House number, street, city, postcode"
            />
          </label>

          <label className="field-label">
            Past diagnoses (optional)
            <textarea
              value={pastDx}
              onChange={(e) => setPastDx(e.target.value)}
              className="field-textarea"
              placeholder="E.g. asthma, diabetes, previous operations…"
            />
          </label>

          <label className="field-label">
            Current GP practice address (optional)
            <textarea
              value={gpAddress}
              onChange={(e) => setGpAddress(e.target.value)}
              className="field-textarea"
              placeholder="Practice name, address, postcode"
            />
          </label>

          {status && <p className="form-status">{status}</p>}
          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="btn-filled onboarding-submit"
          >
            {saving ? "Saving…" : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
}