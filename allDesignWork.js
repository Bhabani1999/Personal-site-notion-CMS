import zemetric from "./content/zemetric.json";
import evy from "./content/evy.json";
import undergraduate from "./content/undergraduate.json";

// One gallery holding every screen from the three work pages, grouped by
// where it came from. Captions are dropped here: this view is for scanning
// the visual work, and the case-study pages carry the explanation.

// Files the undergraduate page leaves out of its own galleries; the same
// omissions apply here so the two views agree.
const SKIPPED = {
  saksham: ["020.avif", "023.avif", "028.avif", "031.avif", "034.avif", "motion-04.mp4"],
  sprinklr: ["add-adjustment.avif"],
};

const fileName = src => (src || "").split("/").pop();

// The undergraduate items carry a `shot` hint that tells the gallery a
// capture is a desktop screen rather than a phone one. The Zemetric and Evy
// items predate that field, so it is derived from the proportions: anything
// clearly wider than it is tall is a desktop capture.
function withShotHint(item) {
  if (item.shot || !item.width || !item.height) return item;
  const ratio = item.width / item.height;
  return ratio >= 1.25 ? { ...item, shot: "viewport" } : item;
}

// A group is one product or project: a heading plus its screens in order.
function fromGalleries(content, labels) {
  return Object.entries(content.galleries || {})
    .filter(([, gallery]) => (gallery.units || []).length)
    .map(([key, gallery]) => ({
      id: `${labels.prefix}-${key}`,
      source: labels.source,
      title: gallery.title || key,
      items: (gallery.units || []).flatMap(unit => unit.items).map(withShotHint),
    }));
}

function fromUndergraduate() {
  return undergraduate
    .map(project => {
      const skip = new Set(SKIPPED[project.slug] || []);
      const items = (project.items || []).filter(
        item => item.type === "image" && !skip.has(fileName(item.src))
      );
      return {
        id: `undergraduate-${project.slug}`,
        source: "Design explorations",
        title: project.title,
        items,
      };
    })
    .filter(group => group.items.length);
}

export const allDesignGroups = [
  ...fromGalleries(zemetric, { prefix: "zemetric", source: "Zemetric" }),
  ...fromGalleries(evy, { prefix: "evy", source: "Evy Energy" }),
  ...fromUndergraduate(),
];

export const allDesignCount = allDesignGroups.reduce(
  (total, group) => total + group.items.length,
  0
);
