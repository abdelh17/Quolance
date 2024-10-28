import { useState } from 'react';
import { PiSliders } from 'react-icons/pi';
import { submissioners } from '@/data/data';
import FreelancerCard from '@/components/ui/freelancers/FreelancerCard';
import FreelancersFilterModal from '@/components/ui/freelancers/FreelancersFilterModal';

type ProjectSubmissionsProps = {
  projectId: number;
};

export default function ProjectSubmissions({
  projectId,
}: ProjectSubmissionsProps) {
  const [filterModal, setFilterModal] = useState(false);

  return (
    <section className='sbp-30 stp-30'>
      <div className='container'>
        <h2 className='heading-2 pb-3'>
          Discover the world’s best flexible talent
        </h2>
        <p className='text-n300 font-medium'>
          Browse and connect with top talent who can help bring your next
          project to life
        </p>

        <div className='stp-15 sbp-15 flex items-start justify-start'>
          <div className='border-b50 flex flex-wrap items-center justify-start gap-3 overflow-hidden rounded-lg border p-1 min-[380px]:rounded-full'>
            <div
              onClick={() => setFilterModal(true)}
              className='bg-n30 text-n300 flex cursor-pointer items-center justify-start gap-3 rounded-full px-5 py-3 text-start font-medium'
            >
              <PiSliders />
              <span className=''>Filters</span>
            </div>
            <div className='bg-n30 text-n300 flex cursor-pointer rounded-full px-5 py-3 text-start font-medium'>
              <span className=''>Location</span>
            </div>
            <div className='bg-n30 text-n300 cursor-pointer rounded-full px-5 py-3 text-start font-medium'>
              <span className=''>Rate</span>
            </div>
          </div>
        </div>
        <div className='flex w-full flex-row flex-wrap gap-6'>
          {submissioners.map(({ id, ...props }) => (
            <FreelancerCard key={id} {...props} />
          ))}
        </div>
        {/*<Pagination />*/}
      </div>

      <FreelancersFilterModal
        filterModal={filterModal}
        setFilterModal={setFilterModal}
      />
    </section>
  );
}
