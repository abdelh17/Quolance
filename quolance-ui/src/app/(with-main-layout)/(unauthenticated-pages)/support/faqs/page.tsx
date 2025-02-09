import React from 'react';

const faqs = [
  {
    id: 2,
    question: "What are the fees for using the platform?",
    answer:
      "We maintain a transparent fee structure. Clients can post projects for free. Freelancers pay zero commission on their earnings. We only charge a small processing fee for payments to cover transaction costs. Premium features like priority project listing or advanced search filters are available through our optional subscription plans.",
  },
  {
    id: 3,
    question: "How do you verify freelancers and clients?",
    answer:
      "We have a comprehensive verification process that includes identity verification, skill assessment, and portfolio review for freelancers. Clients undergo business verification and payment method validation. We also maintain a review system where both parties can rate their experience after project completion.",
  },
  {
    id: 4,
    question: "What happens if there's a dispute between a client and freelancer?",
    answer:
      "Our dedicated dispute resolution team handles any conflicts that may arise. Both parties can submit their case with supporting documentation, and our team will mediate to reach a fair resolution. The escrow system helps protect both parties during this process.",
  },
  {
    id: 5,
    question: "Can I hire freelancers for long-term projects?",
    answer:
      "Yes, you can hire freelancers for both short-term and long-term projects. We offer different contract types including fixed-price projects, hourly rates, and retainer agreements. You can also convert successful project-based relationships into ongoing collaborations.",
  },
  {
    id: 6,
    question: "How do I know if a freelancer is right for my project?",
    answer:
      "You can review freelancers' profiles, which include their portfolio, skills, experience, and client reviews. We also provide skill verification badges and success scores. Additionally, you can conduct interviews and request small paid test projects before committing to larger projects.",
  },
  {
    id: 7,
    question: "What types of projects can I post or find on the platform?",
    answer:
      "Our platform supports a wide range of digital and creative services including web development, design, writing, marketing, and consulting. You can post or find projects in categories such as software development, graphic design, content creation, digital marketing, business consulting, and more.",
  },
  {
    id: 8,
    question: "How do you ensure the quality of work?",
    answer:
      "Quality is maintained through our rating system, skill verification process, and portfolio reviews. Clients can set clear milestones and review work before releasing payment. We also provide collaboration tools for effective communication and project management throughout the engagement.",
  },
  {
    id: 9,
    question: "What happens if I'm not satisfied with the work?",
    answer:
      "If you're not satisfied with the delivered work, you can request revisions based on the original project requirements. If issues persist, you can raise a dispute through our resolution center. Our team will review the case and ensure a fair outcome based on the project terms and delivered work.",
  },
  {
    id: 10,
    question: "How do you protect intellectual property rights?",
    answer:
      "Our terms of service include clear provisions for intellectual property rights. When a project is completed and payment is released, all intellectual property rights are transferred to the client. We also provide NDA templates and confidentiality agreements for sensitive projects.",
  }
];

const FAQPage: React.FC = () => {
  return (
    <div className="bg-white">
    <div className="mx-auto max-w-7xl px-6 py-8 sm:py-16 lg:px-8">
      <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Frequently asked questions</h2>
      <p className="mt-6 max-w-2xl text-base/7 text-gray-600">
        Have a different question and can’t find the answer you’re looking for? Reach out to our support team by{' '}
        <a href="#" className="font-semibold text-b300 hover:text-b400">
          sending us an email
        </a>{' '}
        and we’ll get back to you as soon as we can.
      </p>
      <div className="mt-20">
        <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:gap-x-10">
          {faqs.map((faq) => (
            <div key={faq.id}>
              <dt className="text-base/7 font-semibold text-gray-900">{faq.question}</dt>
              <dd className="mt-2 text-base/7 text-gray-600">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  </div>
  );
};

export default FAQPage;