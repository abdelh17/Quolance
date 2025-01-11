'use client';

import React, { useState, useRef, useEffect } from 'react';

interface CreatePostModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    onSubmit: () => void;
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
            <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-4xl h-[60%] max-h-[60%] overflow-hidden">
                    {/* Close Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={closeDialog}
                            className="text-gray-500 text-2xl"
                        >
                            ✖
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="overflow-auto h-full space-y-4">
                        {children}
                    </div>
                </div>
            </div>
        </dialog>
    ) : null;
};

export default CreatePostModal;
