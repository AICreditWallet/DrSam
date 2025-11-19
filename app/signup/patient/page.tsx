"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PatientProfile = {
  id: string;
  full_name: string | null;
  date_of_birth: string | null;
  address: string | null;
  past_diagnoses: string | null;
  gp_address: string | null;
  avatar_url: string | null;
};

export default function PatientSignup() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  // profile fields
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [diagnoses, setDiagnoses] = useState("");
  const [gpAddress, setGpAddress] = useState("");

  // avatar
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // password fields (optional)
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  useEffect(() => {
    async function load() {
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

      setUserId(user.id);
      setEmail(user.email ?? null);

      // Load existing profile if it exists
      const { data: profile, error: profileError } = await supabase
        .from("patients")
        .select(
          "full_name, date_of_birth, address, past_diagnoses, gp_address, avatar_url"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error(profileError);
        setError("Something went wrong loading your profile.");
      } else if (profile) {
        setFullName(profile.full_name ?? "");
        setDob(profile.date_of_birth ?? "");
        setAddress(profile.address ?? "");
        setDiagnoses(profile.past_diagnoses ?? "");
        setGpAddress(profile.gp_address ?? "");
        setAvatarUrl(profile.avatar_url);
        setAvatarPreview(profile.avatar_url);
      }

      setLoading(false);
    }

    load();
  }, []);

  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setError(null);

    try {
      // simple preview
      const preview = URL.createObjectURL(file);
      setAvatarPreview(preview);

      // upload to Supabase Storage (bucket: "avatars")
      const fileExt = file.name.split(".").pop();
      const filePath = `patients/${userId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error(uploadError);
        setError("We couldn’t upload your photo. Please try again.");
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
    } catch (err) {
      console.error(err);
      setError("We couldn’t upload your photo. Please try again.");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    if (password && password !== passwordConfirm) {
      setError("Passwords do not match.");
      setSaving(false);
      return;
    }

    try {
      // upsert profile
      const { error: upsertError } = await supabase.from("patients").upsert(
        {
          id: userId,
          full_name: fullName || null,
          date_of_birth: dob || null,
          address: address || null,
          past_diagnoses: diagnoses || null,
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

      // Optional password update
      if (password) {
        const { error: pwError } = await supabase.auth.updateUser({
          password,
        });
        if (pwError) {
          console.error(pwError);
          setError(
            "Your profile was saved, but we couldn’t update your password. You can try setting it again later."
          );
          setSaving(false);
          return;
        }
      }

      setSuccess("Profile saved!");
      router.push("/patient/dashboard");
    } catch (err) {
      console.error(err);
      setError("We couldn’t save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const initials =
    fullName?.trim()?.split(" ")?.map((n) => n[0])?.join("")?.toUpperCase() ||
    email?.[0]?.toUpperCase() ||
    "P";

  return (
    <div className="patient-signup-root">
      <div className="patient-signup-shell">
        <header className="patient-signup-header">
          <div className="patient-signup-logo-circle">
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarPreview} alt="Avatar preview" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="patient-signup-header-text">
            <h1 className="patient-signup-title">Set up your profile</h1>
            <p className="patient-signup-subtitle">
              Add a few details so doctors can quickly understand your
              background.
            </p>
          </div>
        </header>

        <main className="patient-signup-main">
          {loading ? (
            <p className="patient-signup-status">Loading your profile…</p>
          ) : error && !userId ? (
            <p className="patient-signup-error">{error}</p>
          ) : (
            <form className="patient-signup-card" onSubmit={handleSubmit}>
              {/* Avatar + upload */}
              <div className="patient-signup-avatar-row">
                <button
                  type="button"
                  className="patient-signup-upload-btn"
                  onClick={() =>
                    document.getElementById("avatar-input")?.click()
                  }
                >
                  Upload a photo
                </button>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
                <p className="patient-signup-helper-text">
                  A clear face photo helps doctors recognise you quickly.
                </p>
              </div>

              {/* Full name */}
              <div className="form-field">
                <label className="form-label" htmlFor="full-name">
                  Full name
                </label>
                <input
                  id="full-name"
                  className="form-input"
                  type="text"
                  placeholder="e.g. Tenzin Dolma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              {/* Date of birth */}
              <div className="form-field">
                <label className="form-label" htmlFor="dob">
                  Date of birth
                </label>
                <input
                  id="dob"
                  className="form-input"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>

              {/* Address */}
              <div className="form-field">
                <label className="form-label" htmlFor="address">
                  Current address
                </label>
                <input
                  id="address"
                  className="form-input"
                  type="text"
                  placeholder="House number, street, city, postcode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* Past diagnoses */}
              <div className="form-field">
                <label className="form-label" htmlFor="diagnoses">
                  Past diagnoses <span className="form-label-optional">(optional)</span>
                </label>
                <textarea
                  id="diagnoses"
                  className="form-textarea"
                  placeholder="E.g. asthma, diabetes, previous operations…"
                  value={diagnoses}
                  onChange={(e) => setDiagnoses(e.target.value)}
                  rows={3}
                />
              </div>

              {/* GP address */}
              <div className="form-field">
                <label className="form-label" htmlFor="gp-address">
                  Current GP practice address{" "}
                  <span className="form-label-optional">(optional)</span>
                </label>
                <input
                  id="gp-address"
                  className="form-input"
                  type="text"
                  placeholder="Practice name, address, postcode"
                  value={gpAddress}
                  onChange={(e) => setGpAddress(e.target.value)}
                />
              </div>

              {/* Password (optional) */}
              <div className="form-field">
                <label className="form-label">Set a password (optional)</label>
                <p className="patient-signup-helper-text">
                  If you set a password, you’ll be able to log in later using
                  your email and password, instead of only email links.
                </p>
                <div className="patient-signup-password-grid">
                  <input
                    className="form-input"
                    type="password"
                    placeholder="New password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Confirm password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                  />
                </div>
              </div>

              {error && <p className="patient-signup-error">{error}</p>}
              {success && <p className="patient-signup-success">{success}</p>}

              <button
                type="submit"
                className="primary-btn"
                disabled={saving || !userId}
              >
                {saving ? "Saving…" : "Save profile"}
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}