import React from "react";
import { Briefcase } from "lucide-react";
import { FreelancerProfileType,EditModesType } from "@/constants/models/user/UserResponse";
import { ExperienceLevelRadioGroup } from "@/components/ui/freelancers/FreelancerProfileRadioGroups";
import EditButton from "./EditButton";
import SaveButton from "./SaveButton";


interface ExperienceSectionProps {
 profile: {
   experienceLevel?: string | null;
 };
 handleInputChange: (field: keyof FreelancerProfileType, value: string) => void;
 updateEditModes:(value:string)=>void;
 editModes: EditModesType;
 handleSave:(value:string)=>void;
 checkEditModes:(value:string)=>boolean;
}


const ExperienceSection: React.FC<ExperienceSectionProps> = ({
 profile,
 handleInputChange,
 updateEditModes,
 editModes,
 handleSave,
 checkEditModes
}) => (
 <section className="bg-white rounded-xl shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
   <div className="flex justify-between mb-4">
   <h2 className="text-xl font-semibold text-gray-800 self-center">Experience</h2>
   {!editModes.editExperience ?(<EditButton editModeKey="editExperience" updateEditModes={updateEditModes} checkEditModes={checkEditModes}/>):null}
   </div>
   <div className="">
     {editModes.editExperience ? (
       <div>
         <div className="flex">
         <Briefcase className="text-b300 mr-3" />
         <ExperienceLevelRadioGroup
           name="experienceLevel"
           value={profile.experienceLevel ?? ""}
           onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
         />
         </div>
         <div className="mt-4">
         <SaveButton editModeKey="editExperience" handleSave={handleSave}/>
         </div>
        


       </div>
      
      
     ) : (
       <div className="flex items-center">
         <Briefcase className="text-b300 mr-3" />
       <span className="text-gray-700 capitalize">
         {profile.experienceLevel?.toLowerCase() ?? "Not specified"}
       </span>
       </div>
     )}
   </div>
 </section>
);


export default ExperienceSection;

