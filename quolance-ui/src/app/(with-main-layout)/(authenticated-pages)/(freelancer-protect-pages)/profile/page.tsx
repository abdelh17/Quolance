'use client';


import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link, Github, Linkedin} from 'lucide-react';
import { useAuthGuard } from '@/api/auth-api';
import { useGetFreelancerProfile,useEditProfile,useUploadProfileImage} from '@/api/freelancer-api';
import { FreelancerProfileType } from '@/constants/models/user/UserResponse';
import ProfileHeader from './components/ProfileHeader';
import AboutSection from './components/AboutSection';
import ExperienceSection from "./components/ExperienceSection";
import AvailabilitySection from './components/AvailabilitySection';
import SkillsSection from './components/SkillsSection';
import ContactSection from './components/ContactSection';

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


  const [profile, setProfile] = useState<FreelancerProfileType>({
   id: "0",
   userId: "0",
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




 const handleImageClick = () => {
   setIsModalOpen(true);
 };


 const uploadProfileImage = useUploadProfileImage();


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


 const editProfileMutation = useEditProfile();


 const handleSave = () => {
   console.log('Saving profile data:', profile);
   editProfileMutation.mutate(profile, {
     onSuccess: () => {
       console.log("Profile updated successfully");
       setEditMode(false);
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


     {/* Header */}
     <ProfileHeader
        user={user}
        profile={profile}
        editMode={editMode}
        isImageError={isImageError}
        isModalOpen={isModalOpen}
        setIsImageError={setIsImageError}
        handleImageClick={handleImageClick}
        handleSelect={handleSelect}
        handleCancel={handleCancel}
        handleInputChange={handleInputChange}
      />

     {/* Main Content */}
     <main className="container mx-auto px-4 py-8">
       {/* About Section */}
       <AboutSection
        profile={profile}
        editMode={editMode}
        handleInputChange={handleInputChange}
        inputClassName={inputClassName}
      />


       {/* Experience Section */}
            <ExperienceSection
          profile={profile}
          editMode={editMode}
          handleInputChange={handleInputChange}
        />


       {/* Availability Section */}
            <AvailabilitySection
        profile={profile}
        editMode={editMode}
        handleInputChange={handleInputChange}
         />


       {/* Skills Section */}
              <SkillsSection
              profile={profile}
              editMode={editMode}
              handleSkillsChange={handleSkillsChange}
              inputClassName={inputClassName}
                availableSkills={AVAILABLE_SKILLS}
            />

       {/* Contact Section */}
       <ContactSection
  profile={profile}
  editMode={editMode}
  handleInputChange={handleInputChange}
  handleSocialLinksChange={handleSocialLinksChange}
  getSocialIcon={getSocialIcon}
  inputClassName={inputClassName}
/>
     </main>
    
     {/* Floating Action Buttons */}
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
   </div>
 );
};


export default FreelancerProfile;

