'use client';

import { Github, Link, Linkedin } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { useAuthGuard } from '@/api/auth-api';
import {
  useEditProfile,
  useGetFreelancerProfile,
  useGetProfileCompletion,
  useUploadProfileImage,
} from '@/api/freelancer-api';
import LanguageSection from '@/app/(with-main-layout)/(authenticated-pages)/(freelancer-protect-pages)/profile/components/LanguageSection';
import ProjectExperienceSection from '@/app/(with-main-layout)/(authenticated-pages)/(freelancer-protect-pages)/profile/components/ProjectExperienceSection';
import WorkExperienceSection from '@/app/(with-main-layout)/(authenticated-pages)/(freelancer-protect-pages)/profile/components/WorkExperienceSection';
import {
  EditModesType,
  FreelancerProfileType,
} from '@/models/user/UserResponse';
import { SKILLS_OPTIONS } from '@/constants/types/form-types';

import AboutSection from './components/AboutSection';
import AvailabilitySection from './components/AvailabilitySection';
import ContactSection from './components/ContactSection';
import ExperienceSection from './components/ExperienceSection';
import ProfileHeader from './components/ProfileHeader';
import ProfileStatus from './components/ProfileStatus';

import SkillsSection from './components/SkillsSection';

const FreelancerProfile: React.FC = () => {
  const { user, mutate } = useAuthGuard({ middleware: 'auth' });
  const [isImageError, setIsImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data } = useGetFreelancerProfile(user?.username);
  const [profilePercentage, setProfilePercentage] = useState<number>(0);
  const { data: fetchedPercentage, refetch } = useGetProfileCompletion();
  const [editModes, setEditModes] = useState<EditModesType>({
    editProfileImage: false,
    editHeader: false,
    editAbout: false,
    editExperience: false,
    editAvailability: false,
    editSkills: false,
    editContactInformation: false,
    editEducation: false,
    editWorkExperience: false,
    editProjectExperience: false,
    editLanguages: false,
    editCertifications: false,
    editProfile: false,
  });

  const [profile, setProfile] = useState<FreelancerProfileType>({
    id: '0',
    userId: '0',
    username: '',
    firstName: '',
    lastName: '',
    profileImageUrl: '',
    bio: '',
    contactEmail: '',
    city: '',
    state: '',
    experienceLevel: '',
    socialMediaLinks: [],
    skills: [],
    availability: '',
    projectExperiences: [],
    workExperiences: [],
    languagesSpoken: [],
    reviews: [],
    deleted: false,
  });

  useEffect(() => {
    if (data) {
      setProfile(data);
    }
  }, [data]);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const uploadProfileImage = useUploadProfileImage();

  const checkEditModes = (editMode: string): boolean => {
    return Object.entries(editModes).some(
      ([key, value]) => key !== editMode && value === true
    );
  };

  const updateEditModes = (editMode: string) => {
    setEditModes((prevEditModes) => {
      // Check if any other edit modes are active
      const otherModesActive = checkEditModes(editMode);

      // If other modes are active, set the current editMode to false
      if (otherModesActive) {
        return {
          ...prevEditModes,
          [editMode]: false,
        };
      }

      // If no other modes are active, set the current editMode to true
      return {
        ...prevEditModes,
        [editMode]: true,
      };
    });
  };

  const saveEditModes = (editModeKey: string) => {
    setEditModes((prev) => ({
      ...prev,
      [editModeKey]: false,
    }));
  };

  const handleSelect = (file: File) => {
    uploadProfileImage.mutate(file, {
      onSuccess: () => {
        console.log('File uploaded successfully');
        mutate();
        refetch();
        handleSave('editProfileImage');
        setIsModalOpen(false);
      },
      onError: (error) => {
        console.error('Error uploading file:', error);
      },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (fetchedPercentage !== undefined) {
      setProfilePercentage(fetchedPercentage);
    }
  }, [fetchedPercentage]);

  const editProfileMutation = useEditProfile();

  const handleSave = (
    editMode: string,
    updatedProfile?: Partial<FreelancerProfileType>
  ) => {
    const profileToSave = updatedProfile
      ? { ...profile, ...updatedProfile }
      : profile;
    editProfileMutation.mutate(profileToSave, {
      onSuccess: () => {
        console.log('Profile updated successfully');
        saveEditModes(editMode);
        setProfile(profileToSave);
        refetch();
      },
      onError: (error) => {
        console.error('Failed to update profile:', error);
      },
    });
  };

  const handleInputChange = (
    field: keyof FreelancerProfileType,
    value: any
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.log(value);
    console.log(profile);
  };

  const handleSkillsChange = (skillInput: string) => {
    const skillsArray = skillInput
      .split(',')
      .map((skill) => skill.trim().toUpperCase())
      .filter((skill) =>
        SKILLS_OPTIONS.some((availableSkill) => availableSkill.value === skill)
      );
    handleInputChange('skills', skillsArray);
  };

  const handleSocialLinksChange = (linksInput: string) => {
    const linksArray = linksInput.split(',').map((link) => link.trim());
    handleInputChange('socialMediaLinks', linksArray);
  };

  const getSocialIcon = (url: string) => {
    if (url.includes('github')) return <Github className='h-5 w-5' />;
    if (url.includes('linkedin')) return <Linkedin className='h-5 w-5' />;
    return <Link className='h-5 w-5' />;
  };

  const inputClassName =
    ' text-sm sm:text-base block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-b300 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 ';

  return (
    <div className='min-h-screen bg-stone-100'>
      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        {/* Header */}
        <ProfileHeader
          user={user}
          profile={profile}
          isImageError={isImageError}
          isModalOpen={isModalOpen}
          setIsImageError={setIsImageError}
          handleImageClick={handleImageClick}
          handleSelect={handleSelect}
          handleCancel={handleCancel}
          handleInputChange={handleInputChange}
          inputClassName={inputClassName}
          updateEditModes={updateEditModes}
          editModes={editModes}
          handleSave={handleSave}
          checkEditModes={checkEditModes}
        />

        <ProfileStatus
          profile={profile}
          profilePercentage={profilePercentage}
          isHidden={profilePercentage === 100}
        />

        {/* About Section */}
        <AboutSection
          profile={profile}
          handleInputChange={handleInputChange}
          inputClassName={inputClassName}
          updateEditModes={updateEditModes}
          editModes={editModes}
          handleSave={handleSave}
          checkEditModes={checkEditModes}
        />

        {/* Experience Section */}
        <ExperienceSection
          profile={profile}
          handleInputChange={handleInputChange}
          updateEditModes={updateEditModes}
          editModes={editModes}
          handleSave={handleSave}
          checkEditModes={checkEditModes}
        />

        <WorkExperienceSection
          profile={profile}
          handleInputChange={handleInputChange}
          updateEditModes={updateEditModes}
          editModes={editModes}
          handleSave={handleSave}
          checkEditModes={checkEditModes}
        />

        <ProjectExperienceSection
          profile={profile}
          handleInputChange={handleInputChange}
          updateEditModes={updateEditModes}
          editModes={editModes}
          handleSave={handleSave}
          checkEditModes={checkEditModes}
        />

        {/* Availability Section */}
        <AvailabilitySection
          profile={profile}
          handleInputChange={handleInputChange}
          updateEditModes={updateEditModes}
          editModes={editModes}
          handleSave={handleSave}
          checkEditModes={checkEditModes}
        />

        {/* Skills Section */}
        <SkillsSection
          profile={profile}
          handleSkillsChange={handleSkillsChange}
          inputClassName={inputClassName}
          availableSkills={SKILLS_OPTIONS}
          updateEditModes={updateEditModes}
          editModes={editModes}
          handleSave={handleSave}
          checkEditModes={checkEditModes}
        />

        {/* Languages Section */}
        <LanguageSection
          profile={profile}
          handleInputChange={handleInputChange}
          updateEditModes={updateEditModes}
          editModes={editModes}
          handleSave={handleSave}
          checkEditModes={checkEditModes}
        />

        {/* Contact Section */}
        <ContactSection
          profile={profile}
          handleInputChange={handleInputChange}
          handleSocialLinksChange={handleSocialLinksChange}
          getSocialIcon={getSocialIcon}
          inputClassName={inputClassName}
          updateEditModes={updateEditModes}
          editModes={editModes}
          handleSave={handleSave}
          checkEditModes={checkEditModes}
          saveEditModes={saveEditModes}
          editProfileMutation={editProfileMutation}
        />
      </main>

      {/* View as Guest Button */}
      <div className='fixed bottom-16 right-6 z-10'>
        <a
          href={`/public-profile/${user?.username || ''}`}
          className='group flex items-center space-x-2 rounded-full bg-amber-400 px-5 py-2.5 text-amber-900 shadow-lg transition-all duration-200 hover:bg-amber-300 hover:shadow-xl'
        >
          <span className='font-medium'>
            <span className='font-bold'>Done editing?</span>{' '}
            <span className='underline'>See what others see</span>
          </span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className='h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1'
          >
            <path
              fillRule='evenodd'
              d='M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z'
              clipRule='evenodd'
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default FreelancerProfile;
