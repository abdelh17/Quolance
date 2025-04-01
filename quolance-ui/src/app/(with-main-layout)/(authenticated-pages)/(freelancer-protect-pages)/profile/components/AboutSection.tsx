'use client';


import React, { useEffect, useState } from 'react';
import { Book } from 'lucide-react';
import { EditModesType, FreelancerProfileType } from '@/models/user/UserResponse';
import EditButton from './EditButton';
import SaveButton from './SaveButton';
import { PiCaretDown } from 'react-icons/pi';




interface AboutSectionProps {
 profile: {
   bio: string;
 };
 handleInputChange: (field: keyof FreelancerProfileType, value: string) => void;
 inputClassName: string;
 updateEditModes: (value: string) => void;
 editModes: EditModesType;
 handleSave: (value: string) => void;
 checkEditModes: (value: string) => boolean;
}


const AboutSection: React.FC<AboutSectionProps> = ({
 profile,
 handleInputChange,
 inputClassName,
 updateEditModes,
 editModes,
 handleSave,
 checkEditModes,
}) => {
 const maxBioLength = 5000;
 const [bio, setBio] = useState(profile.bio ?? '');
 const [charCount, setCharCount] = useState(0);
 const [showFullBio, setShowFullBio] = useState(false);




 useEffect(() => {
   setCharCount(bio.length);
 }, [bio]);


 useEffect(() => {
   // Reset local state if edit mode just turned on
   if (editModes.editAbout) {
     setBio(profile.bio ?? '');
   }
 }, [editModes.editAbout, profile.bio]);


 const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
   const text = e.target.value;
   if (text.length <= maxBioLength) {
     setBio(text);
     setCharCount(text.length);
   }
 };




 return (
   <section className='bg-white rounded-xl shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md '>
     <div className='flex justify-between mb-4'>
       <h2 className='flex items-center self-center text-md sm:text-xl font-semibold text-gray-80'> <Book className='mr-2' /> About</h2>
       {!editModes.editAbout && (
         <EditButton
           editModeKey='editAbout'
           updateEditModes={updateEditModes}
           checkEditModes={checkEditModes}
         />
       )}
     </div>


     {editModes.editAbout ? (
       <div>
         <textarea
           value={bio}
           maxLength={5000}
           placeholder='Enter Biography'
           onChange={handleBioChange}
           className={`text-sm placeholder:text-sm ${inputClassName}`}
           rows={4}
         />
         <div className='flex justify-between mt-2 text-sm text-gray-500'>
           <span className={charCount >= maxBioLength ? 'text-red-500' : ''}>
             {charCount}/{maxBioLength} characters
           </span>
           <SaveButton editModeKey='editAbout' handleSave={handleSave} updatedProfile={{ bio }} />
         </div>
       </div>
     ) : (
       <div>
           {profile.bio.length > 0 ? (
     <>
       <p className='text-gray-700 break-words whitespace-pre-wrap'>
         {showFullBio || profile.bio.length <= 200
           ? profile.bio
           : `${profile.bio.slice(0, 200)}...`}
       </p>


       {profile.bio.length > 200 && (
         <div className='flex justify-end'>
           <button
             onClick={() => setShowFullBio(!showFullBio)}
             className='mt-2 flex items-center gap-1 text-sm text-blue-600 hover:underline'
           >
             <span>{showFullBio ? 'Show Less' : 'Show More'}</span>
             <PiCaretDown
               className={`h-4 w-4 transition-transform ${
                 showFullBio ? 'rotate-180' : ''
               }`}
             />
           </button>
         </div>
       )}
     </>
   ) : (
        <p className='italic text-gray-500'>No bio added.</p>
    
   )}
       </div>
     )}
   </section>
 );
};


export default AboutSection;





