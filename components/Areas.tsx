import { NG } from "@/lib/data";
import { Icon } from "./Icon";
import { PerthServiceMap } from "./PerthServiceMap";
import { Reveal } from "./Reveal";

function WAInset() {
  return (
    <svg viewBox="0 0 100 110" className="wa-svg" aria-hidden="true">
      <path
        d="M40 4 L92 5 L93 50 L86 70 L78 86 L62 104 L40 106 L34 96 L24 92 L12 78 L8 58 L6 40 L10 22 L20 10 Z"
        fill="var(--green-soft)"
        stroke="var(--navy)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle
        cx="34"
        cy="86"
        r="6"
        fill="var(--green)"
        stroke="#fff"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export function Areas() {
  const A = NG.area;
  return (
    <section className="areas" id="areas">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">
            <span className="dot"></span>Service area
          </span>
          <h2 className="h-section" style={{ marginTop: 16 }}>
            Cleaning across greater Perth
          </h2>
        </Reveal>

        <Reveal className="area-card" delay={80}>
          <div className="area-rail">
            <div className="ar-head">
              <span className="ar-pin">
                <Icon name="pin" size={18} />
              </span>
              <div>
                <span className="ar-kicker">Based in</span>
                <b>{A.center}</b>
              </div>
            </div>

            <div className="ar-radius">
              <span className="arr-ic">
                <Icon name="pin" size={22} />
              </span>
              <div>
                <b>{A.radius}</b>
                <span>Service radius</span>
              </div>
            </div>

            <div className="ar-serve">
              <span className="ar-serve-h">Who we clean for</span>
              {A.serve.map((s) => (
                <div className="ar-serve-row" key={s.t}>
                  <span className="ars-ic">
                    <Icon name={s.ic} size={16} />
                  </span>
                  {s.t}
                </div>
              ))}
            </div>

            <div className="ar-foot">
              <span className="arf-ic">
                <Icon name="pin" size={16} />
              </span>
              Proudly serving within 25&nbsp;km of Nollamara
            </div>
          </div>

          <div className="area-map">
            <PerthServiceMap />
          </div>
        </Reveal>

        <Reveal className="area-cta" delay={120}>
          <p>
            Don&apos;t see your suburb? Chances are we still cover it — just
            ask.
          </p>
          <a className="btn btn-dark" href={"tel:" + NG.biz.phoneRaw}>
            <Icon name="phone" size={16} /> Check your suburb
          </a>
        </Reveal>
      </div>
    </section>
  );
}
