// Turns Portable Text (Sanity's rich text format) into HTML,
// including images (served from Sanity's image CDN) and videos.
import { toHTML, escapeHTML } from '@portabletext/to-html';

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET || 'production';

const isExternal = (href = '') => /^https?:\/\//.test(href);

// Sanity image references look like "image-<id>-<width>x<height>-<ext>".
// The CDN resizes and converts on the fly from URL parameters.
export function imageUrl(ref, width = 1200) {
  const [, id, size, ext] = ref.split('-');
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${size}.${ext}?w=${width}&auto=format&fit=max`;
}

const imageSize = (ref) => ref.split('-')[2].split('x').map(Number);

function videoEmbed(url = '') {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?dnt=1`;
  return null;
}

export function renderBody(blocks = []) {
  return toHTML(blocks, {
    types: {
      image: ({ value }) => {
        const ref = value?.asset?._ref;
        if (!ref || !projectId) return '';
        const [w, h] = imageSize(ref);
        const caption = value.caption ? `<figcaption>${escapeHTML(value.caption)}</figcaption>` : '';
        return `<figure><img src="${imageUrl(ref, 1200)}" srcset="${imageUrl(ref, 600)} 600w, ${imageUrl(ref, 1200)} 1200w" sizes="(max-width: 48rem) 100vw, 68ch" width="${w}" height="${h}" alt="${escapeHTML(value.alt ?? '')}" loading="lazy" decoding="async" />${caption}</figure>`;
      },
      video: ({ value }) => {
        const src = videoEmbed(value?.url);
        if (!src) return '';
        return `<div class="video"><iframe src="${src}" title="${escapeHTML(value.title ?? 'Video')}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
      },
    },
    marks: {
      link: ({ children, value }) => {
        const href = escapeHTML(value?.href ?? '#');
        return isExternal(value?.href)
          ? `<a href="${href}" rel="noopener">${children}</a>`
          : `<a href="${href}">${children}</a>`;
      },
    },
  });
}
