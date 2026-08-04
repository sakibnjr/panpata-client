"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { api, tokenStore, ApiException } from "@/lib/api-client";
import { GOOGLE_AUTH_URL } from "@/lib/config";
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string };
};

function validateName(v: string) {
  if (!v.trim()) return "Full name is required.";
  if (v.trim().length < 2) return "Name must be at least 2 characters.";
  if (v.trim().length > 120) return "Name is too long (max 120 characters).";
  return "";
}
function validateEmail(v: string) {
  if (!v.trim()) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return "Please enter a valid email address.";
  if (v.length > 255) return "Email is too long.";
  return "";
}
function validatePhone(v: string) {
  if (!v.trim()) return "Phone number is required.";
  if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(v.trim()))
    return "Enter a valid Bangladeshi number (e.g. 01712345678 or +8801712345678).";
  return "";
}
function validatePassword(v: string) {
  if (!v) return "Password is required.";
  if (v.length < 8) return "Password must be at least 8 characters.";
  if (v.length > 72) return "Password is too long (max 72 characters).";
  if (!/[A-Za-z]/.test(v)) return "Password must contain at least one letter.";
  if (!/[0-9]/.test(v)) return "Password must contain at least one number.";
  return "";
}

export default function SignupPage() {
  const router = useRouter();
  const { reloadUser } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({ displayName: false, email: false, phone: false, password: false });

  useEffect(() => {
    if (tokenStore.getAccess()) router.push("/");
  }, [router]);

  const errors = {
    displayName: validateName(displayName),
    email: validateEmail(email),
    phone: validatePhone(phone),
    password: validatePassword(password),
  };

  const touch = (field: keyof typeof touched) => setTouched((t) => ({ ...t, [field]: true }));
  const touchAll = () => setTouched({ displayName: true, email: true, phone: true, password: true });
  const hasErrors = Object.values(errors).some(Boolean);

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    touchAll();
    if (hasErrors) return;
    setSubmitting(true);
    try {
      const res = await api.post<AuthResponse>("/auth/register", {
        displayName: displayName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
      });
      tokenStore.set(res.accessToken, res.refreshToken);
      await reloadUser();
      toast.success("Account created! Welcome to Panpata.");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof ApiException ? err.message : "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (t: boolean, err: string) =>
    `h-11 rounded-xl pl-9 ${t ? (err ? "border-destructive focus-visible:ring-destructive/30" : "border-emerald-500 focus-visible:ring-emerald-500/20") : ""}`;

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden lg:flex lg:w-5/12 flex-col justify-between overflow-hidden bg-[#0a2a1e] p-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-16 h-96 w-96 rounded-full bg-[#0ca678]/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <Link href="/" className="relative flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt="Panpata" className="h-20 w-auto object-contain brightness-0 invert" />
        </Link>

        <div className="relative space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white leading-tight">
              Bangladesh&apos;s premier<br />real estate platform
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Join thousands of buyers, sellers and agents finding their perfect match on Panpata.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: "🏠", title: "Browse 12,000+ listings", desc: "Verified properties across 60+ cities" },
              { icon: "⚡", title: "Instant agent contact", desc: "Connect directly, no middlemen" },
              { icon: "🔒", title: "Safe & transparent", desc: "Every listing verified by our team" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/5 p-4 backdrop-blur-sm">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-white/40 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/25">© 2026 Panpata. All rights reserved.</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12 sm:px-12 overflow-y-auto">
        <Link href="/" className="mb-8 flex items-center lg:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt="Panpata" className="h-14 w-auto object-contain" />
        </Link>

        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>

          <div className="mb-7">
            <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
            <p className="mt-2 text-sm text-muted-foreground">List properties, save homes, contact agents.</p>
          </div>

          <a
            id="google-signup-btn"
            href={GOOGLE_AUTH_URL}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium shadow-sm transition-all hover:bg-muted hover:shadow active:scale-[0.98]"
          >
            <GoogleIcon />
            Continue with Google
          </a>

          <div className="my-5 flex items-center gap-3">
            <span className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground px-1">or sign up with email</span>
            <span className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={onSignup} noValidate className="space-y-4">
            <FormField id="name" label="Full name" error={touched.displayName ? errors.displayName : ""} valid={touched.displayName && !errors.displayName}>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" autoComplete="name" placeholder="e.g. Rakib Hasan" value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)} onBlur={() => touch("displayName")}
                  className={inputCls(touched.displayName, errors.displayName)} />
              </div>
            </FormField>

            <FormField id="email" label="Email address" error={touched.email ? errors.email : ""} valid={touched.email && !errors.email}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} onBlur={() => touch("email")}
                  className={inputCls(touched.email, errors.email)} />
              </div>
            </FormField>

            <FormField id="phone" label="Phone number" error={touched.phone ? errors.phone : ""} valid={touched.phone && !errors.phone}>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="phone" type="tel" autoComplete="tel" placeholder="01712345678" value={phone}
                  onChange={(e) => setPhone(e.target.value)} onBlur={() => touch("phone")} maxLength={30}
                  className={inputCls(touched.phone, errors.phone)} />
              </div>
            </FormField>

            <FormField id="password" label="Password"
              error={touched.password ? errors.password : ""}
              valid={touched.password && !errors.password}
              hint="Min 8 characters with at least one letter and one number."
            >
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type={showPwd ? "text" : "password"} autoComplete="new-password"
                  placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)} onBlur={() => touch("password")}
                  className={`${inputCls(touched.password, errors.password)} pr-10`} />
                <button type="button" onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPwd ? "Hide password" : "Show password"}>
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>

            <Button type="submit" disabled={submitting}
              className="w-full h-11 rounded-xl font-semibold text-sm shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0">
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating account…
                </span>
              ) : "Create account"}
            </Button>
          </form>

          <div className="mt-7 space-y-2 text-center text-sm text-muted-foreground">
            <p>
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4">Sign in</Link>
            </p>
            <p>
              Want to list properties?{" "}
              <Link href="/signup/agent" className="font-semibold text-primary hover:underline underline-offset-4">Register as agent</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ id, label, error, valid, hint, children }: {
  id: string; label: string; error: string; valid: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1">
        <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
        <span className="text-destructive text-sm leading-none">*</span>
      </div>
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />{error}
        </p>
      ) : valid ? (
        <p className="flex items-center gap-1.5 text-xs text-emerald-600 animate-in fade-in slide-in-from-top-1 duration-200">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />Looks good!
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}
