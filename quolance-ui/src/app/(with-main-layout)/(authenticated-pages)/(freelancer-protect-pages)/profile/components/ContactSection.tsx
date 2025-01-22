import React from "react";
import { Mail, MapPin, Users } from "lucide-react";
import { FreelancerProfileType } from "@/constants/models/user/UserResponse";

interface ContactSectionProps {
    profile: {
      contactEmail?: string | null;
      city?: string | null;
      state?: string | null;
      socialMediaLinks: string[];
    };
    editMode: boolean;
    handleInputChange: (field: keyof FreelancerProfileType, value: string) => void;
    handleSocialLinksChange: (links: string) => void;
    getSocialIcon: (url: string) => JSX.Element;
    inputClassName: string;
  }
  

  const ContactSection: React.FC<ContactSectionProps> = ({
    profile,
    editMode,
    handleInputChange,
    handleSocialLinksChange,
    getSocialIcon,
    inputClassName,
  }) => {
    
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
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Information</h2>
        <div className="space-y-6">
          {/* Contact Email */}
          <div className="flex items-center">
            <Mail className="text-b300 mr-3" />
            {editMode ? (
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
  
          {/* City and State */}
          <div className="flex items-center">
            <MapPin className="text-b300 mr-3" />
            {editMode ? (
              <div className="flex gap-3 flex-1">
                <input
                  type="text"
                  value={profile.city ?? ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={inputClassName}
                  placeholder="Enter City"
                />
                <input
                  type="text"
                  value={profile.state ?? ""}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className={inputClassName}
                  placeholder="Enter State"
                />
              </div>
            ) : (
              <span className="text-gray-700">
                {profile.city && profile.state ? `${profile.city}, ${profile.state}` : "Not Specified"}
              </span>
            )}
          </div>
  
          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Social Media</h3>
            {editMode ? (
              <input
                type="text"
                value={profile.socialMediaLinks.join(", ")}
                onChange={(e) => handleSocialLinksChange(e.target.value)}
                className={inputClassName}
                placeholder="Enter Social Media Links Separated By Commas"
              />
            ) : (
              <div>
                {profile.socialMediaLinks.length > 0 ? (
                  <div className="space-y-2">
                    {profile.socialMediaLinks.map((link) => (
                      <div key={link} className="flex items-center group">
                        {getSocialIcon(link)}
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-b300 hover:text-b500 transition-colors duration-200 ml-2 group-hover:underline"
                        >
                          {link.split("/").pop()}
                        </a>
                      </div>
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
  
