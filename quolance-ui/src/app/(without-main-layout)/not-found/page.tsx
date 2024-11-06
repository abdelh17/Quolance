import Image from 'next/image';

import LinkButton from '@/components/ui/LinkButton';

import notFoundImage from '/src/public/images/404-img.png';

function ErrorPage() {
  return (
    <section className='stp-30 flex h-full w-full flex-col items-center justify-center '>
      <div className=''>
        <Image src={notFoundImage} alt='' />
      </div>
      <div className='stp-15 flex flex-col items-center justify-center text-center'>
        <h2 className='heading-2'>Page Not Found</h2>


                <p className='pb-10 pt-3'>
          The page you are looking for doesn&apos;t exist or has been moved
        </p>

        <LinkButton link='/' text='Back To Home' />
      </div>
    </section>
  );
}

export default ErrorPage;
