'use client';

import {useAuthGuard} from '@/api/auth-api';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useCancelApplication, useGetProjectApplication, useSubmitApplication,} from '@/api/freelancer-api';
import {Button} from '@/components/ui/button';
import {PiPaperPlaneRight} from 'react-icons/pi';
import {useState} from 'react';
import {IoMdLock} from 'react-icons/io';
import {ProjectStatus} from '@/constants/types/project-types';
import {Sparkles} from 'lucide-react';
import {useGenerateApplicationLetter} from '@/api/textGeneration-api';

type ApplicationFormProps = {
  projectId: string;
  projectStatus: string;
};

type ApplicationFormFields = {
  motivationalLetter: string;
};

export default function FreelancerApplicationForm({
  projectId,
  projectStatus,
}: ApplicationFormProps) {
  const { register, handleSubmit, watch, setValue } =
    useForm<ApplicationFormFields>();
  const { user } = useAuthGuard({ middleware: 'auth' });

  const { mutate: submitApplication } = useSubmitApplication(projectId);
  const { mutate: cancelApplication } = useCancelApplication(projectId);
  const { data: application } = useGetProjectApplication(projectId);
  const applicationLetterMutation = useGenerateApplicationLetter();

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const mergedMutation = {
    mutate: (
      prompt: string,
      options?: { onSuccess?: (response: string) => void }
    ) => applicationLetterMutation.mutate({ projectId, prompt }, options),
    isLoading: applicationLetterMutation.isLoading,
  };

  const onSubmit: SubmitHandler<ApplicationFormFields> = async (formData) => {
    if (!user) return;
    submitApplication(formData.motivationalLetter);
  };

  const wordCount = watch('motivationalLetter')?.split(/\s+/).length || 0;
  const maxWords = 500;

  const handleApplyAiText = (aiText: string) => {
    setValue('motivationalLetter', aiText);
  };

  if (projectStatus === ProjectStatus.CLOSED && !application) {
    return <ProjectClosedCannotApply />;
  }

  return (
      <section className='py-8'>
        <div>
          <h2 className='heading-2 pb-2'>
            {application ? 'Your Application' : 'Submit Application'}
          </h2>

          {!application && (
              <>
                <p className='text-n300 pb-6 font-medium'>
                  Tell us why you're perfect for this project
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                  <div>
                    <label htmlFor='motivationalLetter' className='text-n700 mb-2 block text-sm font-medium'>
                      Motivational Letter
                    </label>
                    <div className='relative'>
                  <textarea
                      id='motivationalLetter'
                      {...register('motivationalLetter')}
                      rows={12}
                      className='bg-n10 w-full resize-none rounded-lg px-4 py-3 text-base outline-none'
                      placeholder="Introduce yourself and explain why you're a great fit for this project..."
                  />
                      <button
                          type='button'
                          onClick={() => setIsAiModalOpen(true)}
                          className='absolute right-2 top-2 flex items-center justify-center rounded-full bg-indigo-600 p-2 text-white shadow-md'
                      >
                        <Sparkles className='h-5 w-5' />
                      </button>
                    </div>
                    <div className='mt-2 flex justify-between text-sm'>
                      <p className='text-n300'>Include relevant experience and skills.</p>
                      <p className={`${wordCount > maxWords ? 'text-red-500' : 'text-n300'}`}>{wordCount}/{maxWords} words</p>
                    </div>
                  </div>

                  <div className='mt-6 flex items-center'>
                    <input
                        type='checkbox'
                        id='termsCheckbox'
                        className='h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                        checked={isChecked}
                        onChange={() => setIsChecked(!isChecked)}
                    />
                    <label htmlFor='termsCheckbox' className='ml-2 text-sm text-gray-700'>
                      By submitting this application, I confirm that I have read and agree to the
                      <a href='/support/terms-of-service' className='text-blue-600 underline ml-1' target='_blank'>
                        Terms of Service
                      </a>{' '}
                      and acknowledge that Quolance is not liable for any disputes or outcomes related to this application.
                    </label>
                  </div>

                  <div className='flex items-center justify-end gap-3'>
                    <Button
                        type='submit'
                        disabled={!isChecked || wordCount > maxWords}
                        shape='full'
                        animation='default'
                        bgColor={isChecked ? 'n700' : 'gray-400'}
                        icon={<PiPaperPlaneRight className='text-xl' />}
                        iconPosition='right'
                        className={!isChecked ? 'cursor-not-allowed' : ''}
                    >
                      Submit Application
                    </Button>
                  </div>
                </form>
              </>
          )}
        </div>
      </section>
  );
}
export const ProjectClosedCannotApply = () => (
  <section className='py-8'>
    <div>
      <h2 className='heading-2 pb-4'>
        <span className='text-n700'>Submit Application</span>
      </h2>
    </div>
    <div className='border-n40 rounded-2xl border border-dashed bg-white shadow-sm'>
      <div className='flex flex-col items-center justify-center px-4 py-16'>
        <div className='bg-r50 mb-6 rounded-full p-6'>
          <IoMdLock className='h-12 w-12 text-red-600' />
        </div>
        <h3 className='text-n700 mb-2 text-xl font-semibold'>
          Project No Longer Accepting Applications
        </h3>
        <p className='text-n400 max-w-md text-center'>
          This project has closed its application window. Check out other
          available projects that match your skills.
        </p>
      </div>
    </div>
  </section>
);