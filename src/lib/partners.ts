export type Partner = {
  name: string;
  logo: string;
  href: string;
  description?: string;
};

/** Partenaires affichés sur l’accueil (logos cliquables). */
export const homePartners: Partner[] = [
  {
    name: "Ville de Lacanau",
    logo: "/images/Logo mairie de lacanau (1).jpg",
    href: "https://www.lacanau.fr",
  },
  {
    name: "Comité de Gironde de Volley-Ball",
    logo: "/images/logo-ffvolley.png",
    href: "https://www.ffvb.org",
  },
  {
    name: "Cap33",
    logo: "/images/Cap33-Evenement-Site.jpg",
    href: "https://www.gironde.fr/cap33",
  },
  {
    name: "BioEcoPrint",
    logo: "/images/logo-bioecoprint.png",
    href: "https://www.bioecoprint.fr",
  },
  {
    name: "Pano Nord Gironde",
    logo: "/images/logo-pano.png",
    href: "https://pano-nordgironde.fr",
  },
  {
    name: "Atelier Marquage Aquitain",
    logo: "/images/logo-ama.png",
    href: "https://www.marquage-aquitaine.fr",
  },
];
