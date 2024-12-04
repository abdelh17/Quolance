'use client';
import { useAuthGuard } from '@/api/auth-api';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSubmitApplication } from '@/api/freelancer-api';
import { Button } from '@/components/ui/button';
import { PiPaperPlaneRight } from 'react-icons/pi';

type ApplicationFormProps = {
  projectId: number;
};

type ApplicationFormFields = {
  motivationalLetter: string;
};

export default function FreelancerApplicationForm({
  projectId,
}: ApplicationFormProps) {
  const { register, handleSubmit, watch } = useForm<ApplicationFormFields>();
  const { user } = useAuthGuard({ middleware: 'auth' });
  const { mutateAsync: mutateApplication } = useSubmitApplication();

  const onSubmit: SubmitHandler<ApplicationFormFields> = async (data) => {
    if (!user) return;
    await mutateApplication(projectId);
  };

  // Calculate word count
  const wordCount = watch('motivationalLetter')?.split(/\s+/).length || 0;
  const maxWords = 500;

  return (
    <section className='py-8'>
      <div>
        <h2 className='heading-2 pb-2'>Submit Application</h2>
        <p className='text-n300 pb-6 font-medium'>
          Tell us why you're perfect for this project
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Motivational Letter Section */}
          <div>
            <label
              htmlFor='motivationalLetter'
              className='text-n700 mb-2 block text-sm font-medium'
            >
              Cover Letter
            </label>
            <textarea
              id='motivationalLetter'
              {...register('motivationalLetter')}
              rows={12}
              className='bg-n20 focus:ring-n50 w-full resize-none rounded-lg px-4 py-3 text-base outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:ring-2'
              placeholder="Introduce yourself and explain why you're a great fit for this project..."
            />
            <div className='mt-2 flex justify-between text-sm'>
              <p className='text-n300'>
                Be sure to include your relevant experience, skills, and why you
                are interested in this project.
              </p>
              <p
                className={`${
                  wordCount > maxWords ? 'text-red-500' : 'text-n300'
                }`}
              >
                {wordCount}/{maxWords} words
              </p>
            </div>
          </div>

          {/* Submit Button Section */}
          <div className='flex items-center justify-end gap-3'>
            <Button
              type='submit'
              disabled={wordCount > maxWords}
              className='bg-n700 hover:text-n900 relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-medium text-white
                transition-all duration-700
                after:absolute after:inset-0 after:left-0 after:w-0
                after:rounded-full after:bg-yellow-400 after:duration-700
                hover:after:w-[calc(100%+2px)]'
            >
              <span className='relative z-10 flex items-center gap-2'>
                <span>Submit Application</span>
                <PiPaperPlaneRight className='text-xl' />
              </span>
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
