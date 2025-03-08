import React, { useState, useEffect } from "react";
import { Mail, Users } from "lucide-react";
import { FreelancerProfileType, EditModesType } from "@/constants/models/user/UserResponse";
import EditButton from "./EditButton";
import SaveButton from "./SaveButton";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { BsTwitter, BsLinkedin } from "react-icons/bs";

interface ContactSectionProps {
  profile: {
    contactEmail?: string | null;
    city?: string | null;
    state?: string | null;
    socialMediaLinks: string[];
  };
  handleInputChange: (field: keyof FreelancerProfileType, value: string) => void;
  handleSocialLinksChange: (links: string) => void;
  getSocialIcon: (url: string) => JSX.Element;
  inputClassName: string;
  updateEditModes: (value: string) => void;
  editModes: EditModesType;
  handleSave: (value: string) => void;
  checkEditModes: (value: string) => boolean;
}

// Only allow 4 platforms
const SOCIAL_PLATFORMS = [
  { name: "Facebook", icon: <FaFacebook className="text-blue-600" />, prefix: "https://facebook.com/" },
  { name: "X", icon: <BsTwitter className="text-blue-400" />, prefix: "https://twitter.com/" },
  { name: "LinkedIn", icon: <BsLinkedin className="text-blue-700" />, prefix: "https://linkedin.com/in/" },
  { name: "GitHub", icon: <FaGithub className="text-gray-800" />, prefix: "https://github.com/" }
];

const ContactSection: React.FC<ContactSectionProps> = ({
  profile,
  handleInputChange,
  handleSocialLinksChange,
  getSocialIcon,
  inputClassName,
  updateEditModes,
  editModes,
  handleSave,
  checkEditModes
}) => {
  // Simple state for each platform
  const [facebookUsername, setFacebookUsername] = useState("");
  const [twitterUsername, setTwitterUsername] = useState("");
  const [linkedinUsername, setLinkedinUsername] = useState("");
  const [githubUsername, setGithubUsername] = useState("");

  // Parse existing links when entering edit mode
  useEffect(() => {
    if (editModes.editContactInformation) {
      // Reset all usernames
      setFacebookUsername("");
      setTwitterUsername("");
      setLinkedinUsername("");
      setGithubUsername("");
      
      // Look for each platform in the existing links
      profile.socialMediaLinks.forEach(link => {
        if (link.includes("facebook.com")) {
          setFacebookUsername(link.replace("https://facebook.com/", ""));
        } else if (link.includes("twitter.com")) {
          setTwitterUsername(link.replace("https://twitter.com/", ""));
        } else if (link.includes("linkedin.com/in")) {
          setLinkedinUsername(link.replace("https://linkedin.com/in/", ""));
        } else if (link.includes("github.com")) {
          setGithubUsername(link.replace("https://github.com/", ""));
        }
      });
    }
  }, [editModes.editContactInformation, profile.socialMediaLinks]);

  // Handle save action
  const handleSocialSave = () => {
    const links = [];
    
    // Only add links with usernames
    if (facebookUsername.trim()) {
      links.push(`https://facebook.com/${facebookUsername.trim()}`);
    }
    
    if (twitterUsername.trim()) {
      links.push(`https://twitter.com/${twitterUsername.trim()}`);
    }
    
    if (linkedinUsername.trim()) {
      links.push(`https://linkedin.com/in/${linkedinUsername.trim()}`);
    }
    
    if (githubUsername.trim()) {
      links.push(`https://github.com/${githubUsername.trim()}`);
    }
    
    // Update parent
    handleSocialLinksChange(links.join(", "));
    handleSave("editContactInformation");
  };
  
  // Email display logic
  let contactEmailDisplay;
  if (profile.contactEmail && profile.contactEmail.length > 0) {
    contactEmailDisplay = (
      <a
        href={`mailto:${profile.contactEmail}`}
        className="text-b300 hover:text-b500 transition-colors duration-200"
      >
        {profile.contactEmail}
      </a>
    );
  } else {
    contactEmailDisplay = <span className="text-gray-700">Not Specified</span>;
  }

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold self-center text-gray-800">Contact Information</h2>
        {!editModes.editContactInformation ? (
          <EditButton 
            editModeKey="editContactInformation" 
            updateEditModes={updateEditModes} 
            checkEditModes={checkEditModes}
          />
        ) : null}
      </div>
      
      <div className="space-y-6">
        {/* Contact Email */}
        <div className="flex items-center">
          <Mail className="mr-3" />
          {editModes.editContactInformation ? (
            <input
              type="email"
              value={profile.contactEmail ?? ""}
              placeholder="Enter Contact Email"
              onChange={(e) => handleInputChange("contactEmail", e.target.value)}
              className={inputClassName}
            />
          ) : (
            contactEmailDisplay
          )}
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Social Media</h3>
          
          {/* Edit Mode */}
          {editModes.editContactInformation ? (
            <div className="space-y-4">
              {/* Facebook */}
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-10 text-center text-xl">
                  <FaFacebook className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-md border border-gray-300 text-sm">
                      facebook.com/
                    </span>
                    <input
                      type="text"
                      value={facebookUsername}
                      placeholder="username"
                      onChange={(e) => setFacebookUsername(e.target.value)}
                      className={`${inputClassName} flex-1 rounded-l-none`}
                    />
                  </div>
                </div>
              </div>
              
              {/* X (Twitter) */}
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-10 text-center text-xl">
                  <BsTwitter className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-md border border-gray-300 text-sm">
                      twitter.com/
                    </span>
                    <input
                      type="text"
                      value={twitterUsername}
                      placeholder="username"
                      onChange={(e) => setTwitterUsername(e.target.value)}
                      className={`${inputClassName} flex-1 rounded-l-none`}
                    />
                  </div>
                </div>
              </div>
              
              {/* LinkedIn */}
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-10 text-center text-xl">
                  <BsLinkedin className="text-blue-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-md border border-gray-300 text-sm">
                      linkedin.com/in/
                    </span>
                    <input
                      type="text"
                      value={linkedinUsername}
                      placeholder="username"
                      onChange={(e) => setLinkedinUsername(e.target.value)}
                      className={`${inputClassName} flex-1 rounded-l-none`}
                    />
                  </div>
                </div>
              </div>
              
              {/* GitHub */}
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-10 text-center text-xl">
                  <FaGithub className="text-gray-800" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-md border border-gray-300 text-sm">
                      github.com/
                    </span>
                    <input
                      type="text"
                      value={githubUsername}
                      placeholder="username"
                      onChange={(e) => setGithubUsername(e.target.value)}
                      className={`${inputClassName} flex-1 rounded-l-none`}
                    />
                  </div>
                </div>
              </div>
              
              {/* Save button */}
              <div className="mt-4">
                <SaveButton 
                  editModeKey="editContactInformation" 
                  handleSave={handleSocialSave} 
                />
              </div>
            </div>
          ) : (
            <div>
              {/* Display Mode - Simple display with logo and username */}
              {profile.socialMediaLinks.length > 0 && profile.socialMediaLinks.some(link => link.trim() !== "") ? (
                <div className="flex flex-col space-y-3">
                  {/* Show each link with its logo */}
                  {profile.socialMediaLinks.map((link, index) => {
                    // Find which platform this link belongs to
                    const platform = SOCIAL_PLATFORMS.find(p => 
                      link.includes(p.prefix.replace("https://", ""))
                    );
                    
                    // Skip if we don't recognize the platform
                    if (!platform || !link.trim()) return null;

                    // Get the username from the link
                    const username = link.replace(platform.prefix, "");
                    
                    return (
                      <div key={index} className="flex items-center">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="rounded-full bg-gray-100 p-3 font-medium hover:bg-gray-200 transition-colors duration-200 mr-3"
                        >
                          {platform.icon}
                        </a>
                        <span className="text-gray-700">
                          {username}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center">
                  <Users className="text-blue-500 mr-3" />
                  <span className="text-gray-700">Not Specified</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;