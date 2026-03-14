export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto prose-sm" style={{ color: 'var(--text-primary)' }}>
      <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Last updated: March 13, 2026</p>

      <div className="space-y-6 text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>1. Information We Collect</h2>
          <p>We collect information you provide directly, including your name, email address, business information, and any data you enter into the CRM. We also collect usage data such as pages viewed, features used, and session duration.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>2. How We Use Your Information</h2>
          <p>Your information is used to provide and improve our CRM services, process payments, send transactional emails, and provide customer support. We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>3. Data Storage & Security</h2>
          <p>Your data is stored securely in Supabase (PostgreSQL) with row-level security policies. All data is encrypted in transit (TLS) and at rest. Access is restricted by organization-level isolation.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>4. Third-Party Services</h2>
          <p>We integrate with Square (payments), Google (AI, Drive, Calendar), Resend (email), and Sentry (error tracking). Each provider has their own privacy policy governing their use of your data.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>5. Your Rights (GDPR)</h2>
          <p>You have the right to access, correct, or delete your personal data. You may request a full export of your data or account deletion by contacting us. We will respond within 30 days.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>6. Cookies</h2>
          <p>We use essential cookies to maintain your session and preferences. Analytics cookies are optional and can be declined via our cookie consent banner.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>7. Contact</h2>
          <p>For privacy-related inquiries, contact us at privacy@studioflow.app.</p>
        </section>
      </div>
    </div>
  );
}
