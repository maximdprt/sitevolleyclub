import { z } from "zod";

/**
 * Politique de mot de passe
 * ─────────────────────────
 * • 8 caractères minimum
 * • au moins un caractère spécial (non alphanumérique) obligatoire
 */
const passwordSchema = z
  .string()
  .min(8, "Minimum 8 caractères")
  .regex(/[^A-Za-z0-9]/, "Au moins un caractère spécial");

export const loginSchema = z.object({
  login: z.string().min(1, "Identifiant requis"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Email invalide"),
    username: z
      .string()
      .min(3, "Minimum 3 caractères")
      .max(20, "Maximum 20 caractères")
      .regex(/^[a-zA-Z0-9_-]+$/, "Lettres, chiffres, _ et - uniquement"),
    firstName: z.string().min(2, "Prénom requis"),
    lastName: z.string().min(2, "Nom requis"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

export const resendVerificationSchema = z.object({
  email: z.string().email("Email invalide"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
