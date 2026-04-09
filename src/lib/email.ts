import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");
}

function getFrom() {
  return `${process.env.RESEND_FROM_NAME ?? "Lacanau Volley-Ball"} <${
    process.env.RESEND_FROM_EMAIL ?? "noreply@lacanau-volley.fr"
  }>`;
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<void> {
  await getResend().emails.send({
    from: getFrom(),
    to,
    subject: "Réinitialisation de votre mot de passe — Lacanau Volley",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:40px 24px">
        <h2 style="color:#0d2237;margin-bottom:8px">Réinitialisation du mot de passe</h2>
        <p style="color:#52525b;line-height:1.6">
          Vous avez demandé la réinitialisation de votre mot de passe.
          Cliquez sur le bouton ci-dessous (valable <strong>1 heure</strong>) :
        </p>
        <a href="${resetUrl}"
           style="display:inline-block;margin:24px 0;padding:12px 28px;background:#7c3aed;
                  color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
          Réinitialiser le mot de passe
        </a>
        <p style="color:#71717a;font-size:13px;margin-top:24px">
          Si vous n'avez pas fait cette demande, ignorez cet email.<br/>
          Ce lien expire dans 1 heure.
        </p>
        <hr style="border:none;border-top:1px solid #e4e4e7;margin:32px 0"/>
        <p style="color:#a1a1aa;font-size:12px">
          AS Lacanau Section Volley Ball • Lacanau, Gironde
        </p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(
  to: string,
  firstName: string
): Promise<void> {
  await getResend().emails.send({
    from: getFrom(),
    to,
    subject: "Bienvenue à Lacanau Volley-Ball !",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:40px 24px">
        <h2 style="color:#0d2237">Bienvenue, ${firstName} !</h2>
        <p style="color:#52525b;line-height:1.6">
          Votre demande d'inscription a bien été reçue.
          Un administrateur va valider votre compte prochainement.
          Vous recevrez un email dès que votre accès sera activé.
        </p>
        <p style="color:#71717a;font-size:13px;margin-top:24px">
          En attendant, n'hésitez pas à nous contacter à{" "}
          <a href="mailto:david.lacanau33@orange.fr" style="color:#7c3aed">
            david.lacanau33@orange.fr
          </a>
        </p>
        <hr style="border:none;border-top:1px solid #e4e4e7;margin:32px 0"/>
        <p style="color:#a1a1aa;font-size:12px">
          AS Lacanau Section Volley Ball • Lacanau, Gironde
        </p>
      </div>
    `,
  });
}
