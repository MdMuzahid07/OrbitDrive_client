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
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [login, { isLoading, error }] = useLoginMutation();

  useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

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

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/v1/auth/google`;
  };

  return (
    <div className="w-full">
      <div className="bg-cyber-surface/80 relative rounded-[2.5rem] border border-white/5 p-8 shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)] ring-1 ring-white/10 backdrop-blur-xl md:p-12">
        {/* Glowing Header Icon */}
        <div className="mb-10 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="bg-cyber-gradient absolute inset-0 animate-pulse rounded-2xl opacity-40 blur-xl" />
            <div className="bg-cyber-gradient shadow-cyber-purple/20 relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-center text-3xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-center font-medium text-white/40">
            Sign in to your OrbitDrive account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                className={`focus:border-cyber-blue/50 focus:ring-cyber-blue/10 selection:bg-cyber-blue/30 h-13 rounded-2xl border-white/5 bg-white/3 pl-12 text-base text-white transition-all placeholder:text-white/10 focus:ring-4 ${errors.email ? "border-red-500/50 ring-red-500/10 focus:border-red-500/50 focus:ring-red-500/10" : ""}`}
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
                className={`focus:border-cyber-blue/50 focus:ring-cyber-blue/10 selection:bg-cyber-blue/30 h-13 rounded-2xl border-white/5 bg-white/3 pl-12 text-base text-white transition-all placeholder:text-white/10 focus:ring-4 ${errors.password ? "border-red-500/50 ring-red-500/10 focus:border-red-500/50 focus:ring-red-500/10" : ""}`}
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
            className="group bg-cyber-gradient shadow-cyber-purple/20 relative h-14 w-full overflow-hidden rounded-2xl text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
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

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase">
              <span className="bg-[#0D0D18] px-4">Or</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            variant="ghost"
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/3 font-bold text-white transition-all hover:bg-white/8"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#4285F4"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
        </form>

        <p className="mt-10 text-center text-[15px] font-medium text-white/30">
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
