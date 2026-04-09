"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(data: ForgotPasswordInput) {
    setServerError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Erreur serveur.");
      }
      setSent(true);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Une erreur est survenue.");
    }
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
          <Image src="/images/LVB1.png" alt="Lacanau Volley Club" width={72} height={72} />
        </div>

        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            </div>
            <h2 className="font-display text-2xl tracking-wide text-[#f0f7ff]">
              Email envoyé
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#f0f7ff]/60">
              Si un compte correspond à cette adresse, vous recevrez un lien de réinitialisation dans quelques minutes.
              Ce lien est valable <strong className="text-[#f0f7ff]/80">1 heure</strong>.
            </p>
            <Link href="/login">
              <Button variant="ghost" className="mt-6">
                <ArrowLeft className="h-4 w-4" />
                Retour à la connexion
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="font-display text-3xl tracking-wide text-[#f0f7ff]">
                Mot de passe oublié
              </h1>
              <p className="mt-2 text-sm text-[#f0f7ff]/60">
                Renseignez votre email pour recevoir un lien de réinitialisation.
              </p>
            </div>

            {serverError && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email">Adresse email</Label>
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

              <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
                {isSubmitting ? "Envoi…" : "Envoyer le lien"}
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
          </>
        )}
      </motion.div>
    </div>
  );
}
