import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Khesed-Tek Systems',
  description: 'Privacy Policy for Khesed-Tek Systems, LLC — Church Management Platform',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-background text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-muted-foreground/70">Khesed-Tek Systems, LLC</p>
          <p className="text-sm text-muted-foreground mt-1">Last Updated: March 9, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 text-muted-foreground text-sm leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">1. Introduction</h2>
          <p>Khesed-Tek Systems, LLC (&quot;Khesed-Tek&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), a Delaware limited liability company, is committed to protecting the privacy of the churches, ministries, and organizations (&quot;you&quot; or &quot;your&quot;) that use our church management platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Services.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">2. Information We Collect</h2>
          <p className="mb-3"><strong>2.1. Account Information.</strong> When you register, we collect: the church or organization name, administrator name, email address, phone number, and billing information.</p>
          <p className="mb-3"><strong>2.2. Church Data.</strong> Data you enter into the platform including member records, attendance, donations, prayer requests, event information, and communications. You retain full ownership of this data.</p>
          <p className="mb-3"><strong>2.3. Usage Data.</strong> We automatically collect information about how you interact with the platform, including log data, IP addresses, browser type, pages visited, and actions taken.</p>
          <p className="mb-3"><strong>2.4. Payment Information.</strong> Payment details are processed by our payment processor (Paddle). We do not store full credit card numbers on our servers.</p>
          <p className="mb-3"><strong>2.5. Communications.</strong> If you contact our support team, we retain records of those communications.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
          <p className="mb-3">We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Provide, operate, and maintain the Khesed-Tek CMS platform</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send transactional emails (receipts, invoices, service notifications)</li>
            <li>Provide customer support and respond to inquiries</li>
            <li>Improve and develop new features for the platform</li>
            <li>Monitor and analyze usage patterns to enhance user experience</li>
            <li>Detect, prevent, and address technical issues or security breaches</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p><strong>We do not sell your data or use it for advertising purposes.</strong></p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">4. Data Sharing and Disclosure</h2>
          <p className="mb-3">We may share your information only in the following circumstances:</p>
          <p className="mb-3"><strong>4.1. Service Providers.</strong> We share data with trusted third-party providers who assist us in operating the platform (cloud hosting, payment processing, email delivery). These providers are bound by strict confidentiality agreements.</p>
          <p className="mb-3"><strong>4.2. Legal Requirements.</strong> We may disclose data if required by law, court order, or governmental authority.</p>
          <p className="mb-3"><strong>4.3. Business Transfers.</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred. We will notify you before this occurs.</p>
          <p className="mb-3"><strong>4.4. Aggregated Data.</strong> We may share anonymized, aggregated statistics that cannot identify any individual church or person.</p>
          <p><strong>We never sell, rent, or trade your personal data to third parties for marketing purposes.</strong></p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">5. Data Security</h2>
          <p className="mb-3">We implement industry-standard security measures to protect your data:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Encryption in transit (HTTPS/TLS) and at rest (AES-256)</li>
            <li>Automated daily backups with offsite storage</li>
            <li>Role-based access controls limiting data access to authorized personnel only</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Monitoring systems for suspicious activity and unauthorized access</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">6. Data Retention</h2>
          <p className="mb-3">We retain your data for as long as your account is active or as needed to provide services. Upon cancellation:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Your data remains accessible for up to 90 days to allow for export and recovery</li>
            <li>After 90 days, your data is permanently deleted from our systems</li>
            <li>Billing and transaction records may be retained for up to 7 years as required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">7. Your Rights</h2>
          <p className="mb-3">As a user of our platform, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li><strong>Access:</strong> Request a copy of the data we hold about your organization</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your data (subject to legal retention requirements)</li>
            <li><strong>Portability:</strong> Export your Church Data in standard formats (CSV, Excel)</li>
            <li><strong>Objection:</strong> Object to processing of your data in certain circumstances</li>
          </ul>
          <p>To exercise any of these rights, contact us at <a href="mailto:legal@khesed-tek-systems.org" className="text-[hsl(var(--info))] underline">legal@khesed-tek-systems.org</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">8. Children&apos;s Privacy</h2>
          <p>Our platform is not directed at individuals under 13 years of age. If your church stores information about minors, you are responsible for ensuring you have obtained the necessary parental or guardian consent as required by applicable law, including COPPA (Children&apos;s Online Privacy Protection Act) if applicable.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">9. International Data Transfers</h2>
          <p>Khesed-Tek Systems, LLC is based in the United States. Your data may be stored and processed in the United States or other countries where our service providers operate. By using our Services, you consent to the transfer of your data to countries that may have different data protection laws than your country of residence. We ensure appropriate safeguards are in place for all international transfers.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">10. Cookies and Tracking</h2>
          <p className="mb-3">We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Maintain your login session</li>
            <li>Remember your preferences</li>
            <li>Analyze platform usage patterns</li>
            <li>Improve platform functionality</li>
          </ul>
          <p className="mt-3">You can control cookie settings through your browser. Disabling cookies may affect certain platform features.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">11. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of material changes via email or through the platform at least 30 days before the changes take effect. Your continued use of the Services after the effective date constitutes acceptance of the updated policy.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">12. Contact Us</h2>
          <div className="bg-muted/30 border border-border rounded-lg p-6 space-y-2">
            <p className="font-semibold text-foreground">Khesed-Tek Systems, LLC</p>
            <p className="text-muted-foreground text-xs">(Delaware Limited Liability Company)</p>
            <p>Email: <a href="mailto:legal@khesed-tek-systems.org" className="text-[hsl(var(--info))] underline">legal@khesed-tek-systems.org</a></p>
            <p>Phone: <a href="tel:+573011234410" className="text-[hsl(var(--info))] underline">+57 301 123 4410</a></p>
            <p>Website: <a href="https://www.khesed-tek-systems.org" className="text-[hsl(var(--info))] underline" target="_blank" rel="noopener noreferrer">www.khesed-tek-systems.org</a></p>
          </div>
        </section>

        <div className="border-t border-border pt-8 mt-8">
          <p className="text-center text-muted-foreground font-medium">
            BY USING OUR SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTOOD THIS PRIVACY POLICY.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-background text-muted-foreground/70 py-6 text-center text-xs">
        <p>© {new Date().getFullYear()} Khesed-Tek Systems, LLC. All rights reserved.</p>
        <p className="mt-1">A Delaware Limited Liability Company</p>
      </div>
    </div>
  )
}
