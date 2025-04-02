import Link from 'next/link';
import React from 'react';

const TermsOfService: React.FC = () => {
  return (
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-8 sm:py-16 lg:px-8">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl mb-8">
            Terms of Service
          </h2>

          <p className="mb-4 text-gray-700">Effective Date: 01/04/2025<br/>Last Updated: 01/04/2025</p>
          <p className="mb-6 text-gray-700">
            Welcome to Quolance. By accessing or using our platform, you agree to be bound by these Terms of Service.
            Please read them carefully.
          </p>

          <h3 className="text-2xl font-semibold mt-10 mb-4">1. Acceptance of Terms</h3>
          <p className="mb-4 text-gray-700">
            By registering, accessing, or using Quolance, you confirm that you are at least 16 years old and agree to
            comply with these Terms of Service and all applicable laws and regulations.
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

          <h3 className="text-2xl font-semibold mt-10 mb-4">4. Introduction</h3>
          <p className="mb-4 text-gray-700">
            Quolance is a platform that connects clients and freelancers in the tech industry. Clients post projects,
            and freelancers submit proposals. We facilitate connections but do not guarantee project matches or
            outcomes.
          </p>

          <h3 className="text-2xl font-semibold mt-10 mb-4">5. No Contract or Payment Handling</h3>
          <p className="mb-4 text-gray-700">
            Quolance does not draft contracts or handle payments. Clients set budget ranges for projects, but all
            financial agreements are solely between the client and freelancer. We do not enforce payments or budget
            commitments.
          </p>

          <h3 className="text-2xl font-semibold mt-10 mb-4">6. Project Posting Rules</h3>
          <ul className="list-disc list-inside mb-4 text-gray-700">
            <li>Projects must be contract-based work, not job offers.</li>
            <li>Advertisements disguised as projects are prohibited.</li>
            <li>Projects must not contain harmful, illegal, or unethical requirements.</li>
            <li>Our AI reviews project submissions:
              <ul className="list-disc list-inside ml-4">
                <li>Clearly valid projects are automatically approved.</li>
                <li>Uncertain projects require manual admin approval.</li>
                <li>Clearly violating projects are rejected.</li>
              </ul>
            </li>
            <li>Clients can appeal rejected projects by contacting support@quolance.com.</li>
            <li>Some projects may be publicly visible to users outside Quolance. Users should avoid sharing personal or
              sensitive information in project descriptions. Such details should only be shared after selecting a
              freelancer.
            </li>
          </ul>

          <h3 className="text-2xl font-semibold mt-10 mb-4">7. User Responsibilities</h3>
          <ul className="list-disc list-inside mb-4 text-gray-700">
            <li>Users are responsible for their actions on the platform.</li>
            <li>We do not intervene in disputes between users.</li>
            <li>Clients cannot hold us liable for stolen project ideas or poor-quality freelancer work.</li>
            <li>Freelancers cannot hold us liable for non-payment.</li>
            <li>We strongly encourage users to draft contracts before engaging in work.</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-10 mb-4">8. Content Moderation</h3>
          <ul className="list-disc list-inside mb-4 text-gray-700">
            <li>Blog posts and chat messages are not actively monitored.</li>
            <li>Users can report inappropriate content for admin review.</li>
            <li>We do not read user messages unless they are reported via screenshots.</li>
            <li>Blog posts are reviewed only when flagged by users.</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-10 mb-4">9. Account Management</h3>
          <p className="mb-4 text-gray-700">
            Users can delete their accounts at any time. Account deletion is permanent and results in the loss of all
            data, including chats, projects, applications, and blog posts.
          </p>

          <h3 className="text-2xl font-semibold mt-10 mb-4">10. Platform Rules Enforcement</h3>
          <p className="mb-4 text-gray-700">
            We reserve the right to delete projects violating platform rules. We may ban users who repeatedly violate
            rules or endanger the platform’s functionality and community.
          </p>

          <h3 className="text-2xl font-semibold mt-10 mb-4">11. Global Accessibility and Compliance</h3>
          <p className="mb-4 text-gray-700">
            While we target freelancers and clients in Canada, users worldwide can access the platform. Users are
            responsible for complying with their local laws.
          </p>

          <h3 className="text-2xl font-semibold mt-10 mb-4">12. Liability Disclaimer</h3>
          <p className="mb-4 text-gray-700">
            Quolance is not responsible for issues arising outside the platform or due to platform-facilitated
            connections. We disclaim liability for disputes, damages, or legal issues resulting from platform use.
          </p>

          <h3 className="text-2xl font-semibold mt-10 mb-4">13. Changes to Terms of Service</h3>
          <p className="mb-4 text-gray-700">
            We reserve the right to modify these Terms of Service at any time.
          </p>

          <h3 className="text-2xl font-semibold mt-10 mb-4">14. Contact Us</h3>
          <p className="mb-6 text-gray-700">
            If you have any questions or concerns about these Terms of Service, please reach out to us at: <br/>
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