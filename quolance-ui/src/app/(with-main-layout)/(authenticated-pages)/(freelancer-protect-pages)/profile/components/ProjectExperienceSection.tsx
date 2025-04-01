import React, { useEffect, useState } from 'react';
import { Briefcase, Calendar, ExternalLink, Plus, Trash2 } from 'lucide-react';
import {
 EditModesType,
 FreelancerProfileType,
 ProjectExperience,
} from '@/models/user/UserResponse';
import EditButton from './EditButton';
import SaveButton from './SaveButton';
import ProfileInputField from './ProfileInputField';
import { Button } from '@/components/ui/button';
import { z } from 'zod';


const ProjectSchema = z.object({
 id: z.string().optional(),
 projectName: z
   .string()
   .min(1, 'Project Name is required')
   .max(255, 'Project Name must contain at most 255 characters'),
 description: z
   .string()
   .max(5000, 'Description must contain at most 5000 characters')
   .optional(),
 startDate: z.date({ required_error: 'Start date is required' }),
 endDate: z.date().optional(),
 projectLink: z
   .string()
   .url('Please enter a valid link')
   .optional()
   .or(z.literal('')),
}).refine(
 (data) => !data.endDate || data.startDate < data.endDate,
 {
   message: 'End date must be greater than start date',
   path: ['endDate'],
 }
);


const ProjectArraySchema = z.array(ProjectSchema);


interface ProjectExperienceSectionProps {
 profile: FreelancerProfileType;
 handleInputChange: (field: keyof FreelancerProfileType, value: any) => void;
 updateEditModes: (value: string) => void;
 editModes: EditModesType;
 handleSave: (value: string) => void;
 checkEditModes: (value: string) => boolean;
}


const ProjectExperienceSection: React.FC<ProjectExperienceSectionProps> = ({
 profile,
 handleInputChange,
 updateEditModes,
 editModes,
 handleSave,
 checkEditModes,
}) => {
 const emptyProjectExperience: ProjectExperience = {
   id: '',
   projectName: '',
   description: '',
   startDate: undefined,
   endDate: undefined,
   projectLink: '',
   // isOngoing is derived from endDate
 };


 const [projectExperiences, setProjectExperiences] = useState<
   ProjectExperience[]
 >(profile.projectExperiences || []);


 const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});


 useEffect(() => {
   setProjectExperiences(profile.projectExperiences || []);
 }, [profile.projectExperiences]);


 const addNewProject = () => {
   const updatedProjects = [
     ...projectExperiences,
     { ...emptyProjectExperience },
   ];
   setProjectExperiences(updatedProjects);
   handleInputChange('projectExperiences', updatedProjects);
 };


 // Helper function to determine if a project is ongoing
 const isProjectOngoing = (project: ProjectExperience) => {
   return !project.endDate;
 };


 const handleProjectChange = (index: number, field: string, value: any) => {
   const updatedProjects = [...projectExperiences];


   if (field === 'isOngoing') {
     if (value === true) {
       // If marking as ongoing, clear end date
       updatedProjects[index] = {
         ...updatedProjects[index],
         endDate: undefined,
       };
     } else {
       // If unchecking ongoing, we need to set a default end date
       // Set to current date as default when user unchecks "ongoing"
       const defaultEndDate = new Date();
       updatedProjects[index] = {
         ...updatedProjects[index],
         endDate: defaultEndDate,
       };
     }
   } else if (field === 'endDate') {
     // Simply update the end date - isOngoing is derived from this
     updatedProjects[index] = {
       ...updatedProjects[index],
       [field]: value,
     };
   } else {
     // For all other fields, just update normally
     updatedProjects[index] = {
       ...updatedProjects[index],
       [field]: value,
     };
   }


   setProjectExperiences(updatedProjects);
   handleInputChange('projectExperiences', updatedProjects);
 };




 const handleDeleteProject = (index: number) => {
   const updated = [...projectExperiences];
   updated.splice(index, 1);


   const updatedErrors: typeof errors = {};
   Object.entries(errors).forEach(([key, val]) => {
     const i = Number(key);
     if (i < index) updatedErrors[i] = val;
     else if (i > index) updatedErrors[i - 1] = val;
   });


   setProjectExperiences(updated);
   setErrors(updatedErrors);
   handleInputChange('projectExperiences', updated);
 };




   const normalizeProjectExperienceData = (projects: ProjectExperience[]) =>
     projects.map((p) => ({
       ...p,
       startDate: p.startDate ? new Date(p.startDate) : undefined,
       endDate: p.endDate ? new Date(p.endDate) : undefined,
       projectLink: p.projectLink
         ? p.projectLink.startsWith('http')
           ? p.projectLink
           : `http://${p.projectLink}`
         : '',
     }));
  




 const handleProjectSave  = (key: string) => {
   const normalized = normalizeProjectExperienceData(projectExperiences);
   const result = ProjectArraySchema.safeParse(normalized);
   if (!result.success) {
     const newErrors: typeof errors = {};
     result.error.errors.forEach((err) => {
       const [idx, field] = err.path;
       if (typeof idx === 'number' && typeof field === 'string') {
         if (!newErrors[idx]) newErrors[idx] = {};
         newErrors[idx][field] = err.message;
       }
     });
     setErrors(newErrors);
     return;
   }
   setErrors({});
   handleSave(key);
 };


 const renderProjectForm = (project: ProjectExperience, index: number) => {
   const isOngoing = isProjectOngoing(project);


   return (
     <div key={`project-${index}`} className='mb-6'>
       {/* Header with distinct background */}
       <div className='flex items-center justify-between rounded-t-lg border bg-gray-100 px-4 py-3'>
         <h4 className='font-medium text-gray-800 break-words truncate'>
           {project.projectName || 'New Project'}
         </h4>
         <button
           onClick={() => handleDeleteProject(index)}
           className='rounded p-1 text-red-500 transition-colors hover:bg-gray-200 hover:text-red-700'
           title='Delete project'
         >
           <Trash2 size={18} />
         </button>
       </div>


       {/* Form content */}
       <div className='space-y-4 rounded-b-lg border-b border-l border-r bg-gray-50/60 p-6 pb-8'>
         {/* Project Name */}
         <ProfileInputField
           label='Project Name'
           name='projectName'
           value={project.projectName}
           type='text'
           isEditing={true}
           onChange={(name, value) => handleProjectChange(index, name, value)}
           placeholder='Enter project name'
           required={true}
           error={errors[index]?.projectName}
         />
         {/* Project Description */}
         <ProfileInputField
           label='Description'
           name='description'
           value={project.description}
           type='textarea'
           isEditing={true}
           onChange={(name, value) => handleProjectChange(index, name, value)}
           placeholder='Describe the project and your role'
           error={errors[index]?.description}
         />
         {/* Project Link */}
         <ProfileInputField
           label='Project Link'
           name='projectLink'
           value={project.projectLink}
           type='text'
           isEditing={true}
           onChange={(name, value) => handleProjectChange(index, name, value)}
           placeholder='https://...'
           icon={<ExternalLink size={16} />}
           error={errors[index]?.projectLink}
          
         />
         {/* Ongoing Checkbox */}
         <ProfileInputField
           label=''
           name='isOngoing'
           value={isOngoing}
           type='checkbox'
           isEditing={true}
           onChange={(name, value) => handleProjectChange(index, name, value)}
           checkboxLabel='This is an ongoing project'
         />
         {/* Dates */}
         <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
           {/* Start Date */}
           <ProfileInputField
             label='Start Date'
             name='startDate'
             value={project.startDate}
             type='month-year'
             isEditing={true}
             onChange={(name, value) =>
               handleProjectChange(index, name, value)
             }
             icon={<Calendar size={16} />}
             error={errors[index]?.startDate}
           />
           {/* End Date */}
           <ProfileInputField
             label='End Date'
             name='endDate'
             value={project.endDate}
             type='month-year'
             isEditing={true}
             onChange={(name, value) =>
               handleProjectChange(index, name, value)
             }
             icon={<Calendar size={16} />}
             disabled={isOngoing}
             error={errors[index]?.endDate}
           />
         </div>
       </div>
     </div>
   );
 };


 return (
   <section className='mb-8 rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md'>
     <div className='mb-4 flex justify-between'>
       <h2 className='flex items-center self-center text-md sm:text-xl font-semibold text-gray-800'>
         <Briefcase className='mr-2' /> Project Experience
       </h2>
       {!editModes.editProjectExperience ? (
         <EditButton
           editModeKey='editProjectExperience'
           updateEditModes={updateEditModes}
           checkEditModes={checkEditModes}
         />
       ) : null}
     </div>


     <div>
       {editModes.editProjectExperience ? (
         <div>
           {/* All Projects */}
           {projectExperiences.map((project, index) =>
             renderProjectForm(project, index)
           )}


           {/* Add New Project Button */}
           <Button
             className='mb-4 hover:bg-gray-100'
             onClick={addNewProject}
             variant='outline'
             size='sm'
             icon={<Plus size={18} />}
           >
             Add Project
           </Button>


           {/* Save Button */}
           <div className='mt-4'>
             <SaveButton
               editModeKey='editProjectExperience'
               handleSave={handleProjectSave}
             />
           </div>
         </div>
       ) : (
         <div>
           {projectExperiences && projectExperiences.length > 0 ? (
             <div className='space-y-4'>
               {projectExperiences.map((project, index) => (
                 <ProjectExperienceCard
                   key={project.id || index}
                   project={project}
                 />
               ))}
             </div>
           ) : (
             <p className='italic text-gray-500'>
               No project experience added.
             </p>
           )}
         </div>
       )}
     </div>
   </section>
 );
};


export const ProjectExperienceCard = ({
 project,
}: {
 project: ProjectExperience;
}) => {
 const formatDateRange = () => {
   const formatDateObject = (date: Date) => {
     return date.toLocaleString('default', {
       month: 'short',
       year: 'numeric',
     });
   };


   const startDateStr = project.startDate
     ? formatDateObject(new Date(project.startDate))
     : '';


   if (!project.endDate) {
     return startDateStr ? `${startDateStr} - Present` : '';
   } else {
     const endDateStr = formatDateObject(new Date(project.endDate));
     return startDateStr && endDateStr
       ? `${startDateStr} - ${endDateStr}`
       : startDateStr || endDateStr;
   }
 };


 const dateRange = formatDateRange();


 return (
   <div
     className={`rounded-2xl border border-gray-200 p-8 transition-shadow hover:shadow-sm mb-4`}
   >
     {/* Project Header */}
     <div className='flex items-start justify-between'>
       <div className='space-y-1 max-w-full'>
         <h4 className='text-lg font-semibold text-gray-800 break-words'>
           {project.projectName || 'Untitled Project'}
         </h4>


         {dateRange && (
           <div className='flex items-center text-xs text-gray-500 break-words'>
             <span>{dateRange}</span>
           </div>
         )}
       </div>
     </div>


     {/* Project Description */}
     {project.description && (
       <div className='mt-8'>
         <p className='text-gray-600 break-words text-sm sm:text-base'>{project.description}</p>
       </div>
     )}


     {/* Project Link */}
     {project.projectLink && (
       <div className='-ml-1 mt-4'>
         <a
           href={
             project.projectLink.startsWith('http')
               ? project.projectLink
               : `http://${project.projectLink}`
           }
           target='_blank'
           rel='noopener noreferrer'
           className='inline-flex items-center rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-800'
         >
           <span>Show Project</span>
           <ExternalLink size={14} className='ml-1' />
         </a>
       </div>
     )}
   </div>
 );
};


export default ProjectExperienceSection;
