import { GenericListTypeComponent } from '@/components/ui/projects/projectFIlter/ProjectListType';

// For now, only clients can see the list of candidates
// If we want to show the list of candidates to freelancers/public users,
// we can add the list types here
const FreelancerListTypes = [
  'All Candidates',
  'Under consideration',
  'Previously hired',
];

interface CandidateListTypeProps {
  currentListType: string;
  setCurrentListType: (value: string) => void;
}

export default function FreelancerCatalogListType({
  currentListType,
  setCurrentListType,
}: CandidateListTypeProps) {
  return (
    <GenericListTypeComponent
      listType={FreelancerListTypes}
      currentListType={currentListType}
      setCurrentListType={setCurrentListType}
    />
  );
}
