"use client";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { selectIsAuthenticated } from "@/redux/features/auth/auth.slice";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();
  const { isLoading: isFetchingUser } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // If not authenticated and not currently fetching user info
    if (!isAuthenticated && !isFetchingUser) {
      router.push("/login");
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, isFetchingUser, router]);

  if (isChecking || isFetchingUser) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#110D1F]">
        <div className="relative mb-8">
          <div className="bg-cyber-gradient absolute inset-0 animate-pulse rounded-2xl opacity-40 blur-xl" />
          <div className="bg-cyber-gradient shadow-cyber-purple/20 relative flex h-24 w-24 items-center justify-center rounded-full shadow-2xl">
            <Image
              src="/images/OrbitDrive_logo-300x300.png"
              alt="OrbitDrive Logo"
              width={70}
              height={70}
              className="rounded-full"
              priority
            />
          </div>
        </div>
        <p className="animate-pulse text-white">
          OrbitDrive is initializing...
        </p>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};
