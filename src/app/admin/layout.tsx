import Link from "next/link";
import { requireAccessScope } from "@/lib/authz";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Any authenticated user can reach the admin area now — even with zero
  // troop memberships, they need access to /admin/troops to create their
  // first troop (self-service; see troop.actions.ts).
  const scope = await requireAccessScope();

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
          {scope.isSuperAdmin && (
            <>
              <Link
                href="/admin/import"
                className="block rounded px-3 py-2 text-sm text-green-100 hover:bg-green-800"
              >
                Import
              </Link>
              <Link
                href="/admin/users"
                className="block rounded px-3 py-2 text-sm text-green-100 hover:bg-green-800"
              >
                Users
              </Link>
            </>
          )}
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
