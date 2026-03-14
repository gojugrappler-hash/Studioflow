export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto prose-sm" style={{ color: 'var(--text-primary)' }}>
      <h1 className="text-2xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Last updated: March 14, 2026</p>

      <div className="space-y-6 text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>1. Acceptance of Terms</h2>
          <p>By accessing or using Studioflow (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>2. Description of Service</h2>
          <p>Studioflow is a customer relationship management (CRM) platform designed for creative professionals, including but not limited to tattoo artists and photographers. The Service provides tools for managing contacts, appointments, invoices, communications, and business operations.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>3. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating an account. You must notify us immediately of any unauthorized use of your account.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>4. User Data</h2>
          <p>You retain ownership of all data you enter into the Service. We will not access, use, or share your data except as necessary to provide the Service or as required by law. You are responsible for the accuracy and legality of the data you store in the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>5. Acceptable Use</h2>
          <p>You agree not to use the Service for any unlawful purpose, to store or transmit malicious code, to attempt to gain unauthorized access to any part of the Service, or to interfere with any other user&apos;s use of the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>6. Payment Processing</h2>
          <p>Payment processing is handled through Square. By using payment features, you agree to Square&apos;s Terms of Service in addition to these terms. We are not responsible for any payment disputes between you and your clients.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>7. Service Availability</h2>
          <p>We strive to maintain 99.9% uptime but do not guarantee uninterrupted access to the Service. We may perform maintenance with or without notice. We are not liable for any loss resulting from service interruptions.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>8. Limitation of Liability</h2>
          <p>The Service is provided &quot;as is&quot; without warranties of any kind. In no event shall Studioflow be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>9. Termination</h2>
          <p>We may suspend or terminate your access to the Service at any time for violation of these terms. You may cancel your account at any time by contacting support. Upon termination, you may request an export of your data within 30 days.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>10. Contact</h2>
          <p>For questions about these Terms, contact us at support@studioflow.app.</p>
        </section>
      </div>
    </div>
  );
}
