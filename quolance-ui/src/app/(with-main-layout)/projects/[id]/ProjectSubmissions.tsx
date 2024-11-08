import { useState } from 'react';
import { PiSliders } from 'react-icons/pi';
import FreelancersFilterModal from '@/components/ui/freelancers/FreelancersFilterModal';
import { useGetProjectSubmissions } from '@/api/client-api';
import Loading from '@/components/loading';
import FreelancerCard from '@/components/ui/freelancers/FreelancerCard';
import { DATA_Submissioners } from '@/constants/data';
import { ApplicationResponse } from '@/constants/models/applications/ApplicationResponse';

type ProjectSubmissionsProps = {
  projectId: number;
};

export default function ProjectSubmissions({
  projectId,
}: ProjectSubmissionsProps) {
  const [filterModal, setFilterModal] = useState(false);
  const { data, isLoading } = useGetProjectSubmissions(projectId);
  const submissions = data?.data;

  return (
    <section className='sbp-30 stp-30'>
      <div className='container'>
        <h2 className='heading-2 pb-3'>Project Submissions</h2>
        <p className='text-n300 font-medium'>
          Browse and connect with top talent
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
        <div className='mx-auto flex flex-row flex-wrap justify-center gap-6'>
          {!isLoading &&
            submissions &&
            submissions.length > 0 &&
            submissions.map((submission: ApplicationResponse, idx: number) => (
              <FreelancerCard
                key={submission.applicationId}
                {...DATA_Submissioners[idx]}
              />
            ))}

          {isLoading && <Loading />}
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
