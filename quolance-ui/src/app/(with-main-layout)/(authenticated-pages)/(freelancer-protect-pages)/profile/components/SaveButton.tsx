import React from 'react';
import { Button } from '@/components/ui/button';
import {
 FreelancerProfileType,
} from '@/models/user/UserResponse';


interface SaveButtonProps {
 editModeKey: string;
 handleSave: (editMode: string, updatedProfile?: Partial<FreelancerProfileType>) => void;
 updatedProfile?: Partial<FreelancerProfileType>; // <-- optional prop
}




const SaveButton: React.FC<SaveButtonProps> = ({ editModeKey, handleSave, updatedProfile }) => {
 const handleClick = () => {
   handleSave(editModeKey, updatedProfile);
 };


 return (
   <div className='flex justify-end'>
     <Button
       variant='default'
       animation='default'
       size='sm'
       onClick={handleClick}
       className='px-6'
     >
       Save
     </Button>
   </div>
 );
};




export default SaveButton;
