import Link from 'next/link';
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-8 sm:py-16 lg:px-8">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl mb-8">
          Privacy Policy
        </h2>

        <p className="mb-4 text-gray-700">Effective Date: 01/04/2025<br />Last Updated: 01/04/2025</p>

        <p className="mb-6 text-gray-700">
          Welcome to <strong>Quolance</strong>! Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4">1. Information We Collect</h3>
        <p className="mb-2 text-gray-700"><strong>a. User-Provided Information</strong></p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>Registration Data: name, email, password, role (client or freelancer)</li>
          <li>Profile Details: bio, skills, links, photo</li>
          <li>Payment Info: billing and payout details (via third-party providers)</li>
          <li>Communication: messages and files shared between users</li>
        </ul>

        <p className="mb-2 text-gray-700"><strong>b. Automatically Collected Data</strong></p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>IP address, device/browser type, OS</li>
          <li>Usage data like pages visited, actions taken</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-10 mb-4">2. How We Use Your Information</h3>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>Create and manage accounts</li>
          <li>Enable freelancer-client communication</li>
          <li>Process secure payments</li>
          <li>Personalize experiences</li>
          <li>Improve platform performance and security</li>
          <li>Prevent fraud, enforce Terms of Service</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-10 mb-4">3. Sharing of Your Information</h3>
        <p className="mb-4 text-gray-700">We do <strong>not</strong> sell your personal information. We may share data with:</p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>Service providers (e.g. payment, analytics, hosting)</li>
          <li>Authorities if legally required</li>
          <li>Others with your explicit consent</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-10 mb-4">4. Data Security</h3>
        <p className="mb-4 text-gray-700">We use encryption, firewalls, and access control to protect your data. No method is 100% secure, but we do our best to keep it safe.</p>

        <h3 className="text-2xl font-semibold mt-10 mb-4">5. Your Rights</h3>
        <p className="mb-4 text-gray-700">Depending on your region, you may request to access, update, or delete your data. Contact us at <strong>contact@quolance.com</strong> for any requests.</p>

        <h3 className="text-2xl font-semibold mt-10 mb-4">6. Cookies & Tracking Technologies</h3>
        <p className="mb-4 text-gray-700">We use cookies to maintain sessions, analyze usage, and personalize content. You may disable cookies in your browser settings.</p>

        <h3 className="text-2xl font-semibold mt-10 mb-4">7. Children’s Privacy</h3>
        <p className="mb-4 text-gray-700">Quolance is not intended for individuals under 16. We do not knowingly collect data from minors.</p>

        <h3 className="text-2xl font-semibold mt-10 mb-4">8. Changes to This Policy</h3>
        <p className="mb-4 text-gray-700">We may update this Privacy Policy periodically. You will be notified of major changes via email or platform notifications.</p>

        <h3 className="text-2xl font-semibold mt-10 mb-4">9. Contact Us</h3>
        <p className="mb-6 text-gray-700">
          If you have questions about this Privacy Policy, please contact us at: <br />
          📧 <strong>contact@quolance.com</strong>
        </p>

        <p className="text-gray-600">
          Also see our{' '}
          <Link href="/support/terms-of-service" className="font-semibold text-b300 hover:text-b400">
            Terms of Service
          </Link>{' '}
          for platform rules and user responsibilities.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
