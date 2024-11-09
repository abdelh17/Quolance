import { useMemo, useState } from 'react';
import { PiSliders, PiX } from 'react-icons/pi';
import FreelancersFilterModal from '@/components/ui/freelancers/FreelancersFilterModal';
import { useGetProjectSubmissions } from '@/api/client-api';
import Loading from '@/components/loading';
import FreelancerCard from '@/components/ui/freelancers/FreelancerCard';
import { DATA_Submissioners } from '@/constants/data';
import { ApplicationResponse } from '@/constants/models/applications/ApplicationResponse';
import {
  applySubmissionFilters,
  createFilterHandlers,
  createSelectionHandlers,
} from '@/util/CandidateSelectionUtils';
import RefuseSubmissionsModal from '@/components/ui/freelancers/RefuseSubmissionsModal';

type ProjectSubmissionsProps = {
  projectId: number;
};

export interface SubmissionFilters {
  viewRejected: boolean;
  viewCancelled: boolean;
}

const initialFilters: SubmissionFilters = {
  viewRejected: false,
  viewCancelled: false,
};

export default function ProjectSubmissions({
  projectId,
}: ProjectSubmissionsProps) {
  const [filterModal, setFilterModal] = useState(false);
  const [isRefuseModalOpen, setIsRefuseModalOpen] = useState(false);
  // Filter state that will actually be used to filter submissions
  const [activeFilters, setActiveFilters] =
    useState<SubmissionFilters>(initialFilters);
  // Filter state that is used specifically for the filter modal popup
  const [tempFilters, setTempFilters] =
    useState<SubmissionFilters>(initialFilters);
  const { data, isLoading } = useGetProjectSubmissions(projectId);
  const submissions = data?.data;
  const [selectedSubmissions, setSelectedSubmissions] = useState<number[]>([]);

  // Functions from util/CandidateSelectionUtils.tsx
  const { handleSelectSubmission } = createSelectionHandlers({
    setSelectedSubmissions,
  });

  const { handleFilterChange, handleApplyFilters, handleResetFilters } =
    createFilterHandlers({
      setTempFilters,
      setActiveFilters,
      setFilterModal,
    });

  // Filtered submissions that will be displayed
  const filteredSubmissions = useMemo(() => {
    if (!submissions) return [];
    return applySubmissionFilters(submissions, activeFilters);
  }, [submissions, activeFilters]);

  // Count of filtered results that will be displayed in the filter modal's apply button
  const filteredResultsCount = useMemo(() => {
    if (!submissions) return 0;
    return applySubmissionFilters(submissions, tempFilters).length;
  }, [submissions, tempFilters]);

  const handleApproveSubmission = (applicationId: number) => {
    console.log('Approving submission for freelancer:', applicationId);
    // Call API to approve submission
  };

  const handleRefuseSelected = async () => {
    setSelectedSubmissions([]);
    setIsRefuseModalOpen(false);
    console.log('Refusing selected submissions:', selectedSubmissions);
    // Call API to refuse selected submissions
  };

  return (
    <section className='sbp-30 stp-30'>
      <div className='container'>
        <div className='flex items-center justify-between'>
          <div>
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
              className='bg-n30 text-n300 flex cursor-pointer items-center justify-start gap-3 rounded-full px-5 py-3 text-start font-medium'
            >
              <PiSliders />
              <span className=''>Filters</span>
            </div>
            <div className='bg-n30 text-n300 flex cursor-pointer rounded-full px-5 py-3 text-start font-medium'>
              <span className=''>Location</span>
            </div>
            <div className='bg-n30 text-n300 cursor-pointer rounded-full px-5 py-3 text-start font-medium'>
              <span className=''>Rate</span>
            </div>
          </div>
        </div>

        {/** Refuse/Clear selections Modal **/}
        <div
          className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 transition-all duration-300 ease-in-out
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
            <span className='relative z-10 flex items-center gap-2'>
              <PiX className='text-xl' />
              Clear selection
            </span>
          </button>

          <button
            onClick={() => setIsRefuseModalOpen(true)}
            className='hover:text-n900 relative overflow-hidden rounded-full bg-red-600 px-6 py-3 font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
          >
            <span className='relative z-10 flex items-center gap-2'>
              <PiX className='text-xl' />
              Refuse selected ({selectedSubmissions.length})
            </span>
          </button>
        </div>
        {/** END of Refuse/Clear selections Modal **/}

        {/** List of submissions **/}
        <div className='submissions-container mx-auto mt-6 flex flex-row flex-wrap  gap-6'>
          {!isLoading &&
            filteredSubmissions &&
            filteredSubmissions.length > 0 &&
            filteredSubmissions.map(
              (submission: ApplicationResponse, idx: number) => (
                <FreelancerCard
                  key={submission.applicationId}
                  handleApproveSubmission={() =>
                    handleApproveSubmission(submission.applicationId)
                  }
                  selected={selectedSubmissions.includes(
                    submission.applicationId
                  )}
                  status={submission.applicationStatus}
                  onSelect={(selected) =>
                    handleSelectSubmission(submission.applicationId, selected)
                  }
                  {...DATA_Submissioners[idx]}
                />
              )
            )}

          {isLoading && <Loading />}
        </div>
        {/*<Pagination />*/}
      </div>

      <FreelancersFilterModal
        filterModal={filterModal}
        setFilterModal={setFilterModal}
        filters={tempFilters}
        onFilterChange={handleFilterChange}
        onApplyFilters={() => handleApplyFilters(tempFilters)}
        onResetFilters={() => handleResetFilters(initialFilters)}
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
