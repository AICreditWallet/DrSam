"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {supabase} from "@/lib/supabase";

type PatientRow = {
  id: string;
  full_name: string | null;
  date_of_birth: string | null;
  current_address: string | null;
  past_diagnoses: string | null;
  gp_address: string | null;
  avatar_url: string | null;
};

export default function PatientOnboarding() {
  const router = useRouter();

  const [patient, setPatient] = useState<PatientRow | null>(null);
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [pastDiagnoses, setPastDiagnoses] = useState("");
  const [gpAddress, setGpAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("We couldn’t find a logged-in patient. Please sign in again.");
        setLoading(false);
        return;
      }

      const { data, error: patientError } = await supabase
        .from("patients")
        .select(
          "id, full_name, date_of_birth, current_address, past_diagnoses, gp_address, avatar_url"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (patientError) {
        console.error(patientError);
        setError("We couldn’t load your profile just now.");
      } else if (data) {
        const p = data as PatientRow;
        setPatient(p);
        setFullName(p.full_name || "");
        setDob(p.date_of_birth || "");
        setCurrentAddress(p.current_address || "");
        setPastDiagnoses(p.past_diagnoses || "");
        setGpAddress(p.gp_address || "");
        setAvatarUrl(p.avatar_url || null);
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  function getInitials(name: string | null): string {
    if (!name && !fullName) return "P";
    const n = name || fullName;
    const parts = n.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase()
    );
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Please sign in again before uploading a photo.");
        setUploading(false);
        return;
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `patients/${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        console.error(uploadError);
        setError("We couldn’t upload your photo. Please try again.");
        setUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      setUploading(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while uploading your photo.");
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("We couldn’t find a logged-in patient. Please sign in again.");
      setSaving(false);
      return;
    }

    // 1) If user entered a new password, update it
    if (newPassword) {
      const { error: pwError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (pwError) {
        console.error(pwError);
        setError("We couldn’t update your password. Please try again.");
        setSaving(false);
        return;
      }
    }

    // 2) Upsert patient profile
    const { error: upsertError } = await supabase.from("patients").upsert(
      {
        id: user.id,
        full_name: fullName.trim(),
        date_of_birth: dob || null,
        current_address: currentAddress || null,
        past_diagnoses: pastDiagnoses || null,
        gp_address: gpAddress || null,
        avatar_url: avatarUrl || null,
      },
      { onConflict: "id" }
    );

    if (upsertError) {
      console.error(upsertError);
      setError("We couldn’t save your profile. Please try again.");
      setSaving(false);
      return;
    }

    setSaving(false);
    setSuccess("Profile saved. Redirecting to your dashboard…");
    setTimeout(() => {
      router.push("/patient/dashboard");
    }, 1200);
  }

  return (
    <div className="patient-onboard-root">
      <div className="patient-onboard-shell">
        <header className="patient-onboard-header">
          <div className="patient-onboard-logo">
            <div className="logo-wrapper">
              <Image
                src="/logo.png"
                alt="Dr. Sam Logo"
                width={40}
                height={40}
                className="logo-image"
              />
            </div>
            <div>
              <p className="patient-onboard-eyebrow">Patient onboarding</p>
              <h1 className="patient-onboard-title">Set up your profile</h1>
              <p className="patient-onboard-subtitle">
                Add a few details so doctors can quickly understand your
                background.
              </p>
            </div>
          </div>
        </header>

        <main>
          <form
            className="patient-onboard-card"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="patient-onboard-card-inner">
              {/* avatar + upload */}
              <div className="patient-onboard-avatar-row">
                <div className="patient-onboard-avatar">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={fullName || "Patient avatar"}
                      width={64}
                      height={64}
                      className="patient-onboard-avatar-img"
                    />
                  ) : (
                    <div className="patient-onboard-avatar-fallback">
                      {getInitials(patient?.full_name || null)}
                    </div>
                  )}
                </div>

                <div className="patient-onboard-avatar-actions">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <button
                    type="button"
                    className="profile-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading…" : "Upload a photo"}
                  </button>
                  <p className="patient-onboard-avatar-help">
                    A clear face photo helps doctors recognise you quickly.
                  </p>
                </div>
              </div>

              {/* profile fields */}
              <div className="patient-onboard-fields">
                <label className="profile-field">
                  <span className="profile-label">Full name</span>
                  <input
                    type="text"
                    className="profile-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tenzin Dolma"
                  />
                </label>

                <label className="profile-field">
                  <span className="profile-label">Date of birth</span>
                  <input
                    type="date"
                    className="profile-input"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </label>

                <label className="profile-field">
                  <span className="profile-label">Current address</span>
                  <input
                    type="text"
                    className="profile-input"
                    value={currentAddress}
                    onChange={(e) => setCurrentAddress(e.target.value)}
                    placeholder="House number, street, city, postcode"
                  />
                </label>

                <label className="profile-field">
                  <span className="profile-label">
                    Past diagnoses <span className="profile-optional">(optional)</span>
                  </span>
                  <textarea
                    className="profile-textarea"
                    rows={3}
                    value={pastDiagnoses}
                    onChange={(e) => setPastDiagnoses(e.target.value)}
                    placeholder="E.g. asthma, diabetes, previous operations…"
                  />
                </label>

                <label className="profile-field">
                  <span className="profile-label">
                    Current GP practice address{" "}
                    <span className="profile-optional">(optional)</span>
                  </span>
                  <input
                    type="text"
                    className="profile-input"
                    value={gpAddress}
                    onChange={(e) => setGpAddress(e.target.value)}
                    placeholder="Practice name, address, postcode"
                  />
                </label>
              </div>

              {/* password section */}
              <div className="patient-onboard-password-block">
                <h2 className="patient-onboard-password-title">
                  Set a password (optional)
                </h2>
                <p className="patient-onboard-password-text">
                  If you set a password, you’ll be able to log in later using
                  your email and password instead of only magic links.
                </p>

                <div className="patient-onboard-password-grid">
                  <label className="profile-field">
                    <span className="profile-label">New password</span>
                    <input
                      type="password"
                      className="profile-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                    />
                  </label>
                  <label className="profile-field">
                    <span className="profile-label">Confirm password</span>
                    <input
                      type="password"
                      className="profile-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </label>
                </div>
              </div>

              {error && <p className="profile-error">{error}</p>}
              {success && <p className="profile-success">{success}</p>}

              <div className="profile-actions">
                <button
                  type="submit"
                  className="profile-save-btn"
                  disabled={saving || loading}
                >
                  {saving ? "Saving…" : "Save profile"}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}