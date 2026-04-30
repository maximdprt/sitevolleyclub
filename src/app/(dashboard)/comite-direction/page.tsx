import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Shield, Lock } from "lucide-react";
import { ComiteWorkspace } from "@/components/comite/ComiteWorkspace";

export default async function ComiteDirectionPage() {
  const session = await auth();
  const role = session?.user?.role;

  if (role !== "COMITE_DIRECTION" && role !== "ADMIN") {
    redirect("/espace-membre");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8610a]/10">
          <Shield className="h-5 w-5 text-[#e8610a]" />
        </div>
        <div>
          <h1 className="font-display text-2xl tracking-wide text-[#f0f7ff]">
            Comité de Direction
          </h1>
          <p className="text-sm text-[#f0f7ff]/50">
            Documents internes réservés aux membres du comité.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-amber-300">
          <Lock className="h-4 w-4 shrink-0" />
          Cet espace est strictement confidentiel. Les documents partagés ici ne sont visibles que par les membres du comité et les administrateurs.
        </div>
      </div>
      <ComiteWorkspace currentUserId={session!.user.id} currentRole={session!.user.role} />
    </div>
  );
}
