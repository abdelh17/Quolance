import { ProjectType } from '@/types/projectTypes';

type ProjectDetailsProps = {
  project: ProjectType;
};

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  return (
    <div className='box-shadow-1 mb-12 rounded-lg bg-white p-8 shadow-lg'>
      <h3 className='heading-2 text-primary mb-4'>{project.name}</h3>

      <div className='mb-4 flex items-center gap-4 text-sm text-gray-500'>
        <p>
          Date Posted:{' '}
          <span className='text-primary'>{project.datePosted}</span>
        </p>
        <p>
          Status:{' '}
          <span
            className={`rounded-lg px-3 py-1 font-medium ${
              project.status === 'open'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {project.status}
          </span>
        </p>
        <p>
          Applicants: <span className='text-primary'>{project.applicants}</span>
        </p>
      </div>

      <p className='mb-6 leading-relaxed text-gray-700'>
        {project.description}
      </p>

      <div className='mb-6 flex flex-wrap gap-2'>
        {project.tags.map((tag, index) => (
          <span
            key={index}
            className='rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-500'
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
