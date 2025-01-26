import Pagination from '@/components/ui/Pagination';
import { PageMetaData } from '@/constants/types/pagination-types';
import { CandidateFilterQuery } from '@/api/client-api';
import { CandidateResponse } from '@/constants/models/candidates/CandidateResponse';
import FreelancerCatalogCard from '@/components/ui/freelancers/candidates/FreelancerCatalogCard';
import FreelancerCatalogFilter from '@/components/ui/freelancers/candidates/candidateFilter/FreelancerCatalogFilter';
import SortControls from '@/components/ui/pagination/SortControls';

interface FreelancerListLayoutProps {
  isLoading: boolean;
  isSuccess: boolean;
  data: [];
  query: CandidateFilterQuery;
  setQuery: (query: CandidateFilterQuery) => void;
  pageMetaData: PageMetaData;
}

const CandidateSortOptions = [{ value: 'id', label: 'Date of registration' }];

const FreelancerListLayout = ({
  isLoading,
  isSuccess,
  data,
  query,
  setQuery,
  pageMetaData,
}: FreelancerListLayoutProps) => {
  return (
    <div className='medium-container mx-auto mt-8 pb-8'>
      <div className='flex flex-col gap-10 lg:flex-row'>
        {/* Sidebar with filters */}
        <div className='w-full shrink-0 lg:w-64'>
          <div className='sticky top-8'>
            <FreelancerCatalogFilter query={query} setQuery={setQuery} />
          </div>
        </div>

        {/* Main content area */}
        <div className='flex-1 px-6'>
          <SortControls
            query={query}
            setQuery={setQuery}
            sortOptions={CandidateSortOptions}
            metadata={pageMetaData}
          />
          {isSuccess && data && (
            <div className='mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
              {data.map((candidate: CandidateResponse) => (
                <FreelancerCatalogCard
                  key={candidate.id}
                  freelancer={candidate}
                  onMessageClick={() => {
                    console.log('Message clicked');
                  }}
                />
              ))}
            </div>
          )}

          {!isLoading && (!data || data.length === 0) && (
            <div className='flex h-64 items-center justify-center'>
              <p className='text-center text-gray-500'>No candidates found</p>
            </div>
          )}
        </div>
      </div>
      <div className={'mb-5 mt-8 w-full'}>
        <Pagination
          metadata={pageMetaData}
          onPageChange={(pageNumber) =>
            setQuery({ ...query, page: pageNumber })
          }
        />
      </div>
    </div>
  );
};

export default FreelancerListLayout;
