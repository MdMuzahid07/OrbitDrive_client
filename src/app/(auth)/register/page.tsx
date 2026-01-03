import { RegisterCard } from "@/components/auth/RegisterCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | OrbitDrive",
  description: "Create a new OrbitDrive account",
};

export default function RegisterPage() {
  return <RegisterCard />;
}
