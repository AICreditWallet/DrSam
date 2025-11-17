import { createClient } from "@supabase/supabase-js";

// TODO: replace these two with your real values from Supabase
const supabaseUrl = "https://sfzkzrgqdxjleujnfvbg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmemt6cmdxZHhqbGV1am5mdmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMjM1MTMsImV4cCI6MjA3ODc5OTUxM30.mJMKyyMkdNOU6ZkCbJLQrKU28tA6mfnPCNnwvcNWQHY";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key are required");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
