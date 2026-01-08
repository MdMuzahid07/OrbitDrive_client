/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForgotPasswordMutation } from "@/redux/features/auth/auth.api";
import { ArrowLeft, ArrowRight, Loader2, Mail, Send } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type ForgotPasswordFormInputs = {
  email: string;
};

export const ForgotPasswordCard = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>();

  const [forgotPassword, { isLoading, isSuccess, error }] =
    useForgotPasswordMutation();

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    try {
      await forgotPassword(data).unwrap();
    } catch (err) {
      console.error("Forgot password request failed:", err);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="bg-card/80 border-border shadow-primary/5 ring-border/50 relative rounded-[2rem] border p-6 shadow-xl ring-1 backdrop-blur-xl md:p-8">
        <div className="mb-5 flex flex-col items-center md:mb-8">
          <div className="relative mb-3 md:mb-4">
            <div className="bg-cyber-gradient absolute inset-0 animate-pulse rounded-2xl opacity-40 blur-xl" />
            <div className="bg-cyber-gradient shadow-primary/20 relative flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg md:h-12 md:w-12">
              <Send className="h-5 w-5 text-white md:h-6 md:w-6" />
            </div>
          </div>
          <h1 className="text-card-foreground text-center text-xl font-bold tracking-tight md:text-2xl">
            Forgot Password?
          </h1>
          <p className="text-muted-foreground mt-1.5 text-center text-sm font-medium">
            Enter your email to receive a reset link
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-6">
            <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-green-500/20 bg-green-500/10 p-6 text-center backdrop-blur-md">
              <h3 className="mb-2 text-lg font-bold text-green-500">
                Check your inbox!
              </h3>
              <p className="text-sm text-green-600/80 dark:text-green-400/80">
                If an account exists for that email, we have sent password reset
                instructions.
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
            <div className="space-y-1.5">
              <label className="text-muted-foreground ml-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                Email Address
              </label>
              <div className="group relative">
                <Mail className="group-focus-within:text-primary text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 transition-colors" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`focus:border-primary/50 focus:ring-primary/10 selection:bg-primary/30 border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 h-10 rounded-xl pl-10 text-sm transition-all focus:ring-2 md:h-11 ${errors.email ? "border-red-500/50 ring-red-500/10 focus:border-red-500/50 focus:ring-red-500/10" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-[10px] font-bold text-red-500/80">
                  {errors.email.message}
                </p>
              )}
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
                  Send Reset Link{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>

            <div className="relative my-5 md:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="border-border/50 w-full border-t" />
              </div>
              <div className="text-muted-foreground relative flex justify-center text-[10px] font-bold tracking-[0.3em] uppercase">
                <span className="bg-card px-3">Or</span>
              </div>
            </div>

            <p className="text-muted-foreground text-center text-xs font-medium">
              Return to{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 font-bold underline decoration-2 underline-offset-4 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
