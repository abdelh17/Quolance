// components/ui/FAQList.tsx
import React from 'react';
import Accordion from './faqAccordion';

interface CollapsibleItem {
  question: string;
  answer: string | JSX.Element;
}

interface CollapsibleProps {
  items: CollapsibleItem[];
}

const FAQList: React.FC<CollapsibleProps> = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <Accordion key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};

export default FAQList;