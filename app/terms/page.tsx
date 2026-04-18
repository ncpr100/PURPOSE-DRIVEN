import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms and Conditions | Khesed-Tek Systems',
  description: 'Terms and Conditions of Service for Khesed-Tek Systems, LLC — Church Management Platform',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-background text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold tracking-tight">Terms and Conditions of Service</h1>
          <p className="mt-2 text-muted-foreground/70">Khesed-Tek Systems, LLC</p>
          <p className="text-sm text-muted-foreground mt-1">Last Updated: March 9, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 text-muted-foreground text-sm leading-relaxed">

        {/* Section 1 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">1. Definitions and Parties</h2>
          <p className="mb-3">
            <strong>1.1. The Parties.</strong> This agreement is entered into between Khesed-Tek Systems, LLC, a Delaware limited liability company (hereinafter &quot;Khesed-Tek&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), and the church, ministry, or non-profit organization (hereinafter &quot;the Church&quot;, &quot;you&quot;, or &quot;your&quot;) that contracts our Services.
          </p>
          <p className="mb-3"><strong>1.2. Key Definitions.</strong></p>
          <div className="overflow-x-auto">
            <table className="w-full border border-border text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="border border-border px-4 py-2 text-left font-semibold text-foreground w-40">Term</th>
                  <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Definition</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Services', 'The Khesed-Tek CMS platform, mobile applications, technical support, and any other products or services offered by Khesed-Tek Systems.'],
                  ['Platform', 'The Khesed-Tek CMS church management software, accessible via web and mobile devices.'],
                  ['Church Data', 'All information, records, and content that the Church enters, imports, or stores on the Platform.'],
                  ['Administrator', 'The person(s) designated by the Church to manage the account and grant permissions to other users.'],
                  ['Authorized Users', 'Pastors, leaders, volunteers, and members whom the Church authorizes to access the Platform.'],
                  ['Content', 'Text, graphics, images, videos, and other materials provided by Khesed-Tek within the Platform.'],
                  ['LLC Act', 'The Delaware Limited Liability Company Act (6 Del. C. § 18-101 et seq.), as amended from time to time.'],
                ].map(([term, def]) => (
                  <tr key={term} className="even:bg-muted/30">
                    <td className="border border-border px-4 py-2 font-medium text-foreground align-top">{term}</td>
                    <td className="border border-border px-4 py-2">{def}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">2. Acceptance of Terms</h2>
          <p className="mb-3"><strong>2.1. Acceptance.</strong> By creating an account, accessing, or using any Khesed-Tek Systems Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions, as well as our Privacy Policy. If you are entering into this agreement on behalf of a church or other entity, you represent and warrant that you have full legal authority to bind that entity.</p>
          <p className="mb-3"><strong>2.2. Modifications.</strong> We may modify these Terms at any time. Material changes will be notified through the Platform or by email at least 30 days in advance. Continued use of the Services after the effective date constitutes acceptance of the modified terms.</p>
          <p className="mb-3"><strong>2.3. Governing Law.</strong> These Terms and any disputes arising out of or related to the Services shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of laws principles. The parties acknowledge that the Delaware Limited Liability Company Act (6 Del. C. § 18-101 et seq.) shall apply to all company governance matters.</p>
          <p className="mb-3"><strong>2.4. Legal Capacity.</strong> The person creating the account on behalf of the Church declares and warrants that they have full authority to legally bind the Church and are at least 18 years of age.</p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">3. Account Creation and Administration</h2>
          <p className="mb-3"><strong>3.1. Registration.</strong> To use our Services, you must provide complete and accurate information, including the Church&apos;s full legal name, a valid email address, and billing information.</p>
          <p className="mb-3"><strong>3.2. Administrators.</strong></p>
          <ul className="list-disc pl-6 mb-3 space-y-1">
            <li>The initial user who creates the account shall be designated as the Primary Administrator.</li>
            <li>Administrators have the authority to manage users, configure permissions, and control the subscription.</li>
            <li>In the event of an internal dispute between Administrators, Khesed-Tek may suspend access until the Church resolves the conflict and provides written instructions signed by its legal representative.</li>
          </ul>
          <p className="mb-3"><strong>3.3. Authorized Users.</strong></p>
          <ul className="list-disc pl-6 mb-3 space-y-1">
            <li>Each user must have unique login credentials. Shared logins are not permitted.</li>
            <li>Administrators are responsible for the actions of all Authorized Users under their account.</li>
            <li>When a user is removed, they will immediately lose all access to the Platform.</li>
          </ul>
          <p className="mb-3"><strong>3.4. Account Security.</strong> You are responsible for: maintaining the confidentiality of all access credentials; ensuring users log out when not using the Platform; and notifying us immediately of any unauthorized access or security breach.</p>
          <p className="mb-3"><strong>3.5. Minimum Age.</strong> Access to the Platform is not permitted for individuals under 13 years of age. If your Church stores information about minors, you represent and warrant that you have obtained the required parental or guardian consent under applicable law.</p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">4. Intellectual Property Rights</h2>
          <p className="mb-3"><strong>4.1. Ownership by Khesed-Tek.</strong> Khesed-Tek Systems, LLC retains all right, title, and interest in and to: the source code, design, interface, and functionality of the Platform; our trademarks, logos, and trade names; content provided by Khesed-Tek; and any improvements, modifications, or updates to the Services.</p>
          <p className="mb-3"><strong>4.2. License to Use.</strong> We grant you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the Services solely for your internal ministry purposes, in accordance with these Terms and during the term of your subscription.</p>
          <p className="mb-3"><strong>4.3. Ownership of Church Data.</strong> You retain all ownership rights to the Church Data you enter into the Platform. We claim no ownership over your data.</p>
          <p className="mb-3"><strong>4.4. License to Church Data.</strong> To provide the Services, you grant us a limited license to: store, process, and backup your data; use your data in anonymized and aggregated form to improve our Services; and share your data with technical providers under strict confidentiality obligations.</p>
          <p className="mb-3"><strong>4.5. Restrictions.</strong> You may not reverse engineer, copy, modify, sell, rent, sublicense, or use the Platform to create a competing product.</p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">5. Acceptable Use and Conduct</h2>
          <p className="mb-3"><strong>5.1. Ministerial Purpose.</strong> Khesed-Tek CMS is designed exclusively to support the work of churches and ministries aligned with traditional Christian values. We reserve the right to determine, in our sole discretion, whether a client&apos;s use aligns with this purpose.</p>
          <p className="mb-3"><strong>5.2. Prohibited Conduct.</strong> You and your Authorized Users may NOT:</p>
          <div className="overflow-x-auto">
            <table className="w-full border border-border text-sm mb-3">
              <thead className="bg-muted/30">
                <tr>
                  <th className="border border-border px-4 py-2 text-left font-semibold text-foreground w-48">Category</th>
                  <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Prohibited Conduct</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Illegal Content', 'Store, transmit, or share illegal, fraudulent, terrorist, or criminally-oriented content.'],
                  ['Offensive Content', 'Post obscene, pornographic, blasphemous, defamatory, hateful, racist, or discriminatory material.'],
                  ['Third-Party Data', 'Store personal information without valid consent from the data subject.'],
                  ['Spam', 'Send unsolicited communications, mass mailings, or chain messages.'],
                  ['Malware', 'Introduce viruses, worms, trojans, or any malicious code.'],
                  ['Impersonation', 'Impersonate another person or entity.'],
                  ['Unauthorized Access', "Attempt to access other clients' accounts or Khesed-Tek's systems without authorization."],
                  ['Automation', 'Use robots, spiders, or automated scripts to extract data from the Platform.'],
                ].map(([cat, desc]) => (
                  <tr key={cat} className="even:bg-muted/30">
                    <td className="border border-border px-4 py-2 font-medium text-foreground align-top">{cat}</td>
                    <td className="border border-border px-4 py-2">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mb-3"><strong>5.3. Monitoring.</strong> We may monitor use of the Services to detect violations of this policy.</p>
          <p className="mb-3"><strong>5.4. Third-Party Privacy.</strong> When posting information about other individuals (including prayer requests), you represent that you have their consent or a valid legal basis.</p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">6. Commercial Terms and Payments</h2>
          <p className="mb-3"><strong>6.1. Subscriptions.</strong> Our Services are offered on a monthly or annual subscription basis. Current pricing is published on our website and may be modified with 30 days&apos; prior notice.</p>
          <p className="mb-3"><strong>6.2. Billing and Payments.</strong> Payments are processed via credit card, debit card, or ACH bank transfer. By providing payment information, you authorize automatic charges according to your chosen billing cycle. Receipts and invoices are available within the Platform.</p>
          <p className="mb-3"><strong>6.3. Taxes.</strong> Prices do not include applicable taxes. You are responsible for paying all taxes arising from your subscription in your jurisdiction.</p>
          <p className="mb-3"><strong>6.4. Late Payments and Default.</strong> If payment cannot be processed: you will be notified to update your information; an administrative fee of $30 USD may be applied per failed transaction; accounts more than 30 days past due may be suspended; and interest on overdue amounts shall accrue at 1.5% per month.</p>
          <p className="mb-3"><strong>6.5. Price Increases.</strong> Any price changes will be notified at least 30 days in advance. If you do not agree to the new price, you may cancel before the effective date.</p>
          <p className="mb-3"><strong>6.6. Mission Commitment.</strong> A portion of Khesed-Tek&apos;s earnings is allocated to fund the rehabilitation programs of Misión Khesed in Colombia and Latin America, as reflected in our operating agreement.</p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">7. Data Ownership and Security</h2>
          <p className="mb-3"><strong>7.1. Data Ownership.</strong> Church Data belongs exclusively to you. Khesed-Tek Systems, LLC acts as a data processor on your behalf.</p>
          <p className="mb-3"><strong>7.2. Confidentiality.</strong> We will not sell, rent, or share your data with third parties for marketing purposes. We only share data with technical providers necessary to operate the service, to comply with legal obligations, or in anonymized and aggregated form for statistical analysis.</p>
          <p className="mb-3"><strong>7.3. Security.</strong> We implement encryption in transit (HTTPS/SSL) and at rest, automated daily backups, role-based access controls, and monitoring for suspicious activity.</p>
          <p className="mb-3"><strong>7.4. Customer Responsibility.</strong> You are responsible for obtaining all necessary consents to store personal data, properly configuring user permissions, and maintaining your own backups of critical information.</p>
          <p className="mb-3"><strong>7.5. International Data Transfers.</strong> Your data may be stored and processed on servers in the United States or other countries. By using our Services, you consent to these international transfers.</p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">8. Service Availability</h2>
          <p className="mb-3"><strong>8.1. &quot;As Is&quot; and &quot;As Available&quot;.</strong> The Services are provided &quot;AS IS&quot; and &quot;AS AVAILABLE,&quot; without warranties of any kind, either express or implied.</p>
          <p className="mb-3"><strong>8.2. Disclaimer of Warranties.</strong> We expressly disclaim all implied warranties of merchantability, fitness for a particular purpose, non-infringement, and accuracy or reliability of results.</p>
          <p className="mb-3"><strong>8.3. Interruptions.</strong> We do not guarantee that the service will be uninterrupted, error-free, or completely secure.</p>
          <p className="mb-3"><strong>8.4. Maintenance.</strong> We may temporarily suspend access to perform maintenance or updates. We will endeavor to perform maintenance during off-peak hours with advance notice.</p>
          <p className="mb-3"><strong>8.5. Force Majeure.</strong> We shall not be liable for failures caused by events beyond our reasonable control, including acts of God, war, terrorism, power failures, or governmental actions.</p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">9. Limitation of Liability</h2>
          <p className="mb-3"><strong>9.1. Exclusion of Damages.</strong> To the maximum extent permitted by Delaware law, Khesed-Tek Systems, LLC shall not be liable for indirect, incidental, special, consequential, or punitive damages; loss of data, revenue, profits, or business opportunities; or costs of procuring substitute services.</p>
          <p className="mb-3"><strong>9.2. Cap on Liability.</strong> Our total liability shall not exceed the total amount paid by you during the twelve (12) months immediately preceding the event giving rise to the claim.</p>
          <p className="mb-3"><strong>9.3. Exceptions.</strong> This limitation does not apply in cases of proven gross negligence, willful misconduct, death or personal injury caused by our negligence, or liability that cannot be limited by applicable law.</p>
          <p className="mb-3"><strong>9.4. Data Loss.</strong> You are responsible for maintaining independent backups of your data.</p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">10. Cancellation and Termination</h2>
          <p className="mb-3"><strong>10.1. Cancellation by You.</strong> You may cancel your subscription at any time from the Platform&apos;s administration panel or by contacting our support team. Cancellation will be effective at the end of the current billing period. No refunds will be issued for partial periods.</p>
          <p className="mb-3"><strong>10.2. Termination by Khesed-Tek.</strong> We may suspend or terminate your access immediately if you violate these Terms, fail to make timely payments, or if we receive a legal or governmental request.</p>
          <p className="mb-3"><strong>10.3. Effect of Termination.</strong> Your access will cease immediately. We may retain your data for up to 90 days to permit recovery. Payment obligations accrued prior to termination remain in effect.</p>
          <p className="mb-3"><strong>10.4. Data Export.</strong> Before cancellation, you may export your data in standard formats (CSV, Excel) from the Platform.</p>
        </section>

        {/* Section 11 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">11. Indemnification</h2>
          <p>You agree to indemnify, defend, and hold harmless Khesed-Tek Systems, LLC, its members, managers, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, and expenses (including reasonable attorneys&apos; fees) arising from your use of the Services, your violation of these Terms, or any claim that your Church Data caused damage to a third party.</p>
        </section>

        {/* Section 12 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">12. General Provisions</h2>
          <p className="mb-3"><strong>12.1. Entire Agreement.</strong> These Terms, together with the Privacy Policy, constitute the entire agreement between the parties and supersede any prior agreements.</p>
          <p className="mb-3"><strong>12.2. Waiver.</strong> Our failure to enforce a right shall not constitute a waiver of that right.</p>
          <p className="mb-3"><strong>12.3. Severability.</strong> If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.</p>
          <p className="mb-3"><strong>12.4. Assignment.</strong> You may not assign these Terms without our prior written consent. We may assign them freely in the event of a merger, acquisition, or reorganization.</p>
          <p className="mb-3"><strong>12.5. Notices.</strong> Legal notices must be sent in writing to our registered agent address or by email to <a href="mailto:legal@khesed-tek-systems.org" className="text-[hsl(var(--info))] underline">legal@khesed-tek-systems.org</a>.</p>
          <p className="mb-3"><strong>12.6. Relationship of Parties.</strong> We are independent contractors. Nothing in these Terms creates a partnership, joint venture, agency, or employment relationship.</p>
          <p className="mb-3"><strong>12.7. Dispute Resolution.</strong> The parties acknowledge the exclusive jurisdiction of the state and federal courts located in Delaware for any disputes arising under these Terms. The prevailing party shall be entitled to recover reasonable attorneys&apos; fees and costs.</p>
          <p className="mb-3"><strong>12.8. No Class Actions.</strong> You agree to bring any claims against Khesed-Tek only in your individual capacity, and not as a plaintiff or class member in any purported class or representative proceeding.</p>
        </section>

        {/* Section 13 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">13. Contact Information</h2>
          <div className="bg-muted/30 border border-border rounded-lg p-6 space-y-2">
            <p className="font-semibold text-foreground">Khesed-Tek Systems, LLC</p>
            <p className="text-muted-foreground text-xs">(Delaware Limited Liability Company)</p>
            <p>Email: <a href="mailto:legal@khesed-tek-systems.org" className="text-[hsl(var(--info))] underline">legal@khesed-tek-systems.org</a></p>
            <p>Phone: <a href="tel:+573011234410" className="text-[hsl(var(--info))] underline">+57 301 123 4410</a></p>
            <p>Website: <a href="https://www.khesed-tek-systems.org" className="text-[hsl(var(--info))] underline" target="_blank" rel="noopener noreferrer">www.khesed-tek-systems.org</a></p>
          </div>
        </section>

        {/* Footer acknowledgment */}
        <div className="border-t border-border pt-8 mt-8">
          <p className="text-center text-muted-foreground font-medium">
            BY USING OUR SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS.
          </p>
        </div>
      </div>

      {/* Page Footer */}
      <div className="bg-background text-muted-foreground/70 py-6 text-center text-xs">
        <p>© {new Date().getFullYear()} Khesed-Tek Systems, LLC. All rights reserved.</p>
        <p className="mt-1">A Delaware Limited Liability Company</p>
      </div>
    </div>
  )
}
