import Image from 'next/image';
import { Stars } from './Stars';
import { Reveal } from './Reveal';
import { NG } from '@/lib/data';

export function Reviews() {
  return (
    <section className="reviews" id="reviews">
      <div className="wrap">
        <Reveal className="sec-head center">
          <span className="eyebrow"><span className="dot"></span>Reviews</span>
          <h2 className="h-section">Trusted by Perth homes &amp; businesses</h2>
          <p className="lead">Real results, friendly service and spotless attention to detail — every visit.</p>
        </Reveal>
        <div className="rev-grid">
          {NG.reviews.map((r, i) => (
            <Reveal className="rcard" key={i} delay={(i % 4) * 60}>
              <Stars n={r.stars} />
              <p>&ldquo;{r.text}&rdquo;</p>
              <div className="who">
                <Image src={NG.faces[r.faceKey]} alt={r.name} width={42} height={42} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div className="nm">{r.name}</div>
                  <div className="bk">{r.svc}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
