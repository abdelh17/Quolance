import Link from 'next/link';
import { useAuthGuard } from '@/api/auth-api';
import { Role } from '@/constants/models/user/UserResponse';

function ProjectCard({
  id,
  name,
  tags,
  datePosted,
  description,
  status,
  applicants,
}: {
  id: number;
  name: string;
  tags: string[];
  datePosted: string;
  description: string;
  status: string;
  applicants: number;
}) {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const view = user?.role;

  return (
    <div className='border-n30 flex w-full min-w-[200px] flex-col gap-3 rounded-2xl border p-5'>
      <div>
        <h5 className='heading-5'>{name}</h5>
        <p className='text-n400 pt-2 text-sm'>Date Posted: {datePosted}</p>
        <p className='text-n400 mt-2 text-sm'>Applicants: {applicants}</p>

        <p
          className={`mt-2 w-max rounded-xl px-3 py-2 font-medium ${
            status === 'open'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {status}
        </p>
      </div>

      <div className='flex items-center justify-between'>
        <div className='text-n400 flex flex-wrap gap-2 text-sm'>
          {tags.map((tag, index) => (
            <p key={index} className='bg-b50 rounded-xl px-3 py-2 font-medium'>
              {tag}
            </p>
          ))}
        </div>

        <Link
          href={`/projects/${id}`}
          className='bg-b300 hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full px-3 py-2 text-sm font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] lg:px-4 lg:py-2'
        >
          <span className='relative z-10'>
            {view === Role.FREELANCER ? 'View Details' : 'View Submissions'}
          </span>
        </Link>
      </div>
    </div>
  );
}

export default ProjectCard;
