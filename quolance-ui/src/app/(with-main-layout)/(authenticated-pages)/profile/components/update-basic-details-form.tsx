'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { HttpErrorResponse } from '@/models/http/HttpErrorResponse';

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});

type Schema = z.infer<typeof schema>;
export default function UpdateBasicDetailsForm() {
  const { user, mutate } = useAuthGuard({ middleware: 'auth' });
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(
    undefined
  );

  const onSubmit = (data: Schema) => {
    setErrors(undefined);
    httpClient
      .put('/api/users', data)
      .then(() => {
        toast.success('Profile updated successfully');
        mutate();
      })
      .catch((error) => {
        const errData = error.response.data as HttpErrorResponse;
        setErrors(errData);
      });
  };

  useEffect(() => {
    if (user) {
      form.setValue('firstName', user.firstName || '');
      form.setValue('lastName', user.lastName || '');
    }
  }, [user]);

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    reValidateMode: 'onSubmit',
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
    },
  });

  return (
    <div className='max-w-screen-sm'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-y-2'
        >
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <Button type='submit' variant={'footerColor'}>
            Update profile
          </Button>
        </form>
      </Form>

      <ErrorFeedback data={errors} />
    </div>
  );
}
