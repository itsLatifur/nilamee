import React from "react";
import appConfig from "../config/appConfig";

const TermsOfService = () => {
  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-gold-gradient text-4xl font-bold mb-4 md:text-5xl">
          Terms of Service
        </h1>
        <p className="text-golden-300 whitestone:text-gray-600 text-sm mb-8">
          Last Updated: January 15, 2026
        </p>

        <div className="space-y-8 text-warm-white whitestone:text-gray-800">
          {/* Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed mb-4">
              Welcome to {appConfig.appName}. By accessing or using our online
              auction platform, you agree to be bound by these Terms of Service
              ("Terms"). If you do not agree to these Terms, you may not use our
              platform.
            </p>
            <p className="leading-relaxed">
              These Terms constitute a legally binding agreement between you and{" "}
              {appConfig.appName}. We reserve the right to modify these Terms at
              any time, and such modifications will be effective upon posting.
            </p>
          </section>

          {/* User Eligibility */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              2. User Eligibility
            </h2>
            <p className="leading-relaxed mb-4">
              To use {appConfig.appName}, you must:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>
                Not be prohibited from using the platform under the laws of
                Bangladesh or your jurisdiction
              </li>
              <li>
                Provide accurate, current, and complete information during
                registration
              </li>
              <li>Maintain the security of your account credentials</li>
            </ul>
            <p className="leading-relaxed">
              You are responsible for all activities that occur under your
              account. Notify us immediately of any unauthorized use of your
              account.
            </p>
          </section>

          {/* Account Types and Roles */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              3. Account Types and Roles
            </h2>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              3.1 User Roles
            </h3>
            <p className="leading-relaxed mb-4">Users can register as:</p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                <strong>Auctioneer:</strong> Can create auction listings, submit
                commission proofs, and sell items
              </li>
              <li>
                <strong>Bidder:</strong> Can place bids on auction items and
                purchase winning items
              </li>
            </ul>
            <p className="leading-relaxed mb-4">
              Users may switch roles through their account settings, subject to
              compliance with all applicable requirements for each role.
            </p>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              3.2 Premium Membership
            </h3>
            <p className="leading-relaxed mb-4">
              Premium membership is available for 1,000 BDT per month and
              provides:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Enhanced profile visibility on auction detail pages</li>
              <li>Access to view feedback from other users</li>
              <li>Premium badge displayed on profile</li>
            </ul>
            <p className="leading-relaxed">
              Premium subscriptions are non-refundable and renew automatically
              unless cancelled.
            </p>
          </section>

          {/* Auction Rules */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              4. Auction Rules and Procedures
            </h2>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              4.1 Creating Auctions (Auctioneers)
            </h3>
            <p className="leading-relaxed mb-4">Auctioneers must:</p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Provide accurate descriptions and images of items</li>
              <li>Set reasonable starting bids and auction durations</li>
              <li>Pay a commission fee of 2% of the final sale price</li>
              <li>
                Submit commission payment proof within 24 hours of auction end
              </li>
              <li>
                Ship items within the specified timeframe after payment
                confirmation
              </li>
              <li>Not cancel auctions after bids have been placed</li>
            </ul>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              4.2 Bidding on Auctions (Bidders)
            </h3>
            <p className="leading-relaxed mb-4">Bidders must:</p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                Place bids in good faith with intention to purchase if winning
              </li>
              <li>Complete payment within 24 hours of winning an auction</li>
              <li>Confirm delivery receipt upon receiving items</li>
              <li>Not engage in bid manipulation or collusion</li>
            </ul>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              4.3 Auction Lifecycle
            </h3>
            <p className="leading-relaxed mb-4">
              Each auction follows this lifecycle:
            </p>
            <ol className="list-decimal list-inside space-y-2 mb-4 ml-4">
              <li>
                <strong>Pending:</strong> Auction awaits admin approval
              </li>
              <li>
                <strong>Active:</strong> Auction is live and accepting bids
              </li>
              <li>
                <strong>Ended:</strong> Auction time has expired, highest bidder
                wins
              </li>
              <li>
                <strong>Payment Pending:</strong> Winner must complete payment
              </li>
              <li>
                <strong>In Escrow:</strong> Payment held securely until delivery
              </li>
              <li>
                <strong>Shipped:</strong> Auctioneer has dispatched the item
              </li>
              <li>
                <strong>Completed:</strong> Buyer confirms delivery, funds
                released to seller
              </li>
            </ol>
          </section>

          {/* Payment and Escrow */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              5. Payment and Escrow System
            </h2>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              5.1 Payment Processing
            </h3>
            <p className="leading-relaxed mb-4">
              All payments are processed through SSLCommerz, a secure payment
              gateway. We accept:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Credit/Debit cards</li>
              <li>Mobile banking (bKash, Nagad, Rocket)</li>
              <li>Internet banking</li>
            </ul>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              5.2 Escrow Protection
            </h3>
            <p className="leading-relaxed mb-4">
              To protect both buyers and sellers, we use an escrow system:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Winning bidder's payment is held in escrow</li>
              <li>
                Funds are released to the auctioneer only after buyer confirms
                delivery
              </li>
              <li>
                If delivery is not confirmed within a reasonable timeframe, a
                dispute may be initiated
              </li>
              <li>Escrow provides protection against fraud and non-delivery</li>
            </ul>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              5.3 Commission Fees
            </h3>
            <p className="leading-relaxed mb-4">
              Auctioneers must pay a 2% commission fee on the final sale price.
              Commission must be submitted within 24 hours of auction end with
              valid payment proof. Failure to submit commission will result in
              account restrictions.
            </p>
          </section>

          {/* Trust and Reputation System */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              6. Trust Score and Reputation System
            </h2>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              6.1 Trust Score Calculation
            </h3>
            <p className="leading-relaxed mb-4">
              Your trust score is automatically calculated based on:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Total transaction volume (BDT)</li>
              <li>Transaction speed (payment and delivery times)</li>
              <li>Successful auction completions</li>
              <li>Dispute outcomes</li>
            </ul>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              6.2 Badge Tiers
            </h3>
            <p className="leading-relaxed mb-4">
              Users earn badge tiers based on total transaction volume:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Bronze I-III: 0 - 9,999 BDT</li>
              <li>Silver I-III: 10,000 - 49,999 BDT</li>
              <li>Gold I-III: 50,000 - 99,999 BDT</li>
              <li>Platinum I-III: 100,000 - 499,999 BDT</li>
              <li>Diamond I-III: 500,000 - 1,999,999 BDT</li>
              <li>Royal: 2,000,000+ BDT</li>
            </ul>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              6.3 Verification Status
            </h3>
            <p className="leading-relaxed mb-4">
              Users become "Verified" after completing their first successful
              transaction:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                <strong>Verified Seller:</strong> Completed first successful
                delivery
              </li>
              <li>
                <strong>Verified Buyer:</strong> Completed first successful
                payment
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              6.4 Star Ratings
            </h3>
            <p className="leading-relaxed">
              Star ratings (1-5 stars) are calculated from trust scores: 100
              trust points = 1 star, up to a maximum of 5 stars (500+ points).
            </p>
          </section>

          {/* Disputes and Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              7. Disputes and Resolution
            </h2>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              7.1 Filing Disputes
            </h3>
            <p className="leading-relaxed mb-4">
              Disputes may be filed for issues such as:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Item not received</li>
              <li>Item significantly different from description</li>
              <li>Damaged or defective items</li>
              <li>Payment issues</li>
            </ul>

            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-3">
              7.2 Dispute Resolution Process
            </h3>
            <p className="leading-relaxed mb-4">
              Our admin team will investigate disputes and may:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                <strong>Refund:</strong> Full refund to buyer, seller loses -50
                trust points
              </li>
              <li>
                <strong>Release:</strong> Payment released to seller, buyer
                loses -10 trust points
              </li>
              <li>
                <strong>Partial Refund:</strong> Partial refund issued, both
                parties lose -10 trust points
              </li>
            </ul>
            <p className="leading-relaxed">
              Admin decisions are final. Repeated disputes may result in account
              suspension.
            </p>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              8. Prohibited Activities
            </h2>
            <p className="leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>List illegal, counterfeit, stolen, or prohibited items</li>
              <li>Engage in bid manipulation, shill bidding, or collusion</li>
              <li>Create multiple accounts to circumvent restrictions</li>
              <li>Interfere with the platform's operation or security</li>
              <li>Use automated bots or scripts</li>
              <li>Misrepresent items or provide false information</li>
              <li>Harass, threaten, or defame other users</li>
              <li>
                Bypass the escrow system or conduct off-platform transactions
              </li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              9. Intellectual Property
            </h2>
            <p className="leading-relaxed mb-4">
              All content on {appConfig.appName}, including but not limited to
              text, graphics, logos, icons, images, and software, is the
              property of {appConfig.appName} or its licensors and is protected
              by copyright and trademark laws.
            </p>
            <p className="leading-relaxed mb-4">
              By uploading content (images, descriptions) to the platform, you
              grant {appConfig.appName} a non-exclusive, worldwide, royalty-free
              license to use, display, and distribute that content for platform
              operation purposes.
            </p>
            <p className="leading-relaxed">
              You retain ownership of your content and are responsible for
              ensuring you have the right to upload and share it.
            </p>
          </section>

          {/* Account Termination */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              10. Account Termination and Suspension
            </h2>
            <p className="leading-relaxed mb-4">
              We reserve the right to suspend or terminate your account at any
              time for:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Violation of these Terms of Service</li>
              <li>Fraudulent or illegal activity</li>
              <li>Repeated disputes or negative feedback</li>
              <li>Non-payment of fees or commissions</li>
              <li>Inactivity for extended periods</li>
            </ul>
            <p className="leading-relaxed">
              You may close your account at any time by contacting support. Upon
              termination, you remain liable for any outstanding obligations.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              11. Limitation of Liability
            </h2>
            <p className="leading-relaxed mb-4">
              {appConfig.appName} acts as a marketplace platform connecting
              buyers and sellers. We are not a party to transactions between
              users and are not responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Quality, safety, legality, or accuracy of listed items</li>
              <li>User conduct, representations, or performance</li>
              <li>Shipping delays or damage during transit</li>
              <li>Third-party payment processing errors</li>
            </ul>
            <p className="leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW,{" "}
              {appConfig.appName.toUpperCase()} SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES
              ARISING FROM YOUR USE OF THE PLATFORM.
            </p>
            <p className="leading-relaxed">
              Our total liability for any claims shall not exceed the amount of
              fees you paid to {appConfig.appName} in the 12 months preceding
              the claim.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              12. Indemnification
            </h2>
            <p className="leading-relaxed">
              You agree to indemnify, defend, and hold harmless{" "}
              {appConfig.appName}, its officers, directors, employees, and
              agents from any claims, liabilities, damages, losses, and expenses
              (including legal fees) arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Your use of the platform</li>
              <li>Content you upload or share</li>
            </ul>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              13. Governing Law and Jurisdiction
            </h2>
            <p className="leading-relaxed mb-4">
              These Terms shall be governed by and construed in accordance with
              the laws of Bangladesh, without regard to its conflict of law
              provisions.
            </p>
            <p className="leading-relaxed">
              Any disputes arising from these Terms or your use of the platform
              shall be subject to the exclusive jurisdiction of the courts of
              Bangladesh.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              14. Changes to Terms
            </h2>
            <p className="leading-relaxed mb-4">
              We reserve the right to modify these Terms at any time. Changes
              will be effective upon posting on the platform. We will notify
              users of significant changes via email or platform notification.
            </p>
            <p className="leading-relaxed">
              Your continued use of the platform after changes are posted
              constitutes acceptance of the modified Terms. If you do not agree
              to the changes, you must discontinue use of the platform.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 whitestone:bg-blue-50 p-6 rounded-lg border-2 border-golden-400/30 whitestone:border-blue-200">
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              15. Contact Information
            </h2>
            <p className="leading-relaxed mb-4">
              For questions about these Terms of Service, please contact us:
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

          {/* Acknowledgment */}
          <section className="bg-gold-gradient/10 whitestone:bg-yellow-50 p-6 rounded-lg border-2 border-golden-400 whitestone:border-yellow-300">
            <h2 className="text-2xl font-bold text-golden-300 whitestone:text-gray-900 mb-4">
              Acknowledgment
            </h2>
            <p className="leading-relaxed">
              BY USING {appConfig.appName.toUpperCase()}, YOU ACKNOWLEDGE THAT
              YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF
              SERVICE.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
};

export default TermsOfService;
