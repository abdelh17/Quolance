import React, { useState } from "react";
import { Book, Sparkles } from "lucide-react";
import { EditModesType, FreelancerProfileType } from "@/constants/models/user/UserResponse";
import EditButton from "./EditButton";
import SaveButton from "./SaveButton";
import AiPromptModal from "@/components/ui/AiPromptModal";

interface AboutSectionProps {
  profile: {
    bio: string;
  };
  handleInputChange: (field: keyof FreelancerProfileType, value: string) => void;
  inputClassName: string;
  updateEditModes: (value: string) => void;
  editModes: EditModesType;
  handleSave: (value: string) => void;
  checkEditModes: (value: string) => boolean;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  profile,
  handleInputChange,
  inputClassName,
  updateEditModes,
  editModes,
  handleSave,
  checkEditModes
}) => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const maxBioLength = 2000;

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxBioLength) {
      handleInputChange("bio", text);
    }
  };

  // Callback when user clicks "Apply" in the AI modal
  const handleApplyAiText = (aiText: string) => {
    // Set the about/bio to the AI-generated text
    handleInputChange("bio", aiText);
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 self-center">About</h2>
        {!editModes.editAbout && (
          <EditButton
            editModeKey="editAbout"
            updateEditModes={updateEditModes}
            checkEditModes={checkEditModes}
          />
        )}
      </div>

      {editModes.editAbout ? (
        <div>
          {/* Wrap the textarea in a relative container so the button can float */}
          <div className="relative">
            <textarea
              value={profile.bio}
              placeholder="Enter Biography"
              onChange={handleBioChange}
              className={`text-sm placeholder:text-sm w-full ${inputClassName}`}
              rows={4}
            />
            {/* Floating AI button (top-right corner) */}
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="absolute top-2 right-2 flex items-center justify-center bg-indigo-600 text-white p-2 rounded-full shadow-md hover:bg-indigo-700 transform hover:scale-110 transition-all"
              title="Generate with AI"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-between mt-2">
            <div className="text-sm text-gray-500">
              <span
                className={profile.bio.length > maxBioLength * 0.9 ? "text-amber-600" : ""}
              >
                {profile.bio.length}
              </span>
              <span>/{maxBioLength} characters</span>
            </div>
            <SaveButton editModeKey="editAbout" handleSave={handleSave} />
          </div>
        </div>
      ) : (
        <div>
          {profile.bio.length > 0 ? (
            <p className="text-gray-700">{profile.bio}</p>
          ) : (
            <div className="flex items-center">
              <Book className="mr-3" />
              <p className="text-gray-700">Not Specified</p>
            </div>
          )}
        </div>
      )}

      {/* AI Prompt Modal */}
      <AiPromptModal
        isOpen={isAiModalOpen}
        setIsOpen={setIsAiModalOpen}
        onApply={handleApplyAiText}
      />
    </section>
  );
};

export default AboutSection;
