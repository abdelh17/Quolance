import React from "react";
import { Briefcase } from "lucide-react";
import { FreelancerProfileType } from "@/constants/models/user/UserResponse";
import { ExperienceLevelRadioGroup } from "@/components/ui/freelancers/FreelancerProfileRadioGroups"; 

interface ExperienceSectionProps {
  profile: {
    experienceLevel?: string | null;
  };
  editMode: boolean;
  handleInputChange: (field: keyof FreelancerProfileType, value: string) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  profile,
  editMode,
  handleInputChange,
}) => (
  <section className="bg-white rounded-xl shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Experience</h2>
    <div className="flex items-center">
      <Briefcase className="text-b300 mr-3" />
      {editMode ? (
        <ExperienceLevelRadioGroup
          name="experienceLevel"
          value={profile.experienceLevel ?? ""}
          onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
        />
      ) : (
        <span className="text-gray-700 capitalize">
          {profile.experienceLevel?.toLowerCase() || "Not specified"}
        </span>
      )}
    </div>
  </section>
);

export default ExperienceSection;

