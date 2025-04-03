'use client';

import Link from 'next/link';
import React from 'react';
import { Shield, Mail, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const TermsOfService: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-white via-blue-50/30 to-white min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-8 sm:py-16 lg:px-8 relative">
        {/* Background grid and blurred shapes */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-blue-100 opacity-30 blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 right-10 h-60 w-60 rounded-full bg-indigo-100 opacity-20 blur-3xl pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          {/* Header with icon */}
          <div className="flex items-center mb-8 gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Terms of Service
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <p className="mb-4 text-gray-700 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <span>
                <strong>Effective Date:</strong> 01/04/2025 |{' '}
                <strong>Last Updated:</strong> 01/04/2025
              </span>
            </p>
            <p className="mb-6 text-gray-700 italic">
              Welcome to Quolance. By accessing or using our platform, you agree to be bound by these Terms of Service.
              Please read them carefully.
            </p>
          </div>

          {/* Sections with consistent styling */}
          {[
            {
              title: "1. Acceptance of Terms",
              content: (
                <>
                  <p className="mb-4 text-gray-700">
                    By registering, accessing, or using Quolance, you confirm that you are at least 16 years old and agree to
                    comply with these Terms of Service and all applicable laws and regulations.
                  </p>
                </>
              )
            },
            {
              title: "2. Account Responsibilities",
              content: (
                <>
                  <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2">
                    <li>Keep your login credentials secure and confidential.</li>
                    <li>You are responsible for all activities under your account.</li>
                    <li>Notify us immediately of unauthorized use.</li>
                  </ul>
                </>
              )
            },
            {
              title: "3. Platform Usage",
              content: (
                <>
                  <p className="mb-4 text-gray-700">
                    You agree to use Quolance only for lawful purposes. You may not:
                  </p>
                  <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2">
                    <li>Violate any laws or regulations.</li>
                    <li>Post false, misleading, or harmful content.</li>
                    <li>Use the platform to distribute spam or malware.</li>
                    <li>Attempt to access data you are not authorized to view.</li>
                  </ul>
                </>
              )
            },
            {
              title: "4. Introduction",
              content: (
                <p className="mb-4 text-gray-700">
                  Quolance is a platform that connects clients and freelancers in the tech industry. Clients post projects,
                  and freelancers submit proposals. We facilitate connections but do not guarantee project matches or
                  outcomes.
                </p>
              )
            },
            {
              title: "5. No Contract or Payment Handling",
              content: (
                <p className="mb-4 text-gray-700">
                  Quolance does not draft contracts or handle payments. Clients set budget ranges for projects, but all
                  financial agreements are solely between the client and freelancer. We do not enforce payments or budget
                  commitments.
                </p>
              )
            },
            {
              title: "6. Project Posting Rules",
              content: (
                <>
                  <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2">
                    <li>Projects must be contract-based work, not job offers.</li>
                    <li>Advertisements disguised as projects are prohibited.</li>
                    <li>Projects must not contain harmful, illegal, or unethical requirements.</li>
                    <li>Our AI reviews project submissions:
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
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
                </>
              )
            },
            {
              title: "7. User Responsibilities",
              content: (
                <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2">
                  <li>Users are responsible for their actions on the platform.</li>
                  <li>We do not intervene in disputes between users.</li>
                  <li>Clients cannot hold us liable for stolen project ideas or poor-quality freelancer work.</li>
                  <li>Freelancers cannot hold us liable for non-payment.</li>
                  <li>We strongly encourage users to draft contracts before engaging in work.</li>
                </ul>
              )
            },
            {
              title: "8. Content Moderation",
              content: (
                <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2">
                  <li>Blog posts and chat messages are not actively monitored.</li>
                  <li>Users can report inappropriate content for admin review.</li>
                  <li>We do not read user messages unless they are reported via screenshots.</li>
                  <li>Blog posts are reviewed only when flagged by users.</li>
                </ul>
              )
            },
            {
              title: "9. Account Management",
              content: (
                <p className="mb-4 text-gray-700">
                  Users can delete their accounts at any time. Account deletion is permanent and results in the loss of all
                  data, including chats, projects, applications, and blog posts.
                </p>
              )
            },
            {
              title: "10. Platform Rules Enforcement",
              content: (
                <p className="mb-4 text-gray-700">
                  We reserve the right to delete projects violating platform rules. We may ban users who repeatedly violate
                  rules or endanger the platform's functionality and community.
                </p>
              )
            },
            {
              title: "11. Global Accessibility and Compliance",
              content: (
                <p className="mb-4 text-gray-700">
                  While we target freelancers and clients in Canada, users worldwide can access the platform. Users are
                  responsible for complying with their local laws.
                </p>
              )
            },
            {
              title: "12. Liability Disclaimer",
              content: (
                <p className="mb-4 text-gray-700">
                  Quolance is not responsible for issues arising outside the platform or due to platform-facilitated
                  connections. We disclaim liability for disputes, damages, or legal issues resulting from platform use.
                </p>
              )
            },
            {
              title: "13. Changes to Terms of Service",
              content: (
                <p className="mb-4 text-gray-700">
                  We reserve the right to modify these Terms of Service at any time.
                </p>
              )
            }
          ].map((section, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 hover:shadow-md transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 border-b pb-2 border-gray-200">
                {section.title}
              </h3>
              {section.content}
            </div>
          ))}

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white mt-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="h-6 w-6 text-blue-200" />
                <h3 className="text-2xl font-bold">Contact Us</h3>
              </div>
              <p className="mb-4 text-blue-100">
                If you have any questions or concerns about these Terms of Service, please reach out to us at:
              </p>
              <div className="flex items-center gap-2">
                <strong>📧 contact@quolance.com</strong>
              </div>

              <p className="mt-4 text-blue-100">
                Also see our{' '}
                <Link 
                  href="/support/privacy-policy" 
                  className="font-semibold text-white hover:underline"
                >
                  Privacy Policy
                </Link>{' '}
                for how we collect and handle your data.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;