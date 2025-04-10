'use client'
import React from 'react';
import { EnvelopeIcon, ClockIcon, InformationCircleIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const ContactUsPage: React.FC = () => {
  return (
    <div className="relative isolate bg-white overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-blue-100 opacity-30 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-40 right-10 h-60 w-60 rounded-full bg-indigo-100 opacity-20 blur-3xl pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="max-w-2xl mb-16">
          <h1
            data-test="contact-us-title"
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            Get in touch
          </h1>
          <p
            data-test="contact-us-desc"
            className="mt-6 text-lg text-gray-600 max-w-xl"
          >
            Have questions about Quolance? Whether you're a client looking to hire or a freelancer ready to offer your expertise,
            we're here to help you succeed in the digital marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-8 gap-x-12 lg:grid-cols-2">
          {/* Contact information - more compact */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <EnvelopeIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 data-test="contact-us-email-title" className="text-base font-medium text-gray-900">Email</h3>
                  <a
                    data-test="contact-us-email-value"
                    href="mailto:support@quolance.com"
                    className="text-base text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    support@quolance.com
                  </a>
                </div>
              </div>

              {/* Support Hours */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 data-test="contact-us-support-hours" className="text-base font-medium text-gray-900">Support Hours</h3>
                  <p data-test="contact-us-support-day" className="text-base text-gray-700">
                    Mon-Fri: 9AM-6PM EST | Weekend: Limited
                  </p>
                </div>
              </div>

              {/* GitHub */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CodeBracketIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 data-test="contact-us-github-title" className="text-base font-medium text-gray-900">GitHub</h3>
                  <a
                    href="https://github.com/abdelh17/Quolance"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-gray-700 hover:text-blue-600 transition-colors"
                    data-test="contact-us-github-value"
                  >
                    github.com/abdelh17/Quolance
                  </a>
                </div>
              </div>
            </div>

            {/* Quick FAQ access */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <InformationCircleIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 data-test="contact-us-faq-question" className="text-base font-medium text-gray-900">Need Quick Answers?</h3>
                  <Link
                    href="/support/faqs"
                    className="text-base text-gray-700 hover:text-blue-600 transition-colors flex items-center"
                    data-test="contact-us-faq-browse"
                  >
                    Browse our FAQ section
                    <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Community section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 shadow-lg text-white">
            <h2 data-test="contact-us-community-title" className="text-2xl font-semibold mb-4">Join Our Community</h2>
            <p data-test="contact-us-community-slogan" className="text-blue-100 mb-6">
              Quolance is an open-source project dedicated to connecting freelancers and clients. We welcome contributors and community members who want to help improve the platform.
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <svg className="h-6 w-6 mr-3 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <div>
                  <a
                    href="https://github.com/abdelh17/Quolance"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-medium hover:text-blue-200 transition-colors"
                    data-test="contact-us-community-star"
                  >
                    Star our repository
                  </a>
                  <p data-test="contact-us-community-notify" className="text-sm text-blue-200">Get notified about updates</p>
                </div>
              </div>

              <div className="flex items-center">
                <svg className="h-6 w-6 mr-3 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                </svg>
                <div>
                  <a
                    href="https://github.com/abdelh17/Quolance/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-medium hover:text-blue-200 transition-colors"
                    data-test="contact-us-community-report"
                  >
                    Report issues
                  </a>
                  <p data-test="contact-us-community-help" className="text-sm text-blue-200">Help us improve the platform</p>
                </div>
              </div>

              <div className="flex items-center">
                <svg className="h-6 w-6 mr-3 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.28 7.78a.75.75 0 00-1.06-1.06l-9.5 9.5a.75.75 0 101.06 1.06l9.5-9.5z" />
                  <path fillRule="evenodd" d="M17.75 10a.75.75 0 01.75.75v6.5a.75.75 0 01-.75.75h-6.5a.75.75 0 010-1.5h5.75v-5.75a.75.75 0 01.75-.75zm-10.5 2.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm5.5-3.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zm-8.25.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z" clipRule="evenodd" />
                </svg>
                <div>
                  <a
                    href="https://github.com/abdelh17/Quolance/pulls"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-medium hover:text-blue-200 transition-colors"
                    data-test="contact-us-community-contribute"
                  >
                    Contribute
                  </a>
                  <p data-test="contact-us-community-submit" className="text-sm text-blue-200">Submit pull requests</p>
                </div>
              </div>
            </div>

            <Link
              data-test="contact-us-community-check"
              href="/support/faqs"
              className="mt-8 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors duration-300 w-full"
            >
              Check our FAQ section
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
