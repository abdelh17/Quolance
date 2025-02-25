import React from 'react';
import { Contact, MapPin, User } from 'lucide-react';
import { ProfileImageModal } from './ProfileImageModal';
import {
  EditModesType,
  FreelancerProfileType,
  UserResponse,
} from '@/constants/models/user/UserResponse';
import EditButton from './EditButton';
import SaveButton from './SaveButton';

interface ProfileHeaderProps {
  user: UserResponse | undefined;
  profile: FreelancerProfileType;
  isImageError: boolean;
  isModalOpen: boolean;
  setIsImageError: (value: boolean) => void;
  handleImageClick: () => void;
  handleSelect: (file: File) => void;
  handleCancel: () => void;
  handleInputChange: (
    field: keyof FreelancerProfileType,
    value: string
  ) => void;
  inputClassName: string;
  updateEditModes: (value: string) => void;
  editModes: EditModesType;
  handleSave: (value: string) => void;
  checkEditModes: (value: string) => boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  profile,
  isImageError,
  isModalOpen,
  setIsImageError,
  handleImageClick,
  handleSelect,
  handleCancel,
  handleInputChange,
  inputClassName,
  updateEditModes,
  editModes,
  handleSave,
  checkEditModes,
}) => {
  const checkModes = checkEditModes('editProfileImage');
  return (
    <section className='relative mb-8 rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md'>
      <div className='relative h-48 rounded-t-xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 '></div>
      <div className='mr-4 mt-4 flex justify-end'>
        {!editModes.editHeader ? (
          <EditButton
            editModeKey='editHeader'
            updateEditModes={updateEditModes}
            checkEditModes={checkEditModes}
          />
        ) : null}
      </div>
      {/* Profile Image Button */}
      <div className='absolute left-6 top-[110px]'>
        {!isImageError && user?.profileImageUrl ? (
          <button
            type='button'
            disabled={checkModes}
            className={`h-32 w-32 rounded-full shadow-lg
         ${checkModes ? 'cursor-not-allowed' : 'hover:bg-gray-900'}`}
            onClick={!editModes.editProfileImage ? handleImageClick : undefined}
            onKeyDown={(e) => {
              if (
                !editModes.editProfileImage &&
                (e.key === 'Enter' || e.key === ' ')
              ) {
                handleImageClick();
              }
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <img
              src={user.profileImageUrl}
              alt='Profile Image'
              className='h-full w-full rounded-full object-cover'
              onError={() => setIsImageError(true)}
            />
          </button>
        ) : (
          <button
            type='button'
            disabled={checkModes}
            className={`flex h-32 w-32 items-center justify-center rounded-full bg-blue-400 text-4xl text-white shadow-lg
         ${checkModes ? 'cursor-not-allowed' : ''}`}
            onClick={!editModes.editProfileImage ? handleImageClick : undefined}
            onKeyDown={(e) => {
              if (
                !editModes.editProfileImage &&
                (e.key === 'Enter' || e.key === ' ')
              ) {
                handleImageClick();
              }
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <User className='h-14 w-14' />
          </button>
        )}
      </div>

      {/* Modal for Image Upload */}
      {isModalOpen && (
        <ProfileImageModal
          userProfileImage={user?.profileImageUrl}
          handleSave={handleSave}
          onSelect={handleSelect}
          onCancel={handleCancel}
        />
      )}

      {/* Profile Content */}
      <div className='p-6'>
        {editModes.editHeader ? (
          <div className='mt-12'>
            <h2 className='mb-4 text-xl font-semibold text-gray-800'>Name</h2>
            {/* First Name and Last Name Inputs */}
            <div className='flex gap-2'>
              <input
                type='text'
                value={profile.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`text-sm placeholder:text-sm ${inputClassName}`}
                placeholder='Enter First Name'
              />
              <input
                type='text'
                value={profile.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`text-sm placeholder:text-sm ${inputClassName}`}
                placeholder='Enter Last Name'
              />
            </div>

            <h2 className='mt-8 text-xl font-semibold text-gray-800'>
              Location
            </h2>

            {/* City and State Inputs */}
            <div className='mt-4 flex items-center gap-2'>
              <input
                type='text'
                value={profile.city ?? ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`text-sm placeholder:text-sm ${inputClassName}`}
                placeholder='Enter City'
              />
              <input
                type='text'
                value={profile.state ?? ''}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className={`text-sm placeholder:text-sm ${inputClassName}`}
                placeholder='Enter State'
              />
            </div>
            <div className='mt-4'>
              <SaveButton editModeKey='editHeader' handleSave={handleSave} />
            </div>
          </div>
        ) : (
          <div>
            {/* Name Display */}
            <div className='-mt-4'>
              {profile.firstName && profile.lastName ? (
                <h2 className='text-md font-bold transition-all duration-300 md:text-2xl'>
                  {`${profile.firstName} ${profile.lastName}`}
                </h2>
              ) : (
                <div className='flex items-center'>
                  <Contact className=' mr-2' />
                  <span className='text-gray-700'>Not Specified</span>
                </div>
              )}
            </div>

            {/* City and State Display */}
            <div className='mt-4 flex items-center'>
              {!(profile.city && profile.state) && (
                <MapPin className='mr-2' />
              )}
              <span className='text-gray-700'>
                {profile.city && profile.state
                  ? <span className='flex'><MapPin className='mr-2' /> {profile.city}, {profile.state}</span>
                  : 'Not Specified'}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileHeader;
