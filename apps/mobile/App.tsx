import { useEffect, useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./src/lib/supabase";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

type Screen = "login" | "register";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<Screen>("login");
  const [ready, setReady] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    return () => listener.subscription.unsubscribe();
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      
      token = (await Notifications.getExpoPushTokenAsync({
        projectId,
      })).data;
      console.log("Expo Push Token:", token);
      
      // Di sistem asli, kita save token ini ke table users Supabase
      // if (user) await supabase.from('users').update({ push_token: token }).eq('id', user.id);
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  }

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
