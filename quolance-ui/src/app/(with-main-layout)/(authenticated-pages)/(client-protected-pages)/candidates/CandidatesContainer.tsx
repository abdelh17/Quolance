'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import heroImage3 from '@/public/images/freelancer-hero-img-3.jpg';
import FreelancerListLayout from '@/components/ui/freelancers/candidates/FreelancerListLayout';
import {
  CandidateFilterQuery,
  CandidateFilterQueryDefault,
  useGetAllCandidates,
} from '@/api/client-api';
import { PageMetaData } from '@/constants/types/pagination-types';
import Loading from '@/components/ui/loading/loading';

function CandidatesContainer() {
  const [currentListType, setCurrentListType] = useState('All Candidates');
  const [query, setQuery] = useState<CandidateFilterQuery>(
    CandidateFilterQueryDefault
  );
  const { data, isLoading, isSuccess } = useGetAllCandidates(query);
  const candidatesData = data?.data.content;
  const pageMetaData = data?.data.metadata;

  return (
    <>
      <div className='relative bg-gray-900'>
        <div className='bg-b300 relative h-60 overflow-hidden md:absolute md:left-0 md:h-full md:w-1/3 lg:w-1/2'>
          <Image
            alt=''
            src={heroImage3}
            className='h-full w-full object-cover'
          />
        </div>
        <div className='relative mx-auto max-w-7xl py-24 sm:py-32 lg:px-8 lg:py-40'>
          <div className='pl-6 pr-6 md:ml-auto md:w-2/3 md:pl-16 lg:w-1/2 lg:pl-24 lg:pr-0 xl:pl-32'>
            <h2 className='text-b300 text-base/7 font-semibold'>
              Candidate Catalog
            </h2>
            <p className='mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl'>
              Scout For Your Next Candidate Today
            </p>
            <p className='mt-6 text-base/7 text-gray-300'>
              Find trusted freelancers and clients with ease. Our extensive
              network of skilled local experts—from programming and design to
              writing and beyond—is here to help you succeed, no matter the
              project.
            </p>
          </div>
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/*<FreelancerCatalogSubListSelect*/}
          {/*  currentSubList={currentListType}*/}
          {/*  setCurrentSubList={setCurrentListType}*/}
          {/*/>*/}
          <FreelancerListLayout
            isLoading={isLoading}
            isSuccess={isSuccess}
            data={candidatesData}
            query={query}
            setQuery={setQuery}
            pageMetaData={pageMetaData as PageMetaData}
          />
        </>
      )}
    </>
  );
}

export default CandidatesContainer;
