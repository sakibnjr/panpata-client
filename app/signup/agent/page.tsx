"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { api, tokenStore, ApiException } from "@/lib/api-client";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  Eye,
  EyeOff,
  Globe,
  ImagePlus,
  Lock,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  User,
} from "lucide-react";

const Schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
  phone: z
    .string()
    .trim()
    .regex(
      /^(?:\+?88)?01[3-9]\d{8}$/,
      "Enter a valid Bangladeshi number (e.g. 01712345678 or +8801712345678)"
    ),
  area: z.string().trim().min(2).max(120),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  bio: z.string().trim().max(1000).optional().or(z.literal("")),
  facebookProfile: z
    .string()
    .trim()
    .max(255)
    .refine((v) => !v || /^https?:\/\/.+/.test(v), "Must be a valid URL (https://…)")
    .optional()
    .or(z.literal("")),
  whatsappNumber: z.string().trim().max(30).optional().or(z.literal("")),
  yearsOfExperience: z.number().int().min(0).max(80),
});

type AuthResponse = { accessToken: string; refreshToken: string };

export default function AgentSignupPage() {
  const router = useRouter();
  const { reloadUser } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    area: "",
    address: "",
    bio: "",
    facebookProfile: "",
    whatsappNumber: "",
    yearsOfExperience: 0,
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [nidFront, setNidFront] = useState<File | null>(null);
  const [nidBack, setNidBack] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (!tokenStore.getAccess()) return;
    api.get("/agent-applications/me")
      .then(() => router.push("/"))
      .catch(() => { });
  }, [router]);

  const upd = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    if (!profileImage || !nidFront || !nidBack) {
      toast.error("Profile photo and both NID photos are required");
      return;
    }
    setSubmitting(true);
    try {
      const auth = await api.post<AuthResponse>("/auth/register", {
        displayName: parsed.data.fullName,
        email: parsed.data.email,
        password: parsed.data.password,
        phone: parsed.data.phone,
      });
      tokenStore.set(auth.accessToken, auth.refreshToken);
      await reloadUser();

      const formData = new FormData();
      const applicationData = { ...parsed.data } as Record<string, unknown>;
      delete applicationData.password;
      Object.entries(applicationData).forEach(([k, v]) => {
        if (v !== undefined && v !== "") formData.append(k, String(v));
      });
      formData.append("profileImage", profileImage);
      formData.append("nidFront", nidFront);
      formData.append("nidBack", nidBack);

      await api.upload("/agent-applications", formData);
      toast.success("Application submitted! An admin will review it shortly.");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof ApiException ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-[#0a2a1e] px-6 py-10 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-[#0ca678]/20 blur-3xl" />
          <div className="absolute -bottom-10 right-1/4 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <Link href="/" className="inline-flex items-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="Panpata" className="h-16 w-auto object-contain brightness-0 invert" />
          </Link>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-[#0ca678]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[#0ca678]">Become a verified agent</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Register as a Panpata Agent</h1>
          <p className="mt-2 text-white/50 text-sm">
            Join our network of verified real estate professionals. Your licence number is auto-generated upon approval.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            {[1, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStep(s as 1 | 2)}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${step === s
                    ? "bg-[#0ca678] text-white shadow shadow-[#0ca678]/40"
                    : "bg-white/10 text-white/50 hover:bg-white/20"
                  }`}
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${step === s ? "bg-white text-[#0ca678]" : "bg-white/20 text-white"}`}>{s}</span>
                {s === 1 ? "Account Info" : "Documents"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-6 flex items-center gap-2">
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to signup
          </Link>
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-8">
          <section className={step !== 1 ? "hidden" : ""}>
            <SectionHeader icon={User} title="Personal details" desc="Basic contact information for your agent profile." />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field id="fullName" label="Full name" required icon={User}>
                <Input id="fullName" value={form.fullName} onChange={(e) => upd("fullName", e.target.value)} required maxLength={120} className="h-11 rounded-xl pl-9" placeholder="Rakibul Islam" />
              </Field>
              <Field id="email" label="Email" required icon={Mail}>
                <Input id="email" type="email" value={form.email} onChange={(e) => upd("email", e.target.value)} required maxLength={255} className="h-11 rounded-xl pl-9" placeholder="you@example.com" />
              </Field>
              <Field id="password" label="Password" required icon={Lock}>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => upd("password", e.target.value)}
                    required
                    minLength={8}
                    className="h-11 rounded-xl pl-9 pr-10"
                    placeholder="Min 8 characters"
                  />
                  <button type="button" onClick={() => setShowPwd((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPwd ? "Hide" : "Show"}>
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>
              <Field id="phone" label="Phone" required icon={Phone}>
                <Input id="phone" value={form.phone} onChange={(e) => upd("phone", e.target.value)} required maxLength={15} className="h-11 rounded-xl pl-9" placeholder="01712345678" />
              </Field>
              <Field id="area" label="Service area / City" required icon={MapPin}>
                <Input id="area" value={form.area} onChange={(e) => upd("area", e.target.value)} required maxLength={120} className="h-11 rounded-xl pl-9" placeholder="e.g. Gulshan, Dhaka" />
              </Field>
              <Field id="whatsappNumber" label="WhatsApp number" icon={Phone}>
                <Input id="whatsappNumber" value={form.whatsappNumber} onChange={(e) => upd("whatsappNumber", e.target.value)} maxLength={30} className="h-11 rounded-xl pl-9" placeholder="+8801700123456" />
              </Field>
              <Field id="yearsOfExperience" label="Years of experience" required icon={BadgeCheck}>
                <Input id="yearsOfExperience" type="number" min={0} max={80} value={form.yearsOfExperience}
                  onChange={(e) => upd("yearsOfExperience", Number(e.target.value))} required className="h-11 rounded-xl pl-9" />
              </Field>
              <Field id="facebookProfile" label="Facebook profile URL" icon={Globe}>
                <Input id="facebookProfile" value={form.facebookProfile} onChange={(e) => upd("facebookProfile", e.target.value)} maxLength={255} className="h-11 rounded-xl pl-9" placeholder="https://facebook.com/…" />
              </Field>
            </div>

            <div className="mt-4">
              <Field id="address" label="Office / Work address" icon={Building2}>
                <Input id="address" value={form.address} onChange={(e) => upd("address", e.target.value)} maxLength={300} className="h-11 rounded-xl pl-9" placeholder="Road 1, Block A, Dhaka" />
              </Field>
            </div>

            <div className="mt-4">
              <label htmlFor="bio" className="block text-sm font-medium mb-1.5">Short bio <span className="text-muted-foreground font-normal text-xs">(optional)</span></label>
              <Textarea id="bio" rows={3} value={form.bio} onChange={(e) => upd("bio", e.target.value)} maxLength={1000}
                placeholder="Tell buyers a little about your expertise, specialties, and why they should work with you…"
                className="resize-none rounded-xl text-sm" />
              <p className="mt-1 text-xs text-muted-foreground text-right">{form.bio.length}/1000</p>
            </div>

            <Button
              type="button"
              onClick={() => setStep(2)}
              className="mt-6 w-full h-11 rounded-xl font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Continue to documents →
            </Button>
          </section>

          <section className={step !== 2 ? "hidden" : ""}>
            <SectionHeader icon={ImagePlus} title="Verification documents" desc="Upload your profile photo and both sides of your Smart NID for identity verification." />

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <FileField id="profileImage" label="Profile photo" required file={profileImage} onChange={setProfileImage} />
              <FileField id="nidFront" label="Smart NID (front)" required file={nidFront} onChange={setNidFront} />
              <FileField id="nidBack" label="Smart NID (back)" required file={nidBack} onChange={setNidBack} />
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-300">
              🔒 Your documents are stored securely and used only for identity verification. They are never shared with third parties.
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="h-11 rounded-xl font-medium">
                ← Back
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="h-11 rounded-xl font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Submitting…
                  </span>
                ) : "Submit application"}
              </Button>
            </div>
          </section>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Just looking to browse?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline underline-offset-4">Sign up as a buyer</Link>
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[#0ca678]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function Field({ id, label, required, icon: Icon, children }: {
  id: string; label: string; required?: boolean; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}{" "}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
        {children}
      </div>
    </div>
  );
}

function FileField({ id, label, required, file, onChange }: {
  id: string; label: string; required?: boolean; file: File | null; onChange: (f: File | null) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}{" "}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <label
        htmlFor={id}
        className={`flex flex-col items-center justify-center gap-2 cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-colors hover:border-primary/50 hover:bg-primary/5 ${file ? "border-primary/40 bg-primary/5" : "border-border"
          }`}
      >
        <ImagePlus className={`h-7 w-7 ${file ? "text-primary" : "text-muted-foreground"}`} />
        {file ? (
          <p className="text-xs font-medium text-primary truncate w-full px-2">{file.name}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Click to upload<br /><span className="opacity-60">JPG, PNG, WebP</span></p>
        )}
        <input id={id} type="file" accept="image/*" required={required} className="sr-only"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
      </label>
    </div>
  );
}
