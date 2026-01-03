import { LoginCard } from "@/components/auth/LoginCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | OrbitDrive",
  description: "Sign in to your OrbitDrive account",
};

export default function LoginPage() {
  return <LoginCard />;
}
