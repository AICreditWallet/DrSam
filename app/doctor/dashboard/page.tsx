"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";



type DoctorRow = {
  full_name: string | null;
  avatar_url: string | null;
  specialty: string | null;
};

type AppointmentStatus = "pending" | "accepted" | "completed" | "cancelled";

type Appointment = {
  id: string;
  patientName: string;
  time: string;
  type: string;
  status: AppointmentStatus;
  isEmergency?: boolean;
};

type Message = {
  id: string;
  patientName: string;
  preview: string;
  time: string;
  hasAttachment?: boolean;
};

export default function DoctorDashboard() {
    const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/"); // send them back to the home page
  }

  const [doctor, setDoctor] = useState<DoctorRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);


  // Mock data for now – later you can replace with Supabase queries
  const notifications: Appointment[] = [
    {
      id: "1",
      patientName: "Sarah K.",
      time: "Today • 15:30",
      type: "GP video",
      status: "pending",
    },
    {
      id: "2",
      patientName: "Emergency triage",
      time: "Now",
      type: "Emergency",
      status: "pending",
      isEmergency: true,
    },
  ];

  const upcomingAppointments: Appointment[] = [
    {
      id: "3",
      patientName: "James W.",
      time: "Tomorrow • 09:00",
      type: "Dermatology • video",
      status: "accepted",
    },
    {
      id: "4",
      patientName: "Amir R.",
      time: "Thu • 18:30",
      type: "Mental health • in person",
      status: "accepted",
    },
  ];

  const pastAppointments: Appointment[] = [
    {
      id: "5",
      patientName: "Emily P.",
      time: "Yesterday • 11:00",
      type: "GP • video",
      status: "completed",
    },
  ];

  const inbox: Message[] = [
    {
      id: "m1",
      patientName: "James W.",
      preview: "Hi, can we move tomorrow’s appointment slightly later?",
      time: "10 min ago",
    },
    {
      id: "m2",
      patientName: "Sarah K.",
      preview: "Uploaded blood test results for review.",
      time: "1 hr ago",
      hasAttachment: true,
    },
  ];

  useEffect(() => {
    async function loadDoctor() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setError("Please sign in again to view your dashboard.");
        setLoading(false);
        return;
      }

      const { data: doctorRow, error: doctorError } = await supabase
        .from("doctors")
        .select("full_name, avatar_url, specialty")
        .eq("id", data.user.id)
        .maybeSingle();

      if (doctorError) {
        console.error(doctorError);
        setError("We couldn’t load your profile just now.");
      } else if (doctorRow) {
        setDoctor(doctorRow as DoctorRow);
      }

      setLoading(false);
    }

    loadDoctor();
  }, []);

  return (
    <div className="dash-root">
      <div className="dash-shell">
        <header className="dash-header">
          <div className="dash-header-left">
            <div className="dash-avatar-wrapper">
              {doctor?.avatar_url ? (
                <Image
                  src={doctor.avatar_url}
                  alt={doctor.full_name || "Doctor avatar"}
                  width={52}
                  height={52}
                  className="dash-avatar-image"
                />
              ) : (
                <div className="dash-avatar-placeholder">
                  <span role="img" aria-label="Doctor">
                    🩺
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="dash-eyebrow">Doctor dashboard</p>
              <h1 className="dash-title">
                {doctor?.full_name || "Welcome back"}
              </h1>
              <p className="dash-subtitle">
                {doctor?.specialty
                  ? doctor.specialty.replace(/,/g, " • ")
                  : "Keep your availability up to date so patients can find you quickly."}
              </p>
            </div>
          </div>

          <div className="dashboard-actions">
  <button
    type="button"
    className="dash-btn dash-btn-outline"
    onClick={() => router.push("/doctor/onboarding")}
  >
    Edit profile
  </button>

  <button
  type="button"
  className={`dash-btn dash-btn-primary ${isOnline ? "dash-btn-primary-on" : ""}`}
  onClick={() => setIsOnline(!isOnline)}
>
  {isOnline ? "Online" : "Go online"}
</button>


  <button
    type="button"
    className="dash-btn dash-btn-ghost"
    onClick={handleLogout}
  >
    Log out
  </button>
</div>


        </header>

        <main className="dash-main">
          {loading && <p className="auth-message">Loading your dashboard…</p>}
          {error && <p className="auth-error">{error}</p>}

          {!loading && !error && (
            <>
              {/* Top summary / balances */}
              <section className="dash-grid dash-grid-3">
                <div className="dash-card">
                  <p className="dash-card-label">Today’s schedule</p>
                  <p className="dash-card-main">2 appointments</p>
                  <p className="dash-card-sub">
                    1 pending confirmation, 1 emergency.
                  </p>
                </div>

                <div className="dash-card">
                  <p className="dash-card-label">Available balance</p>
                  <p className="dash-card-main">£640.00</p>
                  <p className="dash-card-sub">Next payout on Friday.</p>
                </div>

                <div className="dash-card dash-card-highlight">
                  <p className="dash-card-label">Bank details</p>
                  <p className="dash-card-main">Set up payouts</p>
                  <p className="dash-card-sub">
                    Add your bank details so you can get paid.
                  </p>
                  <button type="button" className="dash-secondary-button">
                    Add bank account
                  </button>
                </div>
              </section>

              {/* Notifications & appointments */}
              <section className="dash-grid dash-grid-2">
                {/* Notifications */}
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h2 className="dash-card-title">Notifications</h2>
                    <span className="dash-pill small">
                      {notifications.length} new
                    </span>
                  </div>
                  <div className="dash-list">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`dash-notif-row ${
                          n.isEmergency ? "dash-notif-emergency" : ""
                        }`}
                      >
                        <div>
                          <p className="dash-notif-main">
                            {n.isEmergency ? "🚨 Emergency" : "New request"}
                          </p>
                          <p className="dash-notif-sub">
                            {n.patientName} • {n.type}
                          </p>
                          <p className="dash-notif-time">{n.time}</p>
                        </div>
                        <div className="dash-notif-actions">
                          <button
                            type="button"
                            className="dash-notif-button decline"
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            className="dash-notif-button accept"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming appointments */}
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h2 className="dash-card-title">Upcoming appointments</h2>
                    <button type="button" className="dash-link-button">
                      View calendar
                    </button>
                  </div>
                  <div className="dash-list">
                    {upcomingAppointments.map((a) => (
                      <div key={a.id} className="dash-appointment-row">
                        <div>
                          <p className="dash-apt-main">{a.patientName}</p>
                          <p className="dash-apt-sub">{a.type}</p>
                          <p className="dash-apt-time">{a.time}</p>
                        </div>
                        <span className="dash-pill">Accepted</span>
                      </div>
                    ))}
                  </div>
                  <div className="dash-divider" />
                  <div className="dash-list-header">
                    <p className="dash-card-sub">Recent appointments</p>
                  </div>
                  <div className="dash-list">
                    {pastAppointments.map((a) => (
                      <div key={a.id} className="dash-appointment-row">
                        <div>
                          <p className="dash-apt-main">{a.patientName}</p>
                          <p className="dash-apt-sub">{a.type}</p>
                          <p className="dash-apt-time">{a.time}</p>
                        </div>
                        <span className="dash-pill muted">Completed</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Inbox & documents + payouts detail */}
              <section className="dash-grid dash-grid-2">
                {/* Inbox */}
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h2 className="dash-card-title">Inbox</h2>
                    <button type="button" className="dash-link-button">
                      Open messages
                    </button>
                  </div>
                  <div className="dash-list">
                    {inbox.map((m) => (
                      <div key={m.id} className="dash-message-row">
                        <div className="dash-message-avatar">
                          {m.patientName[0]}
                        </div>
                        <div className="dash-message-body">
                          <p className="dash-message-main">{m.patientName}</p>
                          <p className="dash-message-sub">{m.preview}</p>
                          <p className="dash-message-time">{m.time}</p>
                        </div>
                        {m.hasAttachment && (
                          <span className="dash-pill small">
                            📎 Document
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="dash-card-sub">
                    Patients can message you to adjust appointments and upload
                    documents for review.
                  </p>
                </div>

                {/* Payouts detail */}
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h2 className="dash-card-title">Payouts & balance</h2>
                  </div>
                  <div className="dash-payouts-grid">
                    <div className="dash-payout-card">
                      <p className="dash-card-label">Available</p>
                      <p className="dash-card-main">£640.00</p>
                      <p className="dash-card-sub">
                        Ready to withdraw to your bank account.
                      </p>
                    </div>
                    <div className="dash-payout-card">
                      <p className="dash-card-label">Upcoming</p>
                      <p className="dash-card-main">£320.00</p>
                      <p className="dash-card-sub">
                        From 4 future appointments this week.
                      </p>
                    </div>
                  </div>
                  <div className="dash-divider" />
                  <p className="dash-card-sub">
                    You’ll be able to track payments per appointment once
                    payouts are connected.
                  </p>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
