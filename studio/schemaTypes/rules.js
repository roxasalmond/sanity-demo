// Editorial rules, enforced in the editor so nobody can publish around them.

// Links belong further down the page. The opening paragraph should say what
// the page is about, not send the reader somewhere else.
export const noLinksInFirstParagraph = (blocks) => {
  const first = (blocks ?? []).find((b) => b._type === 'block' && b.style === 'normal');
  if (first?.markDefs?.some((def) => def._type === 'link')) {
    return 'Move the link out of the first paragraph. Open with what the page is about.';
  }
  return true;
};

// Template leftovers that should never reach a live page.
const LEFTOVERS = [/lorem ipsum/i, /\bTODO\b/, /\bPREVIEW\b/, /sitemap v\d/i, /\{\{.*?\}\}/, /\[insert/i];

export const noTemplateLeftovers = (blocks) => {
  for (const block of blocks ?? []) {
    const text = (block.children ?? []).map((c) => c.text ?? '').join('');
    const hit = LEFTOVERS.find((re) => re.test(text));
    if (hit) {
      return `The text still has template or draft wording ("${text.match(hit)[0]}"). Remove it before publishing.`;
    }
  }
  return true;
};


// Phone numbers live in Site settings only, so they can be changed in one place.
const PHONE = /(\+?1[\s.-]?)?\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/;

export const noPhoneNumbers = (blocks) => {
  for (const block of blocks ?? []) {
    const text = (block.children ?? []).map((c) => c.text ?? '').join('');
    const match = text.match(PHONE);
    if (match) {
      return `Remove the phone number ("${match[0]}"). The site adds it from Site settings, so it stays the same everywhere.`;
    }
  }
  return true;
};

// The top of the page is for what the page is about, not a video.
export const noVideoFirst = (blocks) =>
  blocks?.[0]?._type === 'video'
    ? 'Move the video below the opening paragraph. Start with what the page is about.'
    : true;

export const oneVideoPerPage = (blocks) =>
  (blocks ?? []).filter((b) => b._type === 'video').length > 1
    ? 'This page has more than one video. One well-chosen video usually works better.'
    : true;

export const bodyRules = (Rule) => [
  Rule.required().error('Add the page text.'),
  Rule.custom(noLinksInFirstParagraph),
  Rule.custom(noTemplateLeftovers),
  Rule.custom(noPhoneNumbers),
  Rule.custom(noVideoFirst),
  Rule.custom(oneVideoPerPage).warning(),
];

// Links: a page on this site starts with /, other sites with https://.
export const linkFormat = (href) =>
  !href || /^(\/|https:\/\/|mailto:|tel:)/.test(href)
    ? true
    : 'Start with / for a page on this site, or https:// for another site.';

// Warn when a link points to a page on this site that doesn't exist.
const FIXED_PAGES = ['/', '/services/', '/blog/', '/#book', '/#services'];

export const linkTargetExists = async (href, context) => {
  if (!href || !href.startsWith('/') || FIXED_PAGES.includes(href)) return true;
  const match = href.match(/^\/(services|blog)\/([^/#?]+)\/?$/);
  if (!match) return 'This site has no page at that address. Check the link.';
  const type = match[1] === 'services' ? 'service' : 'post';
  const client = context.getClient({ apiVersion: '2025-01-01' });
  const found = await client.fetch(`count(*[_type == $type && slug.current == $slug])`, { type, slug: match[2] });
  return found > 0 ? true : 'No page uses this address yet. Check the link or create the page.';
};
