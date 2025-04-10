'use client';


import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Contact, MapPin, User } from 'lucide-react';
import { ProfileImageModal } from './ProfileImageModal';
import EditButton from './EditButton';
import { Button } from '@/components/ui/button';
import {
  EditModesType,
  FreelancerProfileType,
  UserResponse,
} from '@/models/user/UserResponse';


const schema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(255, 'First name must contain at most 255 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(255, 'Last name must contain at most 255 characters'),
  city: z
    .string()
    .min(1, 'City is required')
    .max(255, 'City must contain at most 255 characters')
    .optional(),
  state: z
    .string()
    .min(1, 'State/Province is required')
    .max(255, 'State/Province must contain at most 255 characters')
    .optional(),
});




type FormValues = z.infer<typeof schema>;


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
  handleSave: (
    editMode: string,
    updatedProfile?: Partial<FreelancerProfileType>
  ) => void;
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      city: profile.city || '',
      state: profile.state || '',
    },
  });


  const checkModes = checkEditModes('editProfileImage');


  const onSubmit = (data: FormValues) => {

    handleInputChange('firstName', data.firstName);
    handleInputChange('lastName', data.lastName);
    handleInputChange('city', data.city ?? '');
    handleInputChange('state', data.state ?? '');

    handleSave('editHeader', {
      firstName: data.firstName,
      lastName: data.lastName,
      city: data.city ?? '',
      state: data.state ?? '',
    });
  };


  useEffect(() => {
    if (editModes.editHeader) {
      reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        city: profile.city || '',
        state: profile.state || '',
      });
    }
  }, [profile, editModes.editHeader, reset]);


  return (
    <section className='relative mb-8 rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md'>
      <div className='relative h-48 rounded-t-xl bg-white'></div>


      <div className='mr-4 mt-16 sm:mt-8 flex justify-end'>
        {!editModes.editHeader && (
          <EditButton
            editModeKey='editHeader'
            updateEditModes={updateEditModes}
            checkEditModes={checkEditModes}
            dataTest="profile-header-edit-btn"
          />
        )}
      </div>


      <div className='absolute left-1/2 top-[110px] -translate-x-1/2 sm:left-6 sm:translate-x-0'>
        {!isImageError && user?.profileImageUrl ? (
          <button
            type='button'
            disabled={checkModes}
            className={`h-32 w-32 rounded-full shadow-lg ${checkModes ? 'cursor-not-allowed' : 'hover:bg-gray-900'
              }`}
            onClick={!editModes.editProfileImage ? handleImageClick : undefined}
            onKeyDown={(e) =>
              !editModes.editProfileImage &&
              (e.key === 'Enter' || e.key === ' ') &&
              handleImageClick()
            }
            onMouseDown={(e) => e.preventDefault()}
          >
            <img
              src={user.profileImageUrl}
              alt='Profile'
              className='h-full w-full rounded-full object-cover'
              onError={() => setIsImageError(true)}
            />
          </button>
        ) : (
          <button
            type='button'
            disabled={checkModes}
            className={`flex h-32 w-32 items-center justify-center rounded-full bg-blue-400 text-4xl text-white shadow-lg ${checkModes ? 'cursor-not-allowed' : ''
              }`}
            onClick={!editModes.editProfileImage ? handleImageClick : undefined}
            onKeyDown={(e) =>
              !editModes.editProfileImage &&
              (e.key === 'Enter' || e.key === ' ') &&
              handleImageClick()
            }
            onMouseDown={(e) => e.preventDefault()}
          >
            <User className='h-14 w-14' />
          </button>
        )}
      </div>


      {isModalOpen && (
        <ProfileImageModal
          userProfileImage={user?.profileImageUrl}
          handleSave={handleSave}
          onSelect={handleSelect}
          onCancel={handleCancel}
        />
      )}


      <div className='p-6'>
        {editModes.editHeader ? (
          <form onSubmit={handleSubmit(onSubmit)} className='mt-12'>
            <h2 className='mb-4 text-xl font-semibold text-gray-800'>Name</h2>
            <div className='flex flex-wrap gap-2 justify-between'>
              <div className='w-full sm:basis-[calc(50%-0.25rem)]'>
                <label className="text-md">First Name</label>
                <input
                  {...register('firstName')}
                  className={inputClassName}
                  placeholder='Enter First Name'
                  data-test="profile-header-input-firstName"
                />
                <div data-test="profile-header-firstName-error" className='text-red-500 text-sm mt-1'>
                  {errors.firstName?.message}
                </div>
              </div>
              <div className='w-full sm:basis-[calc(50%-0.25rem)]'>
                <label className="text-md">Last Name</label>
                <input
                  {...register('lastName')}
                  className={inputClassName}
                  placeholder='Enter Last Name'
                  data-test="profile-header-input-lastName"
                />
                <div data-test="profile-header-lastName-error" className='text-red-500 text-sm mt-1'>
                  {errors.lastName?.message}
                </div>
              </div>
            </div>





            <h2 className='mt-8 text-xl font-semibold text-gray-800'>
              Location
            </h2>
            <div className='mt-4 flex flex-wrap gap-2 justify-between'>
              <div className='w-full sm:basis-[calc(50%-0.25rem)]'>
                <label className="text-md">City</label>
                <input
                  {...register('city')}
                  className={inputClassName}
                  placeholder='Enter City'
                  data-test="profile-header-input-city"
                />
                <div data-test="profile-header-city-error" className='text-red-500 text-sm mt-1'>
                  {errors.city?.message}
                </div>
              </div>
              <div className='w-full sm:basis-[calc(50%-0.25rem)]'>
                <label className="text-md">State/Province</label>
                <input
                  {...register('state')}
                  className={inputClassName}
                  placeholder='Enter State/Province'
                  data-test="profile-header-input-state"
                />
                <div data-test="profile-header-state-error" className='text-red-500 text-sm mt-1'>
                  {errors.state?.message}
                </div>
              </div>
            </div>
            <div className='mt-4 flex justify-end'>
              <Button
                type="submit"
                variant='default'
                animation='default'
                size='sm'
                className='px-6'
                data-test="profile-header-save-btn"
              >
                Save
              </Button>
            </div>


          </form>
        ) : (
          <div>
            <div className='-mt-4'>
              {profile.firstName && profile.lastName ? (
                <div className="flex flex-wrap items-center gap-x-2 max-w-full">
                  <h2 className="text-md font-bold transition-all duration-300 md:text-2xl break-words truncate">
                    {profile.firstName}
                  </h2>
                  <h2 className="text-md font-bold transition-all duration-300 md:text-2xl break-words truncate">
                    {profile.lastName}
                  </h2>
                </div>

              ) : (
                <div className='flex items-center'>
                  <Contact className='mr-2' />
                  <p className='italic text-gray-500'>No Name added.</p>
                </div>
              )}
            </div>


            <div className='mt-4 flex items-center'>
              <MapPin className='mr-2 flex-shrink-0' />
              {profile.city && profile.state ? (
                <span className='truncate text-gray-700 text-sm sm:text-md max-w-[calc(100%-1.5rem)]'>
                  {profile.city}, {profile.state}
                </span>
              ) : (
                <span className='text-gray-700 italic'>No location added.</span>
              )}
            </div>


          </div>
        )}
      </div>
    </section>
  );
};


export default ProfileHeader;


