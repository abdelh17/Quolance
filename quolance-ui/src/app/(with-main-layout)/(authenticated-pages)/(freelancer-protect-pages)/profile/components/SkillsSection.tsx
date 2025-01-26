import React, { useState } from "react";
import { Wrench } from "lucide-react";

interface SkillsSectionProps {
    profile: {
        skills: string[];
    };
    editMode: boolean;
    handleSkillsChange: (skills: string) => void;
    inputClassName: string;
    availableSkills: string[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
                                                         profile,
                                                         editMode,
                                                         handleSkillsChange,
                                                         availableSkills
                                                     }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSkillClick = (skill: string) => {
        const currentSkills = new Set(profile.skills);
        if (currentSkills.has(skill)) {
            currentSkills.delete(skill);
        } else {
            currentSkills.add(skill);
        }
        handleSkillsChange(Array.from(currentSkills).join(","));
    };

    const filteredSkills = availableSkills.filter(skill =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="bg-white rounded-xl shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Skills</h2>
            {editMode ? (
                <div className="space-y-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search skills..."
                    />
                    <div className="flex flex-wrap gap-2">
                        {filteredSkills.map((skill) => (
                            <button
                                key={skill}
                                onClick={() => handleSkillClick(skill)}
                                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                    profile.skills.includes(skill)
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {profile.skills.length > 0 ? (
                        profile.skills.map((skill) => (
                            <span
                                key={skill}
                                className="bg-blue-100 text-b300 px-4 py-2 rounded-lg text-sm capitalize"
                            >
                               {skill}
                           </span>
                        ))
                    ) : (
                        <div className="flex items-center">
                            <Wrench className="text-b300 mr-3" />
                            <span className="text-gray-700">Not specified</span>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default SkillsSection;