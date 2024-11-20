// components/ui/Accordion.tsx
"use client";

import React, { useState } from 'react';

interface AccordionProps {
  question: string;
  answer: string | JSX.Element;
}

const FAQAccordion: React.FC<AccordionProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full text-left py-4 flex justify-between items-center focus:outline-none"
        onClick={toggleAccordion}
      >
        <span className="text-lg font-medium text-gray-100">{question}</span>
        <svg
          className={`w-6 h-6 transition-transform text-gray-400 duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-4">
          <p className="text-gray-400">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQAccordion;