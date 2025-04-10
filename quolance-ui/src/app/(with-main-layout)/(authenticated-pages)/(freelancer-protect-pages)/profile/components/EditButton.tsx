import React from "react";
import { Pencil } from "lucide-react";


interface EditButtonProps {
  editModeKey: string;
  updateEditModes: (editMode: string) => void;
  checkEditModes: (editMode: string) => boolean;
  dataTest?: string;
}


const EditButton: React.FC<EditButtonProps> = ({ editModeKey, updateEditModes, checkEditModes, dataTest }) => {
  const handleClick = () => {
    updateEditModes(editModeKey);
  };


  const checkModes = checkEditModes(editModeKey);


  return (
    <button
      disabled={checkModes}
      className={`rounded-3xl h-10 w-10 flex justify-center items-center ${checkModes ? "cursor-not-allowed" : "hover:bg-gray-100"
        }`}
      onClick={handleClick}
      data-test={dataTest}
    >
      <Pencil className={`text-gray-500`} />
    </button>
  );
};


export default EditButton;
