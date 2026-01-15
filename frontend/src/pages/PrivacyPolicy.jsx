import React from "react";
import appConfig from "../config/appConfig";

const PrivacyPolicy = () => {
  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-gold-gradient text-4xl font-bold mb-4 md:text-5xl">
          Privacy Policy
        </h1>
        <p className="text-golden-300 whitestone:text-gray-600 text-sm mb-8">
          Last Updated: January 15, 2026
        </p>

        <div className="space-y-8 text-warm-white whitestone:text-gray-800">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="leading-relaxed mb-4">
              Welcome to {appConfig.appName}. We are committed to protecting
              your personal information and your right to privacy. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you use our online auction platform.
            </p>
            <p className="leading-relaxed">
              By using {appConfig.appName}, you agree to the collection and use
              of information in accordance with this policy. If you do not agree
              with our policies and practices, please do not use our platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              2.1 Personal Information
            </h3>
            <p className="leading-relaxed mb-4">
              We collect personal information that you voluntarily provide to us
              when you:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                Register for an account (username, email address, phone number)
              </li>
              <li>
                Create auction listings (item details, images, descriptions)
              </li>
              <li>Place bids on auction items</li>
              <li>
                Make payments (payment information processed through SSLCommerz)
              </li>
              <li>Submit commission proofs or dispute claims</li>
              <li>Contact our support team</li>
              <li>Subscribe to premium membership</li>
            </ul>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              2.2 Transaction Information
            </h3>
            <p className="leading-relaxed mb-4">
              We collect and store information about your transactions,
              including:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Auction participation history (bids placed, items won)</li>
              <li>Payment records and transaction amounts</li>
              <li>Trust score and badge tier calculations</li>
              <li>Total transaction volume</li>
              <li>Delivery confirmations and shipment tracking</li>
              <li>Feedback and ratings provided to other users</li>
            </ul>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              2.3 Automatically Collected Information
            </h3>
            <p className="leading-relaxed mb-4">
              When you access our platform, we automatically collect certain
              information:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                Device information (IP address, browser type, operating system)
              </li>
              <li>Log data (access times, pages viewed, actions taken)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                <strong>Platform Operation:</strong> To provide, maintain, and
                improve our auction services
              </li>
              <li>
                <strong>Transaction Processing:</strong> To facilitate auction
                bidding, payment processing, and escrow services
              </li>
              <li>
                <strong>Trust System:</strong> To calculate trust scores, badge
                tiers, and star ratings based on your transaction history
              </li>
              <li>
                <strong>Communication:</strong> To send you notifications about
                auction status, bids, payments, and platform updates
              </li>
              <li>
                <strong>Dispute Resolution:</strong> To investigate and resolve
                disputes between buyers and sellers
              </li>
              <li>
                <strong>Security:</strong> To detect, prevent, and address
                fraud, technical issues, and violations of our Terms of Service
              </li>
              <li>
                <strong>Analytics:</strong> To understand how users interact
                with our platform and improve user experience
              </li>
              <li>
                <strong>Legal Compliance:</strong> To comply with applicable
                laws and regulations
              </li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              4. Information Sharing and Disclosure
            </h2>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              4.1 Public Information
            </h3>
            <p className="leading-relaxed mb-4">
              The following information is visible to other users:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Username and profile image</li>
              <li>Badge tier and verified status</li>
              <li>Trust score and star rating</li>
              <li>Premium membership status</li>
              <li>Auction listings you create</li>
              <li>
                Feedback received (for premium users, recent feedbacks are
                visible)
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              4.2 Service Providers
            </h3>
            <p className="leading-relaxed mb-4">
              We share information with third-party service providers:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                <strong>SSLCommerz:</strong> Payment processing and transaction
                verification
              </li>
              <li>
                <strong>Cloudinary:</strong> Image hosting and content delivery
              </li>
              <li>
                <strong>Email Service Providers:</strong> Sending transactional
                emails and notifications
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              4.3 Legal Requirements
            </h3>
            <p className="leading-relaxed mb-4">
              We may disclose your information if required by law or in response
              to valid requests by public authorities (e.g., court orders,
              subpoenas, law enforcement).
            </p>
          </section>

          {/* Payment Information */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              5. Payment Information Security
            </h2>
            <p className="leading-relaxed mb-4">
              All payment transactions are processed through SSLCommerz, a
              PCI-DSS compliant payment gateway. We do not store your complete
              credit card or banking information on our servers. Payment data is
              encrypted and securely transmitted to SSLCommerz for processing.
            </p>
            <p className="leading-relaxed">
              We utilize an escrow system where auction payments are held
              securely until delivery is confirmed, protecting both buyers and
              sellers.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              6. Data Retention
            </h2>
            <p className="leading-relaxed mb-4">
              We retain your personal information for as long as necessary to:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Provide our services and maintain your account</li>
              <li>
                Comply with legal obligations (tax records, transaction history)
              </li>
              <li>Resolve disputes and enforce our agreements</li>
              <li>
                Maintain trust scores and transaction history for platform
                integrity
              </li>
            </ul>
            <p className="leading-relaxed">
              You may request deletion of your account and personal data by
              contacting us at support@nilamee.com. Some information may be
              retained as required by law or legitimate business interests.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              7. Your Privacy Rights
            </h2>
            <p className="leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                <strong>Access:</strong> Request a copy of the personal
                information we hold about you
              </li>
              <li>
                <strong>Correction:</strong> Update or correct inaccurate
                information through your profile settings
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your account and
                personal data
              </li>
              <li>
                <strong>Opt-Out:</strong> Unsubscribe from marketing
                communications (transactional emails are required for platform
                operation)
              </li>
              <li>
                <strong>Data Portability:</strong> Request a copy of your data
                in a structured, machine-readable format
              </li>
            </ul>
            <p className="leading-relaxed">
              To exercise these rights, please contact us at
              support@nilamee.com.
            </p>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              8. Security Measures
            </h2>
            <p className="leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to
              protect your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Encryption of data in transit (HTTPS/SSL)</li>
              <li>Secure password hashing (bcrypt)</li>
              <li>JWT-based authentication</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and user authentication</li>
              <li>Escrow system for payment protection</li>
            </ul>
            <p className="leading-relaxed">
              However, no method of transmission over the internet is 100%
              secure. While we strive to protect your information, we cannot
              guarantee absolute security.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              9. Children's Privacy
            </h2>
            <p className="leading-relaxed">
              Our platform is not intended for users under the age of 18. We do
              not knowingly collect personal information from children. If you
              are a parent or guardian and believe your child has provided us
              with personal information, please contact us immediately.
            </p>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              10. International Users
            </h2>
            <p className="leading-relaxed">
              {appConfig.appName} is based in Bangladesh. If you access our
              platform from outside Bangladesh, please be aware that your
              information may be transferred to, stored, and processed in
              Bangladesh where our servers are located. By using our platform,
              you consent to such transfer.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              11. Changes to This Privacy Policy
            </h2>
            <p className="leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Posting the new Privacy Policy on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending an email notification for significant changes</li>
            </ul>
            <p className="leading-relaxed">
              Your continued use of the platform after changes are posted
              constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 whitestone:bg-blue-50 p-6 rounded-lg border-2 border-golden-400/30 whitestone:border-blue-200">
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              12. Contact Us
            </h2>
            <p className="leading-relaxed mb-4">
              If you have questions, concerns, or requests regarding this
              Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2">
              <p className="leading-relaxed">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:support@nilamee.com"
                  className="text-golden-400 whitestone:text-blue-600 hover:underline"
                >
                  support@nilamee.com
                </a>
              </p>
              <p className="leading-relaxed">
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:+8801234567890"
                  className="text-golden-400 whitestone:text-blue-600 hover:underline"
                >
                  +880 1234-567890
                </a>
              </p>
              <p className="leading-relaxed">
                <strong>Business Hours:</strong> 9:00 AM - 6:00 PM (Bangladesh
                Standard Time)
              </p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
