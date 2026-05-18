"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0d2237]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e8610a] border-t-transparent" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const pwd = watch("password", "");
  const strengthChecks = [
    { label: "8 caractères min.", ok: pwd.length >= 8 },
    { label: "Un caractère spécial", ok: /[^A-Za-z0-9]/.test(pwd) },
    { label: "Une majuscule (recommandé)", ok: /[A-Z]/.test(pwd) },
    { label: "Un chiffre (recommandé)", ok: /[0-9]/.test(pwd) },
  ];

  async function onSubmit(data: ResetPasswordInput) {
    setServerError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur lors de la réinitialisation.");
      setSuccess(true);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Une erreur est survenue.");
    }
  }

  // Token manquant
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d2237] px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm text-center"
        >
          <Image
            src="/images/LVC_FINAL%20LOGO-08%20(1).png"
            alt="Lacanau Volley Club"
            width={80}
            height={80}
            className="mx-auto mb-6"
          />
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15">
            <XCircle className="h-7 w-7 text-red-400" />
          </div>
          <h2 className="font-display text-2xl tracking-wide text-[#f0f7ff]">
            Lien invalide
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#f0f7ff]/60">
            Aucun token de réinitialisation n’a été fourni. Demandez un nouveau lien.
          </p>
          <Link href="/forgot-password">
            <Button className="mt-6">Demander un nouveau lien</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Succès
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d2237] px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm text-center"
        >
          <Image
            src="/images/LVC_FINAL%20LOGO-08%20(1).png"
            alt="Lacanau Volley Club"
            width={80}
            height={80}
            className="mx-auto mb-6"
          />
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2 className="h-7 w-7 text-emerald-400" />
          </div>
          <h2 className="font-display text-2xl tracking-wide text-[#f0f7ff]">
            Mot de passe modifié
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#f0f7ff]/60">
            Votre mot de passe a bien été réinitialisé.
            Vous pouvez désormais vous reconnecter.
          </p>
          <Link href="/login">
            <Button className="mt-6">
              Se connecter <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d2237] px-6 py-12">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/LVC_FINAL%20LOGO-08%20(1).png"
            alt="Lacanau Volley Club"
            width={72}
            height={72}
          />
        </div>

        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl tracking-wide text-[#f0f7ff]">
            Nouveau mot de passe
          </h1>
          <p className="mt-2 text-sm text-[#f0f7ff]/60">
            Choisissez un mot de passe robuste pour sécuriser votre compte.
          </p>
        </div>

        {serverError && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <input type="hidden" {...register("token")} value={token} />

          <div className="space-y-1.5">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                error={errors.password?.message}
                className="pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f0f7ff]/40 hover:text-[#f0f7ff]/70 transition-colors"
                aria-label={showPwd ? "Masquer" : "Afficher"}
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {pwd.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                {strengthChecks.map((c) => (
                  <div key={c.label} className="flex items-center gap-1.5 text-[11px]">
                    <div
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${
                        c.ok ? "bg-emerald-400" : "bg-[#f0f7ff]/20"
                      }`}
                    />
                    <span className={c.ok ? "text-emerald-400" : "text-[#f0f7ff]/40"}>
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                className="pr-10"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f0f7ff]/40 hover:text-[#f0f7ff]/70 transition-colors"
                aria-label={showConfirm ? "Masquer" : "Afficher"}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            {isSubmitting ? "Mise à jour…" : (
              <>Réinitialiser le mot de passe <ArrowRight className="h-4 w-4" /></>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-[#f0f7ff]/40 hover:text-[#f0f7ff]/70 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour à la connexion
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
