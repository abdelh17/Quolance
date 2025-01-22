'use client';


import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, MapPin, Briefcase, Calendar, Link, Github, Linkedin,User,Wrench,Book,Users} from 'lucide-react';
import { ExperienceLevelRadioGroup, AvailabilityRadioGroup } from '@/components/ui/freelancers/FreelancerProfileRadioGroups';
import { useAuthGuard } from '@/api/auth-api';
import { useGetFreelancerProfile,useEditProfile,useUploadProfileImage} from '@/api/freelancer-api';
import { FreelancerProfileType } from '@/constants/models/user/UserResponse';
import { ProfileImageModal } from './components/ProfileImageModal';

const FreelancerProfile: React.FC = () => {
 const searchParams = useSearchParams();
 const [editMode, setEditMode] = useState(false);
 const [showBanner, setShowBanner] = useState(false);
 const { user,mutate} = useAuthGuard({ middleware: 'auth' });
 const [isImageError, setIsImageError] = useState(false);
 const [isModalOpen, setIsModalOpen] = useState(false);
 
 const {data} = useGetFreelancerProfile(user?.username)


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
  // Update the profile state when data is fetched
 useEffect(() => {
   if (data) {
     setProfile({
       id: data.id,
       userId: data.userId,
       username: data.username,
       firstName: data.firstName,
       lastName: data.lastName,
       profileImageUrl: data.profileImageUrl,
       bio: data.bio,
       contactEmail: data.contactEmail,
       city: data.city,
       state: data.state,
       experienceLevel: data.experienceLevel,
       socialMediaLinks: data.socialMediaLinks,
       skills: data.skills,
       availability: data.availability,
     });
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
   const skillsArray = skillInput.split(',').map(skill => skill.trim().toUpperCase());
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
     <header className="bg-gradient-to-r from-b300 to-blue-600 text-white py-20 px-4 transition-colors duration-300">
       <div className="container mx-auto text-center">
       {!isImageError && user?.profileImageUrl ? (
             <div
               className={`w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg ${editMode ? 'cursor-pointer' : ''}`}
               role="button" 
               tabIndex={0}
               onClick={editMode ? handleImageClick : undefined}
               onKeyDown={(e) => {
                if (editMode && (e.key === 'Enter' || e.key === ' ')) {
                  handleImageClick?.();
                }
              }}
              onMouseDown={(e) => e.preventDefault()} 
             >
               <img
                 src={user.profileImageUrl}
                 alt="Profile Image"
                 className="w-full h-full rounded-full"
                 onError={() => setIsImageError(true)}
               />
             </div>
           ) : (
             <div
               className={`w-32 h-32 rounded-full mx-auto mb-4 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-4xl shadow-lg ${editMode ? 'cursor-pointer hover:bg-blue-700' : ''}`}
               role="button" 
               tabIndex={0}
               onClick={editMode ? handleImageClick : undefined}
               onKeyDown={(e) => {
                if (editMode && (e.key === 'Enter' || e.key === ' ')) {
                  handleImageClick?.();
                }
              }}
              onMouseDown={(e) => e.preventDefault()} 

             >
               <User className="w-14 h-14" />
             </div>
           )}
           {isModalOpen && <ProfileImageModal onSelect={handleSelect} onCancel={handleCancel} />}
         {editMode ? (
           <div className="space-y-2">
             <input
               type="text"
               value={profile.firstName}
               onChange={(e) => handleInputChange('firstName', e.target.value)}
               className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/70"
               placeholder="Enter First Name"
             />
             <input
               type="text"
               value={profile.lastName}
               onChange={(e) => handleInputChange('lastName', e.target.value)}
               className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/70 ml-2"
               placeholder="Enter Last Name"
             />
           </div>
         ) : (
           <h1 className="text-4xl md:text-5xl font-bold mb-2 transition-all duration-300">{`${profile.firstName} ${profile.lastName}`}</h1>
         )}
       </div>
     </header>


     {/* Main Content */}
     <main className="container mx-auto px-4 py-8">
       {/* About Section */}
       <section className="bg-white rounded-xl shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
         <h2 className="text-2xl font-semibold mb-4 text-gray-800">About Me</h2>
         {editMode ? (
           <textarea
             value={profile.bio}
             placeholder="Enter Biography"
             onChange={(e) => handleInputChange('bio', e.target.value)}
             className={inputClassName}
             rows={4}
           />
         ) : (
           <div>
             {profile.bio.length > 0 ?(
                <p className="text-gray-700">{profile.bio}</p>
             ):
             <div className="flex items-center">
               <Book className="text-b300 mr-3"/>
               <p className="text-gray-700">Not Specified</p>
             </div>
             
             }
           
           </div>
          
         )}
       </section>


       {/* Experience Section */}
       <section className="bg-white rounded-xl shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
         <h2 className="text-2xl font-semibold mb-4 text-gray-800">Experience</h2>
         <div className="flex items-center">
           <Briefcase className="text-b300 mr-3" />
           {editMode ? (
             <ExperienceLevelRadioGroup
               name="experienceLevel"
               value={profile.experienceLevel || ''}
               onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
             />
           ) : (
             <span className="text-gray-700 capitalize">{profile.experienceLevel?.toLowerCase() || 'Not specified'}</span>
           )}
         </div>
       </section>


       {/* Availability Section */}
       <section className="bg-white rounded-xl shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
         <h2 className="text-2xl font-semibold mb-4 text-gray-800">Availability</h2>
         <div className="flex items-center">
           <Calendar className="text-b300 mr-3" />
           {editMode ? (
             <AvailabilityRadioGroup
               name="availability"
               value={profile.availability || ''}
               onChange={(e) => handleInputChange('availability', e.target.value)}
             />
           ) : (
             <span className="text-gray-700 capitalize">{profile.availability?.toLowerCase().replace('_', ' ') || 'Not specified'}</span>
           )}
         </div>
       </section>


       {/* Skills Section */}
       <section className="bg-white rounded-xl shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
         <h2 className="text-2xl font-semibold mb-4 text-gray-800">Skills</h2>
         {editMode ? (
           <input
             type="text"
             value={profile.skills.join(', ')}
             onChange={(e) => handleSkillsChange(e.target.value)}
             className={inputClassName}
             placeholder="Enter Skills Separated By Commas"
           />
         ) : (
           <div className="flex flex-wrap gap-2">
           {profile.skills.length > 0 ? (
             profile.skills.map((skill, index) => (
               <span
                 key={index}
                 className="bg-blue-100 text-b300 px-4 py-2 rounded-lg text-sm capitalize transition-all duration-200 hover:bg-blue-200"
               >
                 {skill.toLowerCase()}
               </span>
             ))
           ) : (
             <div className='flex items-center'>
               <Wrench className="text-b300 mr-3"/>
               <span className="text-gray-700 capitalize">Not specified</span>
             </div>
            
           )}
         </div>
         )}
       </section>


       {/* Contact Section */}
       <section className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
         <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Information</h2>
         <div className="space-y-6">
           <div className="flex items-center">
             <Mail className="text-b300 mr-3" />
             {editMode ? (
               <input
                 type="email"
                 value={profile.contactEmail}
                 placeholder="Enter Contact Email"
                 onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                 className={inputClassName}
               />
             ) : profile.contactEmail && profile.contactEmail.length > 0 ? (
               <a
                 href={`mailto:${profile.contactEmail}`}
                 className="text-b300 hover:text-b500 transition-colors duration-200"
               >
                 {profile.contactEmail}
               </a>
             ) : (
               <span className="text-gray-700">Not Specified</span>
             )}
           </div>


           <div className="flex items-center">
             <MapPin className="text-b300 mr-3" />
             {editMode ? (
               <div className="flex gap-3 flex-1">
                 <input
                   type="text"
                   value={profile.city || ''}
                   onChange={(e) => handleInputChange('city', e.target.value)}
                   className={inputClassName}
                   placeholder="Enter City"
                 />
                 <input
                   type="text"
                   value={profile.state || ''}
                   onChange={(e) => handleInputChange('state', e.target.value)}
                   className={inputClassName}
                   placeholder="Enter State"
                 />
               </div>
             ) : (
               <span className="text-gray-700">{profile.city && profile.state ? `${profile.city}, ${profile.state}` : 'Not Specified'}</span>
             )}
           </div>
           <div>
             <h3 className="text-lg font-semibold mb-2 text-gray-800">Social Media</h3>
             {editMode ? (
               <input
                 type="text"
                 value={profile.socialMediaLinks.join(', ')}
                 onChange={(e) => handleSocialLinksChange(e.target.value)}
                 className={inputClassName}
                 placeholder="Enter Social Media Links Separated By Commas"
               />
             ) : (
               <div>
                 {profile.socialMediaLinks.length > 0 ? (
                   <div className="space-y-2">
                   {profile.socialMediaLinks.map((link, index) => (
                     <div key={index} className="flex items-center group">
                       {getSocialIcon(link)}
                       <a
                         href={link}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="text-b300 hover:text-b500 transition-colors duration-200 ml-2 group-hover:underline"
                       >
                         {link.split('/').pop()}
                       </a>
                     </div>
                   ))}
                  </div>
                 ):
                 <div className ="flex items-center">
                   <Users className="text-b300 mr-3"/>
                   <span className="text-gray-700">Not Specified</span>
                 </div>
                 }
                  
               </div>
            
             )}
           </div>
         </div>
       </section>
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

