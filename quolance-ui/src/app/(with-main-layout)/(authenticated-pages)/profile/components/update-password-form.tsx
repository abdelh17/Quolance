'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useAuthGuard } from '@/api/auth-api';
import httpClient from '@/lib/httpClient';

import ErrorFeedback from '@/components/error-feedback';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";



// Validation schema with regex for password complexity
const schema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  password: z.string(),
  confirmPassword: z.string(),
});

type Schema = z.infer<typeof schema>;

export default function UpdatePasswordForm() {
  const { user, mutate } = useAuthGuard({ middleware: "auth" });
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    reValidateMode: 'onSubmit',
  });

  const onSubmit = (data: Schema) => {
    setErrors([]); // Clear previous errors
    setSuccessMessage(undefined); // Clear previous success message

    const validationErrors = [];
    if (data.password !== data.confirmPassword) {
      validationErrors.push("Passwords do not match");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return; // Exit early if there are validation errors
    }

    // Send request to backend
    httpClient
      .patch("/api/users/password", data)
      .then(() => {
        setSuccessMessage("Password updated successfully");
        mutate();
      })
      .catch((error) => {
        console.log(error);
          const errData = error.response?.data as HttpErrorResponse;
          // Display backend validation errors if available
          if (errData?.errors) {
            const fieldErrors = Object.values(errData.errors);
            setErrors(fieldErrors);
          }else if (errData?.generalErrors) {
            setErrors([errData.generalErrors[0]]);
          }
          else if (errData?.message) {
            setErrors([errData.message]);
          } else if (error.response?.status === 422) {
            setErrors(["The data provided was invalid. Please check the fields and try again."]);
          } else {
            setErrors(["An unexpected error occurred. Please try again later."]);
          }
      });
  };

  return (
    <div className="m -w-screen-sm animationOne">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4 p-4 bg-white rounded-lg shadow-lg transition duration-500 ease-in-out transform hover:shadow-2xl"
        >
          {/* Old Password Field */}
          <FormField
            control={form.control}
            name='oldPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your current password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className="p-2 rounded-md border-b500 focus:ring-2 focus:ring-b500 focus:ring-opacity-50 focus:border-b500 transition-all duration-300 ease-in-out"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* New Password Field */}
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className="border-b500 border rounded-md p-2 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-b500 focus:ring-opacity-50 focus:border-b500"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className="p-2 rounded-md border-b500 focus:ring-2 focus:ring-b500 focus:ring-opacity-50 focus:border-b500 transition-all duration-300 ease-in-out"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="footerColor"
            className="mt-4 bg-b300 text-white py-2 px-4 max-w-xs mx-auto rounded-full transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 focus:outline-none"
          >
            Update password
          </Button>
        </form>
      </Form>

      {/* Bottom Block for Error or Success Messages */}
      {errors.length > 0 && (
        <div className="mt-4 text-red-600">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
      {successMessage && <div className="mt-4 text-green-600">{successMessage}</div>}
    </div>
  );
}