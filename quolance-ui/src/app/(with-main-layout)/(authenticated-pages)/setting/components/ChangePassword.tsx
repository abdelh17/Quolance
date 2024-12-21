"use client";


import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


import httpClient from "@/lib/httpClient";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HttpErrorResponse } from "@/constants/models/http/HttpErrorResponse";
import { showToast } from "@/util/context/ToastProvider";


import PasswordStrengthBar from "./PasswordStrengthBar";




const changePasswordSchema = z
 .object({
   oldPassword: z.string().min(1, "Current password is required"),
   password: z.string().min(8, "New password must be at least 8 characters long"),
   confirmPassword: z.string().min(1, "Password confirmation is required"),
 })
 .refine((data) => data.password === data.confirmPassword, {
   message: "Passwords do not match",
   path: ["confirmPassword"],
 });


type Schema = z.infer<typeof changePasswordSchema>;


export default function ChangePassword() {
 const [isLoading, setIsLoading] = useState(false);


 const { register, handleSubmit, formState, reset,setError,clearErrors} = useForm<Schema>({
   resolver: zodResolver(changePasswordSchema),
   reValidateMode: "onSubmit",
 });


 const [password, setPassword] = useState("");


 async function onSubmit(data: Schema) {
  
  
   setIsLoading(true);


   httpClient
     .patch("/api/users/password", data)
     .then(() => {
       showToast("The password has been changed successfully", "success");
       reset();
       setPassword("");
     })
     .catch((error) => {
       const errData = error.response?.data as HttpErrorResponse;


       if (error.response?.status === 400){
           if (errData?.message === "Wrong password") {
               setError("oldPassword", {
                 type: "manual",
                 message: "The current password is incorrect.",
               });
             }
       }


     })
     .finally(() => {
       setIsLoading(false);
     });
 }


 return (
   <div className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
     <div>
       <h2 className="text-base/7 font-semibold">Change password</h2>
       <p className="mt-1 text-sm/6 text-gray-400">
         Update your password associated with your account.
       </p>
     </div>


     <form
       onSubmit={handleSubmit(onSubmit)}
       className="md:col-span-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
     >
      
       <div className="col-span-full">
         <Label htmlFor="oldPassword">Current password</Label>
         <Input
           id="oldPassword"
           type="password"
           autoComplete="current-password"
           disabled={isLoading}
           {...register("oldPassword")}
           className="block w-full rounded-md px-3 py-1.5 outline outline-1 focus:outline-indigo-500 sm:text-sm/6"
           onChange={() => clearErrors("oldPassword")}
         />
         {formState.errors.oldPassword && (
           <small className="text-red-600">{formState.errors.oldPassword.message}</small>
         )}
       </div>


      
       <div className="col-span-full">
         <Label htmlFor="password">New password</Label>
         <Input
           id="password"
           type="password"
           autoComplete="new-password"
           disabled={isLoading}
           {...register("password")}
           className="block w-full rounded-md px-3 py-1.5 text-base outline outline-1 focus:outline-indigo-500 sm:text-sm/6"
           onChange={(e) => {
               clearErrors("password");
               setPassword(e.target.value);
             }}
         />
        
         {formState.errors.password && (
           <small className="text-red-600">{formState.errors.password.message}</small>
         )}
         {password.length >= 1 && <PasswordStrengthBar password={password} />}
       </div>


       <div className="col-span-full">
         <Label htmlFor="confirmPassword">Confirm password</Label>
         <Input
           id="confirmPassword"
           type="password"
           autoComplete="new-password"
           disabled={isLoading}
           {...register("confirmPassword")}
           className="block w-full rounded-md px-3 py-1.5 text-base outline outline-1 focus:outline-indigo-500 sm:text-sm/6"
           onChange={() => clearErrors("confirmPassword")}
         />
         {formState.errors.confirmPassword && (
           <small className="text-red-600">{formState.errors.confirmPassword.message}</small>
         )}
       </div>


       <div className="mt-8 flex">
         <Button
           type="submit"
           disabled={isLoading}
           className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 "
         >
           {isLoading ? "Updating..." : "Change Password"}
         </Button>
       </div>
     </form>
   </div>
 );
}
