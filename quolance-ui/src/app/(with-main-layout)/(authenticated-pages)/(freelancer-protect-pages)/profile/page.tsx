'use client';


import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link, Github, Linkedin} from 'lucide-react';
import { useAuthGuard } from '@/api/auth-api';
import { useGetFreelancerProfile,useEditProfile,useUploadProfileImage,useGetProfileCompletion} from '@/api/freelancer-api';
import { FreelancerProfileType,EditModesType} from '@/constants/models/user/UserResponse';
import ProfileHeader from './components/ProfileHeader';
import AboutSection from './components/AboutSection';
import ExperienceSection from "./components/ExperienceSection";
import AvailabilitySection from './components/AvailabilitySection';
import SkillsSection from './components/SkillsSection';
import ContactSection from './components/ContactSection';
import ProfileStatus from './components/ProfileStatus';
import { UpdateProfileModal } from './components/UpdateProfileModal';

const AVAILABLE_SKILLS = [
    "JAVA", "PYTHON", "HTML", "CSS", "JAVASCRIPT", "TYPESCRIPT", "C", "CPLUSPLUS",
    "CSHARP", "GO", "RUST", "SWIFT", "KOTLIN", "PHP", "RUBY", "REACT", "ANGULAR",
    "VUE", "NEXTJS", "NUXTJS", "SPRING", "DJANGO", "FLASK", "EXPRESS", "NESTJS",
    "SQL", "MONGODB", "POSTGRESQL", "MYSQL", "REDIS", "AWS", "AZURE", "GCP",
    "DOCKER", "KUBERNETES", "JENKINS", "TERRAFORM", "REACTNATIVE", "FLUTTER",
    "IOS", "ANDROID"
];

const FreelancerProfile: React.FC = () => {
 const searchParams = useSearchParams();
 const [editMode, setEditMode] = useState(false);
 const [showBanner, setShowBanner] = useState(false);
 const { user,mutate} = useAuthGuard({ middleware: 'auth' });
 const [isImageError, setIsImageError] = useState(false);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const {data} = useGetFreelancerProfile(user?.username)
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
  editProfile: false,
 });
 const [showStatus,setShowStatus] = useState(true);

 console.log(data)


  const [profile, setProfile] = useState<FreelancerProfileType>({
   id: 0,
   userId: 0,
   username: "",
   firstName: "",
   lastName: "",
   profileImageUrl: "",
   bio: "",
   contactEmail: "",
   city: "",
   state: "",
   experienceLevel:"",
   socialMediaLinks: [],
   skills: [],
   availability: "",
 });

 useEffect(() => {
  if (data) {
    setProfile(data);
  }
}, [data]);


const dontShowStatus = () => {
  setShowStatus(false);
 };
 


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
    const otherModesActive = checkEditModes(editMode)
 
 
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
       console.log("File uploaded successfully");


       mutate();
      
       setIsModalOpen(false);
      
     },
     onError: (error) => {
       console.error("Error uploading file:", error);
     },
   });
  
 };


 const handleCancel = () => {
   setIsModalOpen(false);
 };


 useEffect(() => {
   setEditMode(searchParams.has('edit'));
 }, [searchParams]);


 useEffect(() => {
   if (editMode) {
     setShowBanner(true);
   } else {
     setShowBanner(false);
   }
 }, [editMode]);

 useEffect(() => {
  if (fetchedPercentage !== undefined) {
    setProfilePercentage(fetchedPercentage);
  }
}, [fetchedPercentage]);

// Refetch profile completion whenever profile changes
useEffect(() => {
  refetch();
}, [profile]);


 const editProfileMutation = useEditProfile();


 const handleSave = (editMode:string) => {
  console.log('Saving profile data:', profile);
  editProfileMutation.mutate(profile, {
    onSuccess: () => {
      console.log("Profile updated successfully");
      saveEditModes(editMode);
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
    },
  });
 };


 const handleEnableEdit = () => {
   setEditMode(true);
 };


 const handleInputChange = (field: keyof FreelancerProfileType, value: any) => {
   setProfile(prev => ({
     ...prev,
     [field]: value
   }));
 };


    const handleSkillsChange = (skillInput: string) => {
        const skillsArray = skillInput.split(',').filter(skill =>
            AVAILABLE_SKILLS.includes(skill.trim().toUpperCase())
        );
        handleInputChange('skills', skillsArray);
    };


 const handleSocialLinksChange = (linksInput: string) => {
   const linksArray = linksInput.split(',').map(link => link.trim());
   handleInputChange('socialMediaLinks', linksArray);
 };


 const getSocialIcon = (url: string) => {
   if (url.includes('github')) return <Github className="w-5 h-5" />;
   if (url.includes('linkedin')) return <Linkedin className="w-5 h-5" />;
   return <Link className="w-5 h-5" />;
 };


 const inputClassName = "w-full px-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200";


 return (
   <div className="min-h-screen bg-gray-50">
     {/* Notification Banner */}
     <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-amber-400 text-amber-900 py-2 px-4 rounded-lg transition-all duration-300 shadow-lg ${showBanner ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
       <div className="text-sm font-medium whitespace-nowrap">
         ✏️ Edit mode enabled
       </div>
     </div>

    




     {/* Main Content */}
     <main className="container mx-auto px-4 py-8">

     {editModes.editProfile && (
       <UpdateProfileModal 
       profile={profile}
       inputClassName={inputClassName}
       availableSkills={AVAILABLE_SKILLS}
       saveEditModes={saveEditModes}
       handleInputChange={handleInputChange}
       handleSkillsChange={handleSkillsChange}
       handleSocialLinksChange={handleSocialLinksChange}
       handleSave={handleSave}
       />
     )}



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
       checkEditModes = {checkEditModes}
     />


     {showStatus && (
       <ProfileStatus
         profile={profile}
         profilePercentage = {profilePercentage}
         isHidden={profilePercentage === 100}
         updateEditModes={updateEditModes}
         checkEditModes = {checkEditModes}
         dontShowStatus = {dontShowStatus}
       />
     )}
  
      {/* About Section */}
      <AboutSection
       profile={profile}
       handleInputChange={handleInputChange}
       inputClassName={inputClassName}
       updateEditModes={updateEditModes}
       editModes={editModes}
       handleSave={handleSave}
       checkEditModes = {checkEditModes}
     />




      {/* Experience Section */}
           <ExperienceSection
         profile={profile}
         handleInputChange={handleInputChange}
         updateEditModes={updateEditModes}
         editModes={editModes}
         handleSave={handleSave}
         checkEditModes = {checkEditModes}
       />




      {/* Availability Section */}
           <AvailabilitySection
         profile={profile}
         handleInputChange={handleInputChange}
         updateEditModes={updateEditModes}
         editModes={editModes}
         handleSave={handleSave}
         checkEditModes = {checkEditModes}
        />




      {/* Skills Section */}
             <SkillsSection
             profile={profile}
             handleSkillsChange={handleSkillsChange}
             inputClassName={inputClassName}
             availableSkills={AVAILABLE_SKILLS}
             updateEditModes={updateEditModes}
             editModes={editModes}
             handleSave={handleSave}
             checkEditModes = {checkEditModes}
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
       checkEditModes = {checkEditModes}
     />

     </main>
    
     {/* Floating Action Buttons */}
     

    {/*
    <div className="fixed bottom-8 right-8">
      {editMode ? (
        <button
          onClick={handleSave}
          className="bg-b300 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-b500 transition-all duration-200 flex items-center space-x-2 hover:scale-105"
        >
          <span>Save Changes</span>
        </button>
      ) : (
        <button
          onClick={handleEnableEdit}
          className="bg-amber-400 text-b500 px-6 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition-all duration-200 flex items-center space-x-2 hover:scale-105"
        >
          <span>Enable Edit</span>
        </button>
      )}
    </div>
*/}
   </div>
 );
};


export default FreelancerProfile;

