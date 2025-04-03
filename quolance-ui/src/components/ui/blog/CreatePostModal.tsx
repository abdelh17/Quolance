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
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl w-[90vw] md:w-[600px] lg:w-[720px] xl:w-[800px] max-h-[95vh] relative">
                
                {/* Close Button */}
                <button
                    onClick={closeDialog}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:text-white hover:bg-red-600 flex items-center justify-center z-10"
                >
                    ✕
                </button>
        
                {/* Content Area */}
                <div className="overflow-y-auto max-h-[95vh] p-6 pr-8">
                    {children}
                </div>
                </div>
            </div>
        </dialog>
    ) : null;
};

export default CreatePostModal;
