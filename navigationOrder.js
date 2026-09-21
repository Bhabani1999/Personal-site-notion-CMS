// One reading order across the whole site, so /next carries a reader from the
// writing through the work and back again. The work pages are listed here
// because they are hand-built routes rather than Notion entries; the writing
// slugs come from Notion and are looked up at build time.
//
// Order: writing, then work newest first, then back to the start.
export const WORK_ORDER = [
  { slug: "zemetric", href: "/work/zemetric", label: "Zemetric" },
  { slug: "evy-energy", href: "/work/evy-energy", label: "Evy Energy" },
  {
    slug: "undergraduate-explorations",
    href: "/work/undergraduate-explorations",
    label: "Design Explorations",
  },
];

// Where a work page's /next points. The last work page wraps to the writing,
// which is what `null` means: the caller substitutes the first writing slug.
export function nextAfterWork(slug) {
  const index = WORK_ORDER.findIndex(entry => entry.slug === slug);
  if (index === -1) return null;
  const next = WORK_ORDER[index + 1];
  return next ? next.href : null;
}

// A writing post's /next runs to the following post, and the last one hands
// over to the first work page.
export function nextAfterPost(slug, postSlugs) {
  const index = postSlugs.indexOf(slug);
  if (index === -1) return WORK_ORDER[0].href;
  const next = postSlugs[index + 1];
  return next ? `/post/${next}` : WORK_ORDER[0].href;
}
