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
    <div className="flex justify-center p-8">
      <div className="w-[80%] max-w-3xl">
        <h1 className="heading-2 mb-6 text-center">Frequently Asked Questions</h1>
        
        {/* Collapsible Section */}
          <CollapsibleList items={faqs} />
      </div>
    </div>
  );
};

export default FAQPage;