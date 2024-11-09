// Utility file used in ProjectSubmissions.tsx
import {
  ApplicationResponse,
  ApplicationStatus,
} from '@/constants/models/applications/ApplicationResponse';
import { SubmissionFilters } from '@/app/(with-main-layout)/projects/[id]/ProjectSubmissions';
import { Dispatch, SetStateAction } from 'react';

// Interface for the filter management functions
interface FilterManagementParams {
  setTempFilters: Dispatch<SetStateAction<SubmissionFilters>>;
  setActiveFilters: Dispatch<SetStateAction<SubmissionFilters>>;
  setFilterModal: Dispatch<SetStateAction<boolean>>;
}

interface SelectionManagementParams {
  setSelectedSubmissions: Dispatch<SetStateAction<number[]>>;
}

// Filter logic function that will be used to filter submissions
export const applySubmissionFilters = (
  submissions: ApplicationResponse[],
  filters: SubmissionFilters
) => {
  return submissions.filter((submission) => {
    if (
      !filters.viewRejected &&
      submission.applicationStatus === ApplicationStatus.REJECTED
    ) {
      return false;
    }
    if (
      !filters.viewCancelled &&
      submission.applicationStatus === ApplicationStatus.CANCELLED
    ) {
      return false;
    }
    return true;
  });
};

export const createFilterHandlers = ({
  setTempFilters,
  setActiveFilters,
  setFilterModal,
}: FilterManagementParams) => {
  const handleFilterChange = <K extends keyof SubmissionFilters>(
    filterType: K,
    value: SubmissionFilters[K]
  ) => {
    setTempFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const handleApplyFilters = (tempFilters: SubmissionFilters) => {
    setActiveFilters(tempFilters);
    setFilterModal(false);
  };

  const handleResetFilters = (initialFilters: SubmissionFilters) => {
    setTempFilters(initialFilters);
    setActiveFilters(initialFilters);
    setFilterModal(false);
  };

  return {
    handleFilterChange,
    handleApplyFilters,
    handleResetFilters,
  };
};

export const createSelectionHandlers = ({
  setSelectedSubmissions,
}: SelectionManagementParams) => {
  const handleSelectSubmission = (submissionId: number, selected: boolean) => {
    setSelectedSubmissions((prev) =>
      selected
        ? [...prev, submissionId]
        : prev.filter((id) => id !== submissionId)
    );
  };

  return {
    handleSelectSubmission,
  };
};
