'use client';


import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';


import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import httpClient from '@/lib/httpClient';
import { HttpErrorResponse } from '@/constants/models/http/HttpErrorResponse';
import { showToast } from '@/util/context/ToastProvider';
import { cn } from '@/util/utils';


const createAdminSchema = z
 .object({
   email: z.string().email(),
   username: z
   .string()
   .refine(
     (val) => val.length >= 5 && val.length <= 50,
     "Username must be between 5 and 50 characters"
   ),
   temporaryPassword: z.string().min(8, "New password must be at least 8 characters long"),
   passwordConfirmation: z.string().min(1, "Password confirmation is required"),
   firstName: z.string().optional(),
   lastName: z.string().optional(),
 })
 .refine((data) => data.temporaryPassword === data.passwordConfirmation, {
   message: 'Passwords do not match',
   path: ['passwordConfirmation'],
 });


type CreateAdminSchema = z.infer<typeof createAdminSchema>;


export function CreateAdminForm({
 className,
 ...props
}: React.HTMLAttributes<HTMLDivElement>) {
 const { register, handleSubmit, formState,reset,setError,clearErrors } = useForm<CreateAdminSchema>({
   resolver: zodResolver(createAdminSchema),
 });


 const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


 async function onSubmit(data: CreateAdminSchema) {
 
   setIsLoading(true);


   httpClient
     .post('/api/users/admin', data)
     .then(() => {
       showToast('New admin created successfully', 'success');
       reset();
       router.push('/adminDashboard');
     })
     .catch((error) => {
       const errData = error.response.data as HttpErrorResponse;
      




      if (error.response?.status === 400){
       if (errData?.message === "A user with this email already exists.") {
           setError("email", {
             type: "manual",
             message: "A user with this email already exists.",
           });
         }
   }


       if (error.response?.status === 422){
         if (errData?.message === "Unprocessable entity") {
             setError("temporaryPassword", {
               type: "manual",
               message: "Temporary Password must contain one uppercase letter, one lowercase letter, and one digit.",
             });
           }
        }


        if (error.response?.status === 500){
         if (errData?.message === "Unexpected error") {
             setError("username", {
               type: "manual",
               message: "A user with this username already exists.",
             });
           }
     }


      
     })
     .finally(() => setIsLoading(false));
 }


 return (
   <div className={cn('grid gap-6', className)} {...props}>
 


     <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
       <div className='grid gap-2'>
         <Label htmlFor='email'>Email</Label>
         <Input
           id='email'
           placeholder="Enter Admin's Email"
           type='text'
           autoCapitalize='none'
           autoComplete='email'
           autoCorrect='off'
           disabled={isLoading}
           {...register('email')}
           onChange={() => clearErrors("email")}
           data-test="email-input"
         />
         {formState.errors.email && (
           <small data-test="email-error" className='text-red-600'>
             {formState.errors.email.message}
           </small>
         )}
          <Label htmlFor='username'>Username</Label>
         <Input
           id='username'
           placeholder="Enter Admin's Username"
           type='text'
           autoCapitalize='none'
           autoComplete='username'
           autoCorrect='off'
           disabled={isLoading}
           {...register('username')}
           onChange={() => clearErrors("username")}
           data-test="username-input"
         />
         {formState.errors.username && (
           <small data-test="username-error" className='text-red-600'>
             {formState.errors.username.message}
           </small>
         )}


         <Label htmlFor='temporaryPassword'>Temporary Password</Label>
         <Input
           id='temporaryPassword'
           placeholder="Enter Admin's Temporary Password"
           type='password'
           disabled={isLoading}
           {...register('temporaryPassword')}
           onChange={() => clearErrors("temporaryPassword")}
           data-test="password-input"
         />
         {formState.errors.temporaryPassword && (
           <small data-test="password-error" className='text-red-600'>
             {formState.errors.temporaryPassword.message}
           </small>
         )}


         <Label htmlFor='passwordConfirmation'>
           Confirm Temporary Password
         </Label>
         <Input
           id='passwordConfirmation'
           placeholder="Confirm Admin's Temporary Password"
           type='password'
           disabled={isLoading}
           {...register('passwordConfirmation')}
           onChange={() => clearErrors("passwordConfirmation")}
           data-test="passwordConfirm-input"
         />
         {formState.errors.passwordConfirmation && (
           <small data-test="passwordConfirm-error" className='text-red-600'>
             {formState.errors.passwordConfirmation.message}
           </small>
         )}


         <Label htmlFor='firstName'>First Name</Label>
         <Input
           id='firstName'
           placeholder="Enter Admin's First Name"
           type='text'
           disabled={isLoading}
           {...register('firstName')}
           data-test="firstName-input"
         />


         <Label htmlFor='lastName'>Last Name</Label>
         <Input
           id='lastName'
           placeholder="Enter Admin's Last Name"
           type='text'
           disabled={isLoading}
           {...register('lastName')}
           data-test="lastName-input"
         />
       </div>




       <Button data-test="create-admin-btn" type='submit' disabled={isLoading} variant={'footerColor'} className = "mb-8">
         {isLoading ? 'Creating Admin...' : 'Create Admin'}
       </Button>
     </form>
   </div>
 );
}



