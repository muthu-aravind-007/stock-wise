import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function TestSupabase() {
  const [status, setStatus] = useState("⚡ Page loaded, testing Supabase...");

  useEffect(() => {
    console.log("🔍 TestSupabase mounted"); // debug log

    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*").limit(5);

        if (error) {
          console.error("❌ Supabase error:", error);
          setStatus("❌ Connection failed: " + error.message);
        } else {
          console.log("✅ Products:", data);
          setStatus("✅ Connected! Found " + data.length + " product(s).");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setStatus("🔥 Unexpected error: " + String(err));
      }
    };

    testConnection();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold">{status}</h1>
    </div>
  );
}
