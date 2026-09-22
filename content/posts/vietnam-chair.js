const main = (text, href = null) => ({ contentType: "main", text, href });
const sidenote = (text, href = null) => ({
  contentType: "sidenote",
  text,
  href,
});

const vietnamChair = {
  properties: {
    pageTitle: "The Street Begins With a Chair",
    pageDescription:
      "What Vietnam's plastic chairs reveal about streets, homes, and the portable infrastructure of social life.",
    icon: "🪑",
    creationDate: "2025-09-22T00:00:00.000Z",
    Tags: "notes",
  },
  content: [
    {
      type: "paragraph",
      content: [
        main(
          "A traveller's opinion is romantic, therefore useless. Every time I would notice something that felt like a tremendous insight, I would recite to myself the above platitude and move on."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        sidenote("Edward Hopper's "),
        sidenote(
          "Nighthawks",
          "https://www.artic.edu/artworks/111628/nighthawks"
        ),
        sidenote(
          " (1942) holds four people in a brightly lit diner with no visible entrance. Alain de Botton's "
        ),
        sidenote(
          "The Art of Travel",
          "https://www.penguin.co.uk/books/337564/the-art-of-travel-by-de-botton-alain/9780241970065"
        ),
        sidenote(
          " is interested in similar in-between places: airports, service stations, hotels, and other rooms built for passing through."
        ),
        main(
          "A few months ago, I backpacked across Vietnam for a few weeks, starting from the south and moving north. In hindsight, calling it backpacking is generous. Most evenings I would splurge on a cheap plate of cơm tấm, broken rice with ribs and pickled vegetables, and a glass of bia hơi, Vietnam's fresh draft beer, and sit idle for hours looking outwards at the dwindling traffic and the night settling. The beer would work its magic and the night would become Edward Hopper's Nighthawks. The diner setting invokes in all of us the comfortable loneliness of being somewhere we have no business being. Alain de Botton, in The Art of Travel, calls these threshold places: places where you do not speak the language and yet have a sense of command over the night."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        main(
          "In my imagination of the night, the painting held up in almost every detail except one. Hopper's characters were perched on tall, long chairs, while I was seated on acutely small ones, almost close to the ground. The chairs were most often plastic, and they were ubiquitous across Vietnam."
        ),
      ],
    },
    {
      type: "image",
      url: "/writing/vietnam-chair/saigon-street-dining.jpg",
      alt: "People dining on low stools at a street corner in Saigon",
      width: 1800,
      height: 1075,
      credit:
        "Saigon street-corner dining, 1994. Photograph by Alan Turkus, CC BY 2.0.",
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Saigon_Street_Corner_Dining_(at_noon).jpg",
    },
    { type: "h2", text: "The white plastic chair" },
    {
      type: "paragraph",
      content: [
        sidenote("Bad Bunny's 2025 album "),
        sidenote(
          "DeBÍ TiRAR MáS FOToS",
          "https://www.behindthecovers.com/covers/debi-tirar-mas-fotos"
        ),
        sidenote(
          " places two white monobloc chairs beneath a plantain tree. The empty chairs hold the memory of people who are no longer in the photograph."
        ),
        main(
          "Have you noticed that unsuspecting white plastic chair? It is outside the pharmacy and inside the wedding tent. It waits beside a mechanic's shop, appears at a funeral, and spends the rest of the week stacked behind a restaurant. I am convinced there is no other object in modern human history that has fostered more belonging, discourse, conviviality, and negotiation than this humble chair. If you have not been paying attention, the monobloc even made an unexpected appearance on the cover of Bad Bunny's DeBÍ TiRAR MáS FOToS."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        sidenote("Ethan Zuckerman's "),
        sidenote(
          "essay on the monobloc",
          "https://ethanzuckerman.com/2011/04/06/those-white-plastic-chairs-the-monobloc-and-the-context-free-object/"
        ),
        sidenote(
          " calls it a context-free object: cheap, globally distributed, and remarkably poor at revealing where or when a photograph was taken."
        ),
        main("Ethan Zuckerman, in a blog post titled "),
        main(
          "Those White Plastic Chairs",
          "https://ethanzuckerman.com/2011/04/06/those-white-plastic-chairs-the-monobloc-and-the-context-free-object/"
        ),
        main(
          ", makes a compelling observation about the chair's ubiquity. You could guesstimate a photo's geographical origin by looking at the electrical outlets: two flat pins in North America and Japan, three rectangular pins across much of the Commonwealth. Similarly, you might date a photo by looking at its television set, from dial knobs on wooden cabinets to zero-bezel flat screens."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        main(
          "The monobloc evades both. The chair I sat on at a funeral in my hometown twenty years ago is the same chair in a cafe in Lagos, on a sidewalk in Hanoi, and on an album cover shot in Puerto Rico. Zuckerman calls it a context-free object. It belongs nowhere and therefore it belongs everywhere. Name another everyday object that has a song titled in its honour. The monobloc has one: White Stackable Chairs."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        main(
          "Its anonymity is also its trick. A monobloc asks almost nothing of its surroundings. It does not need to match the room because it is usually making the room. Bring out four chairs and a conversation has a shape. Add ten and it becomes a meeting. Add fifty, some marigolds, and a loudspeaker, and the same patch of ground is ready for a ceremony."
        ),
      ],
    },
    { type: "h2", text: "The street and the house" },
    {
      type: "paragraph",
      content: [
        main(
          "I arrived in Ho Chi Minh City early in the morning, a little anxious about my solo trip and wondering how the city would receive me. As I hopped off my Grab ride and hunched under my backpack across the street, the first sight I encountered at 6 a.m., before the sun had properly risen, was locals, including office-goers, gig workers, and schoolchildren, perched on tiny chairs on the sidewalk, enjoying breakfast before setting off on their daily hustle. At once, I felt my anxiety flatten and was drawn back to my childhood memories. Even where there were storefronts, there was rarely any seating inside."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        sidenote("1 Lisa Drummond calls this movement "),
        sidenote(
          "inside-out",
          "https://doi.org/10.1080/00420980020002850"
        ),
        sidenote(
          ": cooking, washing, eating, childcare, and other activities conventionally assigned to the home extending into public space."
        ),
        main(
          "Growing up in the Indian subcontinent, most of my core memories happened on the verandah. Entry doors were always flanked by front verandahs that interfaced the street with the house, the public with the private. Back then, even with scarce land, every house across every economic stratum, concrete or kutcha, had one. Unlike the lounge or living room in modern apartments, social life happened inside-out. This in-between space was where the most interesting things happened: local council meetings, household gossip, afternoon chai with neighbours, and the negotiation of marriages."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        main(
          "Thousands of miles from my childhood verandah, the streets were throbbing with the same interplay. I would be driving back from a day trip to my hostel and see marriage ceremonies flowing onto the street. Through the white decorative cloth draped from house to sidewalk, you could see families greeting one another inside. Family gatherings and karaoke nights spilled out too, and strangers occasionally joined in."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        main(
          "At a family-run restaurant, when the footfall reduced, the owners brought their pots outside and reheated the phở on the pavement, joining the few remaining customers. In another alley, a group of elderly women played cards in the daytime while a woman across from them, hanging clothes on the sidewalk, sent playing tips over. I always felt like I was watching a performance with no backstage. The inside was leaning out and everyone was invited to watch."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        sidenote(
          "Drummond reserves outside-in for the state's reach into domestic life. This shopfront is better understood as mixed frontage: domestic, commercial, and public life occupying the same few metres."
        ),
        main(
          "The movement also ran in the other direction, though not quite in the way I first thought. Pawn shops, similar to the tube shops found across Southeast Asia, had their shopfronts tied into their private space. Family members watched reality television on a sofa while the head of the family pawned a scooter for a customer a few feet away. Domestic and commercial life did not take turns; they occupied the same frontage. The line between public and private was not so much blurred as continually redrawn."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        sidenote("Jane Jacobs named this everyday coordination the "),
        sidenote(
          "sidewalk ballet",
          "https://www.penguinrandomhouse.com/books/86058/the-death-and-life-of-great-american-cities-by-jane-jacobs/"
        ),
        sidenote(
          ": public order produced by repeated, mostly unwritten agreements among the people who use and watch the street."
        ),
        main("In The Death and Life of Great American Cities, Jane Jacobs "),
        main(
          "observed",
          "https://www.penguinrandomhouse.com/books/86058/the-death-and-life-of-great-american-cities-by-jane-jacobs/"
        ),
        main(
          " that cities do not derive their vitality from grand structures but from the unspectacular choreography of everyday life at street level. She called it the sidewalk ballet. Everywhere I walked in Vietnam, the ballet was alive and performing."
        ),
      ],
    },
    { type: "h2", text: "The sidewalk has a clock" },
    {
      type: "paragraph",
      content: [
        sidenote("2 Sandra Kurfürst's open-access study, "),
        sidenote(
          "Shared Streets: Choreographed Disorder in the Late Socialist City",
          "https://www.cogitatiopress.com/politicsandgovernance/article/download/6466/3175"
        ),
        sidenote(
          ", describes Hanoi's sidewalks as shared resources governed simultaneously by municipal rules and local social norms."
        ),
        main(
          "A plan drawing can label a sidewalk public, but the lived city gives it a timetable. Early in the morning it is swept, cooked on, and used for breakfast. Later it stores motorbikes or drying clothes. By evening, tables and stools turn the same strip into a restaurant. The boundary is not only spatial; it is temporal."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        main(
          "This helped me understand why the streets could appear disorderly without feeling random. Each use had a rhythm, and the people sharing the pavement knew more of the schedule than I did. A vendor did not simply occupy a piece of ground. She entered a local arrangement among residents, other traders, customers, and ward officials about who could be there, when, and for how long."
        ),
      ],
    },
    { type: "h2", text: "Sidewalk ballet infrastructure" },
    {
      type: "paragraph",
      content: [
        main(
          "One of the strongest indicators that a celebration is being hosted in a family or a house in South or Southeast Asia is the sight of people heaving long stacks of chairs through the entry door. The image persists in Indian cinema. To establish that a wedding is about to happen, the camera moves overhead: two relatives dictate the decorations from the first floor while three people huff underneath a skyscraper-like stack of chairs."
        ),
      ],
    },
    {
      type: "image",
      url: "/writing/vietnam-chair/hanoi-plastic-stools.jpg",
      alt: "Stacks of blue and red plastic stools outside a restaurant in Hanoi",
      width: 1920,
      height: 1371,
      credit:
        "Plastic stools stacked outside a Hanoi restaurant, 2011. Photograph by CEphoto, Uwe Aranas, CC BY-SA 3.0.",
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Hanoi_Vietnam_The-omnipresent-plastic-chairs-01.jpg",
    },
    {
      type: "paragraph",
      content: [
        sidenote(
          "3 In 2008, Hanoi prohibited street trade on 62 streets and at 48 historic sites. Kurfürst records patrols confiscating the small tables and stools that made stalls operable."
        ),
        main(
          "The portability is not merely convenient. It is what allows street life to negotiate with formal order. A stall assembled from a pot, a table, and six plastic stools can appear for breakfast and vanish before a patrol arrives. In 2008, when Hanoi intensified its campaign against street trade, the police confiscated precisely these small tables and stools. The furniture was light because the business had to be."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        main(
          "Chairs, monobloc, textured, and multicoloured, allow spaces to become social without architectural investment. They are light enough to migrate from room to pavement, cheap enough to exist in excess, washable after a meal, and stackable when the occasion ends. A permanent bench prescribes where people may gather. A plastic chair can follow the gathering."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        sidenote(
          "4 Kurfürst calls this local order choreographed: residents, vendors, customers, residential leaders, and officials continually mediate the same shared space."
        ),
        main(
          "That makes the stack a small piece of civic infrastructure. It can turn an alley into a dining room, a shopfront into a waiting room, a courtyard into a council, and an otherwise forgettable stretch of pavement into a wedding hall for one evening. None of this transformation is announced by architecture. It arrives carried on somebody's back."
        ),
      ],
    },
    { type: "h2", text: "A city at eye level" },
    {
      type: "paragraph",
      content: [
        main(
          "The size of Vietnam's street chairs matters. They place your knees near your chest and your eyes near the level of a saucepan. From there, the city does not present itself as a view. It moves around you. A scooter stops inches away. Someone reaches across your table for the chilli sauce. The person cooking and the person eating occupy almost the same room, even when there is no room."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        main(
          "Tourism usually gives you height and distance: a rooftop, a viewpoint, a bus window, a photograph taken before you move on. The tiny chair does the opposite. It lowers you into the operating level of the street. You cannot observe with the clean separation of Hopper's diner window because there is barely a window at all."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        main(
          "Perhaps that is why these evenings stayed with me more than the places I had made plans to visit. Sitting still, I noticed the same chair move between commerce, domestic life, and celebration without becoming a different object. The city changed around it."
        ),
      ],
    },
    { type: "h2", text: "The chair comes home" },
    {
      type: "paragraph",
      content: [
        main(
          "It would be easy to make Vietnam stand in for an uncomplicated idea of community, which is where the traveller's romantic opinion becomes useless again. The street is not automatically generous because it is busy, and the absence of privacy is not always freedom. I was there briefly. I could leave whenever the discomfort stopped being charming."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        main(
          "What felt true was smaller. The chairs did not reveal an exotic way of living; they made a familiar one visible. I recognised in them the verandah of my childhood, where a house never quite ended at its door and company did not need an appointment. I had gone to Vietnam prepared to notice difference. The chairs kept showing me resemblance."
        ),
      ],
    },
    {
      type: "paragraph",
      content: [
        main(
          "A traveller's opinion may still be romantic, therefore useless. But the next time I see a stack of white chairs being carried through a doorway, I will know that a room is about to be made where there was none."
        ),
      ],
    },
  ],
};

export default vietnamChair;
