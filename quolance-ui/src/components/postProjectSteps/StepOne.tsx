'use client';

import BusinessCategoryDropDown from '@/components/ui/client/BusinessCategoryDropDown';
import { useSteps } from '@/util/context/StepsContext';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import AiPromptModal from '@/components/ui/AiPromptModal';
import { useGenerateProject } from '@/api/textGeneration-api'; // Adjust this import as needed

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), {
  ssr: false,
});

const schema = z.object({
  projectTitle: z.string().min(1, 'Project Title is required').max(255),
  projectDescription: z
    .string()
    .min(80, 'Project Description must contain at least 80 chracaters')
    .max(5000),
  location: z.string().min(1, 'Location is required').max(255),
});

function StepOne({ handleNext }: { handleNext: () => void }) {
  const { formData, setFormData } = useSteps();
  const [isAiDescriptionModalOpen, setIsAiDescriptionModalOpen] = useState(false);
  
  // Use your text generation hook for project descriptions
  const generateDescriptionMutation = useGenerateProject();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData,
  });

  const onSubmit = (data: any) => {
    setFormData({ ...formData, ...data });
    handleNext();
  };

  // AI text application handler for project description
  const handleApplyAiDescription = (aiText: string) => {
    setValue('projectDescription', aiText, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4 data-test='project-step1-title' className='heading-4'>
        Basic Project Information
      </h4>
      <p className='text-n300 pb-4 pt-6 font-medium lg:pt-10'>
        Project Category <span className='text-red-500'>* </span>
      </p>
      <BusinessCategoryDropDown
        name='category'
        value={formData.category || ''}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      />

      <p className='pb-4 pt-6 lg:pt-10'>
        Project Title <span className='text-red-500'>* </span>
      </p>
      <div className='bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded flex'>
        <div className='mr-3 flex-shrink-0'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className='text-n300 text-sm'>
            Give your project a clear and specific name so freelancers instantly
            understand what it's about.
          </p>
          <p className='font-semibold text-sm mt-2'>
            Example: "Marketing specialist needed", "Looking for an experienced
            Wordpress Developer"
          </p>
        </div>
      </div>
      <input
        type='text'
        {...register('projectTitle')}
        className='bg-n30 w-full rounded-lg p-3 outline-none'
      />
      {errors.projectTitle && (
        <p data-test='project-title-error' className='text-red-500'>
          {errors.projectTitle.message}
        </p>
      )}

      <p className='text-n300 pb-4 pt-6 font-medium lg:pt-10'>
        Detailed Project Description <span className='text-red-500'>* </span>
      </p>
      <div className='bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded flex'>
        <div className='mr-3 flex-shrink-0'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className='text-n300 text-sm'>
            Describe your goals, expectations, features needed, required tools or
            platforms, timeline, and any references or links. Be as detailed as
            possible to get better proposals.
          </p>
          <p className='font-semibold text-sm mt-2'>
            Example: "I need a modern and responsive landing page built using
            React. The page should include a pricing section, testimonials, and
            contact form. I have mockups ready in Figma.."
          </p>
        </div>
      </div>
      <div className="relative">
        <Controller
          name='projectDescription'
          control={control}
          defaultValue=''
          render={({ field: { onChange, value } }) => (
            <div className="relative">
              <RichTextEditor
                value={value}
                onChange={(name, value) => onChange(value)}
                name='projectDescription'
                placeholder=''
                className=''
                minHeight='130px'
              />
              {/* AI button for project description */}
              <motion.button
                type="button"
                onClick={() => setIsAiDescriptionModalOpen(true)}
                className="absolute top-0.5 right-2 flex items-center justify-center p-2
                  bg-white/90 backdrop-blur-sm border border-indigo-100
                  shadow-md text-indigo-800 rounded-md overflow-hidden"
                title="Generate description with AI"
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
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 opacity-0"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
                <motion.div 
                  className="relative flex items-center justify-center w-5 h-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-sm"
                  whileHover={{ scale: 1.1 }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-white relative z-10" />
                </motion.div>
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
          )}
        />
      </div>
      {errors.projectDescription && (
        <p data-test='project-desc-error' className='text-red-500'>
          {errors.projectDescription.message}
        </p>
      )}

      <p className='pb-4 pt-6 lg:pt-10'>
        Location <span className='text-red-500'>* </span>
      </p>
      <div className='bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded flex'>
        <div className='mr-3 flex-shrink-0'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className='text-n300 text-sm'>
            Specify if you want the freelancer to be based in a specific location
            or if remote work is fine.
          </p>
          <p className='font-semibold text-sm mt-2'>
            Example: "Montreal, QC" or "Remote – Open to All Locations"
          </p>
        </div>
      </div>
      <input
        type='text'
        {...register('location')}
        className='bg-n30 w-full rounded-lg p-3 outline-none'
      />
      {errors.location && (
        <p data-test='project-location-error' className='text-red-500'>
          {errors.location.message}
        </p>
      )}

      <div className='mt-8 flex justify-center'>
        <button
          data-test='next-btn-step1'
          type='submit'
          className='bg-b300 hover:text-n900 relative flex w-1/2 items-center justify-center overflow-hidden rounded-full px-4 py-2 text-lg font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3'
        >
          <span className='relative z-10'>Next</span>
        </button>
      </div>

      {/* AI Prompt Modal for Project Description */}
      <AiPromptModal
        isOpen={isAiDescriptionModalOpen}
        setIsOpen={setIsAiDescriptionModalOpen}
        onApply={handleApplyAiDescription}
        generateMutation={generateDescriptionMutation}
        title="Generate Project Description"
        confirmText="Apply"
      />
    </form>
  );
}

export default StepOne;