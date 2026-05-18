import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");
}

function getFrom() {
  return `${process.env.RESEND_FROM_NAME ?? "Lacanau Volley-Ball"} <${
    process.env.RESEND_FROM_EMAIL ?? "noreply@lacanau-volley.fr"
  }>`;
}

const BRAND_HEADER = `
  <div style="background:#0d2237;padding:32px 24px;text-align:center">
    <h1 style="margin:0;font-family:Georgia,serif;color:#f0f7ff;font-size:24px;letter-spacing:0.05em">
      LACANAU VOLLEY CLUB
    </h1>
  </div>
`;

const BRAND_FOOTER = `
  <hr style="border:none;border-top:1px solid #e4e4e7;margin:32px 0"/>
  <p style="color:#a1a1aa;font-size:12px;text-align:center">
    AS Lacanau Section Volley Ball • Lacanau, Gironde<br/>
    Cet email a été envoyé automatiquement, merci de ne pas y répondre.
  </p>
`;

/**
 * Envoie l’email de vérification (clic obligatoire pour activer le compte).
 */
export async function sendVerificationEmail(
  to: string,
  firstName: string,
  verifyUrl: string,
): Promise<void> {
  await getResend().emails.send({
    from: getFrom(),
    to,
    subject: "Confirmez votre adresse email — Lacanau Volley",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;background:#fff">
        ${BRAND_HEADER}
        <div style="padding:32px 24px">
          <h2 style="color:#0d2237;margin-bottom:8px">Bienvenue, ${firstName} !</h2>
          <p style="color:#52525b;line-height:1.6">
            Merci de votre inscription à <strong>Lacanau Volley Club</strong>.
            Pour finaliser la création de votre compte, confirmez votre adresse
            email en cliquant sur le bouton ci-dessous&nbsp;:
          </p>
          <p style="text-align:center;margin:32px 0">
            <a href="${verifyUrl}"
               style="display:inline-block;padding:14px 32px;background:#e8610a;
                      color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
              Confirmer mon email
            </a>
          </p>
          <p style="color:#71717a;font-size:13px;line-height:1.6">
            Ce lien est valable <strong>24 heures</strong>.
            Si vous n’avez pas créé de compte sur Lacanau Volley Club,
            ignorez simplement cet email.
          </p>
          <p style="color:#a1a1aa;font-size:12px;margin-top:24px;word-break:break-all">
            Lien direct&nbsp;: <a href="${verifyUrl}" style="color:#2b7fbf">${verifyUrl}</a>
          </p>
          ${BRAND_FOOTER}
        </div>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
): Promise<void> {
  await getResend().emails.send({
    from: getFrom(),
    to,
    subject: "Réinitialisation de votre mot de passe — Lacanau Volley",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;background:#fff">
        ${BRAND_HEADER}
        <div style="padding:32px 24px">
          <h2 style="color:#0d2237;margin-bottom:8px">Réinitialisation du mot de passe</h2>
          <p style="color:#52525b;line-height:1.6">
            Vous avez demandé la réinitialisation de votre mot de passe.
            Cliquez sur le bouton ci-dessous (valable <strong>1 heure</strong>)&nbsp;:
          </p>
          <p style="text-align:center;margin:32px 0">
            <a href="${resetUrl}"
               style="display:inline-block;padding:14px 32px;background:#e8610a;
                      color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
              Réinitialiser le mot de passe
            </a>
          </p>
          <p style="color:#71717a;font-size:13px;margin-top:24px">
            Si vous n’avez pas fait cette demande, ignorez cet email.<br/>
            Ce lien expire dans 1 heure.
          </p>
          ${BRAND_FOOTER}
        </div>
      </div>
    `,
  });
}

/**
 * Email envoyé une fois l’email confirmé : informe que le compte est
 * désormais en attente de validation par un administrateur.
 */
export async function sendWelcomeEmail(
  to: string,
  firstName: string,
): Promise<void> {
  await getResend().emails.send({
    from: getFrom(),
    to,
    subject: "Email confirmé — Lacanau Volley-Ball",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;background:#fff">
        ${BRAND_HEADER}
        <div style="padding:32px 24px">
          <h2 style="color:#0d2237">Email confirmé, ${firstName} !</h2>
          <p style="color:#52525b;line-height:1.6">
            Votre adresse email a bien été vérifiée. Votre compte est
            désormais <strong>en attente de validation</strong> par un
            administrateur du club.
          </p>
          <p style="color:#52525b;line-height:1.6">
            Vous recevrez un nouvel email dès que votre accès à l’espace
            adhérent sera activé.
          </p>
          <p style="color:#71717a;font-size:13px;margin-top:24px">
            Une question ? Écrivez-nous à
            <a href="mailto:contact@lacanauvolley.fr" style="color:#2b7fbf">
              contact@lacanauvolley.fr
            </a>
          </p>
          ${BRAND_FOOTER}
        </div>
      </div>
    `,
  });
}
