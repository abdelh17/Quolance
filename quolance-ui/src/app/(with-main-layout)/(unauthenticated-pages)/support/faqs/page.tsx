'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { 
  HelpCircle, Search, ChevronDown, ChevronRight, Mail, 
  Building, User, CreditCard, Briefcase, Code, Shield, HelpCircle as SupportIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// FAQ data
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
    icon: "🏢",
    faqs: faqs.filter(faq => [1, 2, 3, 4].includes(faq.id))
  },
  {
    title: "Account & Registration",
    icon: "👤",
    faqs: faqs.filter(faq => [5, 6, 7].includes(faq.id))
  },
  {
    title: "Fees & Payments",
    icon: "💰",
    faqs: faqs.filter(faq => [8].includes(faq.id))
  },
  {
    title: "For Clients",
    icon: "🧑‍💼",
    faqs: faqs.filter(faq => [9, 10, 11, 12, 13, 14, 15, 16, 17].includes(faq.id))
  },
  {
    title: "For Freelancers",
    icon: "💻",
    faqs: faqs.filter(faq => [18, 19, 20, 21, 22].includes(faq.id))
  },
  {
    title: "Quality & Trust",
    icon: "🛡️",
    faqs: faqs.filter(faq => [24, 25, 26, 28, 29].includes(faq.id))
  },
  {
    title: "Support",
    icon: "🙋",
    faqs: faqs.filter(faq => [30].includes(faq.id))
  }
];

const FAQPage: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const faqGroups = [
    {
      title: "About Quolance",
      icon: Building,
      faqs: [
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
          question: "I am not a tech-related freelancer/client, can I still use Quolance?",
          answer: "The platform is primarily focused on tech-related projects. While it's open to everyone, it may be challenging to find the right fit if you're not involved in tech services or seeking tech skills."
        }
      ]
    },
    {
      title: "Account & Registration",
      icon: User,
      faqs: [
        {
          id: 5,
          question: "How do I sign up?",
          answer: "To sign up, simply visit our website and create an account. You can register as a freelancer or a client using an email address or an OAuth2-supported provider like Google."
        },
        {
          id: 6,
          question: "Is Quolance free to use?",
          answer: "Yes! Creating an account and browsing projects is free. Some AI features may require a premium subscription or incur service fees."
        },
        {
          id: 31,
          question: "How do I reset my password?",
          answer: "Go to the login page and click \"Forgot Password?\" Follow the instructions to reset your password via email."
        },
        {
          id: 32,
          question: "How do I delete my account?",
          answer: "To delete your account, go to your profile settings and select the \"Delete Account\" option. Follow the instructions to confirm the deletion."
        }
      ]
    },
    {
      title: "Fees & Payments",
      icon: CreditCard,
      faqs: [
        {
          id: 8,
          question: "What are the fees?",
          answer: "Creating an account and browsing projects is free. Some advanced AI features may have associated costs."
        }
      ]
    },
    {
      title: "For Clients",
      icon: Briefcase,
      faqs: [
        {
          id: 9,
          question: "How do I post a project?",
          answer: "You need a client account to post a project. Once logged in, go to the Post a Project section, fill in required details such as title, description, budget, and deadline, then publish. Your project will be reviewed and approved before going live."
        },
        {
          id: 10,
          question: "How long before my project is approved?",
          answer: "Most projects are approved instantaneously, but it may take up to 24 hours for our team to review and approve your project if it was flagged as sensitive."
        },
        {
          id: 11,
          question: "What kinds of projects can I post?",
          answer: "You can post a wide range of tech-related projects, including web development, mobile app development, data analysis, cybersecurity, and more. Ensure your post is not an ad, a full-time job offer, spam, or inappropriate."
        },
        {
          id: 12,
          question: "How do I select a freelancer?",
          answer: "Review proposals submitted by freelancers, check their profiles, and communicate with them via the platform before making a selection."
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
        }
      ]
    },
    {
      title: "For Freelancers",
      icon: Code,
      faqs: [
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
          answer: "Make sure your profile is complete and showcases your skills effectively. Customize your proposals to each project, highlight relevant experience, and use the chat feature to reach out to clients directly."
        }
      ]
    },
    {
      title: "Quality & Trust",
      icon: Shield,
      faqs: [
        {
          id: 24,
          question: "How do you ensure quality and security?",
          answer: "Quolance uses AI-powered models to evaluate freelancer profiles, assess proposal quality, and enforce platform rules. Our verification system ensures transparency and professionalism."
        },
        {
          id: 25,
          question: "Does Quolance help with setting up a contract?",
          answer: "No, Quolance does not provide legal services or contract templates. It is up to the client and freelancer to agree on contract terms. We are a platform for connecting clients and freelancers."
        }
      ]
    },
    {
      title: "Support",
      icon: SupportIcon,
      faqs: [
        {
          id: 30,
          question: "How do I contact support?",
          answer: "For further assistance, visit our support page or email support@quolance.com."
        }
      ]
    }
  ];
  // Search functionality
  const filteredGroups = faqGroups.map(group => ({
    ...group,
    faqs: group.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.faqs.length > 0);

  // Function to toggle FAQ questions
  const toggleQuestion = (id: number) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  // Function to scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveGroup(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Hero section with search */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
        
        {/* Background blurred shapes */}
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-blue-100 opacity-30 blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 right-10 h-60 w-60 rounded-full bg-indigo-100 opacity-20 blur-3xl pointer-events-none"></div>
        
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </div>
            
            <h1
              data-test="faq-title"
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              Frequently Asked Questions
            </h1>
            
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
          </motion.div>

          {/* Search box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-10 mx-auto max-w-xl"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-6 py-4 rounded-full text-gray-700 border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm"
                placeholder="Search for questions or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-4"
                  onClick={() => setSearchTerm('')}
                >
                  <span className="text-gray-400 hover:text-gray-500 text-sm px-2 py-1 rounded-md bg-gray-100">
                    Clear
                  </span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category tabs */}
      {!searchTerm && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="sticky top-0 z-20 bg-white shadow-sm border-b border-gray-100 py-3"
        >
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between overflow-x-auto pb-1 hide-scrollbar">
              <div className="flex gap-2">
                {faqGroups.map((group, index) => {
                  const GroupIcon = group.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => scrollToSection(group.title.toLowerCase().replace(/\s+/g, '-'))}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                        activeGroup === group.title.toLowerCase().replace(/\s+/g, '-')
                          ? 'bg-blue-100 text-blue-700 shadow-sm'
                          : 'bg-white hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <GroupIcon className="h-4 w-4" /> {group.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* FAQ content */}
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group, groupIndex) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + groupIndex * 0.1 }}
              key={groupIndex}
              id={group.title.toLowerCase().replace(/\s+/g, '-')}
              className="mb-16 scroll-mt-24"
            >
              <div className="flex items-center gap-2 mb-8 pb-2 border-b border-gray-200">
                {React.createElement(group.icon, { className: "text-blue-600 h-6 w-6" })}
                <h2 className="text-2xl font-bold text-gray-900">
                  {group.title}
                </h2>
              </div>
              
              <div className="space-y-4">
                {group.faqs.map((faq) => (
                  <motion.div
                    key={faq.id}
                    initial={false}
                    animate={{ 
                      backgroundColor: activeQuestion === faq.id ? 'rgba(239, 246, 255, 0.6)' : 'white',
                      borderColor: activeQuestion === faq.id ? 'rgba(96, 165, 250, 0.5)' : 'rgba(229, 231, 235, 1)'
                    }}
                    className="rounded-xl bg-white p-6 shadow-sm border border-gray-200 overflow-hidden transition-all duration-200"
                  >
                    <button
                      data-test={`${faq.question}`}
                      className="flex w-full items-center justify-between text-left"
                      onClick={() => toggleQuestion(faq.id)}
                    >
                      <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                      <div className="ml-4 flex-shrink-0">
                        {activeQuestion === faq.id ? (
                          <ChevronDown className="h-5 w-5 text-blue-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {activeQuestion === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div
                            data-test={`${faq.answer.split(' ')[0]}`}
                            className="mt-4 text-base text-gray-600 border-t border-gray-100 pt-4"
                          >
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We couldn't find any FAQ that matches your search. Try using different keywords or browse the categories.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Contact support section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-5xl px-6 pb-20"
      >
        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 p-8 shadow-lg text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="md:max-w-lg">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="h-6 w-6 text-blue-200" />
                <h3 className="text-2xl font-bold">Still have questions?</h3>
              </div>
              <p className="text-blue-100 text-lg">
                Our support team is ready to help with any additional questions you may have.
              </p>
            </div>
            <Link
              href="/support/contact-us"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-blue-600 hover:text-blue-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 min-w-[160px] text-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FAQPage;