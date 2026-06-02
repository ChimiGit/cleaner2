import Image from 'next/image';
import { Icon } from './Icon';
import { Stars } from './Stars';
import { NG } from '@/lib/data';

interface HeroProps {
  onBook: () => void;
}

export function Hero({ onBook }: HeroProps) {
  return (
    <section className="hero" id="home">
      <div className="wrap">
        <div className="hero-stage">
          <div className="hero-img">
            <Image src={NG.IMG.hero} alt="NG Clean team cleaning a bright Perth home" fill style={{ objectFit: 'cover' }} priority />
          </div>
          <div className="hero-content">
            <span className="hero-kicker"><span className="dot"></span>{NG.hero.kicker}</span>
            <h1>{NG.hero.title}</h1>
            <p className="hero-sub">{NG.hero.sub}</p>
            <div className="hero-cta">
              <button className="btn btn-primary" onClick={onBook}>
                Book a clean <Icon name="arrow" size={16} className="arr" />
              </button>
              <a className="btn btn-light" href={'tel:' + NG.biz.phoneRaw}>
                <Icon name="phone" size={16} /> Call {NG.biz.phone}
              </a>
            </div>
            <div className="hero-rating">
              <Stars n={5} /><b>5.0</b><span>Loved by Perth homes &amp; businesses</span>
            </div>
          </div>
        </div>
        <div className="hero-strip">
          {['Locally owned & operated', 'Residential & commercial', 'Open 7 days', 'Free, no-obligation quotes'].map((t, i) => (
            <div className="hs-item" key={i}><Icon name="check" size={16} />{t}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
