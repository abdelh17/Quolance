import React, { useState } from "react";
import { Wrench } from "lucide-react";
import {EditModesType } from "@/constants/models/user/UserResponse";
import EditButton from "./EditButton";
import SaveButton from "./SaveButton";


interface SkillsSectionProps {
   profile: {
       skills: string[];
   };
   handleSkillsChange: (skills: string) => void;
   inputClassName: string;
   availableSkills: string[];
   updateEditModes:(value:string)=>void;
   editModes: EditModesType;
   handleSave:(value:string)=>void;
   checkEditModes:(value:string)=>boolean;
}


const SkillsSection: React.FC<SkillsSectionProps> = ({
   profile,
   handleSkillsChange,
   inputClassName,
   availableSkills,
   updateEditModes,
   editModes,
   handleSave,
   checkEditModes
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


   return (
       <section className="bg-white rounded-xl shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
           <div className="flex justify-between mb-4">
           <h2 className="text-xl font-semibold text-gray-800 self-center">Skills</h2>
           {!editModes.editSkills?(<EditButton editModeKey="editSkills" updateEditModes={updateEditModes} checkEditModes={checkEditModes}/>):null}
           </div>
           {editModes.editSkills ? (
               <div>
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
                   <div className="mt-4">
                   <SaveButton editModeKey="editSkills" handleSave={handleSave}/>
                   </div>
               </div>
           ) : (
               <div className="flex flex-wrap gap-2">
                   {profile.skills.length > 0 ? (
                       profile.skills.map((skill) => (
                           <span
                               key={skill}
                               className="bg-blue-100 text-b300 px-4 py-2 rounded-lg text-xs capitalize"
                           >
                              {skill}
                          </span>
                       ))
                   ) : (
                       <div className="flex items-center">
                           <Wrench className="text-b300 mr-3" />
                           <span className="text-gray-700">Not specified</span>
                       </div>
                   )}
               </div>
           )}
       </section>
   );
};


export default SkillsSection;
