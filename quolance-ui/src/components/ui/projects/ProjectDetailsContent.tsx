import { ProjectType } from '@/constants/types/project-types';
import Image from 'next/image';
import freelancerImg from '@/public/images/freelancer-hero-img-2.jpg';
import Link from 'next/link';
import ViewEditField from '@/components/ui/ViewEditField';
import {
 BUDGET_OPTIONS,
 BUSINESS_CATEGORY_OPTIONS,
 EXPERIENCE_LEVEL_OPTIONS,
} from '@/constants/types/form-types';
import { formatEnumString, formatPriceRange } from '@/util/stringUtils';
import dynamic from 'next/dynamic';
import {useAuthGuard} from "@/api/auth-api";
import { Control, FieldErrors,Controller } from 'react-hook-form';
import { ProjectFormValues } from '@/lib/validation/projectSchema';







const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), {
 ssr: false,
});


interface ProjectDetailsProps {
 project: ProjectType;
 setDraftProject: (key: string, value: any) => void;
 editMode: boolean;
 control: Control<ProjectFormValues>;
 errors?: FieldErrors<ProjectFormValues>;
}


export default function ProjectDetailsContent({
 project,
 setDraftProject,
 editMode,
 control,
 errors
}: ProjectDetailsProps) {


 const { user } = useAuthGuard({ middleware: 'auth' });


 return (
   <div className='bg-white py-8 sm:pb-12 sm:pt-10'>
     <div className='mx-auto max-w-7xl'>
       <div className='mx-auto flex max-w-2xl flex-col items-start gap-8 lg:mx-0 lg:max-w-none lg:flex-row'>
         {!user && (
             <div className='max-w-xl lg:pr-4'>
               <div className='relative overflow-hidden rounded-3xl bg-gray-900 px-6 pb-9 pt-64 shadow-2xl sm:px-12 lg:max-w-lg lg:px-8 lg:pb-8 xl:px-10 xl:pb-10'>
                 <Image
                     data-test="project-img"
                     alt=''
                     src={freelancerImg}
                     className='absolute inset-0 h-full w-full object-cover'
                 />
                 <div className='absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/50 to-transparent' />
                 <figure className='relative isolate'>
                   <blockquote className='mt-6 text-xl/8 font-semibold text-white'>
                     <p data-test="project-quote">
                       Bring your ideas to life with skilled freelancers ready to
                       make them reality. Post your project or browse talent to
                       get started.
                     </p>
                   </blockquote>
                   <Link
                       href='/auth/register'
                       className='bg-b300 hover:text-n900 relative mt-4 flex w-1/2 items-center justify-center overflow-hidden rounded-full px-6 py-2.5 font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
                   >
                     <span data-test="sign-up-for-free-btn" className='relative z-10'>Sign Up For Free</span>
                   </Link>
                 </figure>
               </div>
             </div>
         )}
         <div className={'w-full flex-1'}>
           <div className='w-[calc(100%-20px)] text-base/7'>
             <h1 className='text-pretty text-4xl font-semibold tracking-tight sm:text-5xl'>
            
               <Controller
                   name="title"
                   control={control}
                   render={({ field }) => (
                     <ViewEditField
                       {...field}
                       isEditing={editMode}
                       name="title"
                       onChange={(name, value) => field.onChange(value)}
                       className={editMode ? 'px-4 py-3 text-4xl' : ''}
                     />
                   )}
                 />
                 {errors?.title?.message && (
                   <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                 )}


             </h1>
             <div className='mt-3 w-full'>
           
                 <Controller
                   name="description"
                   control={control}
                   render={({ field }) => (
                     <RichTextEditor
                       name="description"
                       value={field.value}
                       onChange={(name, value) => field.onChange(value)}
                       placeholder="Enter project description..."
                       debounceMs={200}
                       minHeight="200px"
                       readOnly={!editMode}
                       className="mt-6"
                     />
                   )}
                 />
                 {errors?.description?.message && (
                   <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                 )}


             </div>
           </div>
           <dl
             className={`${
               editMode ? '' : 'sm:flex-row'
             } mt-10 flex w-[calc(100%-20px)] flex-col gap-8 border-t border-gray-900/10 px-4 pt-10 sm:px-0 `}
           >
          


             <ProjectDetailField
               label="Project Category"
               value={formatEnumString(project.category)}
               name="category"
               editMode={editMode}
               control={control}
               errors={errors}
               options={BUSINESS_CATEGORY_OPTIONS}
               type="select"
             />


             <ProjectDetailField
               label="Budget"
               value={formatPriceRange(project.priceRange)}
               name="priceRange"
               editMode={editMode}
               control={control}
               errors={errors}
               options={BUDGET_OPTIONS}
               type="select"
             />


             <ProjectDetailField
               label="Experience Level"
               value={
                 EXPERIENCE_LEVEL_OPTIONS.find((o) => o.value === project.experienceLevel)
                   ?.label || ''
               }
               name="experienceLevel"
               editMode={editMode}
               control={control}
               errors={errors}
               options={EXPERIENCE_LEVEL_OPTIONS}
               type="select"
             />


           
           </dl>
         </div>
       </div>
     </div>
   </div>
 );
}






interface ProjectDetailFieldProps {
 label: string;
 value: string;
 name: keyof ProjectFormValues;
 editMode: boolean;
 control: Control<ProjectFormValues>;
 errors?: FieldErrors<ProjectFormValues>;
 options?: { value: string; label: string }[];
 type?: 'text' | 'select';
}


const ProjectDetailField = ({
 label,
 value,
 name,
 editMode,
 control,
 errors,
 options,
 type = 'text',
}: ProjectDetailFieldProps) => {
 return (
   <div
     className={
       editMode ? 'grid grid-cols-[190px_1fr] items-center' : 'flex flex-col'
     }
   >
     <dt className='text-sm/6 font-semibold text-gray-600'>{label}</dt>
     <dd
       className={`${
         !editMode && 'mt-2'
       } w-full text-xl font-semibold tracking-tight`}
     >
       {editMode ? (
         <>
           <Controller
             name={name}
             control={control}
             render={({ field }) => (
               <ViewEditField
                 {...field}
                 id={name}
                 name={name}
                 type={type}
                 isEditing={editMode}
                 value={field.value}
                 onChange={(name, value) => field.onChange(value)}
                 options={options}
                 placeholder={`Select a ${label.toLowerCase()}`}
                 className={`${editMode && 'font-medium sm:text-base'}`}
               />
             )}
           />
           {errors?.[name]?.message && (
             <p className="text-red-500 text-sm mt-1">
               {errors[name]?.message as string}
             </p>
           )}
         </>
       ) : (
         value
       )}
     </dd>
   </div>
 );
};


