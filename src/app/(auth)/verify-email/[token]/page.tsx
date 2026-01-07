"use client";

import { useVerifyEmailMutation } from "@/redux/features/auth/auth.api";
import { setCredentials } from "@/redux/features/auth/auth.slice";
import { useAppDispatch } from "@/redux/hooks";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const VerifyEmailPage = () => {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [verifyEmail, { isLoading, isSuccess, isError, error }] =
    useVerifyEmailMutation();

  useEffect(() => {
    if (token) {
      verifyEmail(token)
        .unwrap()
        .then((data) => {
          toast.success("Email verified successfully!");
          dispatch(
            setCredentials({ user: data.user, accessToken: data.accessToken }),
          );
          setTimeout(() => {
            router.push("/");
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token, verifyEmail, router, dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0eef6] p-4 dark:bg-[#030014]">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl filter dark:bg-purple-900/20" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl filter dark:bg-blue-900/20" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card Glow */}
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-purple-500/30 to-blue-500/30 opacity-50 blur-2xl" />

        <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/50 p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col items-center justify-center text-center">
            {isLoading ? (
              <>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-500/10">
                  <Loader2 className="h-10 w-10 animate-spin text-purple-600 dark:text-purple-400" />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  Verifying your email
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we secure your connection...
                </p>
              </>
            ) : isSuccess ? (
              <>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  Email Verified!
                </h1>
                <p className="mb-8 text-gray-600 dark:text-gray-400">
                  Your account has been successfully verified. Entering
                  OrbitDrive...
                </p>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="h-full animate-[progress_2s_ease-in-out_infinite] bg-gradient-to-r from-purple-500 to-blue-500" />
                </div>
              </>
            ) : isError ? (
              <>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
                  <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  Verification Failed
                </h1>
                <p className="mb-8 text-gray-600 dark:text-gray-400">
                  {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (error as any)?.data?.message ||
                      "The verification link is invalid or has expired."
                  }
                </p>
                <Link
                  href="/login"
                  className="rounded-xl border border-gray-200 bg-white/50 px-6 py-3 font-bold text-gray-900 backdrop-blur-sm transition-colors hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Back to Login
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
