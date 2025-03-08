'use client';

import Link from 'next/link';
import {useState} from 'react';
import {AiOutlineLoading3Quarters} from 'react-icons/ai';
import {PiCheckBold, PiXBold} from 'react-icons/pi';

import StepFour from '@/components/postProjectSteps/StepFour';
import StepOne from '@/components/postProjectSteps/StepOne';
import StepThree from '@/components/postProjectSteps/StepThree';
import StepTwo from '@/components/postProjectSteps/StepTwo';
import ProjectStatusNotification from '@/components/ProjectStatusNotification';

import {useAuthGuard} from '@/api/auth-api';
import {usePostProject} from '@/api/projects-api';
import {PostProjectType} from '@/constants/types/project-types';
import {useSteps} from '@/util/context/StepsContext';
import {showToast} from '@/util/context/ToastProvider';

interface ProjectEvaluationResult {
  projectId: string;
  approved: boolean;
  confidenceScore: number;
  reason: string;
  flags: string[];
  requiresManualReview: boolean;
}

const stepsComponents = [StepOne, StepTwo, StepThree, StepFour];

const stepsName = [
  'Basic Project Information',
  'Project Scope & Requirements',
  'Timeline & Preferences',
  'Previewing & Confirmation',
];

function PostsTasksSteps() {
  const [evaluationResult, setEvaluationResult] = useState<ProjectEvaluationResult | null>(null);
  const [loading, setLoading] = useState(false); // Added loading state
  const { user } = useAuthGuard({ middleware: 'auth' });
  const { currentStep, setCurrentStep, formData, resetSteps } = useSteps();
  const StepComponent = stepsComponents[currentStep];

  const {mutateAsync: mutateProject} = usePostProject();

  const submitForm = async () => {
    try {
      setLoading(true);
      const project: PostProjectType = formData;
      const response = await mutateProject(project);

      if (response?.data) {
        setEvaluationResult(response.data);
      } else {
        setEvaluationResult({
          projectId: "",
          approved: false,
          confidenceScore: 0,
          reason: 'Awaiting system evaluation',
          flags: [],
          requiresManualReview: true,
        });
      }

      resetSteps();
    } catch (err) {
      showToast('Error creating project', 'error');
    } finally {
      setLoading(false);
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
        {evaluationResult && <ProjectStatusNotification evaluationResult={evaluationResult}/>}
        <section className="sbp-30">
          <div className="4xl:large-container max-4xl:container flex items-center justify-between pt-6">
            <Link href={user?.role ? '/dashboard' : '/'}>
              <h1 className="text-2xl font-bold">Quolance</h1>
            </Link>
            <Link
                href={user?.role ? '/dashboard' : '/'}
                className="hover:text-r300 flex items-center justify-start gap-2 text-lg font-medium duration-500"
            >
              Cancel <PiXBold className="ph-bold ph-x !leading-none"/>
            </Link>
          </div>
          {currentStep < 4 && !evaluationResult && (
              <div className="stp-30 container grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-4 xl:col-span-3 xl:col-start-2">
                  <div className="border-n30 rounded-3xl border p-4 sm:p-8">
                    <ul className="flex flex-col gap-8">
                  {stepsName.map((item, idx) => (
                      <li className="relative" key={idx}>
                      {currentStep === idx ? (
                          <div className="bg-b50 flex w-full items-center justify-start gap-4 rounded-full p-2">
                            <div className="bg-b300 flex items-center justify-center rounded-full p-2 text-white">
                            <PiCheckBold />
                          </div>
                            <p className="text-sm font-medium">{item}</p>
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
                            } p-2 text-sm`}
                          >
                            {idx + 1}
                          </div>
                          <p className='text-sm font-medium '>{item}</p>
                        </div>
                      )}

                        {idx < stepsName.length - 1 && (
                            <div className="absolute left-[22px] top-[54px] h-[32px] w-[3px]">
                              <div
                                  className={`h-full w-full border-l-4 border-dotted transition-all duration-300 ${
                                      currentStep > idx ? 'border-b300' : 'border-gray-200'
                                  }`}
                              />
                            </div>
                        )}
                      </li>
                  ))}
                    </ul>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-8 xl:col-span-6 xl:col-start-6">
                  <div className="border-n30 rounded-3xl border p-6 sm:p-8 relative">
                    {loading && (
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 rounded-3xl">
                          <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500"/>
                          <p className="mt-2 text-sm text-gray-700">Processing your request...</p>
                        </div>
                    )}
                    <StepComponent handleNext={handleNext} handleBack={handleBack} submitForm={submitForm}/>
                  </div>
                </div>
              </div>
          )}
        </section>
      </>
  );
}

export default PostsTasksSteps;
