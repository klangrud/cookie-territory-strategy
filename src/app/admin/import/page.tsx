import { redirect } from "next/navigation";
import { requireAccessScope } from "@/lib/authz";
import { ImportTabs } from "@/components/admin/import-tabs";

export default async function ImportPage() {
  const scope = await requireAccessScope();
  if (!scope.isSuperAdmin) redirect("/admin");

  return <ImportTabs />;
}
