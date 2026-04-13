"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { registerSchema, type RegisterInput } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const pwd = watch("password", "");
  const strengthChecks = [
    { label: "12 caractères min.", ok: pwd.length >= 12 },
    { label: "Une majuscule", ok: /[A-Z]/.test(pwd) },
    { label: "Un chiffre", ok: /[0-9]/.test(pwd) },
    { label: "Un caractère spécial", ok: /[^A-Za-z0-9]/.test(pwd) },
  ];

  async function onSubmit(data: RegisterInput) {
    setServerError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur lors de l&apos;inscription.");
      setSuccess(true);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Une erreur est survenue.");
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d2237] px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm text-center"
        >
          <Image
            src="/images/LVB1.png"
            alt="Lacanau Volley Club"
            width={80}
            height={80}
            className="mx-auto mb-6"
          />
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2 className="h-7 w-7 text-emerald-400" />
          </div>
          <h2 className="font-display text-2xl tracking-wide text-[#f0f7ff]">
            Inscription envoyée !
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#f0f7ff]/60">
            Votre compte est en attente de validation par un administrateur.
            Vous recevrez un email dès que votre accès sera activé.
          </p>
          <Link href="/?auth=1">
            <Button className="mt-6">Se connecter</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0d2237]">
      {/* ─── Panneau gauche — visuel ─────────────────────────────────────────── */}
      <div className="relative hidden w-[55%] overflow-hidden lg:block">
        <Image
          src="/images/team-1.jpg"
          alt="Équipe Lacanau Volley-Ball"
          fill
          className="object-cover"
          sizes="55vw"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#0d2237] via-[#0d2237]/70 to-[#0d2237]/40" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0d2237] via-transparent to-[#0d2237]/30" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          <div>
            <Image
              src="/images/LVB1.png"
              alt="Lacanau Volley Club"
              width={140}
              height={140}
              className="drop-shadow-2xl"
            />
          </div>
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-display text-5xl leading-[0.95] tracking-wide text-[#f0f7ff] xl:text-6xl">
                Rejoignez<br />le club
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#f0f7ff]/70">
                Créez votre compte pour accéder à vos documents, au forum et à toute la vie du club.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── Panneau droit — formulaire ─────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 lg:px-16">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo mobile */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Image src="/images/LVB1.png" alt="Logo" width={48} height={48} />
            <span className="font-display text-xl tracking-wide text-[#f0f7ff]">
              Lacanau Volley Club
            </span>
          </div>

          <div className="mb-6">
            <h1 className="font-display text-3xl tracking-wide text-[#f0f7ff]">
              Créer un compte
            </h1>
            <p className="mt-2 text-sm text-[#f0f7ff]/60">
              Votre accès sera activé après validation par un administrateur.
            </p>
          </div>

          {serverError && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  placeholder="Marie"
                  error={errors.firstName?.message}
                  {...register("firstName")}
                />
                {errors.firstName && <p className="text-xs text-red-400">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  placeholder="Dupont"
                  error={errors.lastName?.message}
                  {...register("lastName")}
                />
                {errors.lastName && <p className="text-xs text-red-400">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="marie.dupont@email.fr"
                error={errors.email?.message}
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="username">Nom d&apos;utilisateur</Label>
              <Input
                id="username"
                autoComplete="username"
                placeholder="marie_dupont"
                error={errors.username?.message}
                {...register("username")}
              />
              {errors.username && <p className="text-xs text-red-400">{errors.username.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••••••"
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
                      <div className={`h-1.5 w-1.5 rounded-full transition-colors ${c.ok ? "bg-emerald-400" : "bg-[#f0f7ff]/20"}`} />
                      <span className={c.ok ? "text-emerald-400" : "text-[#f0f7ff]/40"}>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••••••"
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
              {isSubmitting ? "Inscription…" : (
                <>Créer mon compte <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#f0f7ff]/50">
            Déjà adhérent ?{" "}
            <Link href="/?auth=1" className="font-semibold text-[#e8610a] hover:text-[#ff7a28] transition-colors">
              Se connecter
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
