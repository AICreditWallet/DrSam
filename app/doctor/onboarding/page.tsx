"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const SPECIALTIES = [
  "General practice (GP)",
  "Dermatology",
  "Mental health / Psychiatry",
  "Women’s health",
  "Paediatrics",
  "Cardiology",
  "Endocrinology / Diabetes",
  "Orthopaedics",
  "Neurology",
  "Respiratory medicine",
  "Gastroenterology",
  "Sexual health",
  "Other",
];

export default function DoctorOnboarding() {
  const [fullName, setFullName] = useState("");
  const [gmcNumber, setGmcNumber] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [clinicDetails, setClinicDetails] = useState("");
  const [availability, setAvailability] = useState("");
  const [consultationType, setConsultationType] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  // Make sure we have a logged-in doctor (from Supabase session)
  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setError(
          "We couldn't find a logged-in doctor. Please sign up or sign in again."
        );
        return;
      }
      setUserId(data.user.id);
    }
    loadUser();
  }, []);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);

    const url = URL.createObjectURL(file);
    setAvatarPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus(null);

    if (!userId) {
      setError("You must be signed in to complete your profile.");
      return;
    }

    // Front-end validation: all required
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!gmcNumber.trim()) {
      setError("Please enter your GMC number.");
      return;
    }
    if (!specialty.trim()) {
      setError("Please choose your specialty.");
      return;
    }
    if (!clinicDetails.trim()) {
      setError("Please add your practice or clinic details.");
      return;
    }
    if (!availability.trim()) {
      setError("Please describe your availability.");
      return;
    }
    if (!consultationType.trim()) {
      setError("Please describe your consultation type.");
      return;
    }

    setLoading(true);

    try {
      let avatarUrl: string | null = null;

      // 1) Upload avatar if provided
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const filePath = `doctors/${userId}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          console.error(uploadError);
          setError(
            "We couldn't upload your photo. You can try again or save without a photo."
          );
        } else {
          const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);

          avatarUrl = data.publicUrl;
        }
      }

      // 2) Save doctor profile in `doctors` table
      const { error: upsertError } = await supabase.from("doctors").upsert(
        {
          id: userId,
          full_name: fullName.trim(),
          gmc_number: gmcNumber.trim(),
          specialty: specialty.trim(),
          clinic_details: clinicDetails.trim(),
          availability: availability.trim(),
          consultation_type: consultationType.trim(),
          avatar_url: avatarUrl,
        },
        { onConflict: "id" }
      );

      if (upsertError) {
        console.error(upsertError);
        setError(
          "We couldn't save your profile just now. Please try again in a moment."
        );
        return;
      }

      setStatus("Profile saved! You’re ready to start using Dr. Sam.");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-shell doctor-onboard-shell">
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
              <p className="auth-eyebrow">Doctor profile</p>
              <h1 className="auth-title">Set up your profile</h1>
              <p className="auth-subtitle">
                Add your name and details. We’ll use this when we show you to
                patients in Dr. Sam.
              </p>
            </div>
          </div>

          <Link href="/" className="account-close">
            ✕
          </Link>
        </header>

        <main className="auth-main doctor-onboard-main">
          {/* Avatar uploader */}
          <div className="onboard-avatar-row">
            <div className="onboard-avatar-wrapper">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Profile preview"
                  width={72}
                  height={72}
                  className="onboard-avatar-image"
                />
              ) : (
                <div className="onboard-avatar-placeholder">
                  <span role="img" aria-label="Doctor">
                    🩺
                  </span>
                </div>
              )}
            </div>

            <div className="onboard-avatar-text">
              <p className="onboard-avatar-title">Profile picture</p>
              <p className="onboard-avatar-sub">
                Optional, but it helps patients recognise you.
              </p>
              <label className="onboard-avatar-button">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="onboard-avatar-input"
                />
                Upload a photo
              </label>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-label">
              Full name
              <input
                type="text"
                className="auth-input"
                placeholder="Dr Jane Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </label>

            <label className="auth-label">
              GMC number
              <input
                type="text"
                className="auth-input"
                placeholder="1234567"
                value={gmcNumber}
                onChange={(e) => setGmcNumber(e.target.value)}
              />
            </label>

            <label className="auth-label">
              Specialty
              <select
                className="auth-input auth-select"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              >
                <option value="">Select a specialty…</option>
                {SPECIALTIES.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>

            <label className="auth-label">
              Practice / clinic details
              <textarea
                className="auth-input auth-textarea"
                placeholder="Clinic name, location, NHS / private, etc."
                rows={3}
                value={clinicDetails}
                onChange={(e) => setClinicDetails(e.target.value)}
              />
            </label>

            <label className="auth-label">
              Availability
              <textarea
                className="auth-input auth-textarea"
                placeholder="e.g. Weekday evenings, weekends, same-day appointments…"
                rows={2}
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              />
            </label>

            <label className="auth-label">
              Consultation type
              <textarea
                className="auth-input auth-textarea"
                placeholder="e.g. Video, phone, in person, follow-up only…"
                rows={2}
                value={consultationType}
                onChange={(e) => setConsultationType(e.target.value)}
              />
            </label>

            {error && <p className="auth-error">{error}</p>}
            {status && <p className="auth-message">{status}</p>}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading || !userId}
            >
              {loading ? "Saving profile..." : "Save profile"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
