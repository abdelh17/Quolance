import { Role } from '@/constants/models/user/UserResponse';
import { useAuthGuard } from '@/api/auth-api';

const FreelancerSubLists = ['All Projects', 'Applied'];
const ClientSubLists = ['All Projects', 'Posted', 'Completed'];
const PublicSubLists = ['All Projects'];

const getProjectSubListFromRole = (role: Role | undefined) => {
  switch (role) {
    case Role.FREELANCER:
      return FreelancerSubLists;
    case Role.CLIENT:
      return ClientSubLists;
    default:
      return PublicSubLists;
  }
};

interface ProjectSubListProps {
  currentSubList: string;
  setCurrentSubList: (value: string) => void;
}

export default function ProjectSubListSelect({
  currentSubList,
  setCurrentSubList,
}: ProjectSubListProps) {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const subList = getProjectSubListFromRole(user?.role);
  return (
    <GenericSubListComponent
      subList={subList}
      currentSubList={currentSubList}
      setCurrentSubList={setCurrentSubList}
    />
  );
}

interface GenericSubListComponentProps {
  subList: string[];
  currentSubList: string;
  setCurrentSubList: (value: string) => void;
}

export const GenericSubListComponent = ({
  subList,
  currentSubList,
  setCurrentSubList,
}: GenericSubListComponentProps) => {
  return (
    <nav className='border-b'>
      <div className='medium-container'>
        <div className='flex px-6'>
          {subList.map((type) => (
            <button
              key={type}
              onClick={() => setCurrentSubList(type)}
              title={`Show ${type}`}
              className={`
                px-4 pb-[10px] pt-3 text-sm font-medium
                ${
                  currentSubList === type
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }
              `}
              data-test={`${type}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
