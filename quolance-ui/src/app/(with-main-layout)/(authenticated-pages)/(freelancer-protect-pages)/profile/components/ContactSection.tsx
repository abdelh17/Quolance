import { Mail, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BsLinkedin, BsTwitter } from "react-icons/bs";
import { FaFacebook, FaGithub } from "react-icons/fa";


import { EditModesType, FreelancerProfileType } from "@/models/user/UserResponse";


import EditButton from "./EditButton";
import type { EditProfileMutationType } from '@/api/freelancer-api';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';


const contactSchema = z.object({
  contactEmail: z
    .string()
    .email('Please enter a valid email')
    .max(255, 'Email must contain at most 255 characters')
    .optional()
    .or(z.literal('')),


  facebookUsername: z
    .string()
    .max(255, 'Facebook username must contain at most 255 characters')
    .optional(),


  twitterUsername: z
    .string()
    .max(255, 'Twitter username must contain at most 255 characters')
    .optional(),


  linkedinUsername: z
    .string()
    .max(255, 'LinkedIn username must contain at most 255 characters')
    .optional(),


  githubUsername: z
    .string()
    .max(255, 'GitHub username must contain at most 255 characters')
    .optional(),
});


interface ContactSectionProps {
  profile: FreelancerProfileType;
  handleInputChange: (field: keyof FreelancerProfileType, value: string) => void;
  handleSocialLinksChange: (links: string) => void;
  getSocialIcon: (url: string) => JSX.Element;
  inputClassName: string;
  updateEditModes: (value: string) => void;
  editModes: EditModesType;
  handleSave: (value: string) => void;
  checkEditModes: (value: string) => boolean;
  saveEditModes: (value: string) => void;
  editProfileMutation: EditProfileMutationType;
}


const SOCIAL_PLATFORMS = [
  { name: "Facebook", icon: <FaFacebook className="text-blue-600" />, prefix: "https://facebook.com/" },
  { name: "X", icon: <BsTwitter className="text-blue-400" />, prefix: "https://twitter.com/" },
  { name: "LinkedIn", icon: <BsLinkedin className="text-blue-700" />, prefix: "https://linkedin.com/in/" },
  { name: "GitHub", icon: <FaGithub className="text-gray-800" />, prefix: "https://github.com/" },
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
  checkEditModes,
  saveEditModes,
  editProfileMutation,
}) => {
  const [facebookUsername, setFacebookUsername] = useState("");
  const [twitterUsername, setTwitterUsername] = useState("");
  const [linkedinUsername, setLinkedinUsername] = useState("");
  const [githubUsername, setGithubUsername] = useState("");


  type ContactFormValues = z.infer<typeof contactSchema>;


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      contactEmail: profile.contactEmail || '',
      facebookUsername,
      twitterUsername,
      linkedinUsername,
      githubUsername,
    },
  });


  useEffect(() => {
    if (editModes.editContactInformation) {
      let fb = "", tw = "", li = "", gh = "";
      profile.socialMediaLinks.forEach(link => {
        if (link.includes("facebook.com")) {
          fb = link.replace("https://facebook.com/", "");
        } else if (link.includes("twitter.com")) {
          tw = link.replace("https://twitter.com/", "");
        } else if (link.includes("linkedin.com/in")) {
          li = link.replace("https://linkedin.com/in/", "");
        } else if (link.includes("github.com")) {
          gh = link.replace("https://github.com/", "");
        }
      });
      reset({
        contactEmail: profile.contactEmail || '',
        facebookUsername: fb,
        twitterUsername: tw,
        linkedinUsername: li,
        githubUsername: gh,
      });
    }
  }, [editModes.editContactInformation, profile.socialMediaLinks, profile.contactEmail, reset]);


  const onSubmit = (data: ContactFormValues) => {
    const links: string[] = [];

    const clean = (username: string | undefined) =>
      username?.trim().replace(/\/+$/, '');
    if (clean(data.facebookUsername)) {
      links.push(`https://facebook.com/${clean(data.facebookUsername)}`);
    }
    if (clean(data.twitterUsername)) {
      links.push(`https://twitter.com/${clean(data.twitterUsername)}`);
    }
    if (clean(data.linkedinUsername)) {
      links.push(`https://linkedin.com/in/${clean(data.linkedinUsername)}`);
    }
    if (clean(data.githubUsername)) {
      links.push(`https://github.com/${clean(data.githubUsername)}`);
    }
    const updatedProfile = {
      ...profile,
      contactEmail: data.contactEmail ?? '',
      socialMediaLinks: links,
    };
    editProfileMutation.mutate(updatedProfile, {
      onSuccess: () => {
        updateEditModes("editContactInformation");
        saveEditModes("editContactInformation");
      },
      onError: (err) => {
        console.error("Failed to save social links", err);
      },
    });
  };


  return (
    <section className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between mb-4">
        <h2 className="text-md sm:text-xl font-semibold self-center text-gray-800">Contact Information</h2>
        {!editModes.editContactInformation ? (
          <EditButton
            editModeKey="editContactInformation"
            updateEditModes={updateEditModes}
            checkEditModes={checkEditModes}
            dataTest="profile-contact-edit-btn"
          />
        ) : null}
      </div>


      {editModes.editContactInformation ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center">
            <Mail className="hidden sm:block mr-6 text-b300" />
            <div className="w-full">
              <label className="block sm:hidden text-sm">Email</label>
              <input
                {...register('contactEmail')}
                type="email"
                placeholder="Enter Contact Email"
                className={inputClassName}
                data-test="contact-email-input"
              />
              {errors.contactEmail && (
                <div className="text-red-500 text-sm mt-1">{errors.contactEmail.message}</div>
              )}
            </div>
          </div>


          <div className="space-y-4">
            {/* Facebook */}
            <div className="flex items-center gap-2">
              <div className=" hidden sm:block flex-shrink-0 w-10 text-center text-xl">
                <FaFacebook className="text-blue-600" />
              </div>
              <div className="flex-1">
                <label className="block sm:hidden text-sm">Facebook Username</label>
                <div className="flex items-center">
                  <span className="hidden sm:block bg-gray-200 text-gray-700 px-3 py-2 rounded-l-md border border-gray-300 text-sm">
                    facebook.com/
                  </span>
                  <input
                    {...register('facebookUsername')}
                    placeholder="username"
                    className={`${inputClassName} flex-1 rounded-lg sm:rounded-l-none`}
                    data-test="facebook-input"
                  />
                </div>
                {errors.facebookUsername && (
                  <div className="text-red-500 text-sm mt-1">{errors.facebookUsername.message}</div>
                )}
              </div>
            </div>


            {/* Twitter */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:block flex-shrink-0 w-10 text-center text-xl">
                <BsTwitter className="text-blue-400" />
              </div>
              <div className="flex-1">
                <label className="block sm:hidden text-sm">Twitter Username</label>
                <div className="flex items-center">
                  <span className=" hidden sm:block bg-gray-200 text-gray-700 px-3 py-2 rounded-l-md border border-gray-300 text-sm">
                    twitter.com/
                  </span>
                  <input
                    {...register('twitterUsername')}
                    placeholder="username"
                    className={`${inputClassName} flex-1 rounded-lg sm:rounded-l-none`}
                    data-test="twitter-input"
                  />
                </div>
                {errors.twitterUsername && (
                  <div className="text-red-500 text-sm mt-1">{errors.twitterUsername.message}</div>
                )}
              </div>
            </div>


            {/* LinkedIn */}
            <div className="flex items-center gap-2">
              <div className=" hidden sm:block  flex-shrink-0 w-10 text-center text-xl">
                <BsLinkedin className="text-blue-700" />
              </div>
              <div className="flex-1">
                <label className="block sm:hidden text-sm">Linkedin Username</label>
                <div className="flex items-center">
                  <span className=" hidden sm:block bg-gray-200 text-gray-700 px-3 py-2 rounded-l-md border border-gray-300 text-sm">
                    linkedin.com/in/
                  </span>
                  <input
                    {...register('linkedinUsername')}
                    placeholder="username"
                    className={`${inputClassName} flex-1 rounded-lg sm:rounded-l-none`}
                    data-test="linkedin-input"
                  />
                </div>
                {errors.linkedinUsername && (
                  <div className="text-red-500 text-sm mt-1">{errors.linkedinUsername.message}</div>
                )}
              </div>
            </div>


            {/* GitHub */}
            <div className="flex items-center gap-2">
              <div className=" hidden sm:block flex-shrink-0 w-10 text-center text-xl">
                <FaGithub className="text-gray-800" />
              </div>
              <div className="flex-1">
                <label className="block sm:hidden text-sm">Github Username</label>
                <div className="flex items-center">
                  <span className="hidden sm:block  bg-gray-200 text-gray-700 px-3 py-2 rounded-l-md border border-gray-300 text-sm">
                    github.com/
                  </span>
                  <input
                    {...register('githubUsername')}
                    placeholder="username"
                    className={`${inputClassName} flex-1 rounded-lg sm:rounded-l-none`}
                    data-test="github-input"
                  />
                </div>
                {errors.githubUsername && (
                  <div className="text-red-500 text-sm mt-1">{errors.githubUsername.message}</div>
                )}
              </div>
            </div>


            <div className='mt-4 flex justify-end'>
              <Button
                type="submit"
                variant='default'
                animation='default'
                size='sm'
                className='px-6'
                data-test="profile-contact-save-btn"
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex items-center mb-4">
            {profile.contactEmail && profile.contactEmail.trim().length > 0 ? (
              <>
                <a
                  href={`mailto:${profile.contactEmail}`}
                  className="rounded-full bg-gray-100 p-3 font-medium hover:bg-gray-200 transition-colors duration-200 mr-3"
                >
                  <Mail className="w-4 h-4 text-b300" />
                </a>
                <span className="text-gray-700 break-words truncate max-w-full">{profile.contactEmail}</span>
              </>
            ) : (
              <>
                <Mail className="text-b300 ml-2 mr-4" />
                <p className='italic text-gray-500'>
                  No email added.
                </p>
              </>
            )}
          </div>

          {profile.socialMediaLinks.length > 0 && profile.socialMediaLinks.some(link => link.trim() !== "") ? (
            <div className="flex flex-col space-y-3">
              {profile.socialMediaLinks.map((link, index) => {
                const platform = SOCIAL_PLATFORMS.find(p =>
                  link.includes(p.prefix.replace("https://", ""))
                );
                if (!platform || !link.trim()) return null;
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
                    <span className="text-gray-700 break-words truncate max-w-full">{username}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center mt-4">
              <Users className="text-blue-500 ml-2 mr-3" />
              <p className='italic text-gray-500'>
                No social media links added.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};


export default ContactSection;

