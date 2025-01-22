import React from "react";
import { User } from "lucide-react";
import { ProfileImageModal } from "./ProfileImageModal";
import { UserResponse,FreelancerProfileType } from "@/constants/models/user/UserResponse"; 


interface ProfileHeaderProps {
  user: UserResponse | undefined;
  profile: FreelancerProfileType; 
  editMode: boolean;
  isImageError: boolean;
  isModalOpen: boolean;
  setIsImageError: (value: boolean) => void;
  handleImageClick: () => void;
  handleSelect: (file: File) => void;
  handleCancel: () => void;
  handleInputChange: (field: keyof FreelancerProfileType, value: string) => void; 
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  profile,
  editMode,
  isImageError,
  isModalOpen,
  setIsImageError,
  handleImageClick,
  handleSelect,
  handleCancel,
  handleInputChange,
}) => {
  return (
    <header className="bg-gradient-to-r from-b300 to-blue-600 text-white py-20 px-4 transition-colors duration-300">
      <div className="container mx-auto text-center">
        {/* Profile Image */}
        {!isImageError && user?.profileImageUrl ? (
          <button
            type="button"
            className={`w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg ${
              editMode ? "cursor-pointer" : ""
            }`}
            onClick={editMode ? handleImageClick : undefined}
            onKeyDown={(e) => {
              if (editMode && (e.key === "Enter" || e.key === " ")) {
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
            className={`w-32 h-32 rounded-full mx-auto mb-4 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-4xl shadow-lg ${
              editMode ? "cursor-pointer hover:bg-blue-700" : ""
            }`}
            onClick={editMode ? handleImageClick : undefined}
            onKeyDown={(e) => {
              if (editMode && (e.key === "Enter" || e.key === " ")) {
                handleImageClick();
              }
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <User className="w-14 h-14" />
          </button>
        )}

        {/* Modal for Image Upload */}
        {isModalOpen && <ProfileImageModal onSelect={handleSelect} onCancel={handleCancel} />}

        {/* Profile Name or Editable Inputs */}
        {editMode ? (
          <div className="space-y-2">
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/70"
              placeholder="Enter First Name"
            />
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/70 ml-2"
              placeholder="Enter Last Name"
            />
          </div>
        ) : (
          <h1 className="text-4xl md:text-5xl font-bold mb-2 transition-all duration-300">
            {`${profile.firstName} ${profile.lastName}`}
          </h1>
        )}
      </div>
    </header>
  );
};

export default ProfileHeader;


