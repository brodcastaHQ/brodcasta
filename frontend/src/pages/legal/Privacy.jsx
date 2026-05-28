import LegalPageLayout from './LegalPageLayout';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-semibold mb-4 text-[var(--app-text)]">{title}</h2>
    <div className="text-sm text-[var(--app-muted)] leading-relaxed space-y-3">
      {children}
    </div>
  </div>
);

const Privacy = () => {
  return (
    <LegalPageLayout title="Privacy Policy" updated="May 15, 2026">
      <Section title="1. Introduction">
        <p>
          Brodcasta Inc. ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information when you use our real-time
          messaging and event broadcasting platform ("the Service").
        </p>
        <p>
          By accessing or using the Service, you consent to the practices described in this policy. If you do
          not agree with any part of this Privacy Policy, please discontinue use of the Service immediately.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <p className="font-medium text-[var(--app-text)]">2.1 Information You Provide</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Account information</strong> — Name, email address, and password when you create an account.</li>
          <li><strong>Profile information</strong> — Any additional profile details you choose to add.</li>
          <li><strong>Payment information</strong> — When subscribing to a paid plan, payment card details are collected and processed by Paystack, our PCI-compliant payment processor. We do not store full card numbers.</li>
          <li><strong>Communication</strong> — Information you provide when contacting our support team.</li>
        </ul>

        <p className="font-medium text-[var(--app-text)] mt-5">2.2 Information Collected Automatically</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Usage data</strong> — Connection timestamps, API request counts, message volumes, feature interactions.</li>
          <li><strong>Device information</strong> — IP address, browser type, operating system, device identifiers.</li>
          <li><strong>Cookies and tracking</strong> — We use essential cookies for authentication and session management. See Section 5 for details.</li>
        </ul>

        <p className="font-medium text-[var(--app-text)] mt-5">2.3 Information We Do Not Collect</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>We do not read, scan, or analyze the content of messages transmitted through the platform except as necessary to route and deliver messages.</li>
          <li>We do not sell your personal information to third parties.</li>
          <li>We do not use third-party advertising trackers or analytics that share data with ad networks.</li>
        </ul>
      </Section>

      <Section title="3. How We Use Your Information">
        <p>We use the collected information for the following purposes:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Service operation</strong> — To provide, maintain, and improve the Service, including routing messages, enforcing rate limits, and managing accounts.</li>
          <li><strong>Billing</strong> — To process subscription payments, manage invoices, and handle billing inquiries.</li>
          <li><strong>Support</strong> — To respond to your questions, troubleshoot issues, and provide customer support.</li>
          <li><strong>Security</strong> — To detect, prevent, and address fraudulent, abusive, or unauthorized use of the Service.</li>
          <li><strong>Product improvement</strong> — To analyze usage patterns and performance metrics to improve the Service. Aggregated, anonymized data may be used for product development.</li>
          <li><strong>Legal compliance</strong> — To comply with applicable laws, regulations, and legal processes.</li>
        </ul>
      </Section>

      <Section title="4. Data Sharing and Disclosure">
        <p>We may share your information in the following circumstances:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Service providers</strong> — With trusted third-party vendors who assist in operating the Service, including cloud infrastructure providers, payment processors (Paystack), and email delivery services. These providers are bound by confidentiality agreements.</li>
          <li><strong>Legal requirements</strong> — If required by law, regulation, or legal process (e.g., court order, subpoena), or to protect our rights, property, or safety, or the rights, property, or safety of others.</li>
          <li><strong>Business transfers</strong> — In connection with a merger, acquisition, reorganization, or sale of assets, your information may be transferred as part of that transaction.</li>
          <li><strong>With your consent</strong> — We may share information for any other purpose with your explicit consent.</li>
        </ul>
        <p className="mt-3">
          We do not rent, sell, or trade your personal information with third parties for their marketing purposes.
        </p>
      </Section>

      <Section title="5. Cookies and Tracking Technologies">
        <p>
          We use only essential cookies required for the operation of the Service. These include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Authentication cookies</strong> — Session tokens to keep you logged in across requests.</li>
          <li><strong>CSRF tokens</strong> — Security tokens to prevent cross-site request forgery.</li>
        </ul>
        <p className="mt-3">
          We do not use tracking cookies, advertising cookies, or third-party analytics cookies. You can
          configure your browser to reject all cookies, though this may affect the functionality of the Service.
        </p>
      </Section>

      <Section title="6. Data Retention">
        <p>
          We retain your information for as long as your account is active or as needed to provide the Service.
          Specific retention periods:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Account information</strong> — Retained until account deletion or termination.</li>
          <li><strong>Message data</strong> — Retained according to your plan&apos;s retention policy (7 days for Starter, 30 days for Pro, custom for Enterprise). Messages are automatically purged after the retention period.</li>
          <li><strong>Usage logs</strong> — Aggregated usage data retained for up to 12 months for analytics purposes.</li>
          <li><strong>Payment records</strong> — Retained for the duration required by applicable financial regulations (typically 5-7 years).</li>
        </ul>
        <p className="mt-3">
          When you delete your account, your message data is scheduled for deletion within 30 days. Backup copies
          may persist for a reasonable period but will not be accessible through the Service.
        </p>
      </Section>

      <Section title="7. Data Security">
        <p>
          We implement comprehensive security measures to protect your data:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Encryption in transit</strong> — All API and WebSocket connections use TLS 1.2 or higher.</li>
          <li><strong>Encryption at rest</strong> — Data stored on encrypted volumes using industry-standard encryption.</li>
          <li><strong>Access controls</strong> — Strict access controls and authentication for infrastructure access.</li>
          <li><strong>Regular audits</strong> — Periodic security reviews and penetration testing.</li>
          <li><strong>PCI compliance</strong> — Payment processing is handled by Paystack, a PCI DSS Level 1 certified provider.</li>
        </ul>
        <p className="mt-3">
          While we strive to protect your data, no method of transmission or storage is 100% secure. We cannot
          guarantee absolute security.
        </p>
      </Section>

      <Section title="8. Your Rights and Choices">
        <p>Depending on your jurisdiction, you may have the following rights regarding your personal information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Access</strong> — Request a copy of the personal data we hold about you.</li>
          <li><strong>Correction</strong> — Request correction of inaccurate or incomplete data.</li>
          <li><strong>Deletion</strong> — Request deletion of your personal data, subject to legal retention requirements.</li>
          <li><strong>Portability</strong> — Request a machine-readable copy of your data.</li>
          <li><strong>Objection</strong> — Object to the processing of your data for certain purposes.</li>
          <li><strong>Withdrawal of consent</strong> — Withdraw consent at any time where processing is based on consent.</li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, contact us at privacy@brodcasta.dev. We will respond to your request
          within 30 days. We may need to verify your identity before processing your request.
        </p>
      </Section>

      <Section title="9. International Data Transfers">
        <p>
          We primarily store and process data in the United States. If you access the Service from outside the
          United States, your information may be transferred to, stored, and processed in the United States or
          other countries where our service providers operate. By using the Service, you consent to this transfer.
        </p>
        <p>
          When transferring data from the European Economic Area (EEA), Switzerland, or the United Kingdom, we
          ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the
          European Commission.
        </p>
      </Section>

      <Section title="10. Children&apos;s Privacy">
        <p>
          The Service is not intended for individuals under the age of 16 (or the age of majority in your
          jurisdiction). We do not knowingly collect personal information from children. If we become aware
          that a child has provided us with personal information, we will take steps to delete such information
          promptly. If you believe a child has provided us with personal data, please contact us.
        </p>
      </Section>

      <Section title="11. Third-Party Links and Services">
        <p>
          The Service may contain links to third-party websites or services, including payment processing
          through Paystack. We are not responsible for the privacy practices of these third parties. We
          encourage you to review their privacy policies before providing any personal information.
        </p>
      </Section>

      <Section title="12. Changes to This Privacy Policy">
        <p>
          We may update this Privacy Policy from time to time. Material changes will be communicated via
          email or through a notification on the Service. We encourage you to review this policy periodically.
          Your continued use of the Service after changes take effect constitutes acceptance of the updated policy.
        </p>
      </Section>

      <Section title="13. Contact Us">
        <p>
          If you have questions, concerns, or requests regarding this Privacy Policy or our data practices:
        </p>
        <p className="mt-2">
          Brodcasta Inc.<br />
          Email: privacy@brodcasta.dev<br />
          Address: 251 Little Falls Drive, Wilmington, DE 19808, United States
        </p>
        <p className="mt-3">
          For data privacy inquiries, you may also contact our Data Protection Officer at dpo@brodcasta.dev.
        </p>
      </Section>
    </LegalPageLayout>
  );
};

export default Privacy;
