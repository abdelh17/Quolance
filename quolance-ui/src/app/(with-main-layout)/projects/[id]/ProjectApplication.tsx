// components/projects/ApplicationForm.tsx
'use client';
import { useState } from 'react';

type ApplicationFormProps = {
  projectId: number;
};

export default function ProjectApplication({
  projectId,
}: ApplicationFormProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    console.log('Submitting application:', { projectId, coverLetter, file });
    // Add form submission logic here
  };

  return (
    <div className='box-shadow-1 mt-6 rounded-lg bg-white p-8 shadow-lg'>
      <h3 className='heading-3 text-primary mb-6'>Your Application</h3>

      <div className='mb-6'>
        <label htmlFor='coverLetter' className='mb-2 block text-lg font-medium'>
          Cover Letter
        </label>
        <textarea
          id='coverLetter'
          className='focus:ring-primary mb-4 w-full rounded-lg border border-gray-300 p-4 focus:border-transparent focus:outline-none focus:ring-2'
          placeholder="Introduce yourself and explain why you're a great fit for this project..."
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={6}
        />
        <p className='text-sm text-gray-500'>Max 500 words</p>
      </div>

      <div className='mb-6'>
        <label htmlFor='fileUpload' className='mb-2 block text-lg font-medium'>
          Attach Your Portfolio
        </label>
        <input
          id='fileUpload'
          type='file'
          className='focus:ring-primary w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:outline-none focus:ring-2'
          onChange={handleFileChange}
        />
        <p className='text-sm text-gray-500'>
          Accepted formats: PDF, Docx, PNG
        </p>
      </div>

      <div className='mt-8'>
        <button
          className='bg-primary hover:bg-primary-dark focus:ring-primary w-full rounded-lg py-4 font-medium text-white shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-opacity-50'
          onClick={handleSubmit}
        >
          Submit Application
        </button>
      </div>
    </div>
  );
}
