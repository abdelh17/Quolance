import Link from 'next/link';

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
  return (
    <div className='border-n30 flex  min-w-[200px] items-center justify-between gap-3 rounded-2xl border p-3 max-md:flex-col'>
      <div className='max-xxl:gap-2 flex w-full items-center justify-start max-sm:flex-col'>
        <div className=''>
          <h5 className='heading-5'>{name}</h5>
          <p className='text-n400 pt-2 text-sm'>Date Posted: {datePosted}</p>
          <p className='text-n400 mt-2 text-sm'>Applicants: {applicants}</p>

          <p
            className={`mt-2 flex w-max items-center justify-center gap-2 rounded-xl px-3 py-2 font-medium ${
              status === 'open'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {status}
          </p>

          <div className='text-n400 xxl:pt-6 flex flex-wrap gap-1 pt-3 text-sm'>
            {tags.map((tag, index) => (
              <p
                key={index}
                className='bg-b50 flex items-center justify-center gap-2 rounded-xl px-3 py-2 font-medium'
              >
                <span>{tag}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className='border-n30 text-n300 flex h-full w-full flex-col items-center  justify-center rounded-2xl px-6 py-8 text-center md:max-w-[176px]'>
        <Link
          href={`/projects/${id}`}
          className='bg-b300 hover:text-n900 relative mt-4 flex items-center justify-center overflow-hidden rounded-full px-3 py-2 text-sm font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] max-md:w-full lg:px-4 lg:py-3'
        >
          <span className='relative z-10'>View Details</span>
        </Link>
      </div>
    </div>
  );
}

export default ProjectCard;
