import React from "react";
import { Book } from "lucide-react";
import { FreelancerProfileType,EditModesType } from "@/constants/models/user/UserResponse";
import EditButton from "./EditButton";
import SaveButton from "./SaveButton";


interface AboutSectionProps {
 profile: {
   bio: string;
 };
 handleInputChange: (field: keyof FreelancerProfileType, value: string) => void;
 inputClassName: string;
 updateEditModes:(value:string)=>void;
 editModes: EditModesType;
 handleSave:(value:string)=>void;
 checkEditModes:(value:string)=>boolean;
}


const AboutSection: React.FC<AboutSectionProps> = ({
 profile,
 handleInputChange,
 inputClassName,
 updateEditModes,
 editModes,
 handleSave,
 checkEditModes }) => (
 <section className="bg-white rounded-xl shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
   <div className="flex justify-between mb-4">
   <h2 className="text-xl font-semibold  text-gray-800 self-center">About</h2>
   {!editModes.editAbout ?(<EditButton editModeKey="editAbout" updateEditModes={updateEditModes} checkEditModes={checkEditModes}/>):null}
   </div>
  
   {editModes.editAbout ? (
     <div>
        <textarea
       value={profile.bio}
       placeholder="Enter Biography"
       onChange={(e) => handleInputChange("bio", e.target.value)}
       className={`text-sm placeholder:text-sm ${inputClassName}`}
       rows={4}
     />
     <div className="mt-4">
     <SaveButton editModeKey="editAbout" handleSave={handleSave}/>
     </div>
     </div>
   
   ) : (
     <div>
       {profile.bio.length > 0 ? (
         <p className="text-gray-700">{profile.bio}</p>
       ) : (
         <div className="flex items-center">
           <Book className="text-b300 mr-3" />
           <p className="text-gray-700">Not Specified</p>
         </div>
       )}
     </div>
   )}
 </section>
);


export default AboutSection;

