import React, { useState } from "react";
import { Book, Sparkles } from "lucide-react";
import { EditModesType, FreelancerProfileType } from "@/models/user/UserResponse";
import EditButton from "./EditButton";
import SaveButton from "./SaveButton";
import AiPromptModal from "@/components/ui/AiPromptModal";
import { useGenerateAbout } from "@/api/textGeneration-api";
import { motion } from 'framer-motion';

interface AboutSectionProps {
  profile: {
    bio: string;
  };
  handleInputChange: (
    field: keyof FreelancerProfileType,
    value: string
  ) => void;
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
  checkEditModes,
}) => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const maxBioLength = 2000;

  // Use your chosen mutation hook (e.g., useGenerateAbout) here:
  const generateAboutMutation = useGenerateAbout();

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxBioLength) {
      handleInputChange('bio', text);
    }
  };

  // Callback when user clicks "Apply" in the AI modal
  const handleApplyAiText = (aiText: string) => {
    // Set the about/bio to the AI-generated text
    handleInputChange('bio', aiText);
  };

  return (
    <section className='mb-8 rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md'>
      <div className='mb-4 flex justify-between'>
        <h2 className='self-center text-xl font-semibold text-gray-800'>
          About
        </h2>
        {!editModes.editAbout && (
          <EditButton
            editModeKey='editAbout'
            updateEditModes={updateEditModes}
            checkEditModes={checkEditModes}
          />
        )}
      </div>

      {editModes.editAbout ? (
        <div>
          {/* Wrap the textarea in a relative container so the button can float */}
          <div className='relative'>
            <textarea
              value={profile.bio}
              placeholder='Enter Biography'
              onChange={handleBioChange}
              className={`w-full text-sm placeholder:text-sm ${inputClassName}`}
              rows={4}
            />
            {/* Floating AI button (top-right corner) */}
            <motion.button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="absolute top-2 right-2 flex items-center justify-center p-2
                bg-white/90 backdrop-blur-sm border border-indigo-100
                shadow-md text-indigo-800 rounded-md overflow-hidden"
              title="Generate with AI"
              whileHover={{ 
                y: -2, 
                boxShadow: "0 8px 20px -4px rgba(99, 102, 241, 0.25)"
              }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 15 
              }}
            >
              {/* Background gradient that appears on hover */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 opacity-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />

              {/* Icon container with animation */}
              <motion.div 
                className="relative flex items-center justify-center w-5 h-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-sm"
                whileHover={{ scale: 1.1 }}
              >
                <Sparkles className="w-3.5 h-3.5 text-white relative z-10" />
              </motion.div>

              {/* Tiny activity indicator */}
              <motion.span 
                className="absolute top-0.5 right-0.5 h-1 w-1 rounded-full bg-fuchsia-500"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2 
                }}
              />
            </motion.button>
          </div>

          <div className='mt-2 flex justify-between'>
            <div className='text-sm text-gray-500'>
              <span
                className={
                  profile.bio.length > maxBioLength * 0.9
                    ? 'text-amber-600'
                    : ''
                }
              >
                {profile.bio.length}
              </span>
              <span>/{maxBioLength} characters</span>
            </div>
            <SaveButton editModeKey='editAbout' handleSave={handleSave} />
          </div>
        </div>
      ) : (
        <div>
          {profile.bio.length > 0 ? (
            <p className='text-gray-700'>{profile.bio}</p>
          ) : (
            <div className='flex items-center'>
              <Book className='mr-3' />
              <p className='text-gray-700'>Not Specified</p>
            </div>
          )}
        </div>
      )}

      {/* AI Prompt Modal */}
      <AiPromptModal
        isOpen={isAiModalOpen}
        setIsOpen={setIsAiModalOpen}
        onApply={handleApplyAiText}
        generateMutation={generateAboutMutation}
        title='Generate About Me'
        confirmText='Apply'
      />
    </section>
  );
};

export default AboutSection;




