import React, { useState } from "react";
import { Mail, Users, Plus, X } from "lucide-react";
import { FreelancerProfileType, EditModesType } from "@/constants/models/user/UserResponse";
import EditButton from "./EditButton";
import SaveButton from "./SaveButton";
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaYoutube, 
  FaGithub, 
  FaTiktok,
  FaGlobe
} from "react-icons/fa";
import { BsTwitter, BsLinkedin, BsInstagram } from "react-icons/bs";

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

// Social media platform options
const SOCIAL_PLATFORMS = [
  { name: "Facebook", icon: <FaFacebook className="text-blue-600" />, prefix: "https://facebook.com/" },
  { name: "Twitter/X", icon: <BsTwitter className="text-blue-400" />, prefix: "https://twitter.com/" },
  { name: "LinkedIn", icon: <BsLinkedin className="text-blue-700" />, prefix: "https://linkedin.com/in/" },
  { name: "Instagram", icon: <BsInstagram className="text-pink-600" />, prefix: "https://instagram.com/" },
  { name: "YouTube", icon: <FaYoutube className="text-red-600" />, prefix: "https://youtube.com/" },
  { name: "GitHub", icon: <FaGithub className="text-gray-800" />, prefix: "https://github.com/" },
  { name: "TikTok", icon: <FaTiktok className="text-black" />, prefix: "https://tiktok.com/@" },
  { name: "Website", icon: <FaGlobe className="text-blue-500" />, prefix: "https://" }
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
  // State to manage social media links being edited
  const [socialLinks, setSocialLinks] = useState<Array<{platform: string, username: string, fullUrl: string}>>(
    // Parse existing links to extract platforms and usernames
    profile.socialMediaLinks.map(link => {
      const platform = SOCIAL_PLATFORMS.find(p => link.includes(p.prefix.replace("https://", "")));
      return {
        platform: platform ? platform.name : "Website",
        username: platform ? link.replace(platform.prefix, "") : link,
        fullUrl: link
      };
    })
  );
  
  // Get available platforms that haven't been used yet
  const getAvailablePlatforms = () => {
    const usedPlatforms = socialLinks.map(link => link.platform);
    return SOCIAL_PLATFORMS.filter(platform => !usedPlatforms.includes(platform.name));
  };
  
  // Add a new social media platform input
  const addSocialPlatform = () => {
    const availablePlatforms = getAvailablePlatforms();
    if (availablePlatforms.length === 0) return; // All platforms are used
    
    const newPlatform = availablePlatforms[0];
    setSocialLinks([...socialLinks, {
      platform: newPlatform.name, 
      username: "", 
      fullUrl: newPlatform.prefix
    }]);
  };
  
  // Remove a social media platform
  const removeSocialPlatform = (index: number) => {
    const updatedLinks = [...socialLinks];
    updatedLinks.splice(index, 1);
    setSocialLinks(updatedLinks);
    
    // Update the parent component with the new list of URLs
    handleSocialLinksChange(updatedLinks.map(link => link.fullUrl).join(", "));
  };
  
  // Handle social platform selection
  const handlePlatformChange = (index: number, platformName: string) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.name === platformName);
    if (!platform) return;
    
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = {
      platform: platformName,
      username: updatedLinks[index].username,
      fullUrl: platform.prefix + updatedLinks[index].username
    };
    
    setSocialLinks(updatedLinks);
    handleSocialLinksChange(updatedLinks.map(link => link.fullUrl).join(", "));
  };
  
  // Handle username input changes
  const handleUsernameChange = (index: number, username: string) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.name === socialLinks[index].platform);
    if (!platform) return;
    
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = {
      platform: socialLinks[index].platform,
      username: username,
      fullUrl: platform.prefix + username
    };
    
    setSocialLinks(updatedLinks);
    handleSocialLinksChange(updatedLinks.map(link => link.fullUrl).join(", "));
  };
  
  // Function to get proper social media icon based on URL
  const getSocialMediaIcon = (url: string) => {
    const platform = SOCIAL_PLATFORMS.find(p => url.includes(p.prefix.replace("https://", "")));
    return platform ? platform.icon : <FaGlobe className="text-blue-500" />;
  };
  
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
          {editModes.editContactInformation ? (
            <div className="space-y-4">
              {/* Existing Social Media Links */}
              <div className="mb-2 text-gray-500 text-sm">Edit your social media profiles:</div>
              {socialLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <select
                    value={link.platform}
                    onChange={(e) => handlePlatformChange(index, e.target.value)}
                    className={`${inputClassName} w-1/3`}
                  >
                    {/* Current platform must always be available */}
                    <option key={link.platform} value={link.platform}>
                      {link.platform}
                    </option>
                    
                    {/* Add other platforms not already in use */}
                    {SOCIAL_PLATFORMS
                      .filter(p => p.name !== link.platform && 
                                  !socialLinks.some(l => l.platform === p.name && l !== link))
                      .map(platform => (
                        <option key={platform.name} value={platform.name}>
                          {platform.name}
                        </option>
                      ))
                    }
                  </select>
                  
                  <div className="flex-1 flex items-center">
                    <span className="text-gray-500 mr-2">
                      {SOCIAL_PLATFORMS.find(p => p.name === link.platform)?.icon}
                    </span>
                    <input
                      type="text"
                      value={link.username}
                      placeholder={`Enter your ${link.platform} username`}
                      onChange={(e) => handleUsernameChange(index, e.target.value)}
                      className={`${inputClassName} flex-1`}
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeSocialPlatform(index)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors rounded-full hover:bg-red-50"
                    aria-label={`Remove ${link.platform}`}
                    title={`Remove ${link.platform}`}
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
              
              {/* Add Platform Button - only show if there are available platforms */}
              {getAvailablePlatforms().length > 0 ? (
                <button
                  type="button"
                  onClick={addSocialPlatform}
                  className="flex items-center gap-2 text-b300 hover:text-b500 transition-colors mt-3 px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 w-full justify-center"
                >
                  <Plus size={16} />
                  Add {getAvailablePlatforms()[0].name} Profile
                </button>
              ) : (
                <div className="text-gray-500 text-sm mt-3 italic">
                  All social media platforms have been added.
                </div>
              )}
              
              <div className="mt-4">
                <SaveButton editModeKey="editContactInformation" handleSave={handleSave} />
              </div>
            </div>
          ) : (
            <div>
              {profile.socialMediaLinks.length > 0 && profile.socialMediaLinks.some((link) => link.trim() !== "") ? (
                <div className="flex flex-col space-y-4">
                  {/* Each social media link on its own line with icon */}
                  {profile.socialMediaLinks.map((link) => (
                    link.trim() !== "" && (
                      <div key={link} className="flex items-center">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-gray-100 p-3 mr-3 font-medium hover:bg-gray-200 transition-colors duration-200"
                        >
                          {getSocialMediaIcon(link)}
                        </a>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-b300 hover:text-b500 transition-colors duration-200 hover:underline"
                        >
                          {(() => {
                            // Extract username or handle from the URL
                            const platform = SOCIAL_PLATFORMS.find(p => 
                              link.includes(p.prefix.replace("https://", ""))
                            );
                            if (platform) {
                              const username = link.replace(platform.prefix, "");
                              return platform.name + (username ? `: ${username}` : "");
                            }
                            return link;
                          })()}
                        </a>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <div className="flex items-center">
                  <Users className="text-b300 mr-3" />
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