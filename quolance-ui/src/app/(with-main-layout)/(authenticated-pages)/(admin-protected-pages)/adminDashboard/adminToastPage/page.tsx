
"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminToastPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "Loading...";
  const successMessage = searchParams.get("successMessage") || "Action completed successfully!";

  useEffect(() => {
    const toastId = toast.info(<LoadingToast message={message} />, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      hideProgressBar: true,
      style: { 
        marginTop: '300px',
        width: '400px',
        padding: '20px',
        fontSize: '18px'
      },
    });

    setTimeout(() => {
      toast.update(toastId, {
        render: successMessage,
        type: "success",
        isLoading: false,
        autoClose: 1000,
        onClose: () => router.push('/adminDashboard'),
      });
    }, 1000);
  }, [router, message, successMessage]);

  return (
    <>
      <ToastContainer />
    </>
  );
}

const LoadingToast = ({ message }: { message: string }) => (
  <div className="flex items-center">
    <FaSpinner className="animate-spin mr-2 text-blue-500" />
    <span>{message}</span>
  </div>
);

