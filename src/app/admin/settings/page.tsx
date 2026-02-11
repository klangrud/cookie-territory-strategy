"use client";

import { useState } from "react";
import { changePassword } from "@/lib/actions/auth.actions";

export default function SettingsPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);
    const result = await changePassword(formData);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Password changed successfully");
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-900">Settings</h1>

      <div className="mt-6 max-w-md rounded-lg bg-green-50 p-6">
        <h2 className="text-lg font-semibold text-green-900">
          Change Password
        </h2>

        {error && (
          <div className="mt-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded bg-green-100 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              name="currentPassword"
              type="password"
              required
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              name="newPassword"
              type="password"
              required
              minLength={6}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-green-700 py-2 font-medium text-white hover:bg-green-800 disabled:opacity-50"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
