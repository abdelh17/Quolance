import { FreelancerProfileType} from "@/constants/models/user/UserResponse";
import React, { useState, useEffect } from "react";
import ProfileProgressBar from "./ProfileProgressBar";


interface ProfileStatusProps {
 profile: FreelancerProfileType;
 profilePercentage:number;
 isHidden: boolean;
 updateEditModes:(value:string)=>void;
 checkEditModes:(value:string)=>boolean;
 dontShowStatus:()=>void;
}


const ProfileProgress: React.FC<ProfileStatusProps> = ({
 profile,
 profilePercentage,
 isHidden,
 updateEditModes,
 checkEditModes,
 dontShowStatus
}) => {

 const [missingFields, setMissingFields] = useState<string[]>([]);


 const filterMissingFields = () => {
   let missing: string[] = [];
   Object.entries(profile).forEach(([key, value]) => {
     if (
       key !== "id" &&
       key !== "userId" &&
       key !== "username" &&
       (
         value === null ||
         value === undefined ||
         value === "" ||
         (Array.isArray(value) &&
           (value.length === 0 || value.every((item) => item === "")))
       )
     ) {
       missing.push(key);
     }
   });


   const uniqueRecommendations = Array.from(
     new Set(missing.map((key) => getRecommendation(key)))
   ).filter(Boolean) as string[];
   setMissingFields(uniqueRecommendations);
 };




 const getRecommendation = (key: string) => {
   switch (key) {
     case "profileImageUrl":
       return 'Uploading a <strong>Profile Picture</strong>';
     case "bio":
       return "Filling out the <strong>'About Me' </strong> section";
     case "skills":
       return "Filling out the <strong>'Skills' </strong> section ";
     case "contactEmail":
     case "socialMediaLinks":
       return "Filling out the <strong>'Contact Information' </strong> section ";
     case "city":
     case "state":
       return "Filling out the <strong>'Location'</strong> section "
     case "firstName":
     case "lastName":
       return "Filling out the <strong>'Name' </strong> section ";
     case "experienceLevel":
       return "Filling out the <strong>'Experience' </strong> section ";
     case "availability":
       return "Filling out the <strong>'Availability' </strong> section ";
     default:
       return null;
   }
 };


 const handleClick = () => {
   updateEditModes("editProfile");
 };


 const removeStatus= () =>{
   dontShowStatus();
 }


 useEffect(() => {
   filterMissingFields();
 }, [profile]);


 const checkModes = checkEditModes("editProfile");


 if (isHidden) return null;


 return (
   <div className="py-4 bg-white p-4 mb-8 rounded-lg shadow-md flex  md:justify-between lg:flex-nowrap flex-wrap gap-8">
       <div className="flex items-center sm:px-8 px-2 ">
           <svg
           xmlns="http://www.w3.org/2000/svg"
           width="56"
           height="56"
           viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           strokeWidth="2"
           strokeLinecap="round"
           strokeLinejoin="round"
           className="lucide lucide-id-card text-blue-500 mr-4"
           style={{ transform: "rotate(-25deg)" }}
           >
           <path d="M16 10h2" />
           <path d="M16 14h2" />
           <path d="M6.17 15a3 3 0 0 1 5.66 0" />
           <circle cx="9" cy="11" r="2" />
           <rect x="2" y="5" width="20" height="14" rx="2" />
           </svg>
           <div className="sm:max-w-max w-full">
               <div className="font-bold text-lg">Increase Your Profile Strength!</div>
               <ProfileProgressBar  percentage={profilePercentage} />
               <div className="text-sm mb-4">
                     We recommend you complete the following:
                   </div>
                   <ul className="text-sm list-decimal pl-6">
                       {missingFields.map((recommendation, index) => (
                       <li key={index}>
                           <span dangerouslySetInnerHTML={{ __html: recommendation }} />
                       </li>
                       ))}
                   </ul>
           </div>
       </div>
      
       <div className="flex  items-end  w-full  gap-2">
           <div className="flex w-full justify-end gap-2">
               <button className="bg-blue-50 text-grey-500 text-xs px-4 py-2 rounded-md hover:bg-blue-100 max-h-max"
               onClick={removeStatus}
               >
               Don't show again
               </button>
               <button
               className={`bg-blue-500 text-white text-xs px-4 py-2 rounded-md  max-h-max ${
                 checkModes ? "cursor-not-allowed" : "hover:bg-blue-600"
               }`}
               disabled={checkModes}
               onClick={handleClick}>
               Update profile
               </button>
           </div>
       </div>


   </div>
 );
};


export default ProfileProgress;
