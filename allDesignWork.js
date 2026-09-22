import zemetric from "./content/zemetric.json";
import evy from "./content/evy.json";
import undergraduate from "./content/undergraduate.json";

// One board holding every screen from the three work pages. The units are
// kept exactly as the individual galleries group them, so a pair stays a
// pair and a four-up stays a four-up; only the section headings are gone.

// Files the undergraduate page leaves out of its own galleries; the same
// omissions apply here so the two views agree.
const SKIPPED = {
  saksham: ["020.avif", "023.avif", "028.avif", "031.avif", "034.avif", "motion-04.mp4"],
  sprinklr: ["add-adjustment.avif"],
};

const fileName = src => (src || "").split("/").pop();

// The undergraduate items carry a `shot` hint that marks a desktop capture.
// The Zemetric and Evy items predate that field, so it is derived from the
// proportions: anything clearly wider than it is tall is a desktop screen.
function withShotHint(item) {
  if (item.shot || !item.width || !item.height) return item;
  const ratio = item.width / item.height;
  return ratio >= 1.25 ? { ...item, shot: "viewport" } : item;
}

function unitsFromGalleries(content, source) {
  return Object.values(content.galleries || {}).flatMap(gallery =>
    (gallery.units || []).map(unit => ({
      source,
      full: unit.full,
      items: unit.items.map(withShotHint),
    }))
  );
}

// The undergraduate projects are flat lists of images rather than grouped
// units, so each screen becomes its own unit.
function unitsFromUndergraduate() {
  return undergraduate.flatMap(project => {
    const skip = new Set(SKIPPED[project.slug] || []);
    return (project.items || [])
      .filter(item => item.type === "image" && !skip.has(fileName(item.src)))
      .map(item => ({ source: "Design explorations", items: [item] }));
  });
}

// A run of similar cards reads as a block rather than a board, so the three
// sources are woven together: take from whichever source is furthest behind,
// and avoid following a unit with another of the same width and shape.
function weave(groups) {
  const queues = groups.filter(q => q.length).map(q => [...q]);
  const total = queues.reduce((n, q) => n + q.length, 0);
  const taken = queues.map(() => 0);
  const out = [];

  const shapeOf = unit => {
    const first = unit.items[0];
    const wide = first && first.width > first.height;
    return `${unit.items.length}-${wide ? "wide" : "tall"}`;
  };

  while (out.length < total) {
    const last = out[out.length - 1];
    // Rank the sources by how far behind they are, so all three run out at
    // roughly the same point rather than one trailing at the end.
    const order = queues
      .map((queue, i) => ({ i, progress: queue.length ? taken[i] / (taken[i] + queue.length) : 2 }))
      .filter(entry => queues[entry.i].length)
      .sort((a, b) => a.progress - b.progress);

    // Prefer a source whose next unit differs in shape from the last one
    // placed; fall back to the furthest behind when none does.
    const pick =
      order.find(entry => !last || shapeOf(queues[entry.i][0]) !== shapeOf(last)) || order[0];

    out.push(queues[pick.i].shift());
    taken[pick.i] += 1;
  }
  return out;
}

export const allDesignUnits = weave([
  unitsFromGalleries(zemetric, "Zemetric"),
  unitsFromGalleries(evy, "Evy Energy"),
  unitsFromUndergraduate(),
]);

export const allDesignCount = allDesignUnits.reduce(
  (total, unit) => total + unit.items.length,
  0
);
