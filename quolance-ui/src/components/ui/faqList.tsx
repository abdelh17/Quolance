// components/ui/FAQList.tsx
import React from 'react';
import Accordion from './faqAccordion';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQListProps {
  faqs: FAQItem[];
}

const FAQList: React.FC<FAQListProps> = ({ faqs }) => {
  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <Accordion key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

export default FAQList;