// pages/about-us.tsx
import React from 'react';
import CollapsibleList from '@/components/ui/CollapsibleList';

const aboutUsData = [
  {
    question: "What is our mission?",
    answer: "At Quolance, our mission is to redefine freelancing by creating a skill-based marketplace where freelancers and clients can connect and collaborate effortlessly. We empower freelancers with real-time insights, help clients find the right talent, and prioritize a seamless, efficient experience for both parties."
  },
  {
    question: "What is the platform?",
    answer: "Quolance leverages advanced technology, including machine learning and AI-driven moderation, to dynamically match freelancers and projects based on skills, past performance, and other key metrics. We aim to provide:\n- Intelligent project matching for freelancers and clients.\n- Profile optimization and career growth tools for freelancers.\n- Built-in tools for communication, project management, and collaboration.\n- Transparent ratings to foster trust and long-term partnerships.\n- Cost-effective, commission-free transactions to support freelancers directly."
  },
  {
    question: "What is our impact and innovation?",
    answer: "Quolance brings innovative solutions to freelancing challenges through experience-based matching, platform-mediated trust guarantees, and comprehensive project lifecycle support. By focusing on both skill development and real-time industry insights, Quolance aims to elevate freelancing to a more fulfilling, career-oriented path for our users."
  },
  {
    question: "Who is behind Quolance?",
    answer: (
      <>
        <p>Quolance was created by a passionate team of developers and freelancers who understand the challenges and opportunities within the freelancing world. Our team is dedicated to building a supportive, innovative platform where both freelancers and clients can thrive.</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Abdelkader Habel</li>
          <li>Adel Bouchatta</li>
          <li>Anes Khadiri</li>
          <li>Chems-Eddine Saidi</li>
          <li>Francesco Ferrato</li>
          <li>Ismail Feham</li>
          <li>Abdelmalek Anes</li>
          <li>Oussama Cherifi</li>
          <li>Sathurthikan Saththyvel</li>
          <li>Zakaria El Manar El Bouanani</li>
        </ul>
      </>
    )
  }
];

const AboutUsPage: React.FC = () => {
  return (
    <div className="flex justify-center p-8 text-gray-800">
      <div className="w-[80%] max-w-3xl">
        <h1 className="heading-2 mb-6 text-center">About Quolance</h1>

        {/* Reusing FAQList component for About Us Sections */}
        <CollapsibleList items={aboutUsData} />
      </div>
    </div>
  );
};

export default AboutUsPage;