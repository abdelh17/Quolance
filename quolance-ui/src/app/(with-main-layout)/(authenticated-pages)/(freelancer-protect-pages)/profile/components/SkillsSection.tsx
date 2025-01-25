import React from "react";
import { Wrench } from "lucide-react";


interface SkillsSectionProps {
  profile: {
    skills: string[];
  };
  editMode: boolean;
  handleSkillsChange: (skills: string) => void;
  inputClassName: string;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
  profile,
  editMode,
  handleSkillsChange,
  inputClassName,
}) => (
  <section className="bg-white rounded-xl shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Skills</h2>
    {editMode ? (
      <input
        type="text"
        value={profile.skills.join(", ")} 
        onChange={(e) => handleSkillsChange(e.target.value)} 
        className={inputClassName}
        placeholder="Enter Skills Separated By Commas"
      />
    ) : (
      <div className="flex flex-wrap gap-2">
        {profile.skills.length > 0 ? (
          profile.skills.map((skill) => (
            <span
              key={skill}
              className="bg-blue-100 text-b300 px-4 py-2 rounded-lg text-sm capitalize transition-all duration-200 hover:bg-blue-200"
            >
              {skill.toLowerCase()}
            </span>
          ))
        ) : (
          <div className="flex items-center">
            <Wrench className="text-b300 mr-3" />
            <span className="text-gray-700 capitalize">Not specified</span>
          </div>
        )}
      </div>
    )}
  </section>
);

export default SkillsSection;
