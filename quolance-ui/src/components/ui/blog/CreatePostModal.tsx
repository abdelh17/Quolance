'use client';

import React, { useState, useRef, useEffect } from 'react';

interface CreatePostModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const CreatePostModal: React.FC<CreatePostModalProps> = ({ open, onClose, children }) => {
    const dialogRef = useRef<null | HTMLDialogElement>(null);

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

    return open ? (
        <dialog ref={dialogRef} className="dialog">
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[100vh] overflow-auto p-4 relative">
                    {/* Close Button */}
                    <button
                        onClick={closeDialog}
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-700"
                    >
                        ✖
                    </button>

                    {/* Content Area */}
                    <div className="overflow-y-auto max-h-[70vh]">
                        {children}
                    </div>
                </div>
            </div>
        </dialog>
    ) : null;
};

export default CreatePostModal;
