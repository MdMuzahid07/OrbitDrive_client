import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
