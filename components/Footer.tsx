import Image from 'next/image';
import Link from 'next/link';
import { Icon } from './Icon';
import { NG } from '@/lib/data';

interface FooterProps {
  onBook: () => void;
  base?: string;
}

export function Footer({ onBook, base = '' }: FooterProps) {
  const social: [string, string][] = [['fb', 'Facebook'], ['ig', 'Instagram'], ['in', 'LinkedIn']];
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="brand foot-brandrow">
              <Image className="brand-logo chip" src="/assets/logo.png" alt="NG Clean logo" width={46} height={46} />
              <span className="brand-name" style={{ color: '#fff' }}>NG Clean</span>
            </div>
            <p>Reliable, detail-focused cleaning for homes and businesses across Perth — delivered with care, consistency and professionalism.</p>
            <div className="foot-social">
              {social.map(([ic, lbl]) => (
                <a key={ic} href="#" aria-label={lbl}><Icon name={ic} size={17} /></a>
              ))}
            </div>
          </div>
          <div className="foot-col">
            <h5>Services</h5>
            {NG.services.slice(0, 6).map((s) => (
              <Link key={s.key} href={'/services/' + s.key}>{s.title}</Link>
            ))}
          </div>
          <div className="foot-col">
            <h5>Company</h5>
            <a href={base + '#about'}>About us</a>
            <a href={base + '#checklist'}>What&apos;s included</a>
            <a href={base + '#reviews'}>Reviews</a>
            <a href={base + '#areas'}>Service areas</a>
          </div>
          <div className="foot-col">
            <h5>Contact</h5>
            <a href={'tel:' + NG.biz.phoneRaw}>{NG.biz.phone}</a>
            <span className="foot-static">Mon – Fri: 8am – 5pm</span>
            <span className="foot-static">Sat – Sun: 9am – 5pm</span>
            <span className="foot-static">ABN {NG.biz.abn}</span>
            <button className="btn btn-primary btn-sm" onClick={onBook} style={{ marginTop: 12 }}>Book now</button>
          </div>
        </div>
      </div>
      <div className="foot-wordmark" aria-hidden="true">NG&nbsp;CLEAN</div>
      <div className="wrap">
        <div className="foot-bar">
          <span>© {new Date().getFullYear()} NG Clean · Perth, WA. All rights reserved.</span>
          <span className="fb-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms &amp; Conditions</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
