import React, { useState, useEffect} from "react";
import { User, Camera ,Save, X } from "lucide-react";


interface ConfirmationModalProps {
userProfileImage: string | undefined;
onSelect: (file: File) => void;
onCancel: () => void;
}

export const ProfileImageModal: React.FC<ConfirmationModalProps> = ({
userProfileImage,
onSelect,
onCancel,
}) => {
const [file, setFile] = useState<File | null>(null);
const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
const [error, setError] = useState<string>("");


useEffect(() => {
setPreviewUrl(userProfileImage);
}, [userProfileImage]);



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
   className="flex min-h-full items-end justify-center p-4 text-center sm:items-center profileModal"
   style={{ marginTop: "-150px" }}
 >
   <div
     className="relative w-full max-w-2xl  transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8"
   >
     <div className="px-3 py-5">
       <div className="flex items-center justify-between">
       
         <div className="text-md">
            Profile Image
         </div>
         <div className="">
          <button
          type="button"
          onClick={onCancel}
          className=" rounded-full px-2 py-2  hover:bg-gray-100 "
        >
          <X/>
        </button>
         </div>
     
       </div>
     </div>
     <div className="mx-auto my-8 rounded-full w-60 h-60 bg-blue-400 flex justify-center items-center ">
         { previewUrl ? (
              
                  <img
                    src={previewUrl}
                    alt="Profile Image"
                    className="w-full h-full rounded-full border border-gray-700"
                  />
              ) : (
              
                  <User className="w-24 h-24 text-white" />
           
     
              )}
    
    </div>




     <div className=" border-t border-gray-200 px-4 py-3 flex items-center justify-between ">
     <label
               htmlFor="file-input"
               className="block  text-sm text-gray-900  rounded-lg cursor-pointer  p-2 text-center hover:bg-gray-100"
             >
               <Camera className = "mx-auto"/>
               Select Image
            
             </label>
           




             <input
               id="file-input"
               type="file"
               accept=".jpg,.png"
               onChange={handleFileChange}
               className="hidden"
             />
       <button
         type="button"
         onClick={handleConfirm}
         disabled={!file}
         className={` rounded-md px-3 py-2 text-sm  sm:ml-3 sm:w-auto ${
           file
             ? " hover:bg-gray-100"
             : " cursor-not-allowed"
         }`}
       >
        <Save className = "mx-auto"/>
         Save Image
       </button>
   
     </div>
   </div>
 </div>
</div>
</dialog>


);
};


