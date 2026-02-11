import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <aside className="w-56 border-r bg-green-900 p-4">
        <h2 className="mb-4 text-sm font-semibold uppercase text-green-100">
          Admin
        </h2>
        <nav className="space-y-1">
          <Link
            href="/admin"
            className="block rounded px-3 py-2 text-sm text-green-100 hover:bg-green-800"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/troops"
            className="block rounded px-3 py-2 text-sm text-green-100 hover:bg-green-800"
          >
            Troops
          </Link>
          <Link
            href="/admin/scouts"
            className="block rounded px-3 py-2 text-sm text-green-100 hover:bg-green-800"
          >
            Scouts
          </Link>
          <Link
            href="/admin/booths"
            className="block rounded px-3 py-2 text-sm text-green-100 hover:bg-green-800"
          >
            Booths
          </Link>
          <Link
            href="/admin/import"
            className="block rounded px-3 py-2 text-sm text-green-100 hover:bg-green-800"
          >
            Import
          </Link>
          <Link
            href="/admin/settings"
            className="block rounded px-3 py-2 text-sm text-green-100 hover:bg-green-800"
          >
            Settings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
