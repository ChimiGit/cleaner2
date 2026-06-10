"use client";

import { NG } from "@/lib/data";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Icon } from "./Icon";
import type { PricingConfig } from "@/lib/pricing";
import { DEFAULT_PRICING } from "@/lib/pricing";

function closestPrice(table: [number, number, number][], beds: number, baths: number) {
  const exact = table.find(([b, ba]) => b === beds && ba === baths);
  if (exact) return exact[2];
  let best = table[0], bestDist = Infinity;
  for (const row of table) {
    const dist = Math.abs(row[0] - beds) + Math.abs(row[1] - baths);
    if (dist < bestDist) { bestDist = dist; best = row; }
  }
  return best[2];
}

type PricingMode = 'size' | 'hourly';

function calcPrice(
  mode: PricingMode,
  serviceKey: string | null,
  beds: number,
  baths: number,
  freq: string,
  hours: number,
  extraMins: number,
  pricing: PricingConfig,
): { total: number | null } {
  if (mode === 'hourly') {
    const h = hours + extraMins / 60;
    if (serviceKey === 'deep')    return { total: Math.round(h * pricing.deepHourly) };
    if (serviceKey === 'bond')    return { total: Math.round(h * pricing.vacateHourly) };
    if (serviceKey === 'regular') return { total: Math.round(h * (pricing.regularHourly[freq as keyof typeof pricing.regularHourly] ?? pricing.defaultHourly)) };
    return { total: Math.round(h * pricing.defaultHourly) };
  }
  if (serviceKey === 'regular') return { total: closestPrice(pricing.regularTable, beds, baths) };
  if (serviceKey === 'deep')    return { total: closestPrice(pricing.deepTable, beds, baths) };
  if (serviceKey === 'bond')    return { total: closestPrice(pricing.vacateTable, beds, baths) };
  return { total: null };
}

function calcAddonsTotal(selected: Set<string>, carpetRooms: number, addons: PricingConfig['addons']) {
  return addons.reduce((sum, a) => {
    if (!selected.has(a.id)) return sum;
    return sum + (a.id === 'carpet' ? a.price * carpetRooms : a.price);
  }, 0);
}

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  suburb: string;
  entryMethod: string;
  entryOther: string;
  parking: string;
  parkingOther: string;
}

function Stepper({
  label,
  value,
  onChange,
  min = 1,
  max = 9,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="modal-stepper">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          −
        </button>
        <span>{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}

function InlineStepper({
  value,
  onChange,
  min = 1,
  max = 9,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="modal-stepper" style={{ display: 'inline-flex' }}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>−</button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>+</button>
    </div>
  );
}

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  pricing?: PricingConfig;
  initialService?: string | null;
  initialPricingMode?: PricingMode | null;
  initialBeds?: number | null;
  initialBaths?: number | null;
  initialHours?: number | null;
  initialExtraMins?: number;
  initialFrequency?: string | null;
  initialAddons?: string[] | null;
  initialCarpetRooms?: number | null;
}

export function BookingModal({
  open,
  onClose,
  pricing = DEFAULT_PRICING,
  initialService,
  initialPricingMode,
  initialBeds,
  initialBaths,
  initialHours,
  initialExtraMins = 0,
  initialFrequency,
  initialAddons,
  initialCarpetRooms,
}: BookingModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollTop = () => cardRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  const [step, setStep] = useState(0);
  const [service, setService] = useState<string | null>(null);
  const [pricingMode, setPricingMode] = useState<PricingMode>('size');
  const [beds, setBeds] = useState(2);
  const [baths, setBaths] = useState(1);
  const [hours, setHours] = useState(3);
  const [extraMins, setExtraMins] = useState(0);
  const [frequency, setFrequency] = useState<string>("once");
  const [date, setDate] = useState("");
  const [time, setTime] = useState<string | null>(null);
  const [addons, setAddons] = useState<Set<string>>(new Set());
  const [carpetRooms, setCarpetRooms] = useState(1);
  const [svcErr, setSvcErr] = useState(false);
  const [schedErr, setSchedErr] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BookingForm>();

  const nameVal = watch("name", "");
  const svc = NG.services.find((s) => s.key === service);
  const price = useMemo(
    () => calcPrice(pricingMode, service, beds, baths, frequency, hours, extraMins, pricing),
    [pricingMode, service, beds, baths, frequency, hours, extraMins, pricing],
  );
  const addonsTotal = useMemo(() => calcAddonsTotal(addons, carpetRooms, pricing.addons), [addons, carpetRooms, pricing.addons]);
  const grandTotal = price.total !== null ? price.total + addonsTotal : null;
  const hourlyRate = service === 'deep' ? pricing.deepHourly : service === 'bond' ? pricing.vacateHourly : (pricing.regularHourly[frequency as keyof typeof pricing.regularHourly] ?? pricing.defaultHourly);

  const toggleAddon = (id: string) => setAddons(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  useEffect(() => {
    if (open) {
      setStep(initialService ? 1 : 0);
      setService(initialService || null);
      setPricingMode(initialPricingMode ?? 'size');
      setBeds(initialBeds ?? 2);
      setBaths(initialBaths ?? 1);
      setHours(initialHours ?? 3);
      setExtraMins(initialExtraMins);
      setFrequency(initialFrequency || "once");
      setDate("");
      setTime(null);
      setAddons(new Set(initialAddons ?? []));
      setCarpetRooms(initialCarpetRooms ?? 1);
      setSvcErr(false);
      setSchedErr({});
      reset();
    }
  }, [
    open,
    initialService,
    initialPricingMode,
    initialBeds,
    initialBaths,
    initialHours,
    initialExtraMins,
    initialFrequency,
    initialAddons,
    initialCarpetRooms,
    reset,
  ]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const nextStep = () => {
    if (step === 0) {
      if (!service) {
        setSvcErr(true);
        return;
      }
    }
    if (step === 1) {
      const e: Record<string, boolean> = {};
      if (!date) e.date = true;
      if (!time) e.time = true;
      setSchedErr(e);
      if (Object.keys(e).length) return;
    }
    setStep((s) => Math.min(3, s + 1));
    scrollTop();
  };

  const onSubmit = async (data: BookingForm) => {
    setSubmitting(true);
    try {
      await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          service: svc?.title,
          pricingMode,
          beds: pricingMode === 'size' ? beds : null,
          baths: pricingMode === 'size' ? baths : null,
          hours: pricingMode === 'hourly' ? hours + extraMins / 60 : null,
          frequency,
          date,
          time,
          addons: [...addons],
          carpetRooms,
          grandTotal,
          addonsTotal,
        }),
      });
      setStep(3);
    } finally {
      setSubmitting(false);
    }
  };

  const titles = [
    { h: "What can we clean?", p: "Pick the service that fits your space." },
    { h: "Schedule your visit", p: "Tell us the size and when works for you." },
    {
      h: "Your details",
      p: "Where should our team head, and how do we reach you?",
    },
    { h: "Booking requested", p: "" },
  ];
  const t = titles[step];
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div
      className={"modal" + (open ? " open" : "")}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card" role="dialog" aria-modal="true" ref={cardRef}>
        <div className="modal-head">
          <div>
            <h3>{t.h}</h3>
            {t.p && <p>{t.p}</p>}
          </div>
          <button className="modal-x" onClick={onClose} aria-label="Close">
            <Icon name="close" size={18} />
          </button>
        </div>

        {step < 3 && (
          <div className="steps-bar">
            {[0, 1, 2].map((i) => (
              <i key={i} className={i <= step ? "on" : ""}></i>
            ))}
          </div>
        )}

        <div className="modal-body">
          {step === 0 && (
            <div className="opt-grid">
              {NG.services.map((s) => (
                <button
                  key={s.key}
                  className={"opt" + (service === s.key ? " sel" : "")}
                  onClick={() => {
                    setService(s.key);
                    setSvcErr(false);
                    setStep(1);
                    scrollTop();
                  }}
                >
                  <span className="opt-ic">
                    <Icon name={s.icon} size={22} />
                  </span>
                  <span>
                    <span className="opt-tt">{s.title}</span>
                    <br />
                    <span className="opt-ds">
                      {s.desc.split(" ").slice(0, 7).join(" ")}…
                    </span>
                  </span>
                  <span className="opt-pr">{s.cat}</span>
                </button>
              ))}
              {svcErr && (
                <div className="msg" style={{ color: "#c5412f" }}>
                  Please choose a service.
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <>
              {svc && (
                <div className="modal-svc-badge">
                  <span className="modal-svc-ic"><Icon name={svc.icon} size={15} /></span>
                  <span>{svc.title}</span>
                  <button className="modal-svc-change" onClick={() => { setStep(0); scrollTop(); }}>Change</button>
                </div>
              )}
              <div className="qe-tabs" style={{ marginBottom: 14 }}>
                <button className={'qe-tab' + (pricingMode === 'size' ? ' active' : '')} onClick={() => setPricingMode('size')}>By Size</button>
                <button className={'qe-tab' + (pricingMode === 'hourly' ? ' active' : '')} onClick={() => setPricingMode('hourly')}>Hourly</button>
              </div>

              {pricingMode === 'size' ? (
                <div className="f-row">
                  <Stepper label="Bedrooms" value={beds} onChange={setBeds} min={0} max={9} />
                  <Stepper label="Bathrooms" value={baths} onChange={setBaths} min={0} max={6} />
                </div>
              ) : (
                <div className="f-row">
                  <Stepper label="Hours" value={hours} onChange={setHours} min={2} max={8} />
                  <div className="field">
                    <label>Extra mins</label>
                    <select
                      className="qe-select"
                      value={extraMins}
                      onChange={(e) => setExtraMins(Number(e.target.value))}
                    >
                      <option value={0}>None</option>
                      {[5,10,15,20,25,30,35,40,45,50,55].map(m => (
                        <option key={m} value={m}>+{m} min</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              <div className="field">
                <label>Frequency</label>
                <div className="chips">
                  {[
                    { id: "once", label: "Once Off" },
                    { id: "weekly", label: "Weekly" },
                    { id: "fortnightly", label: "Fortnightly" },
                    { id: "monthly", label: "Monthly" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      className={"chip" + (frequency === f.id ? " sel" : "")}
                      onClick={() => setFrequency(f.id)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Add-ons</label>
                <div className="qe-addons grid">
                  {pricing.addons.map((a) => {
                    const on = addons.has(a.id);
                    return (
                      <div key={a.id} className="qe-addon-row">
                        <button
                          type="button"
                          className={'qe-addon' + (on ? ' active' : '')}
                          onClick={() => toggleAddon(a.id)}
                        >
                          <span className="qe-addon-check">{on ? '✓' : '+'}</span>
                          <span className="qe-addon-label">{a.label}</span>
                          <span className="qe-addon-price">${a.price}{a.unit}</span>
                        </button>
                        {on && a.id === 'carpet' && (
                          <div className="qe-carpet-rooms">
                            <span>Rooms:</span>
                            <InlineStepper value={carpetRooms} onChange={setCarpetRooms} min={1} max={10} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={"field" + (schedErr.date ? " err" : "")}>
                <label>Preferred date</label>
                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                />
                {schedErr.date && <div className="msg">Pick a date.</div>}
              </div>
              <div className={"field" + (schedErr.time ? " err" : "")}>
                <label>Preferred time</label>
                <div className="chips">
                  {NG.times.map((s) => (
                    <button
                      key={s}
                      className={"chip" + (time === s ? " sel" : "")}
                      onClick={() => setTime(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {schedErr.time && <div className="msg">Pick a time slot.</div>}
              </div>
            </>
          )}

          {step === 2 && (
            <form
              id="booking-form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="f-row">
                <div className={"field" + (errors.name ? " err" : "")}>
                  <label>Full name</label>
                  <input
                    {...register("name", { required: "Required" })}
                    placeholder="Jane Doe"
                  />
                  {errors.name && (
                    <div className="msg">{errors.name.message}</div>
                  )}
                </div>
                <div className={"field" + (errors.phone ? " err" : "")}>
                  <label>Phone</label>
                  <div style={{ display: 'flex', alignItems: 'stretch' }}>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '0 12px', background: '#f4f6f4',
                      border: '1.5px solid var(--line)', borderRight: 'none',
                      borderRadius: 'var(--r) 0 0 var(--r)',
                      fontSize: 14, fontWeight: 600, color: 'var(--ink)',
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}>
                      🇦🇺 +61
                    </span>
                    <input
                      {...register("phone", {
                        required: "Required",
                        validate: (v) =>
                          v.replace(/\D/g, "").length >= 8 ||
                          "Enter a valid Australian number",
                      })}
                      placeholder="4xx xxx xxx"
                      style={{ borderRadius: '0 var(--r) var(--r) 0' }}
                      inputMode="tel"
                    />
                  </div>
                  {errors.phone && (
                    <div className="msg">{errors.phone.message}</div>
                  )}
                </div>
              </div>
              <div className={"field" + (errors.email ? " err" : "")}>
                <label>Email</label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Required",
                    pattern: {
                      value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                      message: "Valid email needed",
                    },
                  })}
                  placeholder="jane@email.com"
                />
                {errors.email && (
                  <div className="msg">{errors.email.message}</div>
                )}
              </div>
              <div className="f-row">
                <div className={"field" + (errors.address ? " err" : "")}>
                  <label>Address</label>
                  <input
                    {...register("address", { required: "Required" })}
                    placeholder="123 Maple Ave, Apt 4"
                  />
                  {errors.address && (
                    <div className="msg">{errors.address.message}</div>
                  )}
                </div>
                <div className={"field" + (errors.suburb ? " err" : "")}>
                  <label>Suburb</label>
                  <input
                    {...register("suburb", { required: "Required" })}
                    placeholder="Nollamara"
                  />
                  {errors.suburb && (
                    <div className="msg">{errors.suburb.message}</div>
                  )}
                </div>
              </div>
              <div className={"field" + (errors.entryMethod ? " err" : "")}>
                <label>How can we get in? <span style={{ color: '#c5412f' }}>*</span></label>
                <select {...register("entryMethod", { validate: v => !!v || "Please select an option" })}>
                  <option value="">Select…</option>
                  <option>I will be home</option>
                  <option>I will leave a key</option>
                  <option>I can provide lockbox access</option>
                  <option>I can provide access code</option>
                  <option>Other</option>
                </select>
                {errors.entryMethod && (
                  <div className="msg">{errors.entryMethod.message}</div>
                )}
              </div>
              {watch("entryMethod") === "Other" && (
                <div className={"field" + (errors.entryOther ? " err" : "")}>
                  <label>Please describe</label>
                  <input
                    {...register("entryOther", { required: "Required" })}
                    placeholder="Describe how we can get in…"
                  />
                  {errors.entryOther && (
                    <div className="msg">{errors.entryOther.message}</div>
                  )}
                </div>
              )}
              <div className={"field" + (errors.parking ? " err" : "")}>
                <label>Where can we park? <span style={{ color: '#c5412f' }}>*</span></label>
                <select {...register("parking", { validate: v => !!v || "Please select an option" })}>
                  <option value="">Select…</option>
                  <option>Park in the driveway</option>
                  <option>Street parking</option>
                  <option>Paid parking is available</option>
                  <option>Other</option>
                </select>
                {errors.parking && (
                  <div className="msg">{errors.parking.message}</div>
                )}
              </div>
              {watch("parking") === "Other" && (
                <div className={"field" + (errors.parkingOther ? " err" : "")}>
                  <label>Please describe</label>
                  <input
                    {...register("parkingOther", { required: "Required" })}
                    placeholder="Describe parking details…"
                  />
                  {errors.parkingOther && (
                    <div className="msg">{errors.parkingOther.message}</div>
                  )}
                </div>
              )}
            </form>
          )}

          {step === 3 && (
            <div className="success">
              <div className="sk">
                <Icon name="check" size={34} />
              </div>
              <h3 style={{ margin: "0 0 6px", fontSize: 22 }}>
                Thanks, {nameVal.split(" ")[0] || "friend"}!
              </h3>
              <p className="lead" style={{ marginBottom: 18 }}>
                We&apos;ve received your request. NG Clean will confirm your
                booking and free quote by phone shortly.
              </p>
              <div className="summary" style={{ textAlign: "left" }}>
                <div className="sr">
                  <span>Service</span>
                  <b>{svc ? svc.title : "—"}</b>
                </div>
                {pricingMode === 'size' ? (
                  <>
                    <div className="sr"><span>Bedrooms</span><b>{beds}</b></div>
                    <div className="sr"><span>Bathrooms</span><b>{baths}</b></div>
                  </>
                ) : (
                  <div className="sr"><span>Duration</span><b>{extraMins > 0 ? `${hours}h ${extraMins}m` : `${hours}h`} · ${hourlyRate}/hr</b></div>
                )}
                <div className="sr">
                  <span>Frequency</span>
                  <b>
                    {{
                      once: "Once Off",
                      weekly: "Weekly",
                      fortnightly: "Fortnightly",
                      monthly: "Monthly",
                    }[frequency] ?? frequency}
                  </b>
                </div>
                {addons.size > 0 && (
                  <div className="sr">
                    <span>Add-ons</span>
                    <b style={{ textAlign: 'right' }}>
                      {pricing.addons.filter(a => addons.has(a.id))
                        .map(a => a.id === 'carpet' ? `${a.label} (${carpetRooms} rooms)` : a.label)
                        .join(', ')}
                    </b>
                  </div>
                )}
                <div className="sr">
                  <span>Date &amp; time</span>
                  <b>
                    {date || "—"} · {time || "—"}
                  </b>
                </div>
                <div className="sr">
                  <span>Estimate</span>
                  <b>
                    {grandTotal !== null
                      ? `$${grandTotal}${addonsTotal > 0 ? ` (incl. $${addonsTotal} add-ons)` : ''}`
                      : 'Quote by phone'}
                  </b>
                </div>
                <div className="sr">
                  <span>Entry</span>
                  <b>{(watch as (f: string) => string)("entryMethod") || "—"}</b>
                </div>
                <div className="sr">
                  <span>Parking</span>
                  <b>{(watch as (f: string) => string)("parking") || "—"}</b>
                </div>
                <div className="sr">
                  <span>Quote</span>
                  <b>Confirmed by phone</b>
                </div>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: "100%" }}
                onClick={onClose}
              >
                Done
              </button>
            </div>
          )}
        </div>

        {step > 0 && step < 3 && (
          <div className="modal-body" style={{ paddingTop: 16 }}>
            {step >= 1 && service && (
              <div className="modal-price-strip">
                <div className="modal-price-strip-left">
                  <span className="modal-price-label">Estimated total</span>
                  {grandTotal !== null ? (
                    <span className="modal-price-value">${grandTotal}</span>
                  ) : (
                    <span className="modal-price-value" style={{ fontSize: 16 }}>Quote by phone</span>
                  )}
                </div>
                <span className="modal-price-note" style={{ textAlign: 'right' }}>
                  {pricingMode === 'hourly'
                    ? `${extraMins > 0 ? `${hours}h ${extraMins}m` : `${hours}h`} · $${hourlyRate}/hr${addonsTotal > 0 ? ` + $${addonsTotal} add-ons` : ''}`
                    : grandTotal !== null && addonsTotal > 0
                      ? `Incl. $${addonsTotal} add-ons · guide price`
                      : 'Guide price · confirmed by phone'}
                </span>
              </div>
            )}
            <div className="modal-foot">
              {step > 0 ? (
                <button
                  className="btn btn-ghost"
                  onClick={() => { setStep((s) => Math.max(0, s - 1)); scrollTop(); }}
                >
                  <Icon name="arrowL" size={16} /> Back
                </button>
              ) : (
                <span />
              )}
              {step === 2 ? (
                <button
                  className="btn btn-primary"
                  form="booking-form"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Confirming…" : "Confirm booking"}{" "}
                  <Icon name="arrow" size={16} className="arr" />
                </button>
              ) : (
                <button className="btn btn-primary" onClick={nextStep}>
                  Continue <Icon name="arrow" size={16} className="arr" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
