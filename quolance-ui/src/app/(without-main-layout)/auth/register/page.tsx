import Link from "next/link";
import React from "react";

import { UserRegisterForm } from "./components/register-form";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center h-full max-w-sm mx-auto mt-4 space-y-6">
      <h1 className="text-2xl font-semibold">Create a new account</h1>
      <UserRegisterForm />
      <p>
        Already have an account?
        <Link href="/auth/login" className="underline ml-1">Login</Link>
      </p>
      <p className="text-sm text-center">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="underline">Terms</Link> and{" "}
        <Link href="/privacy" className="underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}
