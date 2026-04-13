import { createClient } from "@/utils/supabase/server";

/** Page de test : supprime le dossier `app/test-db` une fois la connexion vérifiée. */
export const dynamic = "force-dynamic";

export default async function TestPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("User").select("id, email").limit(3);

  return (
    <div style={{ padding: 40 }}>
      <h1>Test connexion Supabase</h1>
      {error ? (
        <pre style={{ color: "red" }}>{JSON.stringify(error, null, 2)}</pre>
      ) : (
        <>
          <p style={{ color: "green" }}>✅ Connexion OK</p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
      )}
    </div>
  );
}
