import React from "react";
import { Calendar } from "lucide-react";
import { FreelancerProfileType } from "@/constants/models/user/UserResponse";
import { AvailabilityRadioGroup } from "@/components/ui/freelancers/FreelancerProfileRadioGroups"; 

interface AvailabilitySectionProps {
  profile: {
    availability?: string | null; 
  };
  editMode: boolean;
  handleInputChange: (field: keyof FreelancerProfileType, value: string) => void;
}

const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({
  profile,
  editMode,
  handleInputChange,
}) => (
  <section className="bg-white rounded-xl shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Availability</h2>
    <div className="flex items-center">
      <Calendar className="text-b300 mr-3" />
      {editMode ? (
        <AvailabilityRadioGroup
          name="availability"
          value={profile.availability ?? ""} // Default to empty string if null or undefined
          onChange={(e) => handleInputChange("availability", e.target.value)}
        />
      ) : (
        <span className="text-gray-700 capitalize">
          {profile.availability?.toLowerCase().replace("_", " ") || "Not specified"}
        </span>
      )}
    </div>
  </section>
);

export default AvailabilitySection;
