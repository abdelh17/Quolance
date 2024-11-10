import { formatPriceRange, ProjectType } from '@/constants/types/project-types';
import Image from 'next/image';
import freelancerImg from '@/public/images/freelancer-hero-img-2.jpg';
import Link from 'next/link';

interface ProjectDetailsProps {
  project: ProjectType;
}

export default function ProjectDetailsView({ project }: ProjectDetailsProps) {
  const stats = [
    { label: 'Expected Delivery', value: project.deliveryDate },
    { label: 'Budget', value: formatPriceRange(project.priceRange) },
    { label: 'Location', value: project.location },
  ];

  return (
    <div className='bg-white py-8 sm:py-12'>
      <div className='mx-auto max-w-7xl'>
        <div className='mx-auto flex max-w-2xl flex-col items-start gap-8 lg:mx-0 lg:max-w-none lg:flex-row'>
          <div className='max-w-xl lg:pr-4'>
            <div className='relative overflow-hidden rounded-3xl bg-gray-900 px-6 pb-9 pt-64 shadow-2xl sm:px-12 lg:max-w-lg lg:px-8 lg:pb-8 xl:px-10 xl:pb-10'>
              <Image
                alt=''
                src={freelancerImg}
                className='saturate-20 absolute inset-0 h-full w-full object-cover brightness-125'
              />
              <div className='absolute inset-0 bg-gray-400 opacity-70  mix-blend-multiply' />

              <figure className='relative isolate'>
                <blockquote className='mt-6 text-xl/8 font-semibold text-white'>
                  <p>
                    Bring your ideas to life with skilled freelancers ready to
                    make them reality. Post your project or browse talent to get
                    started.
                  </p>
                </blockquote>
                <Link
                  href='/auth/register'
                  className='bg-b300 hover:text-n900 relative mt-4 flex w-1/2 items-center justify-center overflow-hidden rounded-full px-6 py-2.5 font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
                >
                  <span className='relative z-10'>Sign Up For Free</span>
                </Link>
              </figure>
            </div>
          </div>
          <div>
            <div className='text-base/7 text-gray-700 lg:max-w-lg'>
              <h1 className='text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
                {project.projectTitle}
              </h1>
              <div className='max-w-xl'>
                <p className='mt-6'>
                  Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget
                  risus enim. Mattis mauris semper sed amet vitae sed turpis id.
                  Id dolor praesent donec est. Odio penatibus risus viverra
                  tellus varius sit neque erat velit. Faucibus commodo massa
                  rhoncus, volutpat. Dignissim sed eget risus enim. Mattis
                  mauris semper sed amet vitae sed turpis id.
                </p>
                <p className='mt-8'>
                  Et vitae blandit facilisi magna lacus commodo. Vitae sapien
                  duis odio id et. Id blandit molestie auctor fermentum
                  dignissim. Lacus diam tincidunt ac cursus in vel. Mauris
                  varius vulputate et ultrices hac adipiscing egestas. Iaculis
                  convallis ac tempor et ut. Ac lorem vel integer orci.
                </p>
                <p className='mt-8'>
                  Et vitae blandit facilisi magna lacus commodo. Vitae sapien
                  duis odio id et. Id blandit molestie auctor fermentum
                  dignissim. Lacus diam tincidunt ac cursus in vel. Mauris
                  varius vulputate et ultrices hac adipiscing egestas. Iaculis
                  convallis ac tempor et ut. Ac lorem vel integer orci.
                </p>
              </div>
            </div>
            <dl className='mt-10 grid grid-cols-2 gap-8 border-t border-gray-900/10 pt-10 sm:grid-cols-3'>
              {stats.map((stat, statIdx) => (
                <div key={statIdx}>
                  <dt className='text-sm/6 font-semibold text-gray-600'>
                    {stat.label}
                  </dt>
                  <dd className='mt-2 text-xl font-semibold tracking-tight text-gray-900'>
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
