
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
const supabase = getSupabase();
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const supabase = getSupabase();

  const [mode, setMode] = useState<"login" | "register">("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "register") {
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters.");
        }

        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name
            },
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });

        if (error) throw error;

        if (data.session) {
          router.push("/dashboard");
          router.refresh();
        } else {
          setMessage(
            "Account created successfully! Please verify your email before logging in."
          );
          setMode("login");
          setPassword("");
          setConfirmPassword("");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080d1b] px-5 py-10 text-white">

      {/* Background effects */}

      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl lg:grid-cols-2">

        {/* LEFT SECTION */}

        <div className="hidden flex-col justify-between bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-900 p-12 lg:flex">

          <div>
            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-white/20 p-3">
                <GraduationCap size={35} />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  NIAT PATHFINDER AI
                </h1>

                <p className="text-sm text-cyan-100">
                  Intelligent Career Guidance
                </p>
              </div>

            </div>

            <div className="mt-24">

              <h2 className="text-5xl font-bold leading-tight">
                Discover Your Future.
                <span className="mt-2 block text-cyan-200">
                  Build Your Career.
                </span>
              </h2>

              <p className="mt-6 max-w-md leading-7 text-blue-100">
                Explore your interests, discover career opportunities,
                and receive AI-powered guidance to make smarter
                educational decisions.
              </p>

            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-6">

            <ShieldCheck size={30} className="mb-4" />

            <h3 className="text-lg font-bold">
              Secure Student Portal
            </h3>

            <p className="mt-2 text-sm text-blue-100">
              Your personalized career journey starts here.
            </p>

          </div>

        </div>

        {/* RIGHT SECTION */}

        <div className="flex items-center justify-center p-7 sm:p-12">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}

            <div className="mb-8 text-center lg:hidden">

              <GraduationCap
                size={45}
                className="mx-auto mb-3 text-cyan-400"
              />

              <h1 className="text-xl font-bold">
                NIAT PATHFINDER AI
              </h1>

            </div>

            <div className="mb-8">

              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Welcome to Pathfinder AI
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                {mode === "login"
                  ? "Welcome Back!"
                  : "Create Your Account"}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {mode === "login"
                  ? "Login to continue your personalized career guidance journey."
                  : "Register to discover your interests and explore your future career."}
              </p>

            </div>

            {/* LOGIN / REGISTER SWITCH */}

            <div className="mb-7 grid grid-cols-2 rounded-xl bg-slate-950 p-1">

              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setMessage("");
                }}
                className={`rounded-lg p-3 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-cyan-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <LogIn size={17} className="mr-2 inline" />
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setMessage("");
                }}
                className={`rounded-lg p-3 text-sm font-semibold transition ${
                  mode === "register"
                    ? "bg-cyan-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <UserPlus size={17} className="mr-2 inline" />
                Create Account
              </button>

            </div>

            {/* AUTH FORM */}

            <form onSubmit={handleSubmit} className="space-y-5">

              {mode === "register" && (
                <div>

                  <label className="mb-2 block text-sm font-medium">
                    Full Name
                  </label>

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 outline-none transition focus:border-cyan-400"
                  />

                </div>
              )}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Email Address
                </label>

                <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 px-4 focus-within:border-cyan-400">

                  <Mail size={19} className="text-slate-500" />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="w-full bg-transparent p-4 outline-none"
                  />

                </div>

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 px-4 focus-within:border-cyan-400">

                  <Lock size={19} className="text-slate-500" />

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete={
                      mode === "login"
                        ? "current-password"
                        : "new-password"
                    }
                    className="w-full bg-transparent p-4 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-white"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword
                      ? <EyeOff size={19} />
                      : <Eye size={19} />}
                  </button>

                </div>

              </div>

              {mode === "register" && (
                <div>

                  <label className="mb-2 block text-sm font-medium">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 outline-none focus:border-cyan-400"
                  />

                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm text-cyan-400">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-cyan-500 p-4 font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading
                  ? "Please wait..."
                  : mode === "login"
                    ? "Login to Continue"
                    : "Create My Account"}

                {!loading && <ArrowRight size={19} />}

              </button>

            </form>

            <div className="mt-7 text-center text-sm text-slate-400">

              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError("");
                  setMessage("");
                }}
                className="ml-2 font-semibold text-cyan-400 hover:text-cyan-300"
              >
                {mode === "login"
                  ? "Create Account"
                  : "Login"}
              </button>

            </div>

            <p className="mt-8 text-center text-xs text-slate-500">
              © 2026 NIAT Pathfinder AI. All rights reserved.
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}