import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Saya | Food Rescue",
  description: "Kelola akun dan pengaturan preferensi Food Rescue Anda.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
