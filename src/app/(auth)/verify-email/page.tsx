"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Status = "loading" | "success" | "already" | "expired" | "invalid" | "error";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0d2237]">
          <Loader2 className="h-8 w-8 animate-spin text-[#e8610a]" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const params = useSearchParams();
  const token = params.get("token");

  const [status, setStatus] = useState<Status>(token ? "loading" : "invalid");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const json = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          if (json.error && /expir/i.test(json.error)) setStatus("expired");
          else setStatus("error");
          setErrorMsg(json.error ?? "Erreur lors de la vérification.");
          return;
        }

        setStatus(json.alreadyVerified ? "already" : "success");
      } catch {
        if (cancelled) return;
        setStatus("error");
        setErrorMsg("Connexion impossible. Vérifiez votre réseau et réessayez.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d2237] px-6 py-12">
      <motion.div
        className="w-full max-w-sm text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src="/images/LVC_FINAL%20LOGO-08%20(1).png"
          alt="Lacanau Volley Club"
          width={80}
          height={80}
          className="mx-auto mb-6"
        />

        {status === "loading" && (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#2b7fbf]/15">
              <Loader2 className="h-7 w-7 animate-spin text-[#2b7fbf]" />
            </div>
            <h2 className="font-display text-2xl tracking-wide text-[#f0f7ff]">
              Vérification en cours…
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#f0f7ff]/60">
              Nous validons votre lien de confirmation.
            </p>
          </>
        )}

        {(status === "success" || status === "already") && (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            </div>
            <h2 className="font-display text-2xl tracking-wide text-[#f0f7ff]">
              {status === "already" ? "Email déjà confirmé" : "Email confirmé !"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#f0f7ff]/60">
              {status === "already" ? (
                <>Votre adresse email a déjà été vérifiée.</>
              ) : (
                <>
                  Merci, votre adresse email est confirmée. Votre compte est désormais
                  en attente de validation par un administrateur du club. Vous recevrez
                  un email dès que votre accès sera activé.
                </>
              )}
            </p>
            <Link href="/?auth=1">
              <Button className="mt-6">
                Aller à la connexion <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </>
        )}

        {status === "expired" && <ResendBlock initialError={errorMsg} expired />}

        {(status === "invalid" || status === "error") && (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15">
              <XCircle className="h-7 w-7 text-red-400" />
            </div>
            <h2 className="font-display text-2xl tracking-wide text-[#f0f7ff]">
              Lien invalide
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#f0f7ff]/60">
              {errorMsg ||
                "Ce lien de vérification est invalide ou a déjà été utilisé."}
            </p>
            <ResendBlock initialError={null} />
          </>
        )}
      </motion.div>
    </div>
  );
}

/** Bloc de demande d’un nouvel email de vérification. */
function ResendBlock({
  initialError,
  expired = false,
}: {
  initialError: string | null;
  expired?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  async function resend() {
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Erreur serveur.");
      }
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="mt-6 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-300">
        Un nouvel email de vérification a été envoyé si un compte correspond à
        cette adresse. Pensez à vérifier vos spams.
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-xl border border-[#f0f7ff]/10 bg-[#f0f7ff]/3 p-5 text-left">
      {expired && (
        <>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15">
            <AlertCircle className="h-6 w-6 text-amber-400" />
          </div>
          <h3 className="text-center font-display text-lg tracking-wide text-[#f0f7ff]">
            Lien expiré
          </h3>
          <p className="mb-4 mt-2 text-center text-sm text-[#f0f7ff]/60">
            Votre lien de vérification a expiré. Renseignez votre email pour en
            recevoir un nouveau.
          </p>
        </>
      )}
      {!expired && (
        <p className="mb-4 text-center text-sm text-[#f0f7ff]/60">
          Recevoir un nouvel email de vérification&nbsp;:
        </p>
      )}

      {error && !expired && (
        <p className="mb-3 text-xs text-red-400">{error}</p>
      )}

      <div className="space-y-2">
        <Label htmlFor="resend-email" className="text-xs">Email</Label>
        <Input
          id="resend-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="marie.dupont@email.fr"
          autoComplete="email"
        />
      </div>
      <Button
        onClick={resend}
        className="mt-3 w-full"
        disabled={!email || sending}
        loading={sending}
      >
        {sending ? "Envoi…" : "Renvoyer le lien"}
      </Button>
    </div>
  );
}
