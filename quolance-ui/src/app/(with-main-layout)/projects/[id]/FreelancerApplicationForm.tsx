'use client';
import { useAuthGuard } from '@/api/auth-api';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  useCancelApplication,
  useGetProjectApplication,
  useSubmitApplication,
} from '@/api/freelancer-api';
import { Button } from '@/components/ui/button';
import { PiPaperPlaneRight, PiX } from 'react-icons/pi';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import {
  formatStatusLabel,
  StatusColors,
} from '@/components/ui/freelancers/FreelancerCard';

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
  const { mutate: submitApplication } = useSubmitApplication(projectId);
  const { mutate: cancelApplication } = useCancelApplication(projectId);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: application } = useGetProjectApplication(projectId);

  const onSubmit: SubmitHandler<ApplicationFormFields> = async (data) => {
    if (!user) return;
    submitApplication(projectId);
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
        {!application && (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Motivational Letter Section */}
            <div>
              <label
                htmlFor='motivationalLetter'
                className='text-n700 mb-2 block text-sm font-medium'
              >
                Motivational Letter
              </label>
              <textarea
                id='motivationalLetter'
                {...register('motivationalLetter')}
                rows={12}
                className='bg-n10 focus:bg-n20 focus:ring-n100 w-full resize-none rounded-lg px-4 py-3 text-base outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:ring-2'
                placeholder="Introduce yourself and explain why you're a great fit for this project..."
              />
              <div className='mt-2 flex justify-between text-sm'>
                <p className='text-n300'>
                  Be sure to include your relevant experience, skills, and why
                  you are interested in this project.
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
                shape='full'
                animation='default'
                bgColor='n700'
                icon={<PiPaperPlaneRight className='text-xl' />}
                iconPosition='right'
                size='default'
              >
                Submit Application
              </Button>
            </div>
          </form>
        )}
        {application && (
          <div className='space-y-6'>
            <div className='border-n30 rounded-lg border bg-white'>
              {/* Status Badge Section */}
              <div className='border-n30 border-b px-6 py-4'>
                <div
                  className={`w-fit rounded-full px-3.5 py-1.5 text-sm font-semibold 
                    ${StatusColors[application.status].badge}
                  `}
                >
                  {formatStatusLabel(application.status)}
                </div>
              </div>

              {/* Application Content */}
              <div className='space-y-7 px-6 py-6'>
                <div>
                  <h3 className='text-n700 mb-2 text-sm font-medium'>
                    Your Application
                  </h3>
                  <p className='text-n300 text-base'>
                    No message provided yet. This feature will be available
                    soon.
                  </p>
                </div>

                {/* Metadata */}
                <div className='text-n300 text-sm'>
                  <p>Application ID: #{application.id}</p>
                  <p>Submitted on: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Footer Action Section */}
              <div className='border-n30 border-t bg-gray-50/50 px-6 py-4'>
                <div className='flex justify-end'>
                  <Button
                    onClick={() => setIsDeleteModalOpen(true)}
                    shape='full'
                    animation='default'
                    bgColor='red-600'
                    icon={<PiX className='text-xl' />}
                    iconPosition='left'
                  >
                    Withdraw Application
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title='Withdraw Application'
        icon={<PiX />}
        iconColor='text-red-600'
        confirmText='Withdraw Application'
        confirmButtonColor='bg-red-600'
        onConfirm={() => {
          if (application) {
            cancelApplication(application.id);
            setIsDeleteModalOpen(false);
          }
        }}
      >
        <p className='text-n300 text-lg'>
          Are you sure you want to withdraw your application? This action:
        </p>
        <ul className='text-n300 mt-4 list-disc pl-6'>
          <li>Cannot be undone</li>
          <li>Will remove your application from consideration</li>
          <li>Will allow you to apply again if you change your mind</li>
        </ul>
      </Modal>
    </section>
  );
}
