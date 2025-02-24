import { GenericSubListComponent } from '@/components/ui/projects/projectFIlter/ProjectSubListSelect';

// For now, only clients can see the list of candidates
// If we want to show the list of candidates to freelancers/public users,
// we can add the list types here
const FreelancerSubLists = [
  'All Candidates',
  'Under consideration',
  'Previously hired',
];

interface CandidateSubListProps {
  currentSubList: string;
  setCurrentSubList: (value: string) => void;
}

export default function FreelancerCatalogSubListSelect({
  currentSubList,
  setCurrentSubList,
}: CandidateSubListProps) {
  return (
    <GenericSubListComponent
      subList={FreelancerSubLists}
      currentSubList={currentSubList}
      setCurrentSubList={setCurrentSubList}
    />
  );
}
