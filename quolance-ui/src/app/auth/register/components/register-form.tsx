"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import httpClient from "@/lib/httpClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const registerSchema = z.object({
  firstName: z.string().min(4).max(30),
  lastName: z.string().min(4).max(30),
  email: z.string().email(),
  password: z.string().min(8),
  passwordConfirmation: z.string().min(8),
  role: z.enum(["FREELANCER", "CLIENT"]),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

type Schema = z.infer<typeof registerSchema>;

export function UserRegisterForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { register, handleSubmit, formState } = useForm<Schema>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: Schema) {
    setIsLoading(true);
    try {
      await httpClient.post("http://localhost:8080/api/users", data);
      toast.success("Account created successfully");
    } catch (error) {
      toast.error("Error creating account");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        placeholder="First Name"
        disabled={isLoading}
        {...register("firstName")}
      />

      <Input
        placeholder="Last Name"
        disabled={isLoading}
        {...register("lastName")}
      />

      {/* Ask user if he wants to be a freelancer or a client NOTE THIS IS JUST A SIMPLE EXAMPLE, TO FIX THE CORS ISSUE */}
      <select
        {...register("role")}
        className="w-full p-2 rounded-md border border-gray-300"
      >
        <option value="FREELANCER">Freelancer</option>
        <option value="CLIENT">Client</option>
      </select>

      <Input
        placeholder="Email"
        type="email"
        disabled={isLoading}
        {...register("email")}
      />
      {formState.errors.email && (
        <small className="text-red-600">{formState.errors.email.message}</small>
      )}

      <Input
        placeholder="Password"
        type="password"
        disabled={isLoading}
        {...register("password")}
      />
      {formState.errors.password && (
        <small className="text-red-600">{formState.errors.password.message}</small>
      )}

      <Input
        placeholder="Confirm Password"
        type="password"
        disabled={isLoading}
        {...register("passwordConfirmation")}
      />
      {formState.errors.passwordConfirmation && (
        <small className="text-red-600">
          {formState.errors.passwordConfirmation.message}
        </small>
      )}

      <Button disabled={isLoading} type="submit">
        {isLoading ? "Creating account..." : "Register"}
      </Button>
    </form>
  );
}
