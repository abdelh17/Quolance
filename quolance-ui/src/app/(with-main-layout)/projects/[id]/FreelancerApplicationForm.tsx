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
import { IoMdLock } from 'react-icons/io';
import { ProjectStatus } from '@/constants/types/project-types';
import ApplicationStatusBadge from '@/components/ui/applications/ApplicationStatusBadge';

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
  const { register, handleSubmit, watch } = useForm<ApplicationFormFields>();
  const { user } = useAuthGuard({ middleware: 'auth' });
  const { mutate: submitApplication } = useSubmitApplication(projectId);
  const { mutate: cancelApplication } = useCancelApplication(projectId);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: application } = useGetProjectApplication(projectId);

  const onSubmit: SubmitHandler<ApplicationFormFields> = async (formData) => {
    if (!user) return;
    submitApplication(formData.motivationalLetter);
  };

  if (projectStatus === ProjectStatus.CLOSED && !application) {
    return <ProjectClosedCannotApply />;
  }

  // Calculate word count
  const wordCount = watch('motivationalLetter')?.split(/\s+/).length || 0;
  const maxWords = 500;

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
          </>
        )}
        {application && (
          <div className='space-y-6'>
            {projectStatus === ProjectStatus.CLOSED && (
              <div className='bg-r50 mt-5 flex items-center gap-2 rounded-lg p-4 text-red-700'>
                <IoMdLock className='text-lg' />
                <p className='text-sm font-medium'>
                  This project is no longer accepting new applications. You can
                  still view your existing application details below.
                </p>
              </div>
            )}
            <div className='border-n30 rounded-lg border bg-white'>
              {/* Status Badge Section */}
              <div className='border-n30 border-b px-6 py-4'>
                <ApplicationStatusBadge status={application.status} />
              </div>

              {/* Application Content */}
              <div className='space-y-7 px-6 py-6'>
                <div>
                  <h3 className='text-n700 mb-2 text-sm font-medium'>
                    Your Application
                  </h3>
                  <p className='text-n300 text-base'>{application.message}</p>
                </div>

                {/* Metadata */}
                <div className='text-n300 text-sm'>
                  <p>Application ID: #{application.id}</p>
                  <p>
                    Submitted on: {application.creationDate.toLocaleString()}
                  </p>
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
                    className={`${
                      projectStatus === ProjectStatus.CLOSED && 'invisible'
                    }`}
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

export const ProjectClosedCannotApply = () => (
  <section className='py-8'>
    <div>
      <h2 className='heading-2 pb-4'>
        <span className='text-n700'>Submit Application</span>
      </h2>
    </div>
    <div className='border-n40 rounded-2xl border-2 border-dashed bg-white shadow-sm'>
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
