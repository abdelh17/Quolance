"use client";
import { useRouter,usePathname } from 'next/navigation';
import { FreelancerProfileType } from '@/constants/models/user/UserResponse';
import React, { useState, useEffect } from 'react';
import ProfileProgressBar from './ProfileProgressBar';
import { Button } from '@/components/ui/button';
import DOMPurify from 'dompurify';
import { PiCaretDown} from 'react-icons/pi';

interface ProfileStatusProps {
 profile: FreelancerProfileType;
 profilePercentage: number;
 isHidden: boolean;
}

const ProfileProgress: React.FC<ProfileStatusProps> = ({
 profile,
 profilePercentage,
 isHidden,
}) => {
 const router = useRouter();
 const pathname = usePathname();
 const [missingFields, setMissingFields] = useState<string[]>([]);
 const [showMore, setShowMore] = useState(false);


 const filterMissingFields = () => {
   console.log(Object.entries(profile))
   const missing = Object.entries(profile)
     .filter(
       ([key, value]) =>
         !['id', 'userId', 'username'].includes(key) &&
         (value === null ||
           value === undefined ||
           value === '' ||
           (Array.isArray(value) && value.every((item) => item === '')))
     )
     .map(([key]) => key);


   const uniqueRecommendations = Array.from(
     new Set(missing.map(getRecommendation))
   ).filter(Boolean) as string[];


   setMissingFields(uniqueRecommendations);
 };


 const getRecommendation = (key: string) => {
   switch (key) {
     case 'profileImageUrl':
       return 'Uploading a <strong>Profile Picture</strong>';
     case 'bio':
       return "Filling out the <strong>'About Me' </strong> section";
     case 'skills':
       return "Filling out the <strong>'Skills' </strong> section ";
     case 'contactEmail':
     case 'socialMediaLinks':
       return "Filling out the <strong>'Contact Information' </strong> section ";
     case 'city':
     case 'state':
       return "Filling out the <strong>'Location'</strong> section ";
     case 'firstName':
     case 'lastName':
       return "Filling out the <strong>'Name' </strong> section ";
     case 'experienceLevel':
       return "Filling out the <strong>'Experience' </strong> section ";
     case 'availability':
       return "Filling out the <strong>'Availability' </strong> section ";
     case 'workExperiences':
       return "Filling out the <strong>'Work Experience' </strong> section ";
     case 'languagesSpoken':
       return "Filling out the <strong>'Languages' </strong> section ";
     case 'projectExperiences':
       return "Filling out the <strong>'Project Experience' </strong> section ";
     default:
       return null;
   }
 };


 useEffect(() => {
   filterMissingFields();
 }, [profile]);

 if (isHidden) return null;

 return (
   <div className='mb-8 flex flex-wrap gap-8 rounded-lg bg-white p-4 py-4 shadow-md md:justify-between lg:flex-nowrap'>
     <div className='flex w-full flex-col sm:flex-row sm:items-center px-2 sm:px-8'>
       <svg
         xmlns='http://www.w3.org/2000/svg'
         width='56'
         height='56'
         viewBox='0 0 24 24'
         fill='none'
         stroke='currentColor'
         strokeWidth='2'
         strokeLinecap='round'
         strokeLinejoin='round'
         className='lucide lucide-id-card mr-4 mb-4 sm:mb-0 text-blue-500 self-start sm:self-auto'
         style={{ transform: 'rotate(-25deg)' }}
       >
         <path d='M16 10h2' />
         <path d='M16 14h2' />
         <path d='M6.17 15a3 3 0 0 1 5.66 0' />
         <circle cx='9' cy='11' r='2' />
         <rect x='2' y='5' width='20' height='14' rx='2' />
       </svg>
       <div className='w-full overflow-hidden'>
         <div className='text-lg font-bold'>
           Increase Your Profile Strength!
         </div>
         <div className='w-full max-w-full overflow-hidden'>
           <ProfileProgressBar percentage={profilePercentage} />
         </div>
         <div className='mb-4 text-sm mt-4 break-words'>
           We recommend you complete the following:
         </div>
         <ul className='list-decimal pl-6 text-sm overflow-hidden'>
         {missingFields
             .slice(0, showMore ? missingFields.length : 1)
             .map((recommendation, index) => (
               <li key={index} className="break-words">
                 <span
                   dangerouslySetInnerHTML={{
                     __html: DOMPurify.sanitize(recommendation),
                   }}
                 />
               </li>
             ))}
         </ul>
         {missingFields.length > 1 && (
             <button
               className="text-blue-600 p-2 flex items-center gap-1"
               onClick={() => setShowMore(!showMore)}
             >
               <span className="text-xs">{showMore ? "Show Less" : "Show More"}</span>
               <PiCaretDown className={`w-3 h-3 relative top-[0.5px] ${showMore ? "rotate-180 top-[1.5px]" : ""}`}/>
             </button>
         )}
       </div>
     </div>


     <div className='flex w-full items-end gap-2 mt-4 sm:mt-0'>
       <div className='flex w-full justify-end gap-2'>
       {pathname !== "/profile" && (
           <Button
             variant='default'
             animation='default'
             size='sm'
             onClick={() => router.push('/profile')}
           >
             Update profile
           </Button>
         )}
       </div>
     </div>
   </div>
 );
};


export default ProfileProgress;
