'use client'

import {
  RocketLaunchIcon,
  HandRaisedIcon,
  UserGroupIcon,
  SparklesIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
} from '@heroicons/react/20/solid'

const values = [
  {
    name: 'Quality First',
    description: 'We maintain high standards in our marketplace by carefully vetting freelancers and ensuring top-quality deliverables.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Global Opportunity',
    description: 'Connect talent with opportunities worldwide, breaking down geographical barriers in the digital workforce.',
    icon: GlobeAltIcon,
  },
  {
    name: 'Fair & Transparent',
    description: 'Clear pricing, zero hidden fees, and secure payment protection for both clients and freelancers.',
    icon: HandRaisedIcon,
  },
  {
    name: 'Community Driven',
    description: 'Building a supportive ecosystem where freelancers and clients can grow and succeed together.',
    icon: UserGroupIcon,
  },
  {
    name: 'Innovation',
    description: 'Continuously improving our platform with cutting-edge features to enhance the freelancing experience.',
    icon: SparklesIcon,
  },
  {
    name: 'Empowering Growth',
    description: 'Providing the tools and support needed for both freelancers and clients to achieve their goals.',
    icon: RocketLaunchIcon,
  },
]

export default function AboutPage() {
  return (
    <div className="bg-white">
      <main className="relative isolate">

        {/* Header section */}
        <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-8 ">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h2 className="text-base font-semibold leading-7 text-b300">About Quolance</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Connecting Talent with Opportunity
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We're building the future of work by empowering businesses to connect with top freelance talent globally. 
              Our platform makes it simple to find, hire, and work with the best professionals around the world.
            </p>
          </div>
        </div>

        {/* Content section */}
        <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-gray-700 lg:max-w-none lg:grid-cols-2">
              <div>
                <p>
                  At Quolance, we believe in the power of remote work and the unlimited potential it brings. Our platform 
                  bridges the gap between talented freelancers and businesses seeking expertise, creating opportunities 
                  that transcend geographical boundaries.
                </p>
                <p className="mt-8">
                  We've built a marketplace that prioritizes quality, transparency, and fair practices. Our commitment 
                  to these values has helped us create a thriving community where both clients and freelancers can achieve 
                  their goals.
                </p>
              </div>
              <div>
                <p>
                  Our platform is designed to make the hiring process seamless and secure. We provide the tools and 
                  support needed to ensure successful collaboration, from project inception to completion.
                </p>
                <p className="mt-8">
                  Whether you're a business looking to scale or a freelancer ready to showcase your skills, Quolance 
                  provides the platform you need to succeed in today's digital economy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values section */}
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 lg:px-8 mb-20">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Values</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              These core principles guide everything we do at Quolance, from platform development to community support.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-16">
            {values.map((value) => (
              <div key={value.name} className="relative pl-9">
                <dt className="inline font-semibold text-gray-900">
                  <value.icon aria-hidden="true" className="absolute left-1 top-1 h-5 w-5 text-b300" />
                  {value.name}
                </dt>{' '}
                <dd className="inline">{value.description}</dd>
              </div>
            ))}
          </dl>
        </div>

      </main>
    </div>
  )
}