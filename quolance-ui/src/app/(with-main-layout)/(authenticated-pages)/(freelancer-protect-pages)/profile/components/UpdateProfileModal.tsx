import React, { useState } from "react";
import {FreelancerProfileType } from "@/constants/models/user/UserResponse";
import { ExperienceLevelRadioGroup } from "@/components/ui/freelancers/FreelancerProfileRadioGroups";
import { AvailabilityRadioGroup } from "@/components/ui/freelancers/FreelancerProfileRadioGroups";
import SaveButton from "./SaveButton";
import { X } from 'lucide-react';




interface UpdateProfileModalProps {
profile: FreelancerProfileType;
inputClassName: string;
availableSkills: string[];
saveEditModes:(value:string)=>void;
handleInputChange: (field: keyof FreelancerProfileType, value: string) => void;
handleSkillsChange: (skills: string) => void;
handleSocialLinksChange: (links: string) => void;
handleSave:(value:string)=>void;
}




export const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
profile,
inputClassName,
availableSkills,
saveEditModes,
handleInputChange,
handleSkillsChange,
handleSocialLinksChange,
handleSave
}) => {


    const [searchTerm, setSearchTerm] = useState("");


    const handleSkillClick = (skill: string) => {
       const currentSkills = new Set(profile.skills);
       if (currentSkills.has(skill)) {
           currentSkills.delete(skill);
       } else {
           currentSkills.add(skill);
       }
       handleSkillsChange(Array.from(currentSkills).join(","));
   };
   
    const filteredSkills = availableSkills.filter(skill =>
       skill.toLowerCase().includes(searchTerm.toLowerCase())
   );
  
   const handleClose = ()=>{
       saveEditModes("editProfile")
   }




return (
  <dialog
className="relative z-10"
aria-labelledby="modal-title"
open
aria-modal="true"
>
<div
  className="fixed inset-0 bg-gray-500/75 transition-opacity"
  aria-hidden="true"
></div>
<div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
  <div
    className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
    style={{ marginTop: "-75px" }}
  >
    <div
      className="relative w-full max-w-3xl  transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8"
    >
      <div className="bg-white">


           <div className="flex justify-between items-center border-b border-gray-200 p-3">
                   <h2 className="font-bold text-lg">Edit Profile</h2>
                   <button
                   className= "rounded-3xl h-10 w-10 flex justify-center items-center hover:bg-gray-100"
                   onClick={handleClose}
                   >
                       <X className=""/>
                   </button>
           </div>
        <div className="sm:flex sm:items-start sm:justify-between">
         
           <div className=" flex flex-col gap-6 w-full p-10 overflow-y-auto h-[500px]">
                   <div>
                       <label className="text-sm text-gray-500">First Name</label>
                       <input
                       type="text"
                       value={profile.firstName}
                       onChange={(e) => handleInputChange("firstName", e.target.value)}
                       className={`text-sm placeholder:text-sm ${inputClassName}`}
                       placeholder="Enter First Name"
                       />
                   </div>
                   <div>
                       <label className="text-sm text-gray-500">Last Name</label>
                       <input
                       type="text"
                       value={profile.lastName}
                       onChange={(e) => handleInputChange("lastName", e.target.value)}
                       className={`text-sm placeholder:text-sm ${inputClassName}`}
                       placeholder="Enter Last Name"
                       />
                   </div>
                   <div>
                       <label className="text-sm text-gray-500">City</label>
                       <input
                       type="text"
                       value={profile.city ?? ""}
                       onChange={(e) => handleInputChange("city", e.target.value)}
                       className={`text-sm placeholder:text-sm ${inputClassName}`}
                       placeholder="Enter Last Name"
                       />
                   </div>
                   <div>
                       <label className="text-sm text-gray-500">State</label>
                       <input
                       type="text"
                       value={profile.state ?? ""}
                       onChange={(e) => handleInputChange("state", e.target.value)}
                       className={`text-sm placeholder:text-sm ${inputClassName}`}
                       placeholder="Enter Last Name"
                       />
                   </div>
                   <div>
                       <label className="text-sm text-gray-500">About</label>
                       <textarea
                       value={profile.bio}
                       placeholder="Enter Biography"
                       onChange={(e) => handleInputChange("bio", e.target.value)}
                       className={`text-sm placeholder:text-sm ${inputClassName}`}
                       rows={4}
                       />
                   </div>
                   <div>
                       <label className="text-sm text-gray-500">Experience</label>
                           <div className="flex mt-2">
                           <ExperienceLevelRadioGroup
                               name="experienceLevel"
                               value={profile.experienceLevel ?? ""}
                               onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
                           />
                           </div>
                   </div>


                   <div>
                       <label className="text-sm text-gray-500">Availability</label>
                        <div className="flex mt-2">
                           <AvailabilityRadioGroup
                           name="availability"
                           value={profile.availability ?? ""}
                           onChange={(e) => handleInputChange("availability", e.target.value)}
                           />
                       </div>
                   </div>


                   <div>
                       <label className="text-sm text-gray-500">Skills</label>
                       <div className="space-y-4">
                           <input
                               type="text"
                               value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)}
                               className={`text-sm placeholder:text-sm ${inputClassName}`}
                               placeholder="Search skills..."
                           />
                           <div className="flex flex-wrap gap-2">
                               {filteredSkills.map((skill) => (
                                   <button
                                       key={skill}
                                       onClick={() => handleSkillClick(skill)}
                                       className={`px-4 py-2 rounded-lg text-xs transition-all duration-200 ${
                                           profile.skills.includes(skill)
                                               ? "bg-blue-500 text-white"
                                               : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                       }`}
                                   >
                                       {skill}
                                   </button>
                               ))}
                           </div>
                   </div>
                   </div>
                   <div>
                       <label className="text-sm text-gray-500">Contact Email</label>
                       <input
                           type="email"
                           value={profile.contactEmail ?? ""}
                           placeholder="Enter Contact Email"
                           onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                           className={`text-sm placeholder:text-sm ${inputClassName}`}
                       />
                   </div>


                   <div>
                       <label className="text-sm text-gray-500">Social Media</label>
                       <input
                           type="text"
                           value={profile.socialMediaLinks.join(", ")}
                           onChange={(e) => handleSocialLinksChange(e.target.value)}
                           className={`text-sm placeholder:text-sm ${inputClassName}`}
                           placeholder="Enter Social Media Links Separated By Commas"
                       />
                   </div>
           </div>




  
        </div>
        <div className="flex justify-end items-center border-t border-gray-200 p-4">


           <SaveButton editModeKey="editProfile" handleSave={handleSave}/>


        </div>
      </div>
    
    </div>
  </div>
</div>
</dialog>




);
};
