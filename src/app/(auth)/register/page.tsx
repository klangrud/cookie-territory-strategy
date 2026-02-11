import Link from "next/link";
import { registerUser } from "@/lib/actions/auth.actions";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-sm px-4 py-8">
      <h1 className="text-2xl font-bold">Register</h1>

      <form action={registerUser} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              name="firstName"
              required
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              name="lastName"
              required
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
        </div>
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
            minLength={6}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-green-700 py-2 font-medium text-white hover:bg-green-800"
        >
          Create Account
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-green-700 hover:text-green-900">
          Login
        </Link>
      </p>
    </main>
  );
}
