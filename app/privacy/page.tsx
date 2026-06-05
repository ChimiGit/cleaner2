import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — NG Clean',
  description: 'How NG Clean collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="policy-page">
      <div className="wrap">
        <div className="policy-back">
          <Link href="/">← Back to home</Link>
        </div>
        <div className="policy-card">
          <h1>Privacy Policy</h1>
          <p className="policy-updated">Last Updated: June 2026</p>

          <p>At NG Clean, we value the trust our clients place in us and are committed to protecting your privacy. We collect only the information necessary to provide our services and ensure a smooth customer experience.</p>

          <h2>Information We Collect</h2>
          <p>We may collect:</p>
          <ul>
            <li>Your name and contact details</li>
            <li>Property address and booking information</li>
            <li>Special instructions relating to your cleaning requirements</li>
            <li>Payment information where applicable</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>Your information is used to:</p>
          <ul>
            <li>Schedule and provide cleaning services</li>
            <li>Respond to enquiries and communicate regarding bookings</li>
            <li>Process payments and issue invoices</li>
            <li>Improve our services and customer experience</li>
          </ul>

          <h2>Confidentiality</h2>
          <p>Your personal information is treated with strict confidentiality. NG Clean will never sell or rent your information to third parties. Information may only be shared where required by law or for secure payment processing.</p>

          <h2>Respect for Your Privacy</h2>
          <p>Our team understands that your home and workplace are private spaces. Any information observed while carrying out our services will remain confidential and handled with professionalism and respect.</p>

          <h2>Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal information at any time.</p>

          <h2>Contact Us</h2>
          <p>If you have any questions regarding this Privacy Policy, please contact us:</p>
          <ul>
            <li>Phone: <a href="tel:0403711348">0403 711 348</a></li>
            <li>Or use the <Link href="/#contact">contact form</Link> on our website.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
