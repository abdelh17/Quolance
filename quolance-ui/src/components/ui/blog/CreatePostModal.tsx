'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuthGuard } from '@/api/auth-api';

interface CreatePostModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    onSubmit: () => void;
};

const CreatePostModal: React.FC<CreatePostModalProps> = ({ open, onClose, children, onSubmit }) => {

    const dialogRef = useRef<null | HTMLDialogElement>(null);
    const { user } = useAuthGuard({ middleware: 'auth' }); // Get the authenticated user
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    useEffect(() => {
        if (open) {
            dialogRef.current?.show();
        } else {
            dialogRef.current?.close();
        }
    }, [open]);

    const closeDialog = () => {
        dialogRef.current?.close();
        onClose();
    };

    const clickOk = () => {
        onSubmit();
        closeDialog();
    };

    const dialog: JSX.Element | null = open ? (
        <dialog ref={dialogRef} className="dialog">
            <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-md w-3/5 h-3/5 max-w-4xl max-h-screen">
                    <div className="flex justify-end">
                        <button
                            onClick={closeDialog}
                            className="text-gray-500 text-2xl"
                        >
                            ✖
                        </button>
                    </div>
                    <div className="space-y-4 overflow-auto h-full">
                        {children}
                    </div>
                </div>
            </div>
        </dialog>
    ) : null;
    

    return dialog;
};

export default CreatePostModal;