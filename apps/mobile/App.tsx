import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./src/lib/supabase";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";

type Screen = "login" | "register";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<Screen>("login");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!ready) return null;

  if (user) {
    return (
      <>
        <HomeScreen user={user} onLogout={() => setUser(null)} />
        <StatusBar style="auto" />
      </>
    );
  }

  return (
    <>
      {screen === "login" ? (
        <LoginScreen
          onSwitch={() => setScreen("register")}
          onSuccess={() => {}}
        />
      ) : (
        <RegisterScreen
          onSwitch={() => setScreen("login")}
          onSuccess={() => {}}
        />
      )}
      <StatusBar style="auto" />
    </>
  );
}
