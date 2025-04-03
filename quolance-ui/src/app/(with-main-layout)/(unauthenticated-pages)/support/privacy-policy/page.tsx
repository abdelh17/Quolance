'use client';

import Link from 'next/link';
import React from 'react';
import { Shield, Mail, FileText, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
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
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Privacy Policy
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
              Welcome to <strong>Quolance</strong>! Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </div>

          {[
            {
              title: "1. Information We Collect",
              content: (
                <>
                  <p className="mb-2 text-gray-700"><strong>a. User-Provided Information</strong></p>
                  <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2">
                    <li>Registration Data: name, email, password, role (client or freelancer)</li>
                    <li>Profile Details: bio, skills, links, photo</li>
                    <li>Payment Info: billing and payout details (via third-party providers)</li>
                    <li>Communication: messages and files shared between users</li>
                  </ul>

                  <p className="mb-2 text-gray-700"><strong>b. Automatically Collected Data</strong></p>
                  <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2">
                    <li>IP address, device/browser type, OS</li>
                    <li>Usage data like pages visited, actions taken</li>
                  </ul>
                </>
              )
            },
            {
              title: "2. How We Use Your Information",
              content: (
                <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2">
                  <li>Create and manage accounts</li>
                  <li>Enable freelancer-client communication</li>
                  <li>Process secure payments</li>
                  <li>Personalize experiences</li>
                  <li>Improve platform performance and security</li>
                  <li>Prevent fraud, enforce Terms of Service</li>
                </ul>
              )
            },
            {
              title: "3. Sharing of Your Information",
              content: (
                <>
                  <p className="mb-4 text-gray-700">We do <strong>not</strong> sell your personal information. We may share data with:</p>
                  <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2">
                    <li>Service providers (e.g. payment, analytics, hosting)</li>
                    <li>Authorities if legally required</li>
                    <li>Others with your explicit consent</li>
                  </ul>
                </>
              )
            },
            {
              title: "4. Data Security",
              content: (
                <p className="mb-4 text-gray-700">
                  We use encryption, firewalls, and access control to protect your data. No method is 100% secure, but we do our best to keep it safe.
                </p>
              )
            },
            {
              title: "5. Your Rights",
              content: (
                <p className="mb-4 text-gray-700">
                  Depending on your region, you may request to access, update, or delete your data. Contact us at <strong>contact@quolance.com</strong> for any requests.
                </p>
              )
            },
            {
              title: "6. Cookies & Tracking Technologies",
              content: (
                <p className="mb-4 text-gray-700">
                  We use cookies to maintain sessions, analyze usage, and personalize content. You may disable cookies in your browser settings.
                </p>
              )
            },
            {
              title: "7. Children's Privacy",
              content: (
                <p className="mb-4 text-gray-700">
                  Quolance is not intended for individuals under 16. We do not knowingly collect data from minors.
                </p>
              )
            },
            {
              title: "8. Changes to This Policy",
              content: (
                <p className="mb-4 text-gray-700">
                  We may update this Privacy Policy periodically. You will be notified of major changes via email or platform notifications.
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
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <div className="flex items-center gap-2">
                <strong>📧 contact@quolance.com</strong>
              </div>

              <p className="mt-4 text-blue-100">
                Also see our{' '}
                <Link 
                  href="/support/terms-of-service" 
                  className="font-semibold text-white hover:underline"
                >
                  Terms of Service
                </Link>{' '}
                for platform rules and user responsibilities.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;