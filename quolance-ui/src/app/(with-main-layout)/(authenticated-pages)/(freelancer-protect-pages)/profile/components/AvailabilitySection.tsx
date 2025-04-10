import React from "react";
import { Calendar } from "lucide-react";
import { FreelancerProfileType, EditModesType } from "@/models/user/UserResponse";
import { AvailabilityRadioGroup } from "@/components/ui/freelancers/FreelancerProfileRadioGroups";
import EditButton from "./EditButton";
import SaveButton from "./SaveButton";
import { CalendarDaysIcon } from "lucide-react";






interface AvailabilitySectionProps {
  profile: {
    availability?: string | null;
  };
  handleInputChange: (field: keyof FreelancerProfileType, value: string) => void;
  updateEditModes: (value: string) => void;
  editModes: EditModesType;
  handleSave: (value: string) => void;
  checkEditModes: (value: string) => boolean;
}




const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({
  profile,
  handleInputChange,
  updateEditModes,
  editModes,
  handleSave,
  checkEditModes
}) => (
  <section className="bg-white rounded-xl shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
    <div className="flex justify-between mb-4">
      <h2 className="flex items-center self-center text-md sm:text-xl font-semibold text-gray-80">
        <CalendarDaysIcon className=" mr-2" /> Availability
      </h2>
      {!editModes.editAvailability ? (<EditButton editModeKey="editAvailability" updateEditModes={updateEditModes} checkEditModes={checkEditModes} dataTest="profile-availability-edit-btn" />) : null}
    </div>
    <div className="">

      {editModes.editAvailability ? (
        <div>
          <div className="flex items-center">
            <AvailabilityRadioGroup
              name="availability"
              value={profile.availability ?? ""} // Default to empty string if null or undefined
              onChange={(e) => handleInputChange("availability", e.target.value)}
            />
          </div>
          <div className="mt-4">
            <SaveButton editModeKey="editAvailability" handleSave={handleSave} dataTest="profile-availability-save-btn" />
          </div>
        </div>
      ) : (
        <div className="flex items-center">
          <p
            className={
              profile.availability
                ? 'capitalize text-gray-700'
                : 'italic text-gray-500'
            }
          >
            {profile.availability?.toLowerCase().replace("_", " ") ?? "No availability added."}
          </p>
        </div>

      )}
    </div>
  </section>
);




export default AvailabilitySection;
