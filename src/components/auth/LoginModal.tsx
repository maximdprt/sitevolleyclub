"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthUi } from "@/components/providers/auth-ui-context";

const modalLoginSchema = z.object({
  email: z.string().min(1, "Email requis").email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type ModalLogin = z.infer<typeof modalLoginSchema>;

const ERRORS: Record<string, string> = {
  PENDING: "Votre compte est en attente de validation par un administrateur.",
  SUSPENDED: "Votre compte a été suspendu. Contactez un administrateur.",
  CredentialsSignin: "Identifiants incorrects.",
  CallbackRouteError: "Connexion refusée. Vérifiez vos identifiants ou le statut du compte.",
};

export function LoginModal() {
  const { loginOpen, closeLogin } = useAuthUi();
  const router = useRouter();
  const [showPwd, setShowPwd] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [pendingNext, setPendingNext] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || !loginOpen) return;
    const params = new URLSearchParams(window.location.search);
    setPendingNext(params.get("next"));
  }, [loginOpen]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ModalLogin>({ resolver: zodResolver(modalLoginSchema) });

  React.useEffect(() => {
    if (!loginOpen) {
      reset();
      setServerError(null);
      return;
    }
    if (typeof window === "undefined") return;
    const err = new URLSearchParams(window.location.search).get("error");
    if (err === "PENDING") {
      setServerError(ERRORS.PENDING);
    }
  }, [loginOpen, reset]);

  async function onSubmit(data: ModalLogin) {
    setServerError(null);
    const result = await signIn("credentials", {
      login: data.email.trim().toLowerCase(),
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      const code = result.code ?? result.error;
      setServerError(ERRORS[code] ?? ERRORS[result.error] ?? "Identifiants incorrects.");
      return;
    }

    const target =
      pendingNext && pendingNext.startsWith("/") && !pendingNext.startsWith("//")
        ? pendingNext
        : "/espace-membre";

    closeLogin();
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("auth");
      url.searchParams.delete("next");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
    window.location.assign(target);
  }

  return (
    <Dialog open={loginOpen} onOpenChange={(o) => !o && closeLogin()}>
      <DialogContent className="border-[#f0f7ff]/10 bg-[#0d2237] text-[#f0f7ff] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connexion</DialogTitle>
          <DialogDescription className="text-[#f0f7ff]/50">
            Accédez à votre espace adhérent ou administrateur.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="adherent" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="adherent">Adhérent</TabsTrigger>
            <TabsTrigger value="admin">Administrateur</TabsTrigger>
          </TabsList>
          <TabsContent value="adherent" className="mt-3">
            <p className="text-xs text-[#f0f7ff]/40">
              Espace membre : documents, forum, infos club après validation.
            </p>
          </TabsContent>
          <TabsContent value="admin" className="mt-3">
            <p className="text-xs text-[#f0f7ff]/40">
              Panneau d’administration : le rôle est vérifié côté serveur après connexion.
            </p>
          </TabsContent>
        </Tabs>

        {serverError && (
          <div className="flex items-start gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="modal-email">Email</Label>
            <Input
              id="modal-email"
              type="email"
              autoComplete="username"
              placeholder="vous@exemple.fr"
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="modal-password">Mot de passe</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#2b7fbf] hover:text-[#e8610a]"
                onClick={() => closeLogin()}
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="modal-password"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                className="pr-10"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f0f7ff]/40 hover:text-[#f0f7ff]/70"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Se connecter
          </Button>
        </form>

        <p className="text-center text-xs text-[#f0f7ff]/40">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-[#e8610a] hover:underline" onClick={() => closeLogin()}>
            Créer un compte
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}
