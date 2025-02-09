import React from "react";
import { User,MapPin,Contact} from "lucide-react";
import { ProfileImageModal } from "./ProfileImageModal";
import { UserResponse,FreelancerProfileType,EditModesType } from "@/constants/models/user/UserResponse";
import EditButton from "./EditButton";
import SaveButton from "./SaveButton";




interface ProfileHeaderProps {
 user: UserResponse | undefined;
 profile: FreelancerProfileType;
 isImageError: boolean;
 isModalOpen: boolean;
 setIsImageError: (value: boolean) => void;
 handleImageClick: () => void;
 handleSelect: (file: File) => void;
 handleCancel: () => void;
 handleInputChange: (field: keyof FreelancerProfileType, value: string) => void;
 inputClassName: string;
 updateEditModes:(value:string)=>void;
 editModes: EditModesType;
 handleSave:(value:string)=>void;
 checkEditModes:(value:string)=>boolean;
}


const ProfileHeader: React.FC<ProfileHeaderProps> = ({
 user,
 profile,
 isImageError,
 isModalOpen,
 setIsImageError,
 handleImageClick,
 handleSelect,
 handleCancel,
 handleInputChange,
 inputClassName,
 updateEditModes,
 editModes,
 handleSave,
 checkEditModes
}) => {


 const checkModes = checkEditModes("editProfileImage");
 return (
   <section className="relative bg-white rounded-xl shadow-sm mb-8 transition-all duration-300 hover:shadow-md">
 <div className="bg-gray-200 h-48 rounded-t-xl relative"></div>
 <div className="flex justify-end mr-4 mt-4">
 {!editModes.editHeader ?(<EditButton editModeKey="editHeader" updateEditModes={updateEditModes} checkEditModes={checkEditModes}/>):null}
 </div>
  {/* Profile Image Button */}
 <div className="absolute top-[110px] left-6">
   {!isImageError && user?.profileImageUrl ? (
     <button
       type="button"
       disabled={checkModes}
       className={`w-32 h-32 rounded-full border border-gray-500 shadow-lg
         ${checkModes ? "cursor-not-allowed" :"hover:bg-gray-900"}`}
       onClick={!editModes.editProfileImage ? handleImageClick : undefined}
       onKeyDown={(e) => {
         if (!editModes.editProfileImage && (e.key === "Enter" || e.key === " ")) {
           handleImageClick();
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
     </button>
   ) : (
     <button
       type="button"
       disabled={checkModes}
       className={`bg-blue-400 w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl shadow-lg
         ${checkModes ? "cursor-not-allowed" :""}`}
       onClick={!editModes.editProfileImage ? handleImageClick : undefined}
       onKeyDown={(e) => {
         if (!editModes.editProfileImage && (e.key === "Enter" || e.key === " ")) {
           handleImageClick();
         }
       }}
       onMouseDown={(e) => e.preventDefault()}
     >
       <User className="w-14 h-14" />
     </button>
   )}
 </div>


 {/* Modal for Image Upload */}
 {isModalOpen && (
   <ProfileImageModal userProfileImage={user?.profileImageUrl} handleSave = {handleSave}onSelect={handleSelect} onCancel={handleCancel} />
 )}


 {/* Profile Content */}
 <div className="p-6">
 {editModes.editHeader ? (
   <div className="mt-12">
     <h2 className="text-xl font-semibold mb-4 text-gray-800">Name</h2>
     {/* First Name and Last Name Inputs */}
     <div className="flex gap-2">
       <input
         type="text"
         value={profile.firstName}
         onChange={(e) => handleInputChange("firstName", e.target.value)}
         className={`text-sm placeholder:text-sm ${inputClassName}`}
         placeholder="Enter First Name"
       />
       <input
         type="text"
         value={profile.lastName}
         onChange={(e) => handleInputChange("lastName", e.target.value)}
         className={`text-sm placeholder:text-sm ${inputClassName}`}
         placeholder="Enter Last Name"
       />
     </div>


     <h2 className="text-xl font-semibold mt-8 text-gray-800">Location</h2>


     {/* City and State Inputs */}
     <div className="flex items-center gap-2 mt-4">
      
       <input
         type="text"
         value={profile.city ?? ""}
         onChange={(e) => handleInputChange("city", e.target.value)}
         className={`text-sm placeholder:text-sm ${inputClassName}`}
         placeholder="Enter City"
       />
       <input
         type="text"
         value={profile.state ?? ""}
         onChange={(e) => handleInputChange("state", e.target.value)}
         className={`text-sm placeholder:text-sm ${inputClassName}`}
         placeholder="Enter State"
       />
     </div>
     <div className="mt-4">
     <SaveButton editModeKey="editHeader" handleSave={handleSave}/>
     </div>
    
  </div>
  
 ) : (
   <div>
     {/* Name Display */}
       <div className="-mt-4">
       {profile.firstName && profile.lastName ? (
         <h2 className="text-md md:text-2xl font-bold transition-all duration-300">
           {`${profile.firstName} ${profile.lastName}`}
         </h2>
       ) : (
         <div className="flex items-center">
           <Contact className="text-b300 mr-2" />
           <span className="text-gray-700">Not Specified</span>
         </div>
       )}
        </div>




     {/* City and State Display */}
     <div className="flex items-center mt-4">
     {!(profile.city && profile.state) && (
       <MapPin className="text-b300 mr-2" />
     )}
     <span className="text-gray-700">
       {profile.city && profile.state
         ? `${profile.city}, ${profile.state}`
         : "Not Specified"}
     </span>
     </div>


   </div>
 )}
</div>


</section>


 );
};


export default ProfileHeader;


