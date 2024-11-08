import { useQuery } from '@tanstack/react-query';
import { DATA_ProjectList } from '@/constants/data';

/*--- Hooks ---*/
export const useGetProjectInfo = (projectId: number) => {
  return useQuery({
    queryKey: ['project-info', projectId], // Add projectId to queryKey, important for caching
    queryFn: () => getProjectInfo(projectId),
    enabled: !!projectId,
  });
};

/*--- Query functions ---*/
const getProjectInfo = async (projectId: number) => {
  return DATA_ProjectList.find((project) => project.id === projectId);
};
