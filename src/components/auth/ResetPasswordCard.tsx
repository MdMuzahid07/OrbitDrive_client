/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useResetPasswordMutation } from "@/redux/features/auth/auth.api";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type ResetPasswordFormInputs = {
  password: string;
  confirmPassword: string;
};

export const ResetPasswordCard = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [resetPassword, { isLoading, isSuccess, error }] =
    useResetPasswordMutation();

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    if (!token) return;
    try {
      await resetPassword({
        token,
        body: {
          password: data.password,
          confirmPassword: data.confirmPassword,
        },
      }).unwrap();
    } catch (err) {
      console.error("Reset password failed:", err);
    }
  };

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-md">
        <div className="bg-card/80 border-border shadow-primary/5 ring-border/50 relative rounded-4xl border p-6 shadow-xl ring-1 backdrop-blur-xl md:p-8">
          <div className="mb-5 flex flex-col items-center">
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm font-bold text-red-500">
              Invalid or missing reset token.
            </div>
            <Link
              href="/login"
              className="text-primary mt-3 text-sm font-bold hover:underline"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="bg-card/80 border-border shadow-primary/5 ring-border/50 relative rounded-4xl border p-6 shadow-xl ring-1 backdrop-blur-xl md:p-8">
        <div className="mb-5 flex flex-col items-center md:mb-8">
          <div className="relative mb-3 md:mb-4">
            <div className="bg-cyber-gradient absolute inset-0 animate-pulse rounded-2xl opacity-40 blur-xl" />
            <div className="bg-cyber-gradient shadow-primary/20 relative flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg md:h-12 md:w-12">
              <Lock className="h-5 w-5 text-white md:h-6 md:w-6" />
            </div>
          </div>
          <h1 className="text-card-foreground text-center text-xl font-bold tracking-tight md:text-2xl">
            Reset Password
          </h1>
          <p className="text-muted-foreground mt-1.5 text-center text-sm font-medium">
            Create a strong new password
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-6">
            <div className="animate-in fade-in slide-in-from-top-2 flex flex-col items-center rounded-xl border border-green-500/20 bg-green-500/10 p-6 text-center backdrop-blur-md">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="mb-1.5 text-lg font-bold text-green-500">
                Password Reset Successful!
              </h3>
              <p className="text-sm text-green-600/80 dark:text-green-400/80">
                Your password has been updated properly. You can now sign in
                with your new credentials.
              </p>
            </div>
            <Link
              href="/login"
              className="group bg-cyber-gradient shadow-primary/20 relative flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-xl text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] md:h-12"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-muted-foreground ml-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                  New Password
                </label>
                <div className="group relative">
                  <Lock className="group-focus-within:text-primary text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 transition-colors" />
                  <Input
                    type={showPassword.password ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    className={`focus:border-primary/50 focus:ring-primary/10 selection:bg-primary/30 border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 h-10 rounded-xl pr-10 pl-10 text-sm transition-all focus:ring-2 md:h-11 ${errors.password ? "border-red-500/50 ring-red-500/10 focus:border-red-500/50 focus:ring-red-500/10" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        password: !prev.password,
                      }))
                    }
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 focus:outline-none"
                  >
                    {showPassword.password ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-[10px] font-bold text-red-500/80">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground ml-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                  Confirm Password
                </label>
                <div className="group relative">
                  <Lock className="group-focus-within:text-primary text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 transition-colors" />
                  <Input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className={`focus:border-primary/50 focus:ring-primary/10 selection:bg-primary/30 border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 h-10 rounded-xl pr-10 pl-10 text-sm transition-all focus:ring-2 md:h-11 ${errors.confirmPassword ? "border-red-500/50 ring-red-500/10 focus:border-red-500/50 focus:ring-red-500/10" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        confirmPassword: !prev.confirmPassword,
                      }))
                    }
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 focus:outline-none"
                  >
                    {showPassword.confirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-[10px] font-bold text-red-500/80">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="animate-in fade-in slide-in-from-top-1 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-bold text-red-500">
                {(error as any)?.data?.message ||
                  "Something went wrong. Please try again."}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="group bg-cyber-gradient shadow-primary/20 relative h-10 w-full overflow-hidden rounded-xl text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 md:h-12"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Reset Password{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
