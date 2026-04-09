import { redirect } from "next/navigation";

export default function Home() {
  // Entrée unique de l'app: l'utilisateur commence toujours par la page de connexion.
  // La redirection vers l'espace role-based est gérée après authentification.
  redirect("/login");
}
