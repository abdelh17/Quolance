// components/projects/ApplicationForm.tsx
'use client';
import { useAuthGuard } from '@/lib/auth/use-auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSubmitApplication } from '@/models/freelancer/freelancer-hooks';
import { Button } from '@/components/ui/button';
import { HttpErrorResponse } from '@/models/http/HttpErrorResponse';
import ResponseFeedback from '@/components/response-feedback';

type ApplicationFormProps = {
  projectId: number;
};

type ApplicationFormFields = {
  motivationalLetter: string;
};

export default function ProjectApplication({
  projectId,
}: ApplicationFormProps) {
  const { register, formState, handleSubmit } =
    useForm<ApplicationFormFields>();
  const { user } = useAuthGuard({ middleware: 'auth' });
  const {
    mutateAsync: mutateApplication,
    isSuccess,
    error,
  } = useSubmitApplication();

  const onSubmit: SubmitHandler<ApplicationFormFields> = async (data) => {
    if (!user) return;

    await mutateApplication({
      projectId: projectId,
      freelancerId: user.id,
    });
  };

  return (
    <div className='box-shadow-1 mt-6 rounded-lg bg-white p-8 shadow-lg'>
      <h3 className='heading-3 text-primary mb-6'>Your Application</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-6'>
          <label
            htmlFor='motivationalLetter'
            className='mb-2 block text-lg font-medium'
          >
            Why you're a great fit for this project
          </label>
          <textarea
            id='motivationalLetter'
            className='focus:ring-primary mb-4 w-full rounded-lg border border-gray-300 p-4 focus:border-transparent focus:outline-none focus:ring-2'
            placeholder="Introduce yourself and explain why you're a great fit for this project..."
            {...register('motivationalLetter', {
              validate: (value) => value.split(' ').length <= 500,
            })}
            rows={6}
          />
          <p className='text-sm text-gray-500'>Max 500 words</p>
        </div>

        <div className='mt-8'>
          <Button
            variant='default'
            className={
              'bg-b300 hover:text-n900 relative flex w-full items-center justify-center overflow-hidden rounded-full text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] xl:w-min xl:px-10'
            }
            type='submit'
            onSubmit={handleSubmit(onSubmit)}
          >
            <span className='relative z-10 '> Submit Application </span>
          </Button>
          <ResponseFeedback
            isSuccess={isSuccess}
            successMessage='Your application was successfully submitted'
            error={error?.response?.data as HttpErrorResponse}
          />
        </div>
      </form>
    </div>
  );
}
