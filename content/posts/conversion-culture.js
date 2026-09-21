const main = (text, href = null) => ({ contentType: "main", text, href });
const sidenote = (text, href = null) => ({
  contentType: "sidenote",
  text,
  href,
});

const conversionCulture = {
  properties: {
    pageTitle: "How We Read Bento Grids",
    pageDescription:
      "Bento grids, visual hierarchy, and the difference between looking current and communicating clearly.",
    icon: "🪅",
    creationDate: "2023-11-10T00:00:00.000Z",
    Tags: "notes",
  },
  content: [
    {
      type: "paragraph",
      content: [
        main(
          "Bento grids are not new in their structure. Placing information in cards within a grid has existed in the web-design landscape for a long time. However, its recent implementation has caught designers' attention, and the style is now being called bento grids."
        ),
      ],
    },
    {
      type: "image",
      url: "/writing/conversion-culture/bento-structure.png",
      alt: "A rigid grid compared with a flexible bento grid",
    },
    {
      type: "paragraph",
      content: [
        main(
          "Let's attempt to define the characteristics of a bento grid. Bento is inspired by Japanese bento boxes, with functional compartments that hold food of different shapes and sizes. Unlike typical grids with rigid rows and columns (as in A), bento grids (as in B) do not mandate fixed rows and columns. Child cells can expand to accommodate their content. The result is a set of functional compartments shaped by what sits inside them, mirroring the flexibility of bento boxes."
        ),
      ],
    },
    {
      type: "image",
      url: "/writing/conversion-culture/bento-examples.png",
      alt: "Examples of bento grids used in product interfaces",
    },
    {
      type: "h2",
      text: "'Aesthetic superiority' in product landing pages",
    },
    {
      type: "paragraph",
      content: [
        main(
          "The impact of visual aesthetics varies during discovery. It may not be pronounced in a medium like Google Search, but it sparks conversations on Twitter, where tech enthusiasts often engage. Once someone reaches the marketing page, aesthetic superiority can extend to their perception of the product itself. We see a terrific landing page and assume the product is high quality, even though there may be no direct correlation. Blame the halo effect."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        main(
          "An aesthetically strong page can increase dwell time because it hooks us before we have evaluated the proposition. The next job is to convince the visitor to use the service or product. That requires the value proposition, which is information, to travel from the screen to the visitor's comprehension. Visual appeal without clear information is only half the job. To understand the other half, it helps to consider how we read on the web."
        ),
      ],
    },
    { type: "h2", text: "Reading on the web" },
    {
      type: "paragraph",
      content: [
        sidenote("1 This model of behaviour appears in Faraday's original "),
        sidenote(
          "work",
          "http://facweb.cs.depaul.edu/cmiller/faraday/Faraday.htm"
        ),
        sidenote(" and has also been observed in media such as newspapers."),
        main(
          "We employ two distinct cognitive processes when we read on the web: searching and scanning.1 Searching is a viewer's attempt to find a point of entry into the page. Scanning begins after that entry point is found, as the viewer extracts the information around it. When a visitor is looking for something specific, such as pricing, the process is focused and goal-oriented."
        ),
      ],
    },
    {
      type: "bullet",
      text: "The visitor looks for entry points or cues that might lead to the information they need.",
    },
    {
      type: "bullet",
      text: "Once an entry point is found, they scan the surrounding information for relevance.",
    },
    {
      type: "bullet",
      text: "They repeat this process until they find the information or decide the page does not have it.",
    },
    {
      type: "paragraph",
      content: [
        main(
          "When a visitor has no specific information-seeking goal and is simply trying to understand what a page is about, the behaviour becomes more exploratory:"
        ),
      ],
    },
    {
      type: "bullet",
      text: "They jump between entry points without a predetermined order.",
    },
    {
      type: "bullet",
      text: "The information around each entry point is scanned more casually.",
    },
    {
      type: "bullet",
      text: "If nothing earns attention quickly, they move to another entry point or leave.",
    },
    { type: "h2", text: "Visual hierarchy and entry points" },
    {
      type: "paragraph",
      content: [
        sidenote(
          "2 A banal but useful product-design heuristic: important information is easily overlooked when its section has no strong entry point."
        ),
        main(
          "Entry points are powerful. They pull us in and ask for attention, much like vision works in the physical world. We can look at a scene aimlessly until something sticks out.2 This is why we employ visual hierarchy in graphic and web design. The visual weight of an element defines its importance in the hierarchy, telling the eye what to focus on and in what order. A clearer hierarchy makes the sequence instinctive."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        main("Steven Bradley's "),
        main(
          "essay on dominance, focal points, and hierarchy",
          "https://www.smashingmagazine.com/2015/02/design-principles-dominance-focal-points-hierarchy/"
        ),
        main(
          " is one I return to when thinking about the relative nature of visual weight. An element is not prominent on its own; it is prominent in relation to everything around it."
        ),
      ],
    },
    { type: "h2", text: "What comics teach us about flow" },
    {
      type: "paragraph",
      content: [
        main(
          "Comic pages gave me a more useful way to think about this. A regular comic grid is usually read in a Z-path: left to right across one row, then back to the left for the next. The gutters do a lot of invisible work. They separate one panel from another and make the rows easy to find. When panel sizes become irregular, that default route is less reliable."
        ),
      ],
    },
    {
      type: "image",
      url: "/writing/conversion-culture/reading-paths.svg",
      alt: "A Z-path through a regular grid compared with blockage in an irregular grid",
      width: 1200,
      height: 560,
    },
    {
      type: "paragraph",
      content: [
        sidenote("3 Jason Bane's "),
        sidenote(
          "checklist on comic-page flow",
          "https://makingcomics.com/2014/04/14/comic-review-checklist-part-1-flow/"
        ),
        sidenote(
          " makes a simple distinction: an expressive layout still has to let the reader understand the order without guesswork."
        ),
        main(
          "That does not mean irregular pages are automatically confusing. Comic artists use the content inside the panels to restore flow. A character's gaze, the direction of an action, a leading line, or the position of a speech balloon can pull the eye toward the next panel. Panel size changes pacing too: a large panel asks for a pause, while a run of smaller panels tends to move faster.3 The arrangement provides one set of instructions; the content can reinforce it or override it."
        ),
      ],
    },
    { type: "h2", text: "Reading paths inside irregular grids" },
    {
      type: "paragraph",
      content: [
        main(
          "Neil Cohn's study of comic layouts gives names to a few ways the path changes. The most relevant one for bento grids is blockage. Place two short panels beside one tall panel and the tall panel can block the horizontal row. Readers may move down the short stack before moving across, especially when the stack sits on the left. Mirror the arrangement and the likely path can change again. The same geometry does not always produce the same order."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        sidenote("4 Salgood Sam's "),
        sidenote(
          "notes on flow and eyelines",
          "https://salgoodsam.com/mc/flow-the-eyelines/"
        ),
        sidenote(
          " connect these layout mechanics to the cues inside each panel."
        ),
        main(
          "Spacing changes the route as well. A larger gap separates panels and groups each one with whatever sits closer. Overlap does the opposite: it creates a bridge and suggests that two panels belong together. Staggering interrupts a continuous gutter, while an inset panel behaves almost like a visual aside.4 These are small structural changes, but they decide whether the eye sees a row, a group, a sequence, or a detour."
        ),
      ],
    },
    {
      type: "image",
      url: "/writing/conversion-culture/layout-cues.svg",
      alt: "Separation, overlap, staggering, and eyelines changing the reading path",
      width: 1200,
      height: 690,
    },
    {
      type: "bullet",
      text: "Blockage changes whether the eye moves across a row or down a stack.",
    },
    {
      type: "bullet",
      text: "Separation creates groups through proximity.",
    },
    {
      type: "bullet",
      text: "Overlap visually joins compartments that should be read together.",
    },
    {
      type: "bullet",
      text: "Scale, eyelines, and leading lines can establish an entry point and pull the eye onward.",
    },
    { type: "h2", text: "Back to bento grids" },
    {
      type: "paragraph",
      content: [
        main(
          "A product page is not a comic, but the same problem appears when differently sized cards share one frame. The visitor has to decide where to enter, which cards belong together, and whether there is an order worth following. A strong lead card, visible grouping, and directional content can answer those questions before the visitor has to think about them."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        main(
          "The difference is that a bento grid often does not need one complete reading order. On a feature overview, I might enter through a familiar use case while someone else starts with a product visual or a number. If both of us can understand the whole after reading only a few parts, the looseness is useful. It is one reason the format works well for showing several capabilities in a small amount of space."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        main(
          "I started with the assumption that bento grids might have poor hierarchy. I do not think that is precise anymore. They remove some of the reading order that a regular grid gives us for free, so the design has to put enough of it back. A good bento grid can be loose without leaving the eye lost."
        ),
      ],
    },
  ],
};

export default conversionCulture;
