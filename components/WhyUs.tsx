import { Icon } from './Icon';
import { Reveal } from './Reveal';
import { NG } from '@/lib/data';

export function WhyUs() {
  return (
    <section className="why" id="why">
      <div className="wrap">
        <Reveal className="sec-head center">
          <span className="eyebrow"><span className="dot"></span>Why NG Clean</span>
          <h2 className="h-section">Cleaning done with genuine care</h2>
          <p className="lead">More than a service — a local team that takes pride in making every space fresh, welcoming and stress-free.</p>
        </Reveal>
        <div className="why-grid">
          {NG.why.map((w, i) => (
            <Reveal className="why-card" key={i} delay={i * 70}>
              <span className="why-ic"><Icon name={w.icon} size={22} /></span>
              <h3>{w.t}</h3>
              <p>{w.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
