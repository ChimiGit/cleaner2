import Image from 'next/image';
import { Icon } from './Icon';
import { Reveal } from './Reveal';
import { NG } from '@/lib/data';

interface AboutProps {
  onBook: () => void;
}

export function About({ onBook }: AboutProps) {
  return (
    <section className="about" id="about">
      <div className="wrap">
        <div className="about-grid">
          <Reveal>
            <span className="eyebrow"><span className="dot"></span>Our story</span>
            <h2 className="h-section" style={{ marginTop: 18 }}>Cleaning is what<br />we genuinely love</h2>
            <div className="story">
              {NG.story.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="about-chips">
              <span className="ac"><Icon name="home" size={15} />Residential &amp; commercial</span>
              <span className="ac"><Icon name="clock" size={15} />Open 7 days</span>
              <span className="ac"><Icon name="shield" size={15} />ABN registered</span>
            </div>
            <button className="btn btn-primary" onClick={onBook} style={{ marginTop: 26 }}>
              Get a free quote <Icon name="arrow" size={16} className="arr" />
            </button>
          </Reveal>

          <Reveal delay={120}>
            <div className="about-media">
              <div className="pic" style={{ aspectRatio: '4/4' }}>
                <Image src={NG.IMG.about} alt="NG Clean cleaning a kitchen" fill style={{ objectFit: 'cover' }} loading="lazy" />
              </div>
              <div className="trusted">
                <div className="t-ic"><Icon name="sparkle" size={22} /></div>
                <div>
                  <b>Fresh, welcoming &amp; stress-free</b>
                  <span>Reliable, high-quality results — every visit</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
