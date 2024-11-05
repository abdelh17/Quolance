import Link from "next/link";
import React from "react";

import { UserRegisterForm } from "./components/register-form";

export default function RegisterPage() {
  return (
    <div className="mt-4 md:mt-0 space-y-6 flex flex-col justify-center h-full min-w-52 max-w-screen-sm mx-auto pt-24">
      <h1 className="text-2xl font-semibold">Create a new account</h1>
      <UserRegisterForm />
      <p className="text-center">
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
