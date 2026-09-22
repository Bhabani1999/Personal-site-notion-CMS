import zemetric from "./content/zemetric.json";
import evy from "./content/evy.json";
import undergraduate from "./content/undergraduate.json";

// One board holding every screen from the three work pages. Each source keeps
// the units its own gallery groups it into, and is rendered by that gallery's
// own components, so a screen looks here exactly as it looks there.

// A unit is tagged with its source so the board can hand it to the right
// renderer: Zemetric's captures carry a browser chrome bar, Evy's phone
// screens carry a device frame, and the undergraduate work has its own cards.
function unitsFromGalleries(content, source) {
  return Object.values(content.galleries || {}).flatMap(gallery =>
    (gallery.units || []).map(unit => ({ source, unit }))
  );
}

export const zemetricUnits = unitsFromGalleries(zemetric, "zemetric");
export const evyUnits = unitsFromGalleries(evy, "evy");
export const undergraduateProjects = undergraduate;

// A run of similar cards reads as a block rather than a board, so the sources
// are woven together: take from whichever is furthest behind, and avoid
// following a unit with another of the same width and shape.
export function weave(groups) {
  const queues = groups.filter(q => q.length).map(q => [...q]);
  const total = queues.reduce((n, q) => n + q.length, 0);
  const taken = queues.map(() => 0);
  const out = [];

  const shapeOf = entry => {
    const items = entry.unit?.items || entry.flow?.items || [];
    const first = items[0];
    const wide = first && first.width > first.height;
    return `${items.length}-${wide ? "wide" : "tall"}`;
  };

  while (out.length < total) {
    const last = out[out.length - 1];
    const order = queues
      .map((queue, i) => ({
        i,
        progress: queue.length ? taken[i] / (taken[i] + queue.length) : 2,
      }))
      .filter(entry => queues[entry.i].length)
      .sort((a, b) => a.progress - b.progress);

    const pick =
      order.find(entry => !last || shapeOf(queues[entry.i][0]) !== shapeOf(last)) || order[0];

    out.push(queues[pick.i].shift());
    taken[pick.i] += 1;
  }
  return out;
}
