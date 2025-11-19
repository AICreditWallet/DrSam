"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {supabase} from "@/lib/supabase";

type PatientProfile = {
  full_name: string;
  dob: string;
  address: string;
  diagnoses: string;
  gp_address: string;
};

export default function PatientOnboarding() {
  const router = useRouter();

  const [profile, setProfile] = useState<PatientProfile>({
    full_name: "",
    dob: "",
    address: "",
    diagnoses: "",
    gp_address: "",
  });

  const [initials, setInitials] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Load existing user + profile
  useEffect(() => {
    async function load() {
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

      // Pre-fill name if available from auth
      const nameFromAuth =
        (user.user_metadata?.full_name as string | undefined) ||
        (user.user_metadata?.name as string | undefined) ||
        "";

      // Load patient row if it exists
      const { data: patientRow, error: patientError } = await supabase
        .from("patients")
        .select("full_name, dob, address, diagnoses, gp_address")
        .eq("id", user.id)
        .maybeSingle();

      if (patientError && patientError.code !== "PGRST116") {
        console.error(patientError);
        setError("We couldn't load your profile just now.");
        setLoading(false);
        return;
      }

      const full_name = patientRow?.full_name || nameFromAuth || "";
      setProfile({
        full_name,
        dob: patientRow?.dob || "",
        address: patientRow?.address || "",
        diagnoses: patientRow?.diagnoses || "",
        gp_address: patientRow?.gp_address || "",
      });

      if (full_name) {
        const parts = full_name.trim().split(" ");
        const first = parts[0]?.[0] ?? "";
        const second = parts[1]?.[0] ?? "";
        setInitials((first + second).toUpperCase());
      }

      setLoading(false);
    }

    load();
  }, []);

  function handleChange(field: keyof PatientProfile, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    // Make sure user is still logged in
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("We couldn't find a logged-in patient. Please sign in again.");
      setSaving(false);
      return;
    }

    // Optional password handling
    if (password || passwordConfirm) {
      if (password !== passwordConfirm) {
        setError("Passwords do not match.");
        setSaving(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        setSaving(false);
        return;
      }

      const { error: pwError } = await supabase.auth.updateUser({
        password,
      });

      if (pwError) {
        console.error(pwError);
        setError(
          `We couldn't update your password. ${pwError.message || "Please try again."}`
        );
        setSaving(false);
        return;
      }
    }

    // Save profile in patients table
    const { error: upsertError } = await supabase.from("patients").upsert(
      {
        id: user.id,
        full_name: profile.full_name.trim(),
        dob: profile.dob || null,
        address: profile.address.trim(),
        diagnoses: profile.diagnoses.trim(),
        gp_address: profile.gp_address.trim(),
      },
      { onConflict: "id" }
    );

    if (upsertError) {
      console.error(upsertError);
      setError("We couldn't save your profile. Please try again.");
      setSaving(false);
      return;
    }

    setSaving(false);
    router.push("/patient/dashboard");
  }

  if (loading) {
    return (
      <div className="onboard-root">
        <div className="onboard-shell">
          <p className="onboard-loading">Loading your profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="onboard-root">
      <div className="onboard-shell">
        <header className="onboard-header">
          <div className="onboard-logo-circle">
            <span>{initials || "P"}</span>
          </div>
          <div>
            <h1 className="onboard-title">Set up your profile</h1>
            <p className="onboard-subtitle">
              Add a few details so doctors can quickly understand your
              background.
            </p>
          </div>
        </header>

        <form className="onboard-card" onSubmit={handleSubmit}>
          {/* Avatar row – upload wired later */}
          <div className="onboard-avatar-row">
            <div className="onboard-avatar-circle">
              <span>{initials || "P"}</span>
            </div>
            <button
              type="button"
              className="onboard-upload-btn"
              disabled
              title="Image uploads coming soon"
            >
              Upload a photo
            </button>
          </div>

          <div className="onboard-field">
            <label className="onboard-label">Full name</label>
            <input
              className="onboard-input"
              type="text"
              value={profile.full_name}
              onChange={(e) => {
                handleChange("full_name", e.target.value);
                const name = e.target.value;
                const parts = name.trim().split(" ");
                const first = parts[0]?.[0] ?? "";
                const second = parts[1]?.[0] ?? "";
                setInitials((first + second).toUpperCase());
              }}
              placeholder="e.g. Tenzin Dolma"
              required
            />
          </div>

          <div className="onboard-field">
            <label className="onboard-label">Date of birth</label>
            <input
              className="onboard-input"
              type="date"
              value={profile.dob}
              onChange={(e) => handleChange("dob", e.target.value)}
              required
            />
          </div>

          <div className="onboard-field">
            <label className="onboard-label">Current address</label>
            <input
              className="onboard-input"
              type="text"
              value={profile.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="House number, street, city, postcode"
              required
            />
          </div>

          <div className="onboard-field">
            <label className="onboard-label">
              Past diagnoses <span className="onboard-optional">(optional)</span>
            </label>
            <textarea
              className="onboard-textarea"
              value={profile.diagnoses}
              onChange={(e) => handleChange("diagnoses", e.target.value)}
              placeholder="E.g. asthma, diabetes, previous operations…"
              rows={3}
            />
          </div>

          <div className="onboard-field">
            <label className="onboard-label">
              Current GP practice address{" "}
              <span className="onboard-optional">(optional)</span>
            </label>
            <input
              className="onboard-input"
              type="text"
              value={profile.gp_address}
              onChange={(e) => handleChange("gp_address", e.target.value)}
              placeholder="Practice name, address, postcode"
            />
          </div>

          <div className="onboard-divider" />

          <div className="onboard-field">
            <label className="onboard-label">
              Set a password <span className="onboard-optional">(optional)</span>
            </label>
            <p className="onboard-help">
              If you set a password, you&apos;ll be able to log in later using
              email and password, instead of only magic links.
            </p>
            <div className="onboard-password-grid">
              <div>
                <input
                  className="onboard-input"
                  type="password"
                  autoComplete="new-password"
                  placeholder="New password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <input
                  className="onboard-input"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && <p className="onboard-error">{error}</p>}

          <button
            type="submit"
            className="onboard-submit"
            disabled={saving}
          >
            {saving ? "Saving…" : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
}