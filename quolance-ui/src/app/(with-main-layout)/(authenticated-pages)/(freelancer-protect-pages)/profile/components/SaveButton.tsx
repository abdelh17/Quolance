import React from 'react';
import { Button } from '@/components/ui/button';

interface SaveButtonProps {
  editModeKey: string;
  handleSave: (editMode: string) => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ editModeKey, handleSave }) => {
  const handleClick = () => {
    handleSave(editModeKey);
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
