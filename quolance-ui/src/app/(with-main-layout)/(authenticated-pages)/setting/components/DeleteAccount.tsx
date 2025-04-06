// components/DeleteAccount.tsx
'use client';

import { useState } from 'react';
import DeleteAccountModal from './DeleteAccountModal';
import { useDeleteAccount } from '@/api/user-api';

export default function DeleteAccount() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: deleteAccount } = useDeleteAccount();

  const handleConfirmDelete = () => {
    deleteAccount();
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base/7 font-semibold">Delete account</h2>
          <p className="mt-1 text-sm/6 text-gray-400">
            No longer want to use our service? You can delete your account here. This action is not reversible.
            All information related to this account will be deleted permanently.
          </p>
        </div>

        <div className="flex items-start md:col-span-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-900"
          >
            Yes, Delete My Account
          </button>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
