// src/App.jsx
import React, { useEffect, useState } from "react";
import CRMBoard from "./CRMBoard";
import Login from "./components/auth/Login"; // ✅ FIXED: was '@/components/auth/Login'
import { supabase } from "./components/auth/supabaseClient"; // ✅ FIXED

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log("🧠 Supabase user:", user);
      console.log("⚠️ Error:", error);
      setUser(user);
    };
    getSession();
  
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("🔁 Auth state changed:", session);
      setUser(session?.user || null);
    });
  }, []);  

  return user ? <CRMBoard /> : <Login onLogin={setUser} />;
}
