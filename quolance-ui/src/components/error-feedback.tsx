'use client';

import React from 'react';
import { HttpErrorResponse } from '@/constants/models/http/HttpErrorResponse';
import { cn } from '@/util/utils';

interface ErrorFeedbackProps extends React.HTMLAttributes<HTMLDivElement> {
  data: HttpErrorResponse | undefined;
}
export default function ErrorFeedback({ data, className, ...rest }: ErrorFeedbackProps) {
  if (!data) return <></>;

  return (
    <div
      className={cn(
        'flex w-full flex-col rounded-md bg-red-200 p-4 text-red-800',
        className
      )}
    >
      {data.message && <p {...rest} className='font-bold'>{data.message}</p>}

      {data.errors && (
        <ul className='mt-2 list-inside list-disc'>
          {Object.entries(data.errors).map(([key, value]) => (
            <li key={key}>
              <span className='font-semibold'>{key}</span> {value}
            </li>
          ))}
        </ul>
      )}

      {data.generalErrors && (
        <ul className='list-inside list-disc'>
          {data.generalErrors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
