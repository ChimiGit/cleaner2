const px = (id: number, w?: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w || 1100}`;
const face = (g: string, n: number) => `https://randomuser.me/api/portraits/${g}/${n}.jpg`;

const Y = 1 as const;
const N = 0 as const;

export type ChecklistValue = 0 | 1 | string;

export const NG = {
  biz: {
    name: 'NG Clean',
    phone: '0403 711 348',
    phoneRaw: '0403711348',
    abn: '61 703 572 412',
    city: 'Perth',
    hours: [
      { d: 'Monday – Friday', t: '8am – 5pm' },
      { d: 'Saturday – Sunday', t: '9am – 5pm' },
    ],
  },

  IMG: {
    hero: px(1643383, 1500),
    about: '/assets/cleaning1.png',
    how: px(6195274, 1300),
    cta: px(6197122, 1500),
    svc: {
      bond: '/assets/End of Lease Bond Cleaning.png',
      deep: px(4239035, 900),
      carpet: '/assets/Carpet Cleaning.jpg',
      oven: '/assets/Oven Cleaning.png',
      window: '/assets/Window Cleaning.jpg',
      regular: '/assets/Regular Residential Cleaning.png',
      office: '/assets/Office Cleaning.png',
      airbnb: px(4099354, 900),
      school: px(8613089, 900),
    },
  },

  faces: {
    a: face('women', 65),
    b: face('men', 32),
    c: face('women', 44),
    d: face('men', 51),
    e: face('women', 12),
  } as Record<string, string>,

  nav: [
    { label: 'Services', id: 'services' },
    { label: 'Checklist', id: 'checklist' },
    { label: 'About', id: 'about' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'Areas', id: 'areas' },
    { label: 'Contact', id: 'contact' },
  ],

  hero: {
    kicker: 'Perth · Residential & Commercial',
    title: 'Perth professional cleaning you can trust',
    sub: 'Reliable, detail-focused cleaning for home and business. Spotless results delivered with care, consistency and professionalism.',
  },

  why: [
    { icon: 'spark',  t: 'Premium Product', d: 'Top quality you can trust, crafted for excellence.' },
    { icon: 'shield', t: 'Fully Equipped', d: 'Complete with advanced tools and everything needed.' },
    { icon: 'check',  t: 'Meticulous Result', d: 'Attention to every detail for a flawless finish.' },
    { icon: 'leaf',   t: 'Customized Cleaning & Satisfaction Guarantee', d: 'Tailored to your needs — your satisfaction is our promise. We\'ve got you covered.' },
  ],

  story: [
    'Welcome to NG Clean. For us, cleaning has always been more than just a job — it’s something we genuinely enjoy and take pride in. After many years cleaning for renowned companies, we saw how much a clean space improves people’s comfort, confidence and peace of mind.',
    'Seeing the happiness on our clients’ faces inspired us to start our own business and bring that same care and dedication to our local community. For us, cleaning is therapeutic, mindful work that lets us make a positive difference in people’s everyday lives.',
    'We are committed to providing reliable, high-quality cleaning with attention to detail, professionalism and care — helping homes and workplaces feel fresh, welcoming and stress-free.',
  ],

  services: [
    { key: 'bond', img: 'bond' as const, icon: 'home', cat: 'Residential', checklist: 'vacate',
      title: 'End of Lease / Bond Cleaning',
      desc: 'Moving out? Our detailed end of lease cleaning helps you leave the property spotless and inspection-ready, giving you the best chance of getting your full bond back.' },
    { key: 'deep', img: 'deep' as const, icon: 'sparkle', cat: 'Residential', checklist: 'deep',
      title: 'Deep Cleaning',
      desc: 'Our deep cleaning service targets hidden dirt, grime, and hard-to-reach areas for a complete top-to-bottom clean. Perfect for spring cleans or homes needing extra attention.' },
    { key: 'carpet', img: 'carpet' as const, icon: 'leaf', cat: 'Residential', checklist: null,
      title: 'Carpet Cleaning',
      desc: 'Refresh your carpets with our professional carpet cleaning service. We remove dirt, stains, and odours, leaving your carpets fresh, clean, and looking like new again.' },
    { key: 'oven', img: 'oven' as const, icon: 'spark', cat: 'Residential', checklist: null,
      title: 'Oven Cleaning',
      desc: 'Bring your oven back to life with our thorough oven cleaning service. We remove grease, burnt residue, and stubborn buildup to leave your oven sparkling clean and fresh.' },
    { key: 'window', img: 'window' as const, icon: 'window', cat: 'Residential', checklist: 'deep',
      title: 'Window Cleaning',
      desc: 'Enjoy crystal-clear windows with our professional window cleaning service. We clean interior and exterior glass surfaces for a streak-free shine and brighter space.' },
    { key: 'regular', img: 'regular' as const, icon: 'home', cat: 'Residential', checklist: 'regular',
      title: 'Regular Residential Cleaning',
      desc: 'Keep your home fresh and tidy with our regular residential cleaning service. We provide reliable weekly, fortnightly, or monthly cleaning tailored to your lifestyle and needs.' },
    { key: 'office', img: 'office' as const, icon: 'building', cat: 'Commercial', checklist: null,
      title: 'Office Cleaning',
      desc: 'Create a clean and productive workplace with our office cleaning service. We deliver reliable and professional cleaning solutions to keep your office hygienic, organised, and welcoming.' },
    { key: 'airbnb', img: 'airbnb' as const, icon: 'bed', cat: 'Commercial', checklist: null,
      title: 'Airbnb Cleaning',
      desc: 'Keep your Airbnb guest-ready with our reliable cleaning service. We ensure every room is spotless, refreshed, and welcoming, helping you maintain excellent guest reviews and a professional presentation.' },
    { key: 'school', img: 'school' as const, icon: 'building', cat: 'Commercial', checklist: null,
      title: 'School / Childcare Cleaning',
      desc: 'Safe, thorough cleaning for schools and childcare centres. We use child-friendly products to maintain a hygienic, healthy environment for students and staff.' },
  ],

  steps: [
    { tag: 'Step 1', title: 'Get a free quote', desc: 'Call us or send a quick message with your space and needs — we’ll give you a clear, no-obligation quote.' },
    { tag: 'Step 2', title: 'We arrive & get to work', desc: 'Our team arrives on time with everything needed and cleans to a consistent, detail-focused standard.', cta: true },
    { tag: 'Step 3', title: 'Relax & enjoy', desc: 'Sit back and enjoy a fresh, welcoming, stress-free space — inspection-ready when you need it.' },
  ],

  plans: [
    { key: 'regular', label: 'Regular Clean', sub: 'Weekly · fortnightly · monthly' },
    { key: 'deep', label: 'Deep Clean', sub: 'Top-to-bottom refresh' },
    { key: 'vacate', label: 'Vacate / Bond', sub: 'Inspection-ready' },
  ],

  checklist: [
    { area: 'All areas', tasks: [
      { t: 'General dusting of surfaces', r: Y, d: Y, v: Y },
      { t: 'Vacuum & mop floors', r: Y, d: Y, v: Y },
      { t: 'Light switch wipe down', r: Y, d: 'Surrounding', v: 'Surrounding' },
      { t: 'Empty bins', r: Y, d: Y, v: Y },
      { t: 'Door handles cleaned', r: Y, d: Y, v: Y },
      { t: 'Wall spot clean', r: N, d: N, v: 'Up to 5' },
    ]},
    { area: 'Bedroom & living', tasks: [
      { t: 'Dust furniture & surfaces', r: Y, d: Y, v: Y },
      { t: 'Wipe mirrors & glass', r: Y, d: Y, v: Y },
      { t: 'Upholstery', r: 'Dusted', d: 'Vacuumed', v: N },
      { t: 'Door frames & knobs', r: N, d: Y, v: Y },
      { t: 'Air-con & air vents cleaned', r: N, d: Y, v: Y },
      { t: 'Remove cobwebs', r: N, d: Y, v: Y },
      { t: 'Clean inside wardrobes', r: N, d: N, v: Y },
      { t: 'Fixtures wiped & cleaned', r: N, d: N, v: Y },
    ]},
    { area: 'Bathroom', tasks: [
      { t: 'Clean toilet', r: Y, d: Y, v: Y },
      { t: 'Shower screen & tiles', r: 'Wiped', d: 'Scrubbed', v: 'Scrubbed' },
      { t: 'Clean sink & vanity', r: Y, d: Y, v: Y },
      { t: 'Bathtub cleaned & rinsed', r: Y, d: Y, v: Y },
      { t: 'Exhaust fans & vents dusted', r: N, d: Y, v: Y },
      { t: 'Tile & grout treatment', r: N, d: Y, v: Y },
    ]},
    { area: 'Kitchen', tasks: [
      { t: 'Wipe benchtops & splashback', r: Y, d: Y, v: Y },
      { t: 'Clean sink & taps', r: Y, d: Y, v: Y },
      { t: 'Exterior cupboard wipe', r: Y, d: Y, v: Y },
      { t: 'Interior cupboards (if emptied)', r: N, d: Y, v: Y },
      { t: 'Clean stovetop', r: 'Degrease', d: 'Detailed', v: 'Detailed' },
      { t: 'Clean inside oven', r: N, d: N, v: Y },
      { t: 'Inside cupboards & drawers', r: N, d: N, v: Y },
      { t: 'Rangehood degreased & filter', r: N, d: Y, v: Y },
    ]},
    { area: 'Laundry', tasks: [
      { t: 'Wipe surfaces', r: Y, d: Y, v: Y },
      { t: 'Clean tap & sink area', r: Y, d: Y, v: Y },
      { t: 'Washing machine surface wiped', r: Y, d: Y, v: Y },
      { t: 'Clean inside cabinets', r: N, d: N, v: Y },
    ]},
    { area: 'Windows', note: 'Interior detailing included with End of Lease', tasks: [
      { t: 'Interior window clean', r: N, d: N, v: Y },
      { t: 'Window tracks detailed', r: N, d: N, v: Y },
      { t: 'Glass sliding doors cleaned', r: N, d: Y, v: Y },
      { t: 'Cobwebs around windows', r: N, d: Y, v: Y },
    ]},
    { area: 'Extras / add-ons', note: 'Available on request · included where required for End of Lease', tasks: [
      { t: 'Carpet steam clean / upholstery', r: N, d: N, v: Y },
      { t: 'Blinds wiped', r: N, d: N, v: Y },
      { t: 'Wall spot cleaning', r: N, d: N, v: Y },
      { t: 'Deep wall clean', r: N, d: N, v: Y },
      { t: 'Alfresco / patio & balcony', r: N, d: N, v: Y },
      { t: 'Garage sweep & cobweb removal', r: N, d: N, v: Y },
      { t: 'Fridge detailed', r: N, d: N, v: Y },
      { t: 'Microwave', r: N, d: N, v: Y },
    ]},
  ] as Array<{ area: string; note?: string; tasks: Array<{ t: string; r: ChecklistValue; d: ChecklistValue; v: ChecklistValue }> }>,

  reviews: [
    { name: 'Rebecca M.', faceKey: 'a', stars: 5, svc: 'End of Lease Clean',
      text: 'Got my full bond back with no issues at all. The property was spotless and the team was so thorough — every track, vent and skirting board done.' },
    { name: 'Daniel K.', faceKey: 'b', stars: 5, svc: 'Regular Residential',
      text: 'We have NG Clean fortnightly and the house always feels brand new afterwards. Reliable, friendly and genuinely care about the details.' },
    { name: 'Priya S.', faceKey: 'c', stars: 5, svc: 'Office Cleaning',
      text: 'Our office has never looked better. Professional, consistent and easy to deal with — our staff notice the difference every morning.' },
    { name: 'Tom & Ana', faceKey: 'd', stars: 5, svc: 'Airbnb Turnover',
      text: 'They keep our Airbnb guest-ready every single turnover. Our reviews mention how clean the place is constantly. Couldn’t recommend more.' },
  ],

  area: {
    center: 'Nollamara, WA',
    radius: '25 KM',
    serve: [
      { ic: 'home', t: 'Homes' },
      { ic: 'building', t: 'Offices & Commercial' },
      { ic: 'cap', t: 'Schools & Childcare' },
      { ic: 'dumbbell', t: 'Gyms & Fitness' },
      { ic: 'bed', t: 'Airbnb Cleaning' },
    ],
    pins: [
      { n: 'Landsdale', x: 30, y: 9 }, { n: 'Darch', x: 30, y: 15 }, { n: 'Madeley', x: 31, y: 21 }, { n: 'Alexander Heights', x: 33, y: 27 },
      { n: 'Kingsley', x: 56, y: 10 }, { n: 'Greenwood', x: 58, y: 16 }, { n: 'Warwick', x: 59, y: 22 }, { n: 'Ellenbrook', x: 80, y: 24 },
      { n: 'Mirrabooka', x: 31, y: 35 }, { n: 'Girrawheen', x: 50, y: 33 }, { n: 'Wangara', x: 68, y: 33 },
      { n: 'Westminster', x: 33, y: 42 }, { n: 'Marangaroo', x: 46, y: 38 }, { n: 'Malaga', x: 69, y: 41 },
      { n: 'Balga', x: 35, y: 49 }, { n: 'Ballajura', x: 60, y: 45 }, { n: 'Dianella', x: 41, y: 57 },
      { n: 'Yokine', x: 21, y: 50 }, { n: 'Tuart Hill', x: 19, y: 56 }, { n: 'Osborne Park', x: 18, y: 62 },
      { n: 'Innaloo', x: 16, y: 68 }, { n: 'Doubleview', x: 15, y: 74 }, { n: 'Karrinyup', x: 17, y: 80 },
      { n: 'Scarborough', x: 13, y: 86 }, { n: 'Trigg', x: 12, y: 92 },
      { n: 'Morley', x: 76, y: 52 }, { n: 'Noranda', x: 80, y: 58 }, { n: 'Beechboro', x: 83, y: 64 },
      { n: 'Bassendean', x: 85, y: 70 }, { n: 'Bayswater', x: 80, y: 76 }, { n: 'Ashfield', x: 84, y: 81 },
      { n: 'Guildford', x: 88, y: 84 }, { n: 'Midland', x: 86, y: 90 },
      { n: 'North Perth', x: 37, y: 82 }, { n: 'Leederville', x: 36, y: 88 }, { n: 'Mount Hawthorn', x: 27, y: 93 },
      { n: 'West Perth', x: 40, y: 92 }, { n: 'Perth CBD', x: 50, y: 84 },
      { n: 'Highgate', x: 59, y: 82 }, { n: 'East Perth', x: 64, y: 88 }, { n: 'Victoria Park', x: 67, y: 92 }, { n: 'Burswood', x: 61, y: 93 },
    ],
  },

  contactBlurbs: [
    'We provide reliable and professional cleaning services tailored to your needs. Contact us today for a free quote.',
  ],

  details: {
    bond: {
      tagline: 'Inspection-ready, bond-back cleaning',
      intro: 'Moving out? Our detailed end of lease cleaning helps you leave the property spotless and inspection-ready, giving you the best chance of getting your full bond back.',
      includes: [
        'Full interior detail of every room', 'Inside oven, rangehood & stovetop degreased',
        'Inside & outside of all cupboards and drawers', 'Bathrooms descaled — showers, tiles, grout & toilets',
        'Interior windows, tracks & sills', 'Skirting boards, door frames & switches wiped',
        'Marks spot-cleaned from walls', 'Floors vacuumed & mopped throughout',
      ],
      facts: [
        { ic: 'user', label: 'Best for', value: 'Renters & property managers' },
        { ic: 'clock', label: 'Typical duration', value: '3–8 hours by size' },
        { ic: 'shield', label: 'Peace of mind', value: 'Bond-back re-clean on request' },
      ],
      faqs: [
        { q: 'Do you guarantee my bond back?', a: 'We clean to a detailed end-of-lease standard. If your agent flags something covered in our scope, we’ll return to re-clean those areas — just let us know within your agent’s inspection window.' },
        { q: 'Do you clean carpets too?', a: 'Yes — professional carpet steam cleaning is available as an add-on and is often required by leases. Mention it when you book and we’ll include it in your quote.' },
        { q: 'Should the property be empty?', a: 'Ideally yes. An empty property lets us reach inside cupboards, behind appliances and every corner for the most thorough result.' },
      ],
    },
    deep: {
      tagline: 'A complete top-to-bottom refresh',
      intro: 'Our deep cleaning service targets hidden dirt, grime, and hard-to-reach areas for a complete top-to-bottom clean. Perfect for spring cleans or homes needing extra attention.',
      includes: [
        'Detailed dusting including skirting & ledges', 'Air vents, fans & light fittings cleaned',
        'Cobwebs removed throughout', 'Kitchen detailed — splashback, rangehood & exterior cupboards',
        'Bathrooms scrubbed & descaled', 'Behind and under accessible furniture',
        'Glass, mirrors & sliding doors', 'Floors vacuumed & mopped throughout',
      ],
      facts: [
        { ic: 'home', label: 'Best for', value: 'Spring cleans & fresh starts' },
        { ic: 'clock', label: 'Typical duration', value: '3–6 hours by size' },
        { ic: 'leaf', label: 'Products', value: 'Eco-friendly & family-safe' },
      ],
      faqs: [
        { q: 'How is this different from a regular clean?', a: 'A deep clean covers everything in a regular clean plus the detail work — vents, skirting, behind furniture, descaling and more. It’s the ideal first clean before switching to a regular schedule.' },
        { q: 'How often should I book one?', a: 'Most homes benefit from a deep clean every 3–6 months, or before/after events, guests or moving.' },
        { q: 'Can you focus on specific rooms?', a: 'Absolutely. Tell us your priorities and we’ll tailor the clean to where it matters most to you.' },
      ],
    },
    carpet: {
      tagline: 'Carpets fresh, clean & like new',
      intro: 'Carpets trap dirt, allergens and odours over time. Our professional carpet cleaning lifts deep-set grime and stubborn stains, leaving your carpets visibly brighter, softer underfoot and smelling fresh — with fast drying so you’re back to normal quickly.',
      includes: [
        'Pre-vacuum & fibre inspection', 'Targeted stain & spot treatment',
        'Hot-water extraction deep clean', 'Odour-neutralising deodorise',
        'High-traffic lane restoration', 'Fast-dry finishing pass',
        'Upholstery & rugs (on request)', 'Pet-safe, low-residue solutions',
      ],
      facts: [
        { ic: 'leaf', label: 'Best for', value: 'Stains, odours & allergens' },
        { ic: 'clock', label: 'Drying time', value: '~2–4 hours' },
        { ic: 'shield', label: 'Safe for', value: 'Kids & pets' },
      ],
      faqs: [
        { q: 'How long until I can walk on them?', a: 'Carpets are usually touch-dry within 2–4 hours depending on airflow and humidity. We recommend keeping foot traffic light until fully dry.' },
        { q: 'Will old stains come out?', a: 'We treat stains with targeted solutions and remove the vast majority. Some set-in or dye-based stains may lighten rather than vanish — we’ll always tell you upfront.' },
        { q: 'Do you clean rugs and sofas?', a: 'Yes, upholstery and rugs can be added to your booking. Just let us know the pieces and we’ll quote them in.' },
      ],
    },
    oven: {
      tagline: 'A sparkling, grease-free oven',
      intro: 'Baked-on grease and burnt residue don’t just look bad — they affect how your food tastes and how efficiently your oven runs. We dismantle, soak and detail every part so your oven comes back to life, sparkling inside and out.',
      includes: [
        'Racks & trays removed and soaked', 'Interior degreased & burnt residue lifted',
        'Door glass cleaned inside the panes', 'Seals, edges & hinges detailed',
        'Rangehood & filter degreased (on request)', 'Stovetop & knobs cleaned',
        'Exterior polished', 'Non-toxic, fume-free products',
      ],
      facts: [
        { ic: 'spark', label: 'Best for', value: 'Built-up grease & grime' },
        { ic: 'clock', label: 'Typical duration', value: '1–2 hours' },
        { ic: 'leaf', label: 'Products', value: 'Fume-free & non-toxic' },
      ],
      faqs: [
        { q: 'Can the oven be used the same day?', a: 'Yes — we use fume-free products, so once we’re done the oven is ready to use as normal.' },
        { q: 'Do you clean the racks too?', a: 'Always. Racks and trays are removed, soaked and scrubbed as part of the service.' },
        { q: 'What about the rangehood and cooktop?', a: 'These can be added on. We’ll degrease the rangehood, replace/clean filters and detail the stovetop.' },
      ],
    },
    window: {
      tagline: 'Crystal-clear, streak-free glass',
      intro: 'Enjoy crystal-clear windows with our professional window cleaning service. We clean interior and exterior glass surfaces for a streak-free shine and brighter space.',
      includes: [
        'Interior & exterior glass cleaned', 'Streak-free, lint-free finish',
        'Frames & sills wiped down', 'Window tracks detailed',
        'Fly screens dusted & wiped', 'Glass sliding doors & mirrors',
        'Cobwebs removed around frames', 'Spot-free drying',
      ],
      facts: [
        { ic: 'window', label: 'Best for', value: 'Homes & shopfronts' },
        { ic: 'clock', label: 'Typical duration', value: '1–3 hours' },
        { ic: 'shield', label: 'Access', value: 'Ground & first floor' },
      ],
      faqs: [
        { q: 'Do you do exterior windows?', a: 'Yes — we clean both sides where safely accessible from the ground or standard ladder height. For high-rise or difficult access, we’ll advise on the best approach.' },
        { q: 'Do you clean the tracks and screens?', a: 'Yes, tracks are detailed and fly screens are dusted and wiped as part of the service.' },
        { q: 'How often should windows be cleaned?', a: 'Most homes look great with a clean every 3–6 months; shopfronts and coastal properties often benefit from more frequent visits.' },
      ],
    },
    regular: {
      tagline: 'A consistently fresh, tidy home',
      intro: 'Keep your home fresh and tidy with our regular residential cleaning service. We provide reliable weekly, fortnightly, or monthly cleaning tailored to your lifestyle and needs.',
      includes: [
        'Dusting of surfaces & furniture', 'Vacuum & mop all floors',
        'Kitchen benches, sink & exterior cupboards', 'Bathrooms — toilet, shower, sink & mirrors',
        'Bins emptied & liners replaced', 'Mirrors & glass wiped',
        'Tidy & general reset', 'Tailored to your priorities',
      ],
      facts: [
        { ic: 'home', label: 'Best for', value: 'Busy households' },
        { ic: 'clock', label: 'Frequency', value: 'Weekly · fortnightly · monthly' },
        { ic: 'user', label: 'Your team', value: 'Same trusted cleaners' },
      ],
      faqs: [
        { q: 'Do I get the same cleaner each time?', a: 'Wherever possible, yes — we keep your regular cleaner consistent so they get to know your home and exactly how you like it.' },
        { q: 'Can I change my schedule?', a: 'Of course. You can adjust frequency or skip a visit with reasonable notice — your plan flexes with your life.' },
        { q: 'Do I need to provide products?', a: 'No — we bring everything. If you’d prefer we use specific products you own, just let us know.' },
      ],
    },
    office: {
      tagline: 'A clean, healthy, productive workplace',
      intro: 'Create a clean and productive workplace with our office cleaning service. We deliver reliable and professional cleaning solutions to keep your office hygienic, organised, and welcoming.',
      includes: [
        'Workstations & surfaces sanitised', 'Kitchens & break rooms cleaned',
        'Restrooms sanitised & restocked', 'Floors vacuumed & mopped',
        'Bins emptied & liners replaced', 'Glass doors & high-touch points',
        'Reception & meeting rooms reset', 'Flexible after-hours scheduling',
      ],
      facts: [
        { ic: 'building', label: 'Best for', value: 'Offices & commercial spaces' },
        { ic: 'clock', label: 'Scheduling', value: 'Daily · weekly · after-hours' },
        { ic: 'shield', label: 'Team', value: 'Reliable & insured' },
      ],
      faqs: [
        { q: 'Can you clean outside business hours?', a: 'Yes — early mornings, evenings and weekends are all available so cleaning never disrupts your team or clients.' },
        { q: 'Do you offer ongoing contracts?', a: 'We offer flexible ongoing schedules as well as one-off cleans. We’ll tailor a plan and quote to your space and needs.' },
        { q: 'Is your team insured?', a: 'Yes. We’re a registered, locally owned business and treat every workplace with care and professionalism.' },
      ],
    },
    school: {
      tagline: 'Safe, healthy spaces for learning',
      intro: 'Safe, thorough cleaning for schools and childcare centres. We use child-friendly products to maintain a hygienic, healthy environment for students and staff.',
      includes: [
        'Classrooms & learning spaces cleaned', 'Bathrooms sanitised & restocked',
        'Kitchen & staffroom cleaned', 'Hallways & reception areas mopped',
        'Bins emptied & replaced', 'Hard surfaces & desks disinfected',
        'Windows & glass wiped down', 'Child-safe, eco-friendly products used',
      ],
      facts: [
        { ic: 'building', label: 'Best for', value: 'Schools & childcare centres' },
        { ic: 'leaf',     label: 'Products', value: 'Child-safe & eco-friendly' },
        { ic: 'clock',   label: 'Scheduling', value: 'After hours & weekends' },
      ],
      faqs: [
        { q: 'Do you clean after hours?', a: 'Yes — we schedule cleans outside school hours to avoid disruption to students and staff.' },
        { q: 'Are your products safe for children?', a: 'Absolutely. We use child-safe, non-toxic and eco-friendly products throughout every clean.' },
        { q: 'Can you provide a regular schedule?', a: 'Yes. We offer flexible daily, weekly or fortnightly schedules to keep your facility consistently clean and healthy.' },
      ],
    },
    airbnb: {
      tagline: 'Guest-ready, every single turnover',
      intro: 'Keep your Airbnb guest-ready with our reliable cleaning service. We ensure every room is spotless, refreshed, and welcoming, helping you maintain excellent guest reviews and a professional presentation.',
      includes: [
        'Full clean between every stay', 'Fresh linen & towels changed',
        'Beds made & rooms styled', 'Kitchen reset & dishes done',
        'Bathrooms sanitised & restocked', 'Amenities & consumables checked',
        'Damage & restock reporting', 'Photos on request for your records',
      ],
      facts: [
        { ic: 'bed', label: 'Best for', value: 'Short-stay & Airbnb hosts' },
        { ic: 'clock', label: 'Turnaround', value: 'Same-day between guests' },
        { ic: 'spark', label: 'Standard', value: 'Hotel-quality presentation' },
      ],
      faqs: [
        { q: 'Can you handle same-day turnovers?', a: 'Yes — we work to checkout/check-in windows to have your property guest-ready in time for the next arrival.' },
        { q: 'Do you manage linen?', a: 'We change and make up fresh linen and towels. We can use your supplied linen or discuss a linen service if needed.' },
        { q: 'Will you let me know if something’s wrong?', a: 'Always. We report any damage, low consumables or maintenance issues after each turnover, with photos on request.' },
      ],
    },
  } as Record<string, {
    tagline: string;
    intro: string;
    includes: string[];
    facts: Array<{ ic: string; label: string; value: string }>;
    faqs: Array<{ q: string; a: string }>;
  }>,

  sizes: ['Studio', '1–2 bed', '3–4 bed', '5+ / Large', 'Office / Commercial'],
  times: ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'],
};

export type Service = typeof NG.services[number];
