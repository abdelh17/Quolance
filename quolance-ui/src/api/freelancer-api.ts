'use client';
import { useMutation } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';

/*--- Hooks ---*/
export const useSubmitApplication = () => {
  return useMutation({
    mutationFn: submitApplication,
  });
};

/*--- Query functions ---*/
// Hardcoded for now
const submitApplication = async ({
  freelancerId,
  projectId,
}: {
  freelancerId: number;
  projectId: number;
  // we can a payload of specific type here in the future
}) => {
  return httpClient.post(`api/freelancer/submit-application`, {
    freelancerId,
    projectId,
  });
};
