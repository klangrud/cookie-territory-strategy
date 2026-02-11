"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-8">
      <h1 className="text-2xl font-bold">Login</h1>

      {error && (
        <div className="mt-4 rounded bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-green-700 py-2 font-medium text-white hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        No account?{" "}
        <Link href="/register" className="text-green-700 hover:text-green-900">
          Register
        </Link>
      </p>
    </main>
  );
}
