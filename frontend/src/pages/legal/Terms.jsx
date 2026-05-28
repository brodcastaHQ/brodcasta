import LegalPageLayout from './LegalPageLayout';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-semibold mb-4 text-[var(--app-text)]">{title}</h2>
    <div className="text-sm text-[var(--app-muted)] leading-relaxed space-y-3">
      {children}
    </div>
  </div>
);

const Terms = () => {
  return (
    <LegalPageLayout title="Terms of Service" updated="May 15, 2026">
      <Section title="1. Acceptance of Terms">
        <p>
          By accessing or using Brodcasta ("the Service"), operated by Brodcasta Inc. ("we," "us," or "our"),
          you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms,
          you may not access or use the Service.
        </p>
        <p>
          These Terms apply to all visitors, users, and others who access or use the Service ("Users").
          By creating an account, subscribing to a plan, or using any part of the Service, you acknowledge
          that you have read, understood, and agree to be bound by these Terms.
        </p>
      </Section>

      <Section title="2. Description of Service">
        <p>
          Brodcasta provides a real-time messaging and event broadcasting platform that enables developers
          to integrate WebSocket and Server-Sent Events (SSE) communication into their applications. The Service
          includes APIs, SDKs, analytics dashboards, and related infrastructure.
        </p>
        <p>
          We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time,
          with reasonable notice to paid subscribers. Free tier users acknowledge that the Service may be
          modified without prior notice.
        </p>
      </Section>

      <Section title="3. Account Registration and Security">
        <p>
          You must create an account to access certain features of the Service. When registering, you agree to
          provide accurate, current, and complete information. You are solely responsible for maintaining the
          confidentiality of your account credentials and for all activities that occur under your account.
        </p>
        <p>
          You must notify us immediately of any unauthorized use of your account or any other breach of security.
          We are not liable for any loss or damage arising from your failure to protect your account credentials.
        </p>
      </Section>

      <Section title="4. Subscriptions and Billing">
        <p>
          The Service offers free and paid subscription plans. Paid plans are billed in advance on a monthly
          basis unless otherwise agreed in writing. All fees are non-refundable except as expressly stated in
          these Terms or as required by applicable law.
        </p>
        <p>
          <strong>Payment processing</strong> — All payments are processed securely through Paystack, a PCI DSS
          Level 1 compliant payment processor. We do not store, process, or have access to your full payment
          card details.
        </p>
        <p>
          <strong>Automatic renewal</strong> — Paid subscriptions automatically renew at the end of each billing
          period unless cancelled at least 24 hours before the renewal date. You may cancel at any time through
          your account dashboard. Cancellation takes effect at the end of the current billing period.
        </p>
        <p>
          <strong>Price changes</strong> — We may change subscription fees with 30 days&apos; notice. Continued use
          of the Service after the fee change takes effect constitutes acceptance of the new fees.
        </p>
      </Section>

      <Section title="5. Acceptable Use">
        <p>
          You agree not to use the Service for any unlawful purpose or in violation of any applicable laws or
          regulations. Prohibited activities include, but are not limited to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Transmitting malware, viruses, or any harmful code</li>
          <li>Sending spam, unsolicited messages, or abusive content through the platform</li>
          <li>Attempting to breach, bypass, or disable security features of the Service</li>
          <li>Reverse engineering, decompiling, or disassembling the Service</li>
          <li>Using the Service in a way that exceeds reasonable rate limits or degrades performance for other users</li>
          <li>Hosting or transmitting illegal content, including material that infringes on intellectual property rights</li>
          <li>Using the Service for any form of surveillance, data mining, or scraping without authorization</li>
        </ul>
      </Section>

      <Section title="6. Data, Privacy, and Security">
        <p>
          Your use of the Service is governed by our Privacy Policy, which is incorporated into these Terms by
          reference. We implement industry-standard security measures to protect data transmitted through our
          platform, including encryption in transit (TLS) and at rest.
        </p>
        <p>
          <strong>Message content</strong> — Brodcasta acts as a data processor for messages sent through the
          platform. You retain all rights and ownership of your data. We do not access, read, or analyze your
          message content except as necessary to provide the Service (e.g., routing messages, enforcing rate limits)
          or as required by law.
        </p>
        <p>
          <strong>Data retention</strong> — Message retention periods vary by subscription plan. Messages are
          automatically deleted after the retention period specified in your plan. You are responsible for
          backing up any critical data.
        </p>
        <p>
          <strong>Analytics data</strong> — We collect anonymized usage metrics (connection counts, message
          volumes, response times) to operate and improve the Service. This data does not include message
          content or personally identifiable information of your end users.
        </p>
      </Section>

      <Section title="7. Service Level and Limitations">
        <p>
          We strive to provide reliable service but do not guarantee uninterrupted availability. The Service
          is provided on an "as is" and "as available" basis. Paid plans may include specific uptime SLAs as
          described in the plan details.
        </p>
        <p>
          <strong>Rate limits</strong> — Usage is subject to rate limits and fair use policies as described in
          your plan. Exceeding these limits may result in throttling or temporary suspension.
        </p>
        <p>
          <strong>Maintenance</strong> — We may schedule maintenance windows that temporarily affect service
          availability. Paid subscribers will receive reasonable advance notice of planned maintenance.
        </p>
      </Section>

      <Section title="8. Intellectual Property">
        <p>
          The Service, including its code, design, branding, documentation, and proprietary technology, is
          owned by Brodcasta Inc. and protected by intellectual property laws. You may not copy, modify,
          distribute, sell, or create derivative works without our express written permission.
        </p>
        <p>
          We grant you a limited, non-exclusive, non-transferable license to use the Service in accordance
          with these Terms for your internal business purposes. This license does not include the right to
          sublicense or resell the Service.
        </p>
      </Section>

      <Section title="9. Third-Party Services">
        <p>
          The Service integrates with third-party services including Paystack (payment processing), Redis
          (message queuing), and cloud infrastructure providers. Your use of these services is subject to
          their respective terms of service. We are not responsible for the availability, security, or
          performance of third-party services.
        </p>
      </Section>

      <Section title="10. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, Brodcasta Inc., its affiliates, officers, employees, and
          agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
          including but not limited to loss of profits, data, use, goodwill, or other intangible losses,
          resulting from:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your use or inability to use the Service</li>
          <li>Any unauthorized access to or alteration of your data</li>
          <li>Any interruptions or cessation of the Service</li>
          <li>Any bugs, viruses, or errors transmitted through the Service</li>
          <li>Any conduct or content of third parties on the Service</li>
        </ul>
        <p className="mt-3">
          Our total liability for any claim arising from these Terms or the Service shall not exceed the
          amount you have paid us in the twelve (12) months preceding the claim. Free tier users acknowledge
          that their remedies are limited to the maximum extent permitted by law.
        </p>
      </Section>

      <Section title="11. Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless Brodcasta Inc., its officers, directors, employees,
          and agents from and against any claims, liabilities, damages, losses, and expenses, including
          reasonable legal fees, arising out of or in any way connected with:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your use of the Service in violation of these Terms</li>
          <li>Your violation of any applicable law or regulation</li>
          <li>Content you transmit through the Service</li>
          <li>Your violation of any third-party rights, including intellectual property rights</li>
        </ul>
      </Section>

      <Section title="12. Termination">
        <p>
          We may terminate or suspend your account and access to the Service at any time, with or without
          cause, with or without notice. Grounds for termination include, but are not limited to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Violation of these Terms or applicable laws</li>
          <li>Fraudulent, abusive, or illegal activity</li>
          <li>Non-payment of fees</li>
          <li>Request by law enforcement or other government agencies</li>
        </ul>
        <p className="mt-3">
          Upon termination, your right to use the Service immediately ceases. We may delete your data after
          a reasonable period following termination. You may export your data before termination by contacting
          our support team.
        </p>
      </Section>

      <Section title="13. Changes to Terms">
        <p>
          We reserve the right to modify these Terms at any time. Material changes will be communicated via
          email or through a notification on the Service. Your continued use of the Service after changes take
          effect constitutes acceptance of the updated Terms. If you do not agree to the changes, you must
          stop using the Service and cancel your subscription.
        </p>
      </Section>

      <Section title="14. Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the State of Delaware,
          without regard to its conflict of law provisions. Any disputes arising under these Terms shall be
          resolved exclusively in the federal or state courts located in Delaware.
        </p>
      </Section>

      <Section title="15. Contact">
        <p>
          For questions about these Terms, please contact us at:
        </p>
        <p className="mt-2">
          Brodcasta Inc.<br />
          Email: legal@brodcasta.dev<br />
          Address: 251 Little Falls Drive, Wilmington, DE 19808, United States
        </p>
      </Section>
    </LegalPageLayout>
  );
};

export default Terms;
