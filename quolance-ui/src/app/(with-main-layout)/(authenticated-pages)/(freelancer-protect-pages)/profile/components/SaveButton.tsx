import React from "react";


interface SaveButtonProps {
 editModeKey: string;
 handleSave: (editMode: string) => void;
}


const SaveButton: React.FC<SaveButtonProps> = ({ editModeKey, handleSave }) => {
 const handleClick = () => {
   handleSave(editModeKey); // Call the function to update the edit mode
 };


 return (
   <div className="flex justify-end">
     <button
       className="bg-blue-500 text-white text-xs px-4 py-2 rounded-md hover:bg-blue-600 max-h-max"
       onClick={handleClick}
     >
       Save
     </button>
   </div>
 );
};


export default SaveButton;
