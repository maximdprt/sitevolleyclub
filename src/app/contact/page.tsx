"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Facebook, Send } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <main>
      <PageHero
        title="Contact"
        description="Une question, envie de nous rejoindre ? Écrivez-nous ou appelez-nous."
        imageSrc="/imagesvideos/Images volley lacanau 1.jpg"
      />

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              Coordonnées
            </h2>
            <ul className="mt-6 space-y-4 text-slate-600">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 shrink-0 text-ocean" />
                <a href="tel:0695043114" className="hover:text-ocean hover:underline">
                  06 95 04 31 14
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 shrink-0 text-ocean" />
                <a
                  href="mailto:david.lacanau33@orange.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ocean hover:underline"
                >
                  david.lacanau33@orange.fr
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-ocean" />
                <span>
                  COSEC, 19 av. Albert François<br />
                  33680 Lacanau
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Facebook className="h-5 w-5 shrink-0 text-ocean" />
                <a
                  href="https://www.facebook.com/volley.lacanau"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ocean hover:underline"
                >
                  Facebook — volley.lacanau
                </a>
              </li>
            </ul>
            <p className="mt-8 text-sm text-slate-500">
              Entraînements : mardi de 20h00 à 23h00 et jeudi de 20h30 à 23h00 au COSEC.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <h2 className="font-display text-xl font-semibold text-slate-900">
              Envoyer un message
            </h2>
            {sent ? (
              <p className="mt-6 text-slate-600">
                Merci ! Votre message a bien été envoyé. Nous vous répondrons rapidement.
              </p>
            ) : (
              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                    Nom
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-ocean px-6 py-3 font-semibold text-white transition hover:bg-ocean-light"
                >
                  <Send className="h-4 w-4" />
                  Envoyer
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
