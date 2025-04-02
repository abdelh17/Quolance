import { useEffect, useMemo, useRef, useState } from 'react';
import { PiSliders, PiUsers, PiX } from 'react-icons/pi';
import FreelancersFilterModal from '@/components/ui/freelancers/FreelancersFilterModal';
import {
  useApproveSubmission,
  useGetProjectSubmissions,
  useRejectSubmissions,
} from '@/api/client-api';
import Loading from '@/components/ui/loading/loading';
import FreelancerCard from '@/components/ui/freelancers/FreelancerCard';
import { ApplicationResponse } from '@/models/applications/ApplicationResponse';
import {
  applySubmissionFilters,
  handleApplyFilters,
  handleFilterChange,
  handleResetFilters,
  handleSelectSubmission,
} from '@/util/CandidateSelectionUtils';
import RefuseSubmissionsModal from '@/components/ui/freelancers/RefuseSubmissionsModal';
import { useQueryClient } from '@tanstack/react-query';

type ProjectSubmissionsProps = {
  projectId: string;
};

export interface ApplicationFilters {
  viewRejected: boolean;
  skills: string[];
  experienceLevel: string;
  name: string;
}

const initialFilters: ApplicationFilters = {
  viewRejected: false,
  skills: [],
  experienceLevel: '',
  name: '',
};

const NoApplicationsFound = ({
  fromFilter = false,
}: {
  fromFilter?: boolean;
}) => (
  <div className='border-n40 rounded-2xl border-2 bg-white shadow-sm'>
    <div className='flex flex-col items-center justify-center px-4 py-16'>
      <div className='bg-n30 mb-6 rounded-full p-6'>
        <PiUsers className='text-n300 h-12 w-12' />
      </div>
      <h3 className='text-n700 mb-2 text-xl font-semibold'>
        {fromFilter
          ? 'No applications matching your search'
          : 'No applications yet'}
      </h3>
      <p className='text-n400 max-w-md text-center'>
        {fromFilter
          ? 'Try changing your search criteria or clear filters'
          : 'Your project is waiting for its first applicants. Once freelancers apply, their submissions will appear here.'}
      </p>
    </div>
  </div>
);

export default function ProjectSubmissions({
  projectId,
}: ProjectSubmissionsProps) {
  const [filterModal, setFilterModal] = useState(false);
  const [isRefuseModalOpen, setIsRefuseModalOpen] = useState(false);
  // Filter state that will actually be used to filter submissions
  const [activeFilters, setActiveFilters] =
    useState<ApplicationFilters>(initialFilters);
  // Filter state that is used specifically for the filter modal popup
  const [tempFilters, setTempFilters] =
    useState<ApplicationFilters>(initialFilters);

  useEffect(() => {
    console.log('tempFilters', tempFilters);
  }, [tempFilters]);

  // Query hooks
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetProjectSubmissions(projectId);
  const submissions = data?.data;
  const { mutateAsync: approveSubmission } = useApproveSubmission(projectId);
  const { mutateAsync: rejectSubmissions } = useRejectSubmissions(projectId);

  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  // Filtered submissions that will be displayed
  const filteredSubmissions = useMemo(() => {
    if (!submissions) return [];
    // Sort submissions by status in the following order: ACCEPTED, APPLIED, PENDING_CONFIRMATION, REJECTED, CANCELLED
    submissions.sort(
      (
        a: { status: string; id: string },
        b: { status: string; id: string }
      ) => {
        const statusOrder = [
          'ACCEPTED',
          'APPLIED',
          'PENDING_CONFIRMATION',
          'REJECTED',
          'CANCELLED',
        ];
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      }
    );
    return applySubmissionFilters(submissions, activeFilters);
  }, [submissions, activeFilters]);

  // Count of filtered results that will be displayed in the filter modal's apply button
  const filteredResultsCount = useMemo(() => {
    if (!submissions) return 0;
    return applySubmissionFilters(submissions, tempFilters).length;
  }, [submissions, tempFilters]);

  const handleApproveSubmission = (applicationId: string) => {
    approveSubmission(applicationId).then(() => {
      // Ensure that the project submissions are refetched after approving a submission
      queryClient.invalidateQueries({
        queryKey: ['project-submissions', projectId],
      });
    });
  };

  const handleRefuseSelected = async () => {
    setSelectedSubmissions([]);
    setIsRefuseModalOpen(false);
    await rejectSubmissions(selectedSubmissions);
  };

  //This ref is useful since we scroll down to it when a Client clicks on the "View Applicants" button
  const applicantsRef = useRef(null);

  return (
    <section className='sbp-30 stp-15 container'>
      <div>
        <div className='flex items-center justify-between'>
          <div ref={applicantsRef} id='applicants-section'>
            <h2 className='heading-2 pb-3'>Project Submissions</h2>
            <p className='text-n300 font-medium'>
              Browse and connect with top talent
            </p>
          </div>
        </div>

        <div className='mt-8 flex items-start justify-start'>
          <div className='border-b50 flex flex-wrap items-center justify-start gap-3 overflow-hidden rounded-lg border p-1 min-[380px]:rounded-full'>
            <div
              onClick={() => setFilterModal(true)}
              className='bg-n30 text-n300 flex cursor-pointer items-center justify-start gap-3 rounded-full px-5 py-3 text-start text-sm font-medium sm:text-base'
            >
              <PiSliders />
              <span className=''>Filters</span>
            </div>
          </div>
        </div>

        {/** Refuse/Clear selections Modal **/}
        <div
          className={`fixed bottom-8 right-8 z-[1000] flex items-center gap-3 transition-all duration-300 ease-in-out
         ${
           selectedSubmissions.length === 0
             ? 'translate-y-20 scale-90 opacity-0'
             : 'translate-y-0 scale-100 opacity-100'
         }`}
        >
          <button
            onClick={() => setSelectedSubmissions([])}
            className='bg-n700 hover:text-n900 relative overflow-hidden rounded-full px-6 py-3 font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
          >
            <span className='relative z-10 flex items-center gap-2 text-xs sm:text-base'>
              <PiX className='text-sm sm:text-xl' />
              Clear selection
            </span>
          </button>

          <button
            data-test='reject-selected-btn'
            onClick={() => setIsRefuseModalOpen(true)}
            className='hover:text-n900 relative overflow-hidden rounded-full bg-red-600 px-6 py-3 font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
          >
            <span className='relative z-10  flex items-center gap-2 text-xs sm:text-base'>
              <PiX className='text-sm sm:text-xl' />
              Reject selected ({selectedSubmissions.length})
            </span>
          </button>
        </div>

        <div className='mt-6'>
          {isLoading ? (
            <Loading />
          ) : filteredSubmissions && filteredSubmissions.length > 0 ? (
            <div className='submissions-container grid grid-cols-1 gap-7 gap-y-12 md:grid-cols-2 xl:grid-cols-3'>
              {filteredSubmissions.map(
                (submission: ApplicationResponse, idx: number) => (
                  <div key={`submission-${idx}`}>
                    <FreelancerCard
                      handleApproveSubmission={() =>
                        handleApproveSubmission(submission.id)
                      }
                      selected={selectedSubmissions.includes(submission.id)}
                      status={submission.status}
                      onSelect={(selected) =>
                        handleSelectSubmission(
                          submission.id,
                          selected,
                          setSelectedSubmissions
                        )
                      }
                      freelancerProfile={submission.freelancerProfile}
                      canSelect={
                        !filteredSubmissions.some(
                          (submission) => submission.status === 'ACCEPTED'
                        ) && submission.status === 'APPLIED'
                      }
                      message={submission.message}
                      currentProjectId={projectId}
                    />
                  </div>
                )
              )}
            </div>
          ) : (
            <NoApplicationsFound fromFilter={data !== undefined} />
          )}
        </div>
      </div>

      <FreelancersFilterModal
        filterModal={filterModal}
        setFilterModal={setFilterModal}
        filters={tempFilters}
        onFilterChange={(filterType, value) =>
          handleFilterChange(setTempFilters, filterType, value)
        }
        onApplyFilters={() =>
          handleApplyFilters(tempFilters, setActiveFilters, setFilterModal)
        }
        onResetFilters={() =>
          handleResetFilters(
            initialFilters,
            setTempFilters,
            setActiveFilters,
            setFilterModal
          )
        }
        filteredResults={filteredResultsCount}
      />

      <RefuseSubmissionsModal
        isOpen={isRefuseModalOpen}
        setIsOpen={setIsRefuseModalOpen}
        onConfirm={handleRefuseSelected}
        selectedCount={selectedSubmissions.length}
      />
    </section>
  );
}
