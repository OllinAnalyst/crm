
import React, { useEffect, useState } from "react";
import { supabase } from "./components/auth/supabaseClient";
import Login from "./components/auth/Login";
import CRMBoard from "./CRMBoard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an existing session
    supabase.auth.getUser().then(({ data, error }) => {
      console.log("User fetch result:", data, error);
      setUser(data?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <p className="p-6 text-red-500">Loading...</p>;
  if (!user) return <Login />;

  return <CRMBoard />;
}

export default App;
