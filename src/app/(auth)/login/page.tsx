"use client";

import { Suspense, useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { loginSchema, type LoginInput } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ERRORS: Record<string, string> = {
  PENDING: "Votre compte est en attente de validation par un administrateur.",
  SUSPENDED: "Votre compte a été suspendu. Contactez un administrateur.",
  CredentialsSignin: "Identifiants incorrects.",
};

function getRoleHome(role?: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "COMITE_DIRECTION") return "/comite-direction";
  return "/espace-adherent";
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from");
  const errorParam = params.get("error");

  const [showPwd, setShowPwd] = useState(false);
  const [serverError, setServerError] = useState<string | null>(
    errorParam ? (ERRORS[errorParam] ?? "Une erreur est survenue.") : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    const result = await signIn("credentials", {
      login: data.login,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError(ERRORS[result.error] ?? "Identifiants incorrects.");
      return;
    }

    const session = await getSession();
    const fallbackPath = getRoleHome(session?.user?.role);
    router.push(from ?? fallbackPath);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-[#0d2237]">
      {/* ─── Panneau gauche — photo d'équipe ─────────────────────────────────── */}
      <div className="relative hidden w-[55%] overflow-hidden lg:block">
        <Image
          src="/images/team-1.jpg"
          alt="Équipe Lacanau Volley-Ball"
          fill
          className="object-cover"
          priority
          quality={85}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-[#0d2237] via-[#0d2237]/70 to-[#0d2237]/40" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0d2237] via-transparent to-[#0d2237]/30" />

        {/* Contenu superposé */}
        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          {/* Logo */}
          <div>
            <Image
              src="/images/LVB1.png"
              alt="Lacanau Volley Club"
              width={140}
              height={140}
              className="drop-shadow-2xl"
            />
          </div>

          {/* Texte d'accroche */}
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-display text-5xl leading-[0.95] tracking-wide text-[#f0f7ff] xl:text-6xl">
                Espace<br />adhérent
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#f0f7ff]/70">
                Gérez vos documents, échangez sur le forum et restez connecté à la vie du club.
              </p>
            </motion.div>

            {/* Stats en bas */}
            <div className="mt-8 flex gap-8">
              {[
                { value: "40+", label: "adhérents" },
                { value: "2010", label: "depuis" },
                { value: "Indoor", label: "& Beach" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl tracking-wide text-[#e8610a]">
                    {s.value}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-[#f0f7ff]/50">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Panneau droit — formulaire ─────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo mobile */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <Image
              src="/images/LVB1.png"
              alt="Lacanau Volley Club"
              width={56}
              height={56}
            />
            <span className="font-display text-xl tracking-wide text-[#f0f7ff]">
              Lacanau Volley Club
            </span>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl tracking-wide text-[#f0f7ff]">
              Connexion
            </h1>
            <p className="mt-2 text-sm text-[#f0f7ff]/60">
              Accédez à votre espace adhérent
            </p>
          </div>

          {/* Erreur serveur */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="login">Email ou nom d&apos;utilisateur</Label>
              <Input
                id="login"
                type="text"
                autoComplete="username"
                placeholder="exemple@email.fr"
                error={errors.login?.message}
                {...register("login")}
              />
              {errors.login && (
                <p className="text-xs text-red-400">{errors.login.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#2b7fbf] hover:text-[#e8610a] transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  error={errors.password?.message}
                  className="pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f0f7ff]/40 hover:text-[#f0f7ff]/70 transition-colors"
                  aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" loading={isSubmitting} size="lg">
              {isSubmitting ? "Connexion…" : (
                <>Se connecter <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </form>

          <div className="mt-8 rounded-xl border border-[#f0f7ff]/10 bg-[#f0f7ff]/3 p-4 text-center">
            <p className="text-sm text-[#f0f7ff]/60">
              Pas encore adhérent ?
            </p>
            <Link
              href="/register"
              className="mt-1 inline-block text-sm font-semibold text-[#e8610a] hover:text-[#ff7a28] transition-colors"
            >
              Créer un compte →
            </Link>
          </div>

          <p className="mt-8 text-center text-xs text-[#f0f7ff]/30">
            <Link href="/" className="hover:text-[#f0f7ff]/60 transition-colors">
              ← Retour au site
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
