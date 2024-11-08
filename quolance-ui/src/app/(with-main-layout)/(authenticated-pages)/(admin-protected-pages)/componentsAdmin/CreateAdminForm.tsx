"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import httpClient from "@/lib/httpClient";

import { PiEnvelopeSimple, PiLock, PiUser } from "react-icons/pi";

const createAdminSchema = z.object({
  email: z.string().email(),
  temporaryPassword: z
    .string()
    .min(8),
  passwordConfirmation: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).refine((data) => data.temporaryPassword === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

type CreateAdminSchema = z.infer<typeof createAdminSchema>;

export function CreateAdminForm() {
  const { register, handleSubmit, formState } = useForm<CreateAdminSchema>({
    resolver: zodResolver(createAdminSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: CreateAdminSchema) => {
    setIsLoading(true);
    try {
      await httpClient.post("/api/users/admin", data);
      alert("Admin created successfully!");
    } catch (error) {
      console.error("Error creating admin:", error);
      alert("Failed to create admin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex border rounded w-4/5 m-auto">
      <form className="flex flex-col w-full p-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <div className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3">
              <span className="text-2xl">
                <PiEnvelopeSimple />
              </span>
              <input
                type="text"
                placeholder="Enter Your Email"
                className="w-full text-sm text-gray-700 outline-none"
                {...register("email")}
              />
            </div>
            {formState.errors.email && (
              <small className="text-red-600">{formState.errors.email.message}</small>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Temporary Password</label>
            <div className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3">
              <span className="text-2xl">
                <PiLock />
              </span>
              <input
                type="password"
                placeholder="Enter Temporary Password"
                className="w-full text-sm text-gray-700 outline-none"
                {...register("temporaryPassword")}
              />
            </div>
            {formState.errors.temporaryPassword && (
              <small className="text-red-600">{formState.errors.temporaryPassword.message}</small>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
            <div className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3">
              <span className="text-2xl">
                <PiLock />
              </span>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full text-sm text-gray-700 outline-none"
                {...register("passwordConfirmation")}
              />
            </div>
            {formState.errors.passwordConfirmation && (
              <small className="text-red-600">{formState.errors.passwordConfirmation.message}</small>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">First Name</label>
            <div className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3">
              <span className="text-2xl">
                <PiUser />
              </span>
              <input
                type="text"
                placeholder="Enter Your First Name"
                className="w-full text-sm text-gray-700 outline-none"
                {...register("firstName")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Last Name</label>
            <div className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3">
              <span className="text-2xl">
                <PiUser />
              </span>
              <input
                type="text"
                placeholder="Enter Your Last Name"
                className="w-full text-sm text-gray-700 outline-none"
                {...register("lastName")}
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-2xl bg-blue-500 py-3 text-white font-semibold hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Creating Admin..." : "Create Admin"}
          </button>
        </div>
      </form>
    </div>
  );
}