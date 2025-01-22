import React, { useState } from "react";


interface ConfirmationModalProps {
 onSelect: (file: File) => void;
 onCancel: () => void;
}


export const ProfileImageModal: React.FC<ConfirmationModalProps> = ({
 onSelect,
 onCancel,
}) => {
 const [file, setFile] = useState<File | null>(null);
 const [previewUrl, setPreviewUrl] = useState<string | null>(null);
 const [error, setError] = useState<string>("");


 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const selectedFile = e.target.files?.[0];
   if (selectedFile) {
     const fileType = selectedFile.type;
     if (fileType === "image/jpeg" || fileType === "image/png") {
       setFile(selectedFile);
       setError("");

       const url = URL.createObjectURL(selectedFile);
       setPreviewUrl(url);
     } else {
       setError("Please upload a valid JPG or PNG file.");
       setFile(null);
       setPreviewUrl(null); 
     }
   }
 };


 const handleConfirm = () => {
   if (file) {
     onSelect(file);
   }
 };


 return (
   <dialog
 className="relative z-10"
 aria-labelledby="modal-title"
 open
 aria-modal="true"
>
 <div
   className="fixed inset-0 bg-gray-500/75 transition-opacity"
   aria-hidden="true"
   onClick={onCancel}
 ></div>
 <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
   <div
     className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
     style={{ marginTop: "-250px" }}
   >
     <div
       className="relative w-full max-w-md sm:max-w-lg transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8"
     >
       <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
         <div className="sm:flex sm:items-start sm:justify-between">
           
           <div className="text-center sm:text-left">
             <h3
               className="text-base font-semibold text-gray-900"
               id="modal-title"
             >
               Select Profile Image
             </h3>
             <div className="mt-2">
               <label
                 htmlFor="file-input"
                 className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2 text-center hover:bg-gray-100"
               >
                 Select Image
               </label>
               <input
                 id="file-input"
                 type="file"
                 accept=".jpg,.png"
                 onChange={handleFileChange}
                 className="hidden"
               />
               {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
             </div>
           </div>


           
           {previewUrl && (
             <div className="mt-4 sm:mt-0 flex justify-center">
               <img
                 src={previewUrl}
                 alt="Preview"
                 className="w-48 h-48 rounded-lg object-cover"
               />
             </div>
           )}
         </div>
       </div>
       <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
         <button
           type="button"
           onClick={handleConfirm}
           disabled={!file}
           className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${
             file
               ? "bg-green-600 hover:bg-green-500"
               : "bg-gray-400 cursor-not-allowed"
           }`}
         >
           Select
         </button>
         <button
           type="button"
           onClick={onCancel}
           className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
         >
           Cancel
         </button>
       </div>
     </div>
   </div>
 </div>
</dialog>


 );
};


