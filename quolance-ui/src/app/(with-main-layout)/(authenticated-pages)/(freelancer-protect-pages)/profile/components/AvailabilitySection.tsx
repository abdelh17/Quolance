import React from 'react';
import { CalendarDaysIcon } from 'lucide-react';
import {
  EditModesType,
  FreelancerProfileType,
} from '@/models/user/UserResponse';
import { AvailabilityRadioGroup } from '@/components/ui/freelancers/FreelancerProfileRadioGroups';
import EditButton from './EditButton';
import SaveButton from './SaveButton';

interface AvailabilitySectionProps {
  profile: {
    availability?: string | null;
  };
  handleInputChange: (
    field: keyof FreelancerProfileType,
    value: string
  ) => void;
  updateEditModes: (value: string) => void;
  editModes: EditModesType;
  handleSave: (value: string) => void;
  checkEditModes: (value: string) => boolean;
}

const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({
  profile,
  handleInputChange,
  updateEditModes,
  editModes,
  handleSave,
  checkEditModes,
}) => (
  <section className='mb-8 rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md'>
    <div className='mb-4 flex justify-between'>
      <h2 className='self-center text-xl  font-semibold text-gray-800'>
        Availability
      </h2>
      {!editModes.editAvailability ? (
        <EditButton
          editModeKey='editAvailability'
          updateEditModes={updateEditModes}
          checkEditModes={checkEditModes}
        />
      ) : null}
    </div>

    <div className=''>
      {editModes.editAvailability ? (
        <div>
          <div className='flex items-center'>
            <CalendarDaysIcon className=' mr-3' />
            <AvailabilityRadioGroup
              name='availability'
              value={profile.availability ?? ''} // Default to empty string if null or undefined
              onChange={(e) =>
                handleInputChange('availability', e.target.value)
              }
            />
          </div>
          <div className='mt-4'>
            <SaveButton
              editModeKey='editAvailability'
              handleSave={handleSave}
            />
          </div>
        </div>
      ) : (
        <div className='flex items-center'>
          <CalendarDaysIcon className=' mr-3' />
          <span className='capitalize text-gray-700'>
            {profile.availability?.toLowerCase().replace('_', ' ') ??
              'Not specified'}
          </span>
        </div>
      )}
    </div>
  </section>
);

export default AvailabilitySection;
