"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useAuthGuard } from "@/lib/auth/use-auth";
import httpClient from "@/lib/httpClient";

import ErrorFeedback from "@/components/error-feedback";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2)
});

type Schema = z.infer<typeof schema>;

export default function UpdateBasicDetailsForm() {
  const { user, mutate } = useAuthGuard({ middleware: "auth" });
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  const onSubmit = (data: Schema) => {
    setErrors(undefined);
    httpClient
      .put("/api/users", data)
      .then(() => {
        toast.success("Profile updated successfully");
        setSuccessMessage("Your profile has been updated successfully.");
        mutate();
      })
      .catch((error) => {
        const errData = error.response.data as HttpErrorResponse;
        setErrors(errData);
      });
  };

  useEffect(() => {
    if (user) {
      form.setValue("firstName", user.firstName || '');
      form.setValue("lastName", user.lastName || '');
    }
  }, [user])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(undefined), 3000); // 5000ms
      return () => clearTimeout(timer); // Clear timeout if component unmounts or message changes
    }
  }, [successMessage]);

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    reValidateMode: "onSubmit",
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName
    }
  });

  return (
    <div className="max-w-screen-sm animationOne">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4 p-4 bg-white rounded-lg shadow-lg transition duration-500 ease-in-out transform hover:shadow-2xl"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-b500 border rounded-md p-2 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-b500 focus:ring-opacity-50 focus:border-b500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-b500 border rounded-md p-2 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-b500 focus:ring-opacity-50 focus:border-b500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="footerColor"
            className="mt-4 bg-b300 text-white py-2 px-4 max-w-xs mx-auto rounded-full transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 focus:outline-none"
          >
            Update profile
          </Button>
        </form>
      </Form>
      
      <ErrorFeedback data={errors} />
      {/* Success message */}
      {successMessage && (
        <div className="mt-4 text-green-600">
          {successMessage}
        </div>
      )}
    </div>
  );
}