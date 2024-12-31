'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { PiCheckBold, PiXBold } from 'react-icons/pi';

import StepFour from '@/components/postProjectSteps/StepFour';
import StepOne from '@/components/postProjectSteps/StepOne';
import StepThree from '@/components/postProjectSteps/StepThree';
import StepTwo from '@/components/postProjectSteps/StepTwo';

import { useSteps } from '@/util/context/StepsContext';

import { usePostProject } from '@/api/projects-api';
import { PostProjectType } from '@/constants/types/project-types';

import { showToast } from '@/util/context/ToastProvider';

const stepsComponents = [StepOne, StepTwo, StepThree, StepFour];

const stepsName = [
  'Basic Project Information',
  'Project Scope & Requirements',
  'Timeline & Preferences',
  'Previewing & Confirmation',
];

function PostsTasksSteps() {
  const router = useRouter();

  const { currentStep, setCurrentStep, formData } = useSteps();

  const StepComponent = stepsComponents[currentStep];

  const { mutateAsync: mutateProject } = usePostProject({
    onSuccess: () => {
      console.log('Project created successfully');
      showToast('Project created successfully', 'success');
    },
    onError: (error) => {
      console.log('Error creating project:', error);
      showToast('Error creating project', 'error');
    },
  });

  const submitForm = async () => {
    try {
      console.log('Form submitted:', formData);
      const project: PostProjectType = formData;
      await mutateProject(project);

      // push to home page
      router.push('/dashboard');
    } catch (err) {
      console.log('Error in submitForm:', err);
    }
  };

  const handleNext = () => {
    setCurrentStep((prev: number) =>
      Math.min(prev + 1, stepsComponents.length - 1)
    );
  };

  const handleBack = () => {
    setCurrentStep((prev: number) => Math.max(prev - 1, 0));
  };

  return (
    <>
      <section className='sbp-30'>
        <div className='4xl:large-container max-4xl:container flex items-center justify-between pt-6'>
          <Link href='/' className='pt-1 text-2xl font-bold'>
            Quolance
          </Link>
          <Link
            href='/'
            className='hover:text-r300 flex items-center justify-start gap-2 text-lg font-medium duration-500'
          >
            Cancel{' '}
            <span className='ph-bold ph-x !leading-none'>
              <PiXBold />
            </span>
          </Link>
        </div>

        {currentStep < 4 && (
          <div className='stp-30 container grid grid-cols-12 gap-6'>
            <div className='col-span-12 md:col-span-4 xl:col-span-3 xl:col-start-2'>
              <div className='border-n30 rounded-3xl border p-4 sm:p-8'>
                <ul className='flex flex-col gap-8'>
                  {stepsName.map((item, idx) => (
                    <li className='relative' key={idx}>
                      {currentStep === idx ? (
                        <div className='bg-b50 flex w-full items-center justify-start gap-4 rounded-full p-2'>
                          <div className='bg-b300 flex items-center justify-center rounded-full p-2 !leading-none text-white'>
                            <PiCheckBold />
                          </div>
                          <p className='text-sm font-medium'>{item}</p>
                        </div>
                      ) : (
                        <div
                          className={`flex w-full items-center justify-start gap-4 rounded-full p-2 ${
                            currentStep > idx ? 'text-b300' : 'text-n300'
                          }`}
                        >
                          <div
                            className={`flex size-9 items-center justify-center rounded-full border-2 ${
                              currentStep > idx ? 'border-b300' : 'border-n300'
                            } p-2 text-sm !leading-none `}
                          >
                            {idx + 1}
                          </div>
                          <p className='text-sm font-medium '>{item}</p>
                        </div>
                      )}

                      {stepsName.length !== idx + 1 && (
                        <div className='absolute left-[22px] top-[54px] h-[32px] w-[3px]'>
                          <div
                            className={`h-full w-full border-l-4 border-dotted transition-all duration-300 ${
                              currentStep > idx
                                ? 'border-b300'
                                : 'border-gray-200'
                            }`}
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className='col-span-12 md:col-span-8 xl:col-span-6 xl:col-start-6'>
              <div className='border-n30 rounded-3xl border p-6 sm:p-8'>
                <StepComponent
                  handleNext={handleNext}
                  handleBack={handleBack}
                  submitForm={submitForm}
                />
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default PostsTasksSteps;
