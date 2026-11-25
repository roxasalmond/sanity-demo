// Demo content for a fictional firm, "Wren & Ledger".
// The site falls back to this file when no Sanity project is connected,
// and studio/scripts/make-seed.mjs turns it into a Sanity import file.
// Body text is Portable Text, the same format Sanity stores.

let k = 0;
const key = () => `k${(k++).toString(36)}`;

const p = (text) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
});

const h2 = (text) => ({ ...p(text), style: 'h2' });

const bullets = (items) =>
  items.map((text) => ({ ...p(text), listItem: 'bullet', level: 1 }));

// A paragraph with one internal link: [before, linkText, href, after]
const pLink = (before, linkText, href, after) => {
  const mark = key();
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [{ _type: 'link', _key: mark, href }],
    children: [
      { _type: 'span', _key: key(), text: before, marks: [] },
      { _type: 'span', _key: key(), text: linkText, marks: [mark] },
      { _type: 'span', _key: key(), text: after, marks: [] },
    ],
  };
};

export const settings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  title: 'Wren & Ledger',
  tagline: 'Business consulting for owner-run companies',
  phone: '(510) 555-0142',
  email: 'hello@example.com',
  bookingUrl: '/#book',
  bookingLabel: 'Book a free 30-minute call',
  mainMenu: [
    { _type: 'navLink', _key: key(), label: 'Services', href: '/services/' },
    { _type: 'navLink', _key: key(), label: 'Blog', href: '/blog/' },
  ],
  headerCta: { _type: 'cta', label: 'Book a call', href: '/#book', style: 'primary' },
  footerColumns: [
    {
      _type: 'footerColumn',
      _key: key(),
      heading: 'Services',
      links: [
        { _type: 'navLink', _key: key(), label: 'Growth planning', href: '/services/growth-planning/' },
        { _type: 'navLink', _key: key(), label: 'Marketing strategy', href: '/services/marketing-strategy/' },
        { _type: 'navLink', _key: key(), label: 'Operations and hiring', href: '/services/operations-and-hiring/' },
      ],
    },
    {
      _type: 'footerColumn',
      _key: key(),
      heading: 'Company',
      links: [
        { _type: 'navLink', _key: key(), label: 'Blog', href: '/blog/' },
        { _type: 'navLink', _key: key(), label: 'Book a call', href: '/#book' },
      ],
    },
  ],
  footerNote:
    'This is a demo site for a fictional firm. Names, client stories and numbers are made up.',
};

export const services = [
  {
    _id: 'service-growth',
    _type: 'service',
    title: 'Growth planning',
    slug: { _type: 'slug', current: 'growth-planning' },
    summary:
      'A one-year plan built from your real numbers: what to sell more of, what to stop doing, and what to hire for first.',
    body: [
      p('Most owners know the business could be bigger. Fewer know which part of it should grow first. We start with your last twelve months of sales and costs and find the work that actually pays.'),
      h2('What you get'),
      ...bullets([
        'A short list of the products or services worth pushing, ranked by margin',
        'A plain monthly plan you can follow without us in the room',
        'Three numbers to check every Friday, and what to do when they slip',
      ]),
      h2('How long it takes'),
      p('Four to six weeks, with one working session a week. You leave each session with something to do, not a slide deck.'),
      pLink('If marketing is the bottleneck, we fold in ', 'marketing strategy', '/services/marketing-strategy/', ' from the start.'),
    ],
    results: [
      { _key: key(), result: 'Cut the menu from 60 items to 24 and kept 94% of revenue.', client: 'A family bakery with two locations' },
    ],
    seo: {
      _type: 'seo',
      metaTitle: 'Growth planning for owner-run businesses | Wren & Ledger',
      metaDescription:
        'A one-year growth plan built from your own sales and cost numbers, with a monthly plan and three numbers to check every week.',
    },
  },
  {
    _id: 'service-marketing',
    _type: 'service',
    title: 'Marketing strategy',
    slug: { _type: 'slug', current: 'marketing-strategy' },
    summary:
      'Find the two or three channels that bring you paying customers, then stop paying for the rest.',
    body: [
      p('Small businesses rarely have a marketing problem. They have a focus problem: too many channels, each half-done. We look at where your best customers actually came from and build around that.'),
      h2('What we look at'),
      ...bullets([
        'Where your last fifty paying customers heard about you',
        'What each channel costs per customer, including your own time',
        'Whether your website turns visitors into calls, and why not',
      ]),
      h2('What you get'),
      p('A ninety-day plan with a budget, a calendar and one person responsible for each line. We check in at thirty and sixty days.'),
    ],
    results: [
      { _key: key(), result: 'Moved intake to a booking page and doubled consultations in a quarter.', client: 'A three-lawyer practice' },
      { _key: key(), result: 'Dropped two ad channels and lowered cost per new patient by a third.', client: 'A dental clinic' },
    ],
    seo: {
      _type: 'seo',
      metaTitle: 'Marketing strategy for small businesses | Wren & Ledger',
      metaDescription:
        'Find the marketing channels that bring paying customers, cut the rest, and follow a 90-day plan with a clear budget and owners.',
    },
  },
  {
    _id: 'service-operations',
    _type: 'service',
    title: 'Operations and hiring',
    slug: { _type: 'slug', current: 'operations-and-hiring' },
    summary:
      'Get the owner out of the daily bottleneck: written processes, the right first hires, and a team that can run a week without you.',
    body: [
      p('If the business stops when you take a day off, it is not ready to grow. We write down how the work gets done, decide what to hand off, and help you hire for it.'),
      h2('What you get'),
      ...bullets([
        'Written checklists for the jobs only you know how to do today',
        'A hiring plan with job descriptions and a realistic pay range',
        'A thirty-day onboarding plan for each new hire',
      ]),
    ],
    results: [
      { _key: key(), result: 'Owner took a two-week holiday for the first time in six years.', client: 'A family-run hardware store' },
    ],
    seo: {
      _type: 'seo',
      metaTitle: 'Operations and hiring for small businesses | Wren & Ledger',
      metaDescription:
        'Written processes, a hiring plan and onboarding checklists so your business can run a week without the owner.',
    },
  },
];

export const posts = [
  {
    _id: 'post-fix-before-ads',
    _type: 'post',
    title: 'What to fix before you spend more on ads',
    slug: { _type: 'slug', current: 'fix-before-you-spend-on-ads' },
    publishedAt: '2026-11-10',
    excerpt:
      'More ad spend sends more people to the same leaks. Check these four things first.',
    body: [
      p('Ads are a tap. If the bucket has holes, turning the tap up only makes a bigger puddle. Before you raise the budget, check where people drop off today.'),
      h2('1. Can people tell what you do in five seconds?'),
      p('Show your homepage to someone who has never heard of you. If they cannot say what you sell and who it is for, no ad will fix that.'),
      h2('2. Is there one clear next step?'),
      p('A phone number, a booking button, a short form. Pick one main action and put it at the top of every page.'),
      h2('3. Does anyone answer?'),
      p('Call your own number at 4:30 on a Friday. Fill in your own form. Time how long the reply takes.'),
      h2('4. Do you know which ads bring customers, not clicks?'),
      pLink('Ask every new customer how they found you, and write it down. Our ', 'marketing strategy', '/services/marketing-strategy/', ' work starts from that list.'),
    ],
    relatedService: { _type: 'reference', _ref: 'service-marketing' },
    seo: {
      _type: 'seo',
      metaTitle: 'What to fix before you spend more on ads | Wren & Ledger',
      metaDescription:
        'Four things to check before raising your ad budget: a clear homepage, one next step, fast replies and tracking that counts customers.',
    },
  },
  {
    _id: 'post-pricing-new-service',
    _type: 'post',
    title: "How to price a service you've never sold",
    slug: { _type: 'slug', current: 'price-a-new-service' },
    publishedAt: '2026-10-28',
    excerpt:
      'Start from your costs, test with three real customers, and raise the price until someone says no.',
    body: [
      p('New services are usually priced by guessing what a competitor charges. Your costs and your customers are better guides.'),
      h2('Start with your floor'),
      p('Add up the hours, materials and overhead for one job. That number is the lowest price you can ever charge. Most owners undercount their own time, so count it at the rate you would pay someone else.'),
      h2('Test with three real customers'),
      p('Offer it to three people who already trust you, at a price above your floor. Watch what they ask about. Their questions tell you what the service is really worth to them.'),
      h2('Raise it until someone says no'),
      p('If all three say yes without a pause, you are too cheap. Raise the price for the next three.'),
    ],
    relatedService: { _type: 'reference', _ref: 'service-growth' },
    seo: {
      _type: 'seo',
      metaTitle: "How to price a service you've never sold | Wren & Ledger",
      metaDescription:
        'Price a new service from your real costs, test it with three customers, and raise the price until someone says no.',
    },
  },
];

export const home = {
  _id: 'homePage',
  _type: 'homePage',
  sections: [
    {
      _type: 'heroSection',
      _key: key(),
      heading: 'Your business, run on numbers you can read.',
      text: 'We help owners of restaurants, clinics, shops and small firms decide what to grow, what to stop, and who to hire next. No decks. A plan you can follow on Monday.',
      ctas: [
        { _type: 'cta', _key: key(), label: 'Book a free 30-minute call', href: '/#book', style: 'primary' },
        { _type: 'cta', _key: key(), label: 'See our services', href: '/services/', style: 'secondary' },
      ],
      showPhone: true,
    },
    {
      _type: 'stepsSection',
      _key: key(),
      heading: 'What happens on the first call',
      steps: [
        { _key: key(), title: 'You tell us what is stuck', text: 'Sales, staff, marketing or all three. Ten minutes, your words.' },
        { _key: key(), title: 'We ask for three numbers', text: 'Usually monthly sales, your biggest cost and where customers come from.' },
        { _key: key(), title: 'You leave with one next step', text: 'Something you can do this week, whether or not you hire us.' },
      ],
    },
    {
      _type: 'serviceListSection',
      _key: key(),
      heading: 'Where we can help',
      services: services.map((s) => ({ _type: 'reference', _key: key(), _ref: s._id })),
    },
    {
      _type: 'resultsSection',
      _key: key(),
      heading: 'Recent results',
      items: [
        { _key: key(), result: 'Cut the menu from 60 items to 24 and kept 94% of revenue.', client: 'A family bakery with two locations' },
        { _key: key(), result: 'Moved intake to a booking page and doubled consultations in a quarter.', client: 'A three-lawyer practice' },
      ],
    },
    {
      _type: 'faqSection',
      _key: key(),
      heading: 'Common questions',
      items: [
        { _key: key(), question: 'Is the first call really free?', answer: 'Yes. Thirty minutes, no obligation. You leave with one next step whether or not you hire us.' },
        { _key: key(), question: 'Do you work with businesses outside the Bay Area?', answer: 'Yes, most of our work happens over video calls. We visit in person when it helps, such as for a restaurant or a shop floor.' },
        { _key: key(), question: 'How much does it cost?', answer: 'Most projects are a fixed price agreed before we start, based on the plan from the first call. No hourly surprises.' },
      ],
    },
    { _type: 'blogListSection', _key: key(), heading: 'From the blog', count: 2 },
    {
      _type: 'ctaSection',
      _key: key(),
      heading: 'Book a free 30-minute call',
      text: "Pick a time that suits you. You'll talk to a consultant, not a sales team.",
      cta: { _type: 'cta', label: 'Email us instead', href: 'mailto:hello@example.com', style: 'secondary' },
      showBookingEmbed: true,
    },
  ],
  seo: {
    _type: 'seo',
    metaTitle: 'Wren & Ledger | Business consulting for owner-run companies',
    metaDescription:
      'Business consulting for restaurants, clinics, shops and small firms. Decide what to grow, what to stop and who to hire next.',
  },
};

export const redirects = [
  { _id: 'redirect-1', _type: 'redirect', from: '/consulting/', to: '/services/', permanent: true },
  { _id: 'redirect-2', _type: 'redirect', from: '/marketing/', to: '/services/marketing-strategy/', permanent: true },
];
