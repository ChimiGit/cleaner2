import Image from 'next/image';
import { Icon } from './Icon';
import { Reveal } from './Reveal';
import { NG } from '@/lib/data';

interface HowItWorksProps {
  onBook: () => void;
}

export function HowItWorks({ onBook }: HowItWorksProps) {
  return (
    <section className="how" id="how">
      <div className="wrap">
        <div className="how-grid">
          <Reveal className="how-media">
            <Image src={NG.IMG.how} alt="NG Clean team at work" fill sizes="100vw" style={{ objectFit: 'cover' }} loading="lazy" />
            <div className="how-float">
              <div className="hf-badge"><Icon name="sparkle" size={20} /></div>
              <div>
                <div className="hf-num">Free</div>
                <div className="hf-lbl">No-obligation quotes</div>
              </div>
            </div>
          </Reveal>

          <Reveal className="how-right" delay={100}>
            <span className="eyebrow dark"><span className="dot"></span>How it works</span>
            <h2 className="h-section" style={{ color: '#fff', marginTop: 16 }}>Spotless in three simple steps</h2>
            <div className="steps">
              {NG.steps.map((s, i) => (
                <div className="step" key={i}>
                  <div className="step-n">{i + 1}</div>
                  <div className="step-tx">
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                    {s.cta && (
                      <button className="btn btn-primary btn-sm" onClick={onBook} style={{ marginTop: 12 }}>
                        Book a clean <Icon name="arrow" size={15} className="arr" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
