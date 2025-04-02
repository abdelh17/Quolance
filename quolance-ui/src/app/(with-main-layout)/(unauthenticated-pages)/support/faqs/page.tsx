'use client';

import Link from 'next/link';
import React from 'react';
import {HelpCircle} from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: "What is Quolance?",
    answer: "Quolance is a freelancing platform that connects clients with freelancers specializing in tech services. It allows clients to post projects, receive proposals, and hire professionals, while freelancers can compete to get contracts, showcase their skills, and collaborate with clients."
  },
  {
    id: 2,
    question: "Who can use Quolance?",
    answer: "Anyone looking to hire tech talent or offer freelance tech services can use Quolance. The platform is open to individuals and businesses across Canada and beyond."
  },
  {
    id: 3,
    question: "I am not a tech related freelancer/client, can I still use Quolance?",
    answer: "The platform is open to everyone, but is heavily focused on tech-related projects. It will be difficult for you to find the right fit here given we do not suit your needs. If you are looking for tech services or have tech skills to offer, you can use Quolance."
  },
  {
    id: 4,
    question: "Is Quolance free to use?",
    answer: "Yes! Creating an account and browsing projects is free. Some AI features may require a premium subscription or incur service fees."
  },
  {
    id: 5,
    question: "How do I sign up?",
    answer: "To sign up, simply visit the \"Sign Up\" tab at the top of the page and enter your information. You can register as a freelancer or a client using an email address or an OAuth2-supported provider like Google."
  },
  {
    id: 6,
    question: "How do I reset my password?",
    answer: "Go to the login page and click \"Forgot Password?\" Follow the instructions to reset your password via email."
  },
  {
    id: 7,
    question: "How do I delete my account?",
    answer: "To delete your account, go to your profile settings and select the \"Delete Account\" option. Follow the instructions to confirm the deletion."
  },
  {
    id: 8,
    question: "What are the fees for using the platform?",
    answer: "We maintain a transparent fee structure. Clients can post projects for free. Freelancers pay zero commission on their earnings. Premium features like priority project listing or some AI-powered features may require a subscription or a small fee."
  },
  {
    id: 9,
    question: "How do I post a project?",
    answer: "You need a client account to post a project. Once logged in as a client, go to the Post a Project section, fill in the required details such as title, description, budget, and deadline, then publish it. Your project will be reviewed and approved before going live."
  },
  {
    id: 10,
    question: "How long before my project is approved?",
    answer: "Most projects are approved instantaneously, but it may take up to 24 hours for our team to review and approve your project if it was flagged as sensitive."
  },
  {
    id: 11,
    question: "What kinds of projects can I post?",
    answer: "You can post a wide range of tech-related projects, including web development, mobile app development, data analysis, cybersecurity, and more. Simply make sure your post is not an ad, a full time job offer, spam, unprofessional or inappropriate."
  },
  {
    id: 12,
    question: "How do I select a freelancer?",
    answer: "You can review proposals submitted by freelancers, check their profiles, and communicate with them via the platform before making a selection. Once you choose a freelancer, you can proceed with the contract."
  },
  {
    id: 13,
    question: "Can I modify a project after posting it?",
    answer: "No, once a project is posted and approved, you cannot modify it. However, you can close it or post an updated version."
  },
  {
    id: 14,
    question: "What happens when my project expires?",
    answer: "Projects expire one week after posting by default. Once expired, they remain publicly visible for three additional days before being archived."
  },
  {
    id: 15,
    question: "Is there a limit on the number of projects I can post?",
    answer: "No! You can post as many projects as you want."
  },
  {
    id: 16,
    question: "Can I hire freelancers for long-term projects?",
    answer: "Yes, you can hire freelancers for both short-term and long-term projects. We offer different contract types including fixed-price projects, hourly rates, and retainer agreements. You can also convert successful project-based relationships into ongoing collaborations."
  },
  {
    id: 17,
    question: "How do I know if a freelancer is right for my project?",
    answer: "You can review freelancers' profiles, which include their portfolio, skills, experience, and client reviews. We also provide skill verification badges and success scores. Additionally, you can conduct interviews and request small paid test projects before committing to larger projects."
  },
  {
    id: 18,
    question: "How do I find projects?",
    answer: "Freelancers can browse the \"Available Projects\" section and filter listings based on their skills and preferences."
  },
  {
    id: 19,
    question: "How do I submit a proposal?",
    answer: "Go to the project page you are interested in and click \"Submit Proposal.\" Enter a message explaining why you're the best fit for the contract."
  },
  {
    id: 20,
    question: "Can I update my proposal after submission?",
    answer: "No, once submitted, a proposal cannot be modified. If necessary, you can delete your application and submit a new one."
  },
  {
    id: 21,
    question: "Can I communicate with clients before getting selected?",
    answer: "Yes, freelancers can send messages to clients to discuss project details before selection."
  },
  {
    id: 22,
    question: "I have difficulty getting contracts. What should I do?",
    answer: "Make sure your profile is complete and showcases your skills effectively. You can also improve your proposals by customizing them to each project and highlighting your relevant experience. You can use the chat feature to directly reach out to the client. If still you have no contracts, try to navigate to the blog page and see what other members are saying, maybe something will be useful there."
  },
  {
    id: 24,
    question: "How does Quolance ensure quality and security?",
    answer: "Quolance uses AI-powered models to evaluate freelancer profiles, assess proposal quality, and enforce platform rules. Additionally, our verification system ensures transparency and professionalism."
  },
  {
    id: 25,
    question: "How do you ensure the quality of work?",
    answer: "Quality is maintained through our rating system, skill verification process, and portfolio reviews. Clients can set clear milestones and review work before releasing payment. We also provide collaboration tools for effective communication and project management throughout the engagement."
  },
  {
    id: 26,
    question: "What happens if I'm not satisfied with the work?",
    answer: "If you're not satisfied with the delivered work, you can request revisions based on the original project requirements. If issues persist, you can raise a dispute through our resolution center. Our team will review the case and ensure a fair outcome based on the project terms and delivered work."
  },
  {
    id: 28,
    question: "How do you protect intellectual property rights?",
    answer: "Our terms of service include clear provisions for intellectual property rights. When a project is completed and payment is released, all intellectual property rights are transferred to the client. We also provide NDA templates and confidentiality agreements for sensitive projects."
  },
  {
    id: 29,
    question: "Does Quolance help with setting up a contract?",
    answer: "No, Quolance does not provide legal services or contract templates. It is up to the client and freelancer to agree on the terms of the contract. We are not responsible for any disputes or issues that may arise during the contract period. Our only role is to provide a platform for connecting clients and freelancers."
  },
  {
    id: 30,
    question: "How do I contact support?",
    answer: "For further assistance, visit our support page or email support@quolance.com."
  }
];

const faqGroups = [
  {
    title: "About Quolance",
    faqs: faqs.filter(faq => [1, 2, 3, 4].includes(faq.id))
  },
  {
    title: "Account & Registration",
    faqs: faqs.filter(faq => [5, 6, 7].includes(faq.id))
  },
  {
    title: "Fees & Payments",
    faqs: faqs.filter(faq => [8].includes(faq.id))
  },
  {
    title: "For Clients",
    faqs: faqs.filter(faq => [9, 10, 11, 12, 13, 14, 15, 16, 17].includes(faq.id))
  },
  {
    title: "For Freelancers",
    faqs: faqs.filter(faq => [18, 19, 20, 21, 22].includes(faq.id))
  },
  {
    title: "Quality & Trust",
    faqs: faqs.filter(faq => [ 24, 25, 26, 28, 29].includes(faq.id))
  },
  {
    title: "Support",
    faqs: faqs.filter(faq => [30].includes(faq.id))
  }
];

const FAQPage: React.FC = () => {
  return (
      <div className="bg-gradient-to-b from-white to-blue-50">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-blue-600" />
            <h2
                data-test="faq-title"
                className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
            >
              Frequently Asked Questions
            </h2>
            <p
                data-test="faq-desc"
                className="mt-6 mx-auto max-w-2xl text-lg text-gray-600"
            >
              Find answers to common questions about Quolance. Have a different question?{' '}
              <Link href="/support/contact-us" className="font-medium text-blue-600 hover:text-blue-500 underline">
                Contact our support team
              </Link>{' '}
              and we'll get back to you promptly.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {faqGroups.map((group, index) => (
                <a
                    key={index}
                    href={`#${group.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  {group.title}
                </a>
            ))}
          </div>

          <div className="mt-16">
            {faqGroups.map((group, groupIndex) => (
                <div
                    key={groupIndex}
                    id={group.title.toLowerCase().replace(/\s+/g, '-')}
                    className="mb-16 scroll-mt-24"
                >
                  <h3 className="text-2xl font-semibold text-gray-900 mb-8 border-b border-gray-200 pb-2">
                    {group.title}
                  </h3>
                  <dl className="space-y-6">
                    {group.faqs.map((faq) => (
                        <div
                            key={faq.id}
                            className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 hover:border-blue-200 transition-all duration-200"
                        >
                          <dt>
                            <button
                                data-test={`${faq.question}`}
                                className="flex w-full items-start justify-between text-left"
                                onClick={(e) => {
                                  const answer = e.currentTarget.parentElement?.nextElementSibling;
                                  const icon = e.currentTarget.querySelector('svg');

                                  if (answer && icon) {
                                    const isHidden = answer.classList.contains('hidden');

                                    if (isHidden) {
                                      answer.classList.remove('hidden');
                                      answer.classList.add('block');
                                      icon.classList.add('rotate-180');
                                    } else {
                                      answer.classList.add('hidden');
                                      answer.classList.remove('block');
                                      icon.classList.remove('rotate-180');
                                    }
                                  }
                                }}
                            >
                              <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                              <span className="ml-6 flex h-7 items-center">
                          <svg
                              className="h-6 w-6 text-gray-400 transition-transform duration-200"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                            </button>
                          </dt>
                          <dd
                              data-test={`${faq.answer.split(' ')[0]}`}
                              className="hidden mt-4 text-base text-gray-600 border-t border-gray-100 pt-4"
                          >
                            {faq.answer}
                          </dd>
                        </div>
                    ))}
                  </dl>
                </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block rounded-lg bg-blue-50 p-6 shadow-sm border border-blue-100">
              <h3 className="text-lg font-medium text-gray-900">Still have questions?</h3>
              <p className="mt-2 text-gray-600">
                Our support team is ready to help with any additional questions you may have.
              </p>
              <Link
                  href="/support/contact-us"
                  className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-6 py-2.5 text-white hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
};

export default FAQPage;