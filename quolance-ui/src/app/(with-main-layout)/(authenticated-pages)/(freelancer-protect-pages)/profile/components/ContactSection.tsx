import React from "react";
import { Mail, Users } from "lucide-react";
import { FreelancerProfileType,EditModesType } from "@/constants/models/user/UserResponse";
import EditButton from "./EditButton";
import SaveButton from "./SaveButton";


interface ContactSectionProps {
   profile: {
     contactEmail?: string | null;
     city?: string | null;
     state?: string | null;
     socialMediaLinks: string[];
   };
   handleInputChange: (field: keyof FreelancerProfileType, value: string) => void;
   handleSocialLinksChange: (links: string) => void;
   getSocialIcon: (url: string) => JSX.Element;
   inputClassName: string;
   updateEditModes:(value:string)=>void;
   editModes: EditModesType;
   handleSave:(value:string)=>void;
   checkEditModes:(value:string)=>boolean;
 }


 const ContactSection: React.FC<ContactSectionProps> = ({
   profile,
   handleInputChange,
   handleSocialLinksChange,
   getSocialIcon,
   inputClassName,
   updateEditModes,
   editModes,
   handleSave,
   checkEditModes
 }) => {
  
   let contactEmailDisplay;
   if (profile.contactEmail && profile.contactEmail.length > 0) {
     contactEmailDisplay = (
       <a
         href={`mailto:${profile.contactEmail}`}
         className="text-b300 hover:text-b500 transition-colors duration-200"
       >
         {profile.contactEmail}
       </a>
     );
   } else {
     contactEmailDisplay = <span className="text-gray-700">Not Specified</span>;
   }
    return (
     <section className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
       <div className="flex justify-between mb-4">
       <h2 className="text-xl font-semibold self-center text-gray-800">Contact Information</h2>
       {!editModes.editContactInformation?(<EditButton editModeKey="editContactInformation" updateEditModes={updateEditModes} checkEditModes={checkEditModes}/>):null}
       </div>
      
       <div className="space-y-6">
         {/* Contact Email */}
         <div className="flex items-center">
           <Mail className=" mr-3" />
           {editModes.editContactInformation ? (
             <input
               type="email"
               value={profile.contactEmail ?? ""}
               placeholder="Enter Contact Email"
               onChange={(e) => handleInputChange("contactEmail", e.target.value)}
               className={inputClassName}
             />
           ) : (
             contactEmailDisplay
           )}
         </div>
          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Social Media</h3>
            {editModes.editContactInformation ? (
              <div>
                <input
                  type="text"
                  value={profile.socialMediaLinks.join(", ")}
                  onChange={(e) => handleSocialLinksChange(e.target.value)}
                  className={inputClassName}
                  placeholder="Enter Social Media Links Separated By Commas"
                />
                <div className="mt-4">
                  <SaveButton editModeKey="editContactInformation" handleSave={handleSave} />
                </div>
              </div>
            ) : (
              <div>
                {profile.socialMediaLinks.length > 0 && profile.socialMediaLinks.some((link) => link.trim() !== "") ? (
                  <div className="space-y-2">
                    {profile.socialMediaLinks.map((link) => (
                      link.trim() !== "" && (
                        <div key={link} className="flex items-center group">
                          {getSocialIcon(link)}
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-b300 hover:text-b500 transition-colors duration-200 ml-2 group-hover:underline"
                          >
                            {link.split("/").pop()}
                          </a>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Users className="text-b300 mr-3" />
                    <span className="text-gray-700">Not Specified</span>
                  </div>
                )}
              </div>
            )}
        </div>

       </div>
     </section>
   );
 };
  export default ContactSection;
 

  
