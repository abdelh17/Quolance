import { Role } from '@/constants/models/user/UserResponse';
import { useAuthGuard } from '@/api/auth-api';

const FreelancerListTypes = ['All Projects', 'Applied', 'Favorite'];
const ClientListTypes = ['All Projects', 'Posted', 'Completed'];
const PublicListTypes = ['All Projects'];

const getProjectListTypeFromRole = (role: Role | undefined) => {
  switch (role) {
    case Role.FREELANCER:
      return FreelancerListTypes;
    case Role.CLIENT:
      return ClientListTypes;
    default:
      return PublicListTypes;
  }
};

interface ProjectListTypeProps {
  currentListType: string;
  setCurrentListType: (value: string) => void;
}

export default function ProjectListType({
  currentListType,
  setCurrentListType,
}: ProjectListTypeProps) {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const listType = getProjectListTypeFromRole(user?.role);
  return (
    <GenericListTypeComponent
      listType={listType}
      currentListType={currentListType}
      setCurrentListType={setCurrentListType}
    />
  );
}

interface GenericListTypeComponentProps {
  listType: string[];
  currentListType: string;
  setCurrentListType: (value: string) => void;
}

export const GenericListTypeComponent = ({
  listType,
  currentListType,
  setCurrentListType,
}: GenericListTypeComponentProps) => {
  return (
    <nav className='border-b'>
      <div className='medium-container'>
        <div className='flex px-6'>
          {listType.map((type) => (
            <button
              key={type}
              onClick={() => setCurrentListType(type)}
              title={`Show ${type}`}
              className={`
                px-4 pb-[10px] pt-3 text-sm font-medium
                ${
                  currentListType === type
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }
              `}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
