// pages/faq/index.tsx
import React from 'react';
import FAQList from '@/components/ui/CollapsibleList';
import CollapsibleList from '@/components/ui/CollapsibleList';

const faqs = [
  {
    question: "How do I create an account?",
    answer: "To create an account, click on the 'Sign Up' button at the top right corner and fill in your details.",
  },
  {
    question: "How can I reset my password?",
    answer: "If you've forgotten your password, click on 'Forgot Password' on the login page and follow the instructions.",
  },
  {
    question: "Where can I find my purchase history?",
    answer: "Your purchase history is available under the 'My Account' section in the dashboard.",
  },
  {
    question: "How do I contact support?",
    answer: "You can contact support by clicking the 'Contact Us' link in the footer or by emailing support@example.com.",
  },
  // Add more FAQs as needed
];

const FAQPage: React.FC = () => {
  return (
    <div className='min-h-[calc(100vh-10rem)] bg-gray-800 dark:bg-gray-950 '>
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto ">
        {/* Grid */}
        <div className="grid md:grid-cols-5 gap-10">
          {/* Title Section */}
          <div className="md:col-span-2">
            <div className="max-w-xs">
              <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">
                Frequently<br />asked questions
              </h2>
              <p className="mt-1 hidden md:block text-gray-400 dark:text-neutral-400">
                Answers to the most frequently asked questions.
              </p>
            </div>
          </div>
          {/* FAQ Section */}
          <div className="md:col-span-3">
            {/* Collapsible Section */}
            <div className="divide-y divide-gray-200 dark:divide-neutral-700">
              <CollapsibleList items={faqs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;