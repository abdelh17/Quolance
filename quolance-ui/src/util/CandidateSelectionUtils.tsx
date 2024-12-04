// Utility file used in ProjectSubmissions.tsx
import {
  ApplicationResponse,
  ApplicationStatus,
} from '@/constants/models/applications/ApplicationResponse';
import { ApplicationFilters } from '@/app/(with-main-layout)/projects/[id]/ProjectSubmissions';
import { Dispatch, SetStateAction } from 'react';

// Filter logic function that will be used to filter submissions
export const applySubmissionFilters = (
  submissions: ApplicationResponse[],
  filters: ApplicationFilters
) => {
  return submissions.filter((submission) => {
    if (
      !filters.viewRejected &&
      submission.status === ApplicationStatus.REJECTED
    ) {
      return false;
    }
    if (
      !filters.viewCancelled &&
      submission.status === ApplicationStatus.CANCELLED
    ) {
      return false;
    }
    return true;
  });
};

export const handleFilterChange = (
  setTempFilters: Dispatch<SetStateAction<ApplicationFilters>>,
  filterType: keyof ApplicationFilters,
  value: boolean
) => {
  setTempFilters((prevFilters) => ({
    ...prevFilters,
    [filterType]: value,
  }));
};

export const handleApplyFilters = (
  tempFilters: ApplicationFilters,
  setActiveFilters: Dispatch<SetStateAction<ApplicationFilters>>,
  setFilterModal: Dispatch<SetStateAction<boolean>>
) => {
  setActiveFilters(tempFilters);
  setFilterModal(false);
};

export const handleResetFilters = (
  initialFilters: ApplicationFilters,
  setTempFilters: Dispatch<SetStateAction<ApplicationFilters>>,
  setActiveFilters: Dispatch<SetStateAction<ApplicationFilters>>,
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
