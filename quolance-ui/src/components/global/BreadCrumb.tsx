import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type BreadcrumbProps = {
  pageName: string;
  isMiddlePage?: boolean;
  middlePageName?: string;
  middlePageLink?: string;
};

const Breadcrumb = ({
  pageName,
  isMiddlePage = false,
  middlePageName,
  middlePageLink,
}: BreadcrumbProps) => {
  return (
    <nav aria-label='Breadcrumb' className='flex'>
      <ol role='list' className='flex items-center space-x-4'>
        <li>
          <div className='flex'>
            <Link
              href='/'
              className='text-sm font-medium text-gray-500 hover:text-gray-700'
            >
              Home
            </Link>
          </div>
        </li>

        {isMiddlePage && middlePageName && middlePageLink && (
          <li>
            <div className='flex items-center'>
              <ChevronRight
                aria-hidden='true'
                className='h-5 w-5 shrink-0 text-gray-400'
              />
              <Link
                href={middlePageLink}
                className='ml-4 text-sm font-medium text-gray-500 hover:text-gray-700'
              >
                {middlePageName}
              </Link>
            </div>
          </li>
        )}

        <li>
          <div className='flex items-center'>
            <ChevronRight
              aria-hidden='true'
              className='h-5 w-5 shrink-0 text-gray-400'
            />
            <span className='ml-4 text-sm font-medium text-gray-500'>
              {pageName}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
