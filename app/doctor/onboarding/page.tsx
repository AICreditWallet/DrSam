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

const CONSULTATION_MODES = [
  "Video",
  "Phone",
  "In person",
  "Emergency / home visit",
];

const WEEKDAY_DAY_FEES = ["£20/h", "£45/h", "£55/h", "£75/h"];
const WEEKDAY_NIGHT_FEES = ["£45/h", "£75/h", "£120/h"];
const WEEKEND_DAY_FEES = ["£45/h", "£55/h", "£75/h", "£125/h", "£175/h"];
const WEEKEND_NIGHT_FEES = ["£55/h", "£75/h", "£99/h", "£125/h", "£155/h", "£195/h"];
const EMERGENCY_FEES = ["£125/h", "£210/h", "£350/h", "£450/h"];

export default function DoctorOnboarding() {
  const [fullName, setFullName] = useState("");
  const [gmcNumber, setGmcNumber] = useState("");

  // multi-select specialties & modes
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);

  // availability blocks
  const [weekdayDay, setWeekdayDay] = useState(false);   // 08:00–19:00
  const [weekdayNight, setWeekdayNight] = useState(false); // 19:00–08:00
  const [weekendDay, setWeekendDay] = useState(false);   // 07:00–19:00
  const [weekendNight, setWeekendNight] = useState(false); // 19:00–07:00
  const [is247, setIs247] = useState(false);

  // fees selected per block
  const [feeWeekdayDay, setFeeWeekdayDay] = useState("");
  const [feeWeekdayNight, setFeeWeekdayNight] = useState("");
  const [feeWeekendDay, setFeeWeekendDay] = useState("");
  const [feeWeekendNight, setFeeWeekendNight] = useState("");
  const [feeEmergency, setFeeEmergency] = useState("");

  const [clinicDetails, setClinicDetails] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  // load logged-in doctor
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

  function toggleInList(value: string, list: string[], setter: (v: string[]) => void) {
    if (list.includes(value)) {
      setter(list.filter((v) => v !== value));
    } else {
      setter([...list, value]);
    }
  }

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

    // validation – everything required except photo
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!gmcNumber.trim()) {
      setError("Please enter your GMC number.");
      return;
    }
    if (selectedSpecialties.length === 0) {
      setError("Please choose at least one specialty.");
      return;
    }
    const anyAvailability = weekdayDay || weekdayNight || weekendDay || weekendNight || is247;
    if (!anyAvailability) {
      setError("Please select when you’re available.");
      return;
    }
    if (selectedModes.length === 0) {
      setError("Please choose at least one consultation type.");
      return;
    }
    if (!clinicDetails.trim()) {
      setError("Please add your practice or clinic details.");
      return;
    }

    // fees: require at least one fee, and for each selected time block, encourage fee selection
    const anyFee =
      feeWeekdayDay ||
      feeWeekdayNight ||
      feeWeekendDay ||
      feeWeekendNight ||
      feeEmergency;
    if (!anyFee) {
      setError("Please choose at least one fee option.");
      return;
    }

    // Optional: warn if block selected but no fee for that block
    if (weekdayDay && !feeWeekdayDay) {
      setError("Please choose a fee for weekdays 08:00–19:00 or untick that block.");
      return;
    }
    if (weekdayNight && !feeWeekdayNight) {
      setError("Please choose a fee for weekdays 19:00–08:00 or untick that block.");
      return;
    }
    if (weekendDay && !feeWeekendDay) {
      setError("Please choose a fee for weekends 07:00–19:00 or untick that block.");
      return;
    }
    if (weekendNight && !feeWeekendNight) {
      setError("Please choose a fee for weekends 19:00–07:00 or untick that block.");
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

      // build structured values for saving
      const availabilityBlocks: string[] = [];
      if (weekdayDay) availabilityBlocks.push("weekday_day");
      if (weekdayNight) availabilityBlocks.push("weekday_night");
      if (weekendDay) availabilityBlocks.push("weekend_day");
      if (weekendNight) availabilityBlocks.push("weekend_night");
      if (is247) availabilityBlocks.push("24_7");

      const availabilitySummary = availabilityBlocks.join(",");

      const consultationSummary = selectedModes.join(",");

      const feesConfig = {
        weekday_day: feeWeekdayDay || null,
        weekday_night: feeWeekdayNight || null,
        weekend_day: feeWeekendDay || null,
        weekend_night: feeWeekendNight || null,
        emergency_home: feeEmergency || null,
      };

      // 2) Save doctor profile in `doctors` table
      const { error: upsertError } = await supabase.from("doctors").upsert(
        {
          id: userId,
          full_name: fullName.trim(),
          gmc_number: gmcNumber.trim(),
          specialty: selectedSpecialties.join(","), // multi-specialty
          clinic_details: clinicDetails.trim(),
          availability: availabilitySummary,
          consultation_type: consultationSummary,
          avatar_url: avatarUrl,
          fees: JSON.stringify(feesConfig),
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
                Add your name, specialties, availability and fees so patients
                can find the right doctor quickly.
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

            {/* Specialties multi-select */}
            <div className="auth-label">
              <div className="auth-label-title">Specialties</div>
              <p className="auth-label-sub">
                Choose all that apply – patients can filter by these.
              </p>
              <div className="pill-row">
                {SPECIALTIES.map((item) => {
                  const selected = selectedSpecialties.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      className={`pill ${selected ? "pill-selected" : ""}`}
                      onClick={() =>
                        toggleInList(item, selectedSpecialties, setSelectedSpecialties)
                      }
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clinic details */}
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

            {/* Availability */}
            <div className="auth-label">
              <div className="auth-label-title">Availability</div>
              <p className="auth-label-sub">
                Select when you usually see patients. We’ll use this for
                matching and filters.
              </p>
              <div className="availability-grid">
                <label className="checkbox-chip">
                  <input
                    type="checkbox"
                    checked={weekdayDay}
                    onChange={(e) => setWeekdayDay(e.target.checked)}
                  />
                  <span>Weekdays 08:00–19:00</span>
                </label>
                <label className="checkbox-chip">
                  <input
                    type="checkbox"
                    checked={weekdayNight}
                    onChange={(e) => setWeekdayNight(e.target.checked)}
                  />
                  <span>Weekdays 19:00–08:00</span>
                </label>
                <label className="checkbox-chip">
                  <input
                    type="checkbox"
                    checked={weekendDay}
                    onChange={(e) => setWeekendDay(e.target.checked)}
                  />
                  <span>Weekends 07:00–19:00</span>
                </label>
                <label className="checkbox-chip">
                  <input
                    type="checkbox"
                    checked={weekendNight}
                    onChange={(e) => setWeekendNight(e.target.checked)}
                  />
                  <span>Weekends 19:00–07:00</span>
                </label>
                <label className="checkbox-chip checkbox-chip-247">
                  <input
                    type="checkbox"
                    checked={is247}
                    onChange={(e) => setIs247(e.target.checked)}
                  />
                  <span>Available 24/7</span>
                </label>
              </div>
            </div>

            {/* Consultation types */}
            <div className="auth-label">
              <div className="auth-label-title">Consultation type</div>
              <p className="auth-label-sub">
                Choose all the ways you’re happy to see patients.
              </p>
              <div className="pill-row">
                {CONSULTATION_MODES.map((item) => {
                  const selected = selectedModes.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      className={`pill ${selected ? "pill-selected" : ""}`}
                      onClick={() => toggleInList(item, selectedModes, setSelectedModes)}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fees */}
            <div className="auth-label">
              <div className="auth-label-title">Service fees</div>
              <p className="auth-label-sub">
                Choose your usual hourly rates. You can refine this later.
              </p>

              <div className="fees-grid">
                <div className="fees-item">
                  <div className="fees-label">Weekdays 08:00–19:00</div>
                  <select
                    className="auth-input auth-select"
                    value={feeWeekdayDay}
                    onChange={(e) => setFeeWeekdayDay(e.target.value)}
                  >
                    <option value="">Select fee…</option>
                    {WEEKDAY_DAY_FEES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="fees-item">
                  <div className="fees-label">Weekdays 19:00–08:00</div>
                  <select
                    className="auth-input auth-select"
                    value={feeWeekdayNight}
                    onChange={(e) => setFeeWeekdayNight(e.target.value)}
                  >
                    <option value="">Select fee…</option>
                    {WEEKDAY_NIGHT_FEES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="fees-item">
                  <div className="fees-label">Weekends 07:00–19:00</div>
                  <select
                    className="auth-input auth-select"
                    value={feeWeekendDay}
                    onChange={(e) => setFeeWeekendDay(e.target.value)}
                  >
                    <option value="">Select fee…</option>
                    {WEEKEND_DAY_FEES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="fees-item">
                  <div className="fees-label">Weekends 19:00–07:00</div>
                  <select
                    className="auth-input auth-select"
                    value={feeWeekendNight}
                    onChange={(e) => setFeeWeekendNight(e.target.value)}
                  >
                    <option value="">Select fee…</option>
                    {WEEKEND_NIGHT_FEES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="fees-item">
                  <div className="fees-label">Home visit / Emergency</div>
                  <select
                    className="auth-input auth-select"
                    value={feeEmergency}
                    onChange={(e) => setFeeEmergency(e.target.value)}
                  >
                    <option value="">Select fee…</option>
                    {EMERGENCY_FEES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

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
