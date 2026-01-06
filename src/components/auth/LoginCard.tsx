/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import {
  selectIsAuthenticated,
  setCredentials,
} from "@/redux/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ArrowRight, Loader2, Lock, Mail, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { GoogleLoginButton } from "./GoogleLoginButton";

type LoginFormInputs = {
  email: string;
  password: string;
};

export const LoginCard = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [login, { isLoading, error }] = useLoginMutation();

  useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  // Handle Google Login Redirect
  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const userStr = searchParams.get("user");

    if (accessToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch(setCredentials({ user, accessToken }));
      } catch (err) {
        console.error("Failed to parse Google login data:", err);
      }
    }
  }, [searchParams, dispatch]);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const result = await login(data).unwrap();
      dispatch(
        setCredentials({ user: result.user, accessToken: result.accessToken }),
      );
      router.push("/");
    } catch (err) {
      console.error("Login failed:", err);
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
              <UserPlus className="h-6 w-6 text-white md:h-8 md:w-8" />
            </div>
          </div>
          <h1 className="text-center text-2xl font-bold tracking-tight text-white md:text-3xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-center font-medium text-white/40">
            Sign in to your OrbitDrive account
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-6"
        >
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
              <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-[10px] font-bold text-red-400/80">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="ml-1 flex items-center justify-between">
              <label className="text-[11px] font-bold tracking-[0.2em] text-white/30 uppercase">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-cyber-blue hover:text-cyber-purple text-xs font-bold transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="group relative">
              <Lock className="group-focus-within:text-cyber-blue absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-white/20 transition-colors" />
              <Input
                type="password"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
                className={`focus:border-cyber-blue/50 focus:ring-cyber-blue/10 selection:bg-cyber-blue/30 h-11 rounded-2xl border-white/5 bg-white/3 pl-12 text-base text-white transition-all placeholder:text-white/10 focus:ring-4 md:h-13 ${errors.password ? "border-red-500/50 ring-red-500/10 focus:border-red-500/50 focus:ring-red-500/10" : ""}`}
              />
            </div>
            {errors.password && (
              <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-[10px] font-bold text-red-400/80">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="animate-in fade-in slide-in-from-top-1 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-400">
              {(error as any)?.data?.message ||
                "Invalid credentials. Please try again."}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="group bg-cyber-gradient shadow-cyber-purple/20 relative h-11 w-full overflow-hidden rounded-2xl text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 md:h-14"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign In{" "}
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
          New here?{" "}
          <Link
            href="/register"
            className="text-cyber-purple hover:text-cyber-blue font-bold underline decoration-2 underline-offset-4 transition-colors"
          >
            Join OrbitDrive
          </Link>
        </p>
      </div>
    </div>
  );
};
