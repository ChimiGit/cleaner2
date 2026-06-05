import Image from 'next/image';
import { Icon } from './Icon';
import { Stars } from './Stars';
import { NG } from '@/lib/data';
import { QuoteEstimator, type QuoteData } from './QuoteEstimator';

interface HeroProps {
  onBook: (data?: QuoteData) => void;
}

export function Hero({ onBook }: HeroProps) {
  return (
    <section className="hero" id="home">
      <div className="wrap">
        <div className="hero-stage">
          <div className="hero-img">
            <Image src={NG.IMG.hero} alt="NG Clean team cleaning a bright Perth home" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
          </div>
          <div className="hero-inner">
            <div className="hero-content">
              <span className="hero-kicker"><span className="dot"></span>{NG.hero.kicker}</span>
              <h1>{NG.hero.title}</h1>
              <ul className="hero-sub-list">
                <li>Perth professional cleaning you can trust</li>
                <li>Reliable, detail-focused cleaning for home and business</li>
                <li>Spotless results delivered with care, consistency and professionalism</li>
              </ul>
              <div className="hero-cta">
                <a className="btn btn-light" href={'tel:' + NG.biz.phoneRaw}>
                  <Icon name="phone" size={16} /> Call {NG.biz.phone}
                </a>
                <span className="hero-hours"><Icon name="clock" size={14} />8am – 5pm Mon to Fri</span>
              </div>
              <div className="hero-rating">
                <Stars n={5} /><b>5.0</b><span>Loved by Perth homes &amp; businesses</span>
              </div>
            </div>
            <div className="hero-quote">
              <QuoteEstimator onBook={(data) => onBook(data)} />
            </div>
          </div>
        </div>
        <div className="hero-strip">
          {['Fully Insured', 'National Police Clearance', 'Reliable & Eco-Friendly', 'REA Approved Checklist'].map((t, i) => (
            <div className="hs-item" key={i}><Icon name="check" size={16} />{t}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
