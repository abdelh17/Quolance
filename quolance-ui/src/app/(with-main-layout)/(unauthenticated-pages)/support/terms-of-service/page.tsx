import Link from 'next/link';
import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-8 sm:py-16 lg:px-8">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl mb-8">
          Terms of Service
        </h2>

        <p className="mb-4 text-gray-700">Effective Date: 01/01/2025<br />Last Updated: 3/23/2025</p>

        <p className="mb-6 text-gray-700">
          Welcome to <strong>Quolance</strong>. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4">1. Acceptance of Terms</h3>
        <p className="mb-4 text-gray-700">
          By registering, accessing, or using Quolance, you confirm that you are at least 16 years old and agree to comply with these Terms of Service and all applicable laws and regulations.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4">2. Account Responsibilities</h3>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>Keep your login credentials secure and confidential.</li>
          <li>You are responsible for all activities under your account.</li>
          <li>Notify us immediately of unauthorized use.</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-10 mb-4">3. Platform Usage</h3>
        <p className="mb-4 text-gray-700">
          You agree to use Quolance only for lawful purposes. You may not:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>Violate any laws or regulations.</li>
          <li>Post false, misleading, or harmful content.</li>
          <li>Use the platform to distribute spam or malware.</li>
          <li>Attempt to access data you are not authorized to view.</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-10 mb-4">4. Payments & Fees</h3>
        <p className="mb-4 text-gray-700">
          Payment processing is handled by third-party services. By using Quolance, you agree to their terms. Freelancers will receive payments minus any platform or processing fees. Clients agree to pay project costs on time.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4">5. Dispute Resolution</h3>
        <p className="mb-4 text-gray-700">
          In case of a dispute between users (freelancer and client), Quolance may intervene to mediate. However, we are not legally obligated to resolve disputes and will act in good faith to find a fair solution.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4">6. Intellectual Property</h3>
        <p className="mb-4 text-gray-700">
          All content on Quolance, including the platform’s code, design, and branding, is owned by Quolance or its licensors. Users retain ownership of content they upload but grant Quolance a license to display and use it to operate the platform.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4">7. Termination</h3>
        <p className="mb-4 text-gray-700">
          We reserve the right to suspend or terminate any account that violates these Terms or poses a security risk. You may also delete your account at any time.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4">8. Disclaimer of Warranties</h3>
        <p className="mb-4 text-gray-700">
          Quolance is provided “as is” and “as available.” We make no warranties regarding the accuracy, reliability, or availability of the platform.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4">9. Limitation of Liability</h3>
        <p className="mb-4 text-gray-700">
          Quolance shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4">10. Changes to These Terms</h3>
        <p className="mb-4 text-gray-700">
          We may update these Terms from time to time. Continued use of Quolance after changes means you accept the revised Terms.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4">11. Contact Us</h3>
        <p className="mb-6 text-gray-700">
          If you have any questions or concerns about these Terms of Service, please reach out to us at: <br />
          📧 <strong>contact@quolance.com</strong>
        </p>

        <p className="text-gray-600">
          Also see our{' '}
          <Link href="/support/privacy-policy" className="font-semibold text-b300 hover:text-b400">
            Privacy Policy
          </Link>{' '}
          for how we collect and handle your data.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
