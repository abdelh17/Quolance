'use client';
import React, { useState } from 'react';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import RichTextEditor from '@/components/ui/RichTextEditor';

interface Project {
  id: string;
  title: string;
  description: string;
  expirationDate: string;
  visibilityExpirationDate: string | null;
  category: string;
  priceRange: string;
  experienceLevel: string;
  expectedDeliveryTime: string;
  projectStatus: string;
  tags?: string[];
  clientId: string;
  selectedFreelancerId: string | null;
  applications: any[];
}

interface ProjectDetailsProps {
  project: Project | null;
  status: string;
  onStatusChange: (status: string) => void;
  onSubmit: (reason?: string) => void;
}

const statuses = [
  { id: 'approved', name: 'Approved' },
  { id: 'rejected', name: 'Rejected' },
];

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  status,
  onStatusChange,
  onSubmit,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(
    statuses.find((s) => s.id === status) || statuses[0]
  );
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const handleStatusChange = (status: { id: string; name: string }) => {
    setSelectedStatus(status);
    onStatusChange(status.id);

    if (status.id === 'rejected') {
      setIsSubmitDisabled(true);
    } else {
      setIsSubmitDisabled(false);
    }
  };

  const handleReasonChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setRejectionReason(value);
    setIsSubmitDisabled(value.trim().length === 0);
  };

  const handleSubmit = () => {
    if (selectedStatus.id === 'rejected') {
      onSubmit(rejectionReason);
    } else {
      onSubmit();
    }
  };

  return (
    <>
      <div className='mx-auto max-w-screen-2xl p-4'>
        <div className='grid px-4'>
          <div>
            <h2 className='mt-20 text-3xl font-bold text-gray-900'>
              {project?.title || 'Project Title'}
            </h2>
            <p className='mt-4 text-gray-600'>
              {project?.description ? (
                <RichTextEditor
                  value={project.description}
                  readOnly={true}
                  name=''
                />
              ) : (
                'No description provided'
              )}
            </p>

            <dl className='mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8'>
              <div className='border-t border-gray-300 pt-4'>
                <dt className='font-medium text-gray-900'>Expiration Date</dt>
                <dd className='mt-2 text-sm text-gray-500'>
                  {project?.expirationDate || 'N/A'}
                </dd>
              </div>
              <div className='border-t border-gray-300 pt-4'>
                <dt className='font-medium text-gray-900'>
                  Visibility Expiration Date
                </dt>
                <dd className='mt-2 text-sm text-gray-500'>
                  {project?.visibilityExpirationDate || 'N/A'}
                </dd>
              </div>
              <div className='border-t border-gray-300 pt-4'>
                <dt className='font-medium text-gray-900'>Category</dt>
                <dd className='mt-2 text-sm text-gray-500'>
                  {project?.category || 'N/A'}
                </dd>
              </div>
              <div className='border-t border-gray-300 pt-4'>
                <dt className='font-medium text-gray-900'>Price Range</dt>
                <dd className='mt-2 text-sm text-gray-500'>
                  {project?.priceRange || 'N/A'}
                </dd>
              </div>
              <div className='border-t border-gray-300 pt-4'>
                <dt className='font-medium text-gray-900'>Experience Level</dt>
                <dd className='mt-2 text-sm text-gray-500'>
                  {project?.experienceLevel || 'N/A'}
                </dd>
              </div>
              <div className='border-t border-gray-300 pt-4'>
                <dt className='font-medium text-gray-900'>
                  Expected Delivery Time
                </dt>
                <dd className='mt-2 text-sm text-gray-500'>
                  {project?.expectedDeliveryTime || 'N/A'}
                </dd>
              </div>
              <div className='border-t border-gray-300 pt-4'>
                <dt className='font-medium text-gray-900'>Project Status</dt>
                <dd className='mt-2 text-sm capitalize text-gray-500'>
                  {project?.projectStatus || 'N/A'}
                </dd>
              </div>
              <div className='border-t border-gray-300 pt-4'>
                <dt className='font-medium text-gray-900'>Client ID</dt>
                <dd className='mt-2 text-sm text-gray-500'>
                  {project?.clientId || 'N/A'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-screen-2xl p-4'>
        <h2 className='p-4 text-3xl font-bold text-gray-900'>Change Status</h2>

        <div className='mb-20 flex flex-col gap-6 p-4'>
          <div>
            <Listbox value={selectedStatus} onChange={handleStatusChange}>
              <div className='relative'>
                <ListboxButton
                  className='flex w-full items-center justify-between rounded-xl border border-gray-300 p-2 lg:w-96'
                  data-test='status-dropdown'
                >
                  {selectedStatus.name}
                  <ChevronDownIcon
                    aria-hidden='true'
                    className='h-5 w-5 text-gray-500'
                  />
                </ListboxButton>
                <ListboxOptions
                  className='absolute z-10 mt-1 w-full rounded border bg-white shadow-md lg:w-96'
                  data-test='status-options'
                >
                  {statuses.map((statusOption) => (
                    <ListboxOption
                      key={statusOption.id}
                      value={statusOption}
                      className={({ active }: { active: boolean }) =>
                        `cursor-pointer select-none px-4 py-2 ${
                          active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                        }`
                      }
                      data-test={`status-option-${statusOption.name}`}
                    >
                      {statusOption.name}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          </div>

          {selectedStatus.id === 'rejected' && (
            <div>
              <h3 className='mb-2 font-medium text-gray-900'>
                Reason for Rejection
              </h3>
              <textarea
                value={rejectionReason}
                onChange={handleReasonChange}
                className='w-full rounded-xl border border-gray-300 p-4'
                rows={5}
                data-test='rejection-reason-input'
              />
            </div>
          )}

          <div className='flex justify-end '>
            <button
              onClick={handleSubmit}
              className={`w-full rounded-xl border px-3 py-2 text-white lg:w-48 ${
                isSubmitDisabled
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-blue-500 hover:bg-yellow-500'
              }`}
              disabled={isSubmitDisabled}
              data-test='submit-project-btn'
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
