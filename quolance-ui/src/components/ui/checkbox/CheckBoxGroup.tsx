import React, { useState } from 'react';
import { expertiseNeeded } from '@/data/data';
import { CheckboxGroup } from '@nextui-org/react';
import { CustomCheckbox } from './CustomCheckbox';

export default function CheckBoxGroup() {
  const [groupSelected, setGroupSelected] = useState<string[]>([]);

  return (
    <>
      <CheckboxGroup
        className='gap-1'
        orientation='horizontal'
        value={groupSelected}
        onChange={setGroupSelected}
      >
        {expertiseNeeded.map((expertise, index) => (
          <CustomCheckbox key={index} value={expertise}>
            {expertise}
          </CustomCheckbox>
        ))}
      </CheckboxGroup>
      <p className='text-default-500 ml-1 mt-4'>
        Selected: {groupSelected.join(', ')}
      </p>
    </>
  );
}
