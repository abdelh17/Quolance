import React from "react";
import { Button } from "@/components/ui/button";


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
    <Button  onClick={handleClick}>
      Save
    </Button>
   </div>
 );
};


export default SaveButton;
