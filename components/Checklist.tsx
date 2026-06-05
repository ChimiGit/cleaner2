"use client";

import { ChecklistValue, NG } from "@/lib/data";
import { Fragment, useEffect, useState } from "react";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

function Cell({ v }: { v: ChecklistValue }) {
  if (!v)
    return (
      <span className="cl-no">
        <Icon name="close" size={13} />
      </span>
    );
  return (
    <span className="cl-yes">
      <span className="cl-tick">
        <Icon name="check" size={13} />
      </span>
      {typeof v === "string" && <em>{v}</em>}
    </span>
  );
}

interface ChecklistProps {
  highlight?: string | null;
  onBook: () => void;
}

export function Checklist({ highlight, onBook }: ChecklistProps) {
  const [hi, setHi] = useState("vacate");
  useEffect(() => {
    if (highlight) setHi(highlight);
  }, [highlight]);
  const keyOf: Record<string, "r" | "d" | "v"> = {
    regular: "r",
    deep: "d",
    vacate: "v",
  };

  return (
    <section className="checklist" id="checklist">
      <div className="wrap">
        <Reveal className="sec-head center">
          <span className="eyebrow">
            <span className="dot"></span>What's included
          </span>
          <h2 className="h-section">Compare our cleaning packages</h2>
          <p className="lead">
            Choose the package that best suits your needs. Tap a plan to
            highlight exactly what's covered.
          </p>
        </Reveal>

        <Reveal className="cl-wrap">
          <table className="cl-table">
            <thead>
              <tr>
                <th className="cl-corner">Area &amp; tasks</th>
                {NG.plans.map((p) => (
                  <th
                    key={p.key}
                    className={"cl-plan" + (hi === p.key ? " hi" : "")}
                    onClick={() => setHi(p.key)}
                  >
                    <span className="cl-plan-name">{p.label}</span>
                    <span className="cl-plan-sub">{p.sub}</span>
                    {/* {hi === p.key && <span className="cl-tag">Selected</span>} */}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NG.checklist.map((grp, gi) => (
                <Fragment key={"g" + gi}>
                  <tr className="cl-group">
                    <td className="cl-group-head">
                      {grp.area}
                      {grp.note && <span className="cl-gnote">{grp.note}</span>}
                    </td>
                    <td className="cl-group-fill"></td>
                    <td className="cl-group-fill"></td>
                    <td className="cl-group-fill"></td>
                  </tr>
                  {grp.tasks.map((t, ti) => (
                    <tr key={gi + "-" + ti}>
                      <td className="cl-task">{t.t}</td>
                      {NG.plans.map((p) => (
                        <td
                          key={p.key}
                          className={"cl-cell" + (hi === p.key ? " hi" : "")}
                        >
                          <Cell v={t[keyOf[p.key]]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </Reveal>

        <Reveal className="cl-foot">
          <p>
            Not sure which package fits? Tell us about your space and we'll
            recommend the right clean.
          </p>
          <button className="btn btn-primary" onClick={onBook}>
            Get a free quote <Icon name="arrow" size={16} className="arr" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
