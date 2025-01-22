import React from "react";
import { Book } from "lucide-react";
import { FreelancerProfileType } from "@/constants/models/user/UserResponse";

interface AboutSectionProps {
  profile: {
    bio: string;
  };
  editMode: boolean;
  handleInputChange: (field: keyof FreelancerProfileType, value: string) => void; 
  inputClassName: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ profile, editMode, handleInputChange, inputClassName }) => (
  <section className="bg-white rounded-xl shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800">About Me</h2>
    {editMode ? (
      <textarea
        value={profile.bio}
        placeholder="Enter Biography"
        onChange={(e) => handleInputChange("bio", e.target.value)} 
        className={inputClassName}
        rows={4}
      />
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

