import React, { SetStateAction } from 'react';
import { PiHandshake, PiX } from 'react-icons/pi';

interface ApprovalModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
  freelancerName: string;
}

function ApprovalConfirmationModal({
  isOpen,
  setIsOpen,
  onConfirm,
  freelancerName,
}: ApprovalModalProps) {
  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <>
      <section
        className={`fixed left-0 right-0 top-0 z-[999] flex h-auto items-center justify-center overflow-y-auto delay-[30ms] duration-700 ease-out ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className='mx-3 my-20 max-w-[500px] rounded-2xl bg-white p-8 drop-shadow-2xl'>
          <div className='flex items-center justify-between gap-3'>
            <div className='flex items-center gap-3'>
              <PiHandshake className='text-3xl text-green-600' />
              <p className='text-xl font-medium'>Approve Submission</p>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <PiX className='text-2xl' />
            </button>
          </div>

          <div className='py-6'>
            <p className='text-n300 text-lg'>
              Are you sure you want to approve <b>{freelancerName}</b>{' '}
              submission? This action will:
            </p>
            <ul className='text-n300 mt-4 list-disc pl-6'>
              <li>Initialize the contract with the freelancer</li>
              <li>Send a notification to the freelancer</li>
              <li>Allow the project to move to the next phase</li>
            </ul>
          </div>

          <div className='flex items-end justify-end gap-4'>
            <button
              onClick={() => setIsOpen(false)}
              className='bg-n30 hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full px-6 py-2 font-medium duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-gray-200 after:duration-700 hover:after:w-[calc(100%+2px)]'
            >
              <span className='relative z-10'>Cancel</span>
            </button>
            <button
              onClick={handleConfirm}
              className='hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full bg-green-600 px-6 py-2 font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
            >
              <span className='relative z-10'>Confirm Approval</span>
            </button>
          </div>
        </div>
      </section>

      <div
        className={`bg-b50/60 fixed inset-0 z-[998] duration-700 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full'
        }`}
      />
    </>
  );
}

export default ApprovalConfirmationModal;
