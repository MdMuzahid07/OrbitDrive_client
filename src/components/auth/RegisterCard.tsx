/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRegisterMutation } from "@/redux/features/auth/auth.api";
import {
  selectIsAuthenticated,
  setCredentials,
} from "@/redux/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ArrowRight, Loader2, Mail, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { GoogleLoginButton } from "./GoogleLoginButton";

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const RegisterCard = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [registerAccount, { isLoading, error }] = useRegisterMutation();

  const password = watch("password");

  useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const result = await registerAccount(data).unwrap();
      dispatch(
        setCredentials({ user: result.user, accessToken: result.accessToken }),
      );
      router.push("/");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-cyber-surface/80 relative rounded-[2.5rem] border border-white/5 p-6 shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)] ring-1 ring-white/10 backdrop-blur-xl md:p-12">
        {/* Glowing Header Icon */}
        <div className="mb-6 flex flex-col items-center md:mb-10">
          <div className="relative mb-4 md:mb-6">
            <div className="bg-cyber-gradient absolute inset-0 animate-pulse rounded-2xl opacity-40 blur-xl" />
            <div className="bg-cyber-gradient shadow-cyber-purple/20 relative flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg md:h-16 md:w-16">
              <ShieldCheck className="h-6 w-6 text-white md:h-8 md:w-8" />
            </div>
          </div>
          <h1 className="text-center text-2xl font-bold tracking-tight text-white md:text-3xl">
            Create Account
          </h1>
          <p className="mt-2 text-center font-medium text-white/40">
            Join the OrbitDrive cosmos today
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-5"
        >
          {/* Name */}
          <div className="space-y-2">
            <label className="ml-1 text-[11px] font-bold tracking-[0.2em] text-white/30 uppercase">
              Full Name
            </label>
            <div className="group relative">
              <User className="group-focus-within:text-cyber-blue absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-white/20 transition-colors" />
              <Input
                type="text"
                placeholder="John Doe"
                {...register("name", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className={`focus:border-cyber-blue/50 focus:ring-cyber-blue/10 selection:bg-cyber-blue/30 h-11 rounded-2xl border-white/5 bg-white/3 pl-12 text-base text-white transition-all placeholder:text-white/10 focus:ring-4 md:h-13 ${errors.name ? "border-red-500/50 ring-red-500/10 focus:border-red-500/50 focus:ring-red-500/10" : ""}`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 ml-1 text-[10px] font-bold text-red-400/80">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="ml-1 text-[11px] font-bold tracking-[0.2em] text-white/30 uppercase">
              Email Address
            </label>
            <div className="group relative">
              <Mail className="group-focus-within:text-cyber-blue absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-white/20 transition-colors" />
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
                className={`focus:border-cyber-blue/50 focus:ring-cyber-blue/10 selection:bg-cyber-blue/30 h-11 rounded-2xl border-white/5 bg-white/3 pl-12 text-base text-white transition-all placeholder:text-white/10 focus:ring-4 md:h-13 ${errors.email ? "border-red-500/50 ring-red-500/10 focus:border-red-500/50 focus:ring-red-500/10" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 ml-1 text-[10px] font-bold text-red-400/80">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="ml-1 text-[11px] font-bold tracking-[0.2em] text-white/30 uppercase">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className={`focus:border-cyber-blue/50 focus:ring-cyber-blue/10 selection:bg-cyber-blue/30 h-11 rounded-2xl border-white/5 bg-white/3 text-base text-white transition-all placeholder:text-white/10 focus:ring-4 md:h-13 ${errors.password ? "border-red-500/50 ring-red-500/10 focus:border-red-500/50 focus:ring-red-500/10" : ""}`}
              />
              {errors.password && (
                <p className="mt-1 ml-1 text-[10px] font-bold text-red-400/80">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[11px] font-bold tracking-[0.2em] text-white/30 uppercase">
                Confirm
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className={`focus:border-cyber-blue/50 focus:ring-cyber-blue/10 selection:bg-cyber-blue/30 h-11 rounded-2xl border-white/5 bg-white/3 text-base text-white transition-all placeholder:text-white/10 focus:ring-4 md:h-13 ${errors.confirmPassword ? "border-red-500/50 ring-red-500/10 focus:border-red-500/50 focus:ring-red-500/10" : ""}`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 ml-1 text-[10px] font-bold text-red-400/80">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="animate-in fade-in slide-in-from-top-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 backdrop-blur-md">
              <div className="text-sm font-bold text-red-400">
                {(error as any)?.data?.message ||
                  "Registration failed. Please check your inputs."}
              </div>
              {(error as any)?.data?.errorSources && (
                <ul className="mt-2 space-y-1">
                  {(error as any).data.errorSources.map(
                    (source: any, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-center gap-1.5 text-xs text-red-400/70"
                      >
                        <span className="h-1 w-1 rounded-full bg-red-400/50" />
                        {source.message}
                      </li>
                    ),
                  )}
                </ul>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="group bg-cyber-gradient shadow-cyber-purple/20 relative mt-4 h-11 w-full overflow-hidden rounded-2xl text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 md:h-14"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                Join Now{" "}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </Button>

          <div className="relative my-6 md:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase">
              <span className="bg-[#0D0D18] px-4">Or</span>
            </div>
          </div>

          <GoogleLoginButton />
        </form>

        <p className="mt-6 text-center text-[15px] font-medium text-white/30 md:mt-10">
          Already a member?{" "}
          <Link
            href="/login"
            className="text-cyber-purple hover:text-cyber-blue font-bold underline decoration-2 underline-offset-4 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
