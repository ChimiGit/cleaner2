import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions — NG Clean',
  description: 'Terms and conditions for using NG Clean services.',
};

export default function TermsPage() {
  return (
    <div className="policy-page">
      <div className="wrap">
        <div className="policy-back">
          <Link href="/">← Back to home</Link>
        </div>
        <div className="policy-card">
          <h1>Terms &amp; Conditions</h1>
          <p className="policy-updated">Last Updated: June 2026</p>

          <p>Thank you for choosing NG Clean. By booking our services, you agree to the following terms and conditions.</p>

          <h2>1. Bookings</h2>
          <ul>
            <li>Bookings can be made by phone, email, or through our website.</li>
            <li>Clients are responsible for providing accurate information to ensure efficient service delivery.</li>
          </ul>

          <h2>2. Access to Property</h2>
          <ul>
            <li>Clients must provide access to the property at the scheduled time.</li>
            <li>If no access is provided, a re-visit fee may apply.</li>
            <li>Clients must ensure any valuables or fragile items are secured as NG Clean is not responsible for damage or loss.</li>
          </ul>

          <h2>3. Payments</h2>
          <ul>
            <li>Payment is due upon completion of the service unless otherwise agreed.</li>
            <li>Additional work outside the original scope may incur extra charges.</li>
            <li>We accept payments via credit card, bank transfer, or cash.</li>
            <li>Additional services or changes during cleaning may incur extra charges.</li>
          </ul>

          <h2>4. Cancellations and Rescheduling</h2>
          <p>We kindly request at least 24 hours&apos; notice for cancellations or changes to appointments. Late cancellations may be subject to a cancellation fee.</p>

          <h2>5. Satisfaction Guarantee</h2>
          <p>Customer satisfaction is important to us. If you are not completely satisfied with our service, please notify us within 24 hours, and we will make every reasonable effort to address your concerns.</p>

          <h2>6. Health and Safety</h2>
          <p>NG Clean reserves the right to refuse or discontinue services where conditions are unsafe or pose a risk to our staff, clients, or property.</p>

          <h2>7. Damage and Liability</h2>
          <ul>
            <li>While we strive for excellent service, NG Clean is not liable for pre-existing damage or wear and tear.</li>
            <li>Any damage caused directly by our staff due to negligence must be reported within 24 hours.</li>
            <li>We will investigate and, where applicable, compensate for damages fairly.</li>
          </ul>

          <h2>8. Privacy</h2>
          <p>All client information is handled with care and kept confidential in accordance with our <Link href="/privacy">Privacy Policy</Link>.</p>

          <h2>9. Commitment to Excellence</h2>
          <p>At NG Clean, we take pride in delivering reliable, professional, and detail-oriented cleaning services. We are committed to treating every home and workplace with care, respect, and integrity.</p>

          <h2>10. Changes to Terms</h2>
          <p>NG Clean reserves the right to update these Terms at any time. Clients will be notified of significant changes via email or website updates.</p>

          <h2>Governing Law</h2>
          <p>These Terms are governed by the laws of Western Australia. Any disputes will be resolved in accordance with local laws.</p>

          <h2>Contact Us</h2>
          <p>If you have any questions, please reach out:</p>
          <ul>
            <li>Phone: <a href="tel:0403711348">0403 711 348</a></li>
            <li>Or use the <Link href="/#contact">contact form</Link> on our website.</li>
          </ul>

          <p className="policy-ack">By using our services, you acknowledge and agree to these Terms and Conditions. Thank you for trusting NG Clean.</p>
        </div>
      </div>
    </div>
  );
}
