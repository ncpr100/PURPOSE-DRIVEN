import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy | Khesed-Tek Systems',
  description: 'Refund and Cancellation Policy for Khesed-Tek Systems, LLC — Church Management Platform',
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-background text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold tracking-tight">Refund &amp; Cancellation Policy</h1>
          <p className="mt-2 text-muted-foreground/70">Khesed-Tek Systems, LLC</p>
          <p className="text-sm text-muted-foreground mt-1">Last Updated: March 9, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 text-muted-foreground text-sm leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">1. Overview</h2>
          <p>Khesed-Tek Systems, LLC (&quot;Khesed-Tek&quot;) is committed to providing high-quality church management software. This policy outlines the terms under which refunds and cancellations are handled for subscriptions to the Khesed-Tek CMS platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">2. Subscription Cancellations</h2>
          <p className="mb-3"><strong>2.1. How to Cancel.</strong> You may cancel your subscription at any time by:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Using the cancellation option in your Platform administration panel (Settings → Subscription)</li>
            <li>Contacting our support team at <a href="mailto:soporte@khesed-tek-systems.org" className="text-[hsl(var(--info))] underline">soporte@khesed-tek-systems.org</a></li>
          </ul>
          <p className="mb-3"><strong>2.2. Effective Date.</strong> Cancellations take effect at the end of the current billing period. You will retain full access to the platform until that date.</p>
          <p className="mb-3"><strong>2.3. No Partial Refunds.</strong> We do not issue refunds for partial subscription periods. If you cancel mid-cycle, you will continue to have access until the end of the paid period.</p>
          <p><strong>2.4. Data After Cancellation.</strong> Your Church Data will remain accessible for up to 90 days after cancellation to allow you to export your records. After 90 days, all data is permanently deleted.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">3. Refund Eligibility</h2>
          <p className="mb-3"><strong>3.1. General Rule.</strong> Subscription fees are non-refundable except in the circumstances listed below.</p>
          <p className="mb-3"><strong>3.2. Eligible Refund Cases.</strong> A full or partial refund may be issued in the following situations:</p>
          <div className="overflow-x-auto mb-3">
            <table className="w-full border border-border text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="border border-border px-4 py-2 text-left font-semibold text-foreground w-48">Situation</th>
                  <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Refund</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Duplicate charge due to billing error', 'Full refund of the duplicate amount'],
                  ['Service outage exceeding 72 consecutive hours', 'Pro-rated credit for days affected'],
                  ['Unauthorized charge after cancellation', 'Full refund of the unauthorized charge'],
                  ['Technical failure preventing platform access for 30+ days', 'Pro-rated refund for the affected period'],
                  ['Cancellation within 7 days of first subscription (new accounts only)', 'Full refund — 7-day satisfaction guarantee'],
                ].map(([situation, refund]) => (
                  <tr key={situation} className="even:bg-muted/30">
                    <td className="border border-border px-4 py-2 font-medium text-foreground align-top">{situation}</td>
                    <td className="border border-border px-4 py-2">{refund}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p><strong>3.3. Non-Eligible Cases.</strong> Refunds will not be issued for: change of mind after the 7-day guarantee period; failure to use the platform; dissatisfaction with features that were accurately described; or cancellation due to violation of our Terms of Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">4. How to Request a Refund</h2>
          <p className="mb-3">To request a refund, contact us within <strong>30 days</strong> of the charge in question:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Email: <a href="mailto:legal@khesed-tek-systems.org" className="text-[hsl(var(--info))] underline">legal@khesed-tek-systems.org</a></li>
            <li>Subject line: <strong>Refund Request — [Your Church Name]</strong></li>
            <li>Include: your account email, transaction date, amount, and reason for the request</li>
          </ul>
          <p>We will review your request and respond within <strong>5 business days</strong>. Approved refunds are processed within <strong>7–10 business days</strong> to the original payment method.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">5. Annual Subscriptions</h2>
          <p className="mb-3"><strong>5.1. Annual Plan Cancellation.</strong> If you subscribed to an annual plan and cancel within the first 7 days, you are eligible for a full refund under our satisfaction guarantee.</p>
          <p className="mb-3"><strong>5.2. After 7 Days.</strong> No refund is issued for the remaining months of an annual subscription if cancelled after the 7-day period. You retain access until the end of the annual term.</p>
          <p><strong>5.3. Switching Plans.</strong> If you wish to downgrade your annual plan, the difference may be applied as a credit toward your next billing cycle at our discretion.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">6. Failed Payments</h2>
          <p className="mb-3"><strong>6.1. Notification.</strong> If a payment fails, we will notify you immediately and allow a 7-day grace period to update your payment information.</p>
          <p className="mb-3"><strong>6.2. Administrative Fee.</strong> A failed payment fee of $30 USD may be charged per failed transaction after the grace period.</p>
          <p><strong>6.3. Service Suspension.</strong> Accounts more than 30 days past due may be suspended. Reactivation requires payment of all outstanding balances including any accrued fees.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">7. Termination by Khesed-Tek</h2>
          <p>If Khesed-Tek terminates your account due to a violation of our Terms of Service, no refund will be issued. If we terminate your account for reasons unrelated to a policy violation (e.g., business discontinuation), we will provide a pro-rated refund for the unused portion of your subscription.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">8. Disputes</h2>
          <p>If you believe a charge was made in error and we are unable to resolve the matter directly, you may file a dispute with your payment provider. We encourage you to contact us first at <a href="mailto:legal@khesed-tek-systems.org" className="text-[hsl(var(--info))] underline">legal@khesed-tek-systems.org</a> as we are committed to resolving issues fairly and promptly.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">9. Contact Us</h2>
          <div className="bg-muted/30 border border-border rounded-lg p-6 space-y-2">
            <p className="font-semibold text-foreground">Khesed-Tek Systems, LLC</p>
            <p className="text-muted-foreground text-xs">(Delaware Limited Liability Company)</p>
            <p>Billing Support: <a href="mailto:soporte@khesed-tek-systems.org" className="text-[hsl(var(--info))] underline">soporte@khesed-tek-systems.org</a></p>
            <p>Legal / Refunds: <a href="mailto:legal@khesed-tek-systems.org" className="text-[hsl(var(--info))] underline">legal@khesed-tek-systems.org</a></p>
            <p>Phone: <a href="tel:+573011234410" className="text-[hsl(var(--info))] underline">+57 301 123 4410</a></p>
            <p>Website: <a href="https://www.khesed-tek-systems.org" className="text-[hsl(var(--info))] underline" target="_blank" rel="noopener noreferrer">www.khesed-tek-systems.org</a></p>
          </div>
        </section>

        <div className="border-t border-border pt-8 mt-8">
          <p className="text-center text-muted-foreground font-medium">
            THIS REFUND POLICY IS PART OF AND INCORPORATED INTO OUR TERMS AND CONDITIONS OF SERVICE.
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
