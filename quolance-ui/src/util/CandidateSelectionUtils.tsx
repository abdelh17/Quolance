// Utility file used in ProjectSubmissions.tsx
import {
  ApplicationResponse,
  ApplicationStatus,
} from '@/constants/models/applications/ApplicationResponse';
import { SubmissionFilters } from '@/app/(with-main-layout)/projects/[id]/ProjectSubmissions';
import { Dispatch, SetStateAction } from 'react';

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

export const handleFilterChange = (
  setTempFilters: Dispatch<SetStateAction<SubmissionFilters>>,
  filterType: keyof SubmissionFilters,
  value: boolean
) => {
  setTempFilters((prevFilters) => ({
    ...prevFilters,
    [filterType]: value,
  }));
};

export const handleApplyFilters = (
  tempFilters: SubmissionFilters,
  setActiveFilters: Dispatch<SetStateAction<SubmissionFilters>>,
  setFilterModal: Dispatch<SetStateAction<boolean>>
) => {
  setActiveFilters(tempFilters);
  setFilterModal(false);
};

export const handleResetFilters = (
  initialFilters: SubmissionFilters,
  setTempFilters: Dispatch<SetStateAction<SubmissionFilters>>,
  setActiveFilters: Dispatch<SetStateAction<SubmissionFilters>>,
  setFilterModal: Dispatch<SetStateAction<boolean>>
) => {
  setTempFilters(initialFilters);
  setActiveFilters(initialFilters);
  setFilterModal(false);
};

export const handleSelectSubmission = (
  submissionId: number,
  selected: boolean,
  setSelectedSubmissions: Dispatch<SetStateAction<number[]>>
) => {
  setSelectedSubmissions((prev) =>
    selected
      ? [...prev, submissionId]
      : prev.filter((id) => id !== submissionId)
  );
};
