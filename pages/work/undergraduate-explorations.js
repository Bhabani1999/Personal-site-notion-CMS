/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import Layout from "../../components/Layout";
import projects from "../../content/undergraduate.json";
import styles from "../../styles/Undergraduate.module.css";
import { retrievePageProperties } from "../../notionModule";

function Preview({ item }) {
  const ref = useRef(null);
  const isMobile = item.height > item.width * 1.35 && !item.src.includes("/sprinklr/");
  const previewClassName = [
    // A desktop capture fills the tile from its top viewport instead of
    // letterboxing into a thin strip.
    item.shot ? styles.shotPreview : (isMobile ? styles.mobilePreview : ""),
    item.src.includes("/saksham/") ? styles.roundedPreview : "",
  ].filter(Boolean).join(" ");
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !preference.matches) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.35 });
    observer.observe(video);
    return () => { observer.disconnect(); video.pause(); };
  }, []);
  return item.type === "video" ? (
    <><video ref={ref} className={previewClassName} src={item.src} poster={item.poster} muted loop playsInline preload="none" aria-hidden="true" /><span className={styles.play}><Play size={14} aria-hidden="true" /></span></>
  ) : <img
      className={previewClassName}
      // Desktop captures use a pre-cropped thumbnail: full width kept, height
      // trimmed to the top of the screen.
      src={item.thumb || item.src}
      alt={item.title}
      width={item.thumbWidth || item.width}
      height={item.thumbHeight || item.height}
      loading="lazy"
    />;
}

const galleryFlows = {
  biote: [
    { title: "Health tracking", description: "The dashboard summarizes health risks and watch activity, while the steps view shows monthly movement and a daily breakdown.", files: ["002.avif", "steps-breakdown.png"] },
    { title: "Sign in", description: "Phone-number and password screens form a simple sign-in sequence.", files: ["038.avif", "031.avif"] },
    { title: "Product introduction", description: "A sign-up screen and two introductory slides explain the product and the health information it brings together.", files: ["035.avif", "037.avif", "039.avif"] },
    { title: "Finding and preparing reports", description: "The report journey moves from checking existing records to preparing a plan and receiving results.", files: ["036.avif", "040.avif", "045.avif"] },
    { title: "Reading a genetic report", description: "The reports overview introduces the current finding, followed by detail views with a breakdown, health-plan action, and option to speak with doctors.", files: ["reports-overview.png", "041.avif", "043.avif"] },
    { title: "Pairing a smartwatch", description: "One screen asks the user to put on their watch; the next shows pairing in progress.", files: ["042.avif", "044.avif"] },
    { title: "Testing-kit prompt", description: "A subscription screen includes a prompt to buy a new genetic testing kit.", files: ["046.avif"] },
  ],
  saksham: [
    { title: "Travel dashboard", description: "The dashboard keeps nearby stations and essential travel controls visible at a glance.", files: ["002.avif"] },
    { title: "Plan an accessible journey", description: "A route map and comparison list show journey time, price, and accessible transport options.", files: ["006.avif", "019.avif"] },
    { title: "Start a journey", description: "A focused start screen helps a rider begin the selected journey with confidence.", files: ["008.avif"] },
    { title: "Follow a journey", description: "Live trip states keep progress, the bus schedule, and ticket access close at hand.", files: ["014.avif", "015.avif"] },
    { title: "Bus accessibility details", description: "Detailed vehicle information helps riders assess a bus before boarding.", files: ["011.avif"] },
    { title: "Accessibility reports", description: "An alert flags a lift issue on the route, and a detailed report identifies the affected bus stop.", files: ["016.avif", "033.avif"] },
    { title: "Trips and tickets", description: "Upcoming journeys, digital tickets, and booking details live together as one travel flow.", full: true, files: ["012.avif", "013.avif", "029.avif"] },
    { title: "Welcome and account setup", description: "The entry flow introduces Mobus before moving into account setup and sign-in.", full: true, files: ["035.avif", "024.avif"] },
    { title: "Accessible onboarding", description: "Short stories establish the product purpose and the people it is designed to support.", full: true, files: ["026.avif", "032.avif"] },
    { title: "Bus schedule", description: "Live journey progress keeps the bus schedule available throughout the trip.", files: ["030.avif"] },
  ],
  wikipedia: [
    { title: "Discover and explore", description: "Discovery, news, and search provide multiple ways to enter the knowledge network.", files: ["002.avif", "018.avif", "019.avif"] },
    { title: "Build a research session", description: "Tabs keep separate searches together, while a topic tree shows the hierarchy within a research thread.", files: ["011.avif", "012.avif"] },
    { title: "Save knowledge for later", description: "Saved lists collect articles, quotes, and sections, with a detail view for reviewing one collection.", files: ["013.avif", "017.avif"] },
  ],
  sprinklr: [
    { title: "Scan forecast reports", description: "The report library lists periods, call volume, adherence scores, owners, and a clear action for generating a new report.", files: ["report-library.avif"] },
    { title: "Review the forecast summary", description: "The full report moves from adherence and call-volume patterns to queue utilisation and range summaries.", files: ["forecast-summary.avif"] },
    { title: "See applied adjustments", description: "Applied adjustments sit beside the updated forecast so supervisors can compare current and original call volume.", files: ["applied-adjustments.avif"] },
    { title: "Inspect call volume", description: "The full Call Volume report moves from the forecast trend through queue composition to the queue-level table.", files: ["call-volume.avif"] },
    { title: "Manage forecast adjustments", description: "Review and apply forecast adjustments.", compact: true, files: ["manage-adjustments.avif"] },
  ],
  blip: [
    { title: "Explain the exchange", files: ["landing.avif"] },
    { title: "Capture a journey", description: "An eight-step form breaks the write-up into short prompts covering effort, resources, shortlists, and tips.", files: ["create-wizard.avif"] },
    { title: "Hand over the link", files: ["share.avif"] },
    { title: "Read a published blip", files: ["blip-profile.avif"] },
    { title: "Aggregate by role", description: "Blips for the same role collect into one view, pooling resources, roadmaps, and the contributors behind them.", files: ["job-profile.avif"] },
    { title: "Find relevant experience", files: ["search.avif"] },
  ],
  toli: [
    { title: "Enter the community", description: "Sign in to Toli.", files: ["login.avif"] },
    { title: "Shape a community", description: "Set the community name, URL, description, and colour.", files: ["community-setup.avif"] },
    { title: "Pick channels to follow", description: "Choose channels to follow.", files: ["choose-interests.avif"] },
    { title: "Read the feed", description: "Browse posts, questions, and discussions.", files: ["community-feed.avif"] },
    { title: "Start a thread", description: "Create a post, question, or discussion.", files: ["post-composer.avif"] },
    { title: "Manage members", description: "Review members, roles, and invitations.", files: ["member-directory.avif"] },
  ],
  miscellaneous: [
    // Shapes are grouped so each row fills exactly: the tall capture beside the
    // two squares, the 4:3 cards three-up, then the ultra-wide banners, whose
    // 2.69 proportions genuinely need a full row each.
    { title: "Olive coliving", description: "Website and brand direction for Olive, a coliving brand.", bleed: true, files: ["olive-website.avif"] },
    { title: "Udgam social media", description: "Social campaign design for Udgam, IIT Guwahati's entrepreneurship summit.", files: ["udgam-disrupt.avif", "udgam-workshop.avif"] },
    { title: "Anweshan ecommerce", description: "Ecommerce direction for Anweshan.", files: ["creative-01.avif"] },
    { title: "Anweshan shop", description: "Product and collection layouts for Anweshan.", files: ["creative-09.avif"] },
    { title: "Ideas Forum merchandise", description: "T-shirt graphics for Ideas Forum.", files: ["creative-06.avif"] },
    { title: "Roff website", description: "Website direction for Roff.", files: ["creative-07.avif"] },
    { title: "Evy Energy campaign", description: "Campaign work for Evy Energy.", full: true, fit: "wide", files: ["creative-04.avif"] },
    { title: "Udgam lecture series", description: "Campaign work for the Udgam lecture series.", full: true, fit: "wide", files: ["creative-11.avif"] },
    { title: "Udgam campaign", description: "Additional campaign graphics for Udgam.", full: true, fit: "wide", files: ["creative-12.avif"] },
  ],
};

const motionDescriptions = {
  "Explore route and bus details": "Route details expand from the map to show stops, timing, and fare information.",
  "Read accessibility reports": "Accessibility information opens from the travel dashboard for closer review.",
  "Report an accessibility problem": "The reporting interaction records an accessibility problem encountered during travel.",
  "Discover and resume reading": "Recent reading sits alongside several paths for discovering something new.",
  "Explore topics": "The Randomiser turns selected topic filters into a new article suggestion.",
  "Browse discovery options": "Topic categories can be browsed and refined through related tags.",
  "Navigate articles and reading tools": "Article controls keep history, sections, and reading tools within reach.",
  "Preview linked information": "Linked information opens as a preview without leaving the current article.",
};

function getFileName(src) {
  return src.split("/").pop();
}

// A context line marks its key phrase — the role, team or reach — in [[ ]].
// That phrase renders at full opacity so it reads first.
function renderContext(text) {
  if (!text) return null;
  return text.split(/\[\[(.+?)\]\]/g).map((part, i) =>
    i % 2 === 1 ? <em key={i} className={styles.contextLead}>{part}</em> : part
  );
}

const scrollToTop = (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

function getProjectFlows(project) {
  const skippedFiles = {
    saksham: ["020.avif", "023.avif", "028.avif", "031.avif", "034.avif", "motion-04.mp4"],
    sprinklr: ["add-adjustment.avif"],
  };
  const skip = new Set(skippedFiles[project.slug] || []);
  const images = project.items.filter(item => item.type === "image" && !skip.has(getFileName(item.src)));
  const videos = project.items.filter(item => item.type === "video" && !skip.has(getFileName(item.src)));
  const byFile = new Map(images.map(item => [getFileName(item.src), item]));

  const flows = (galleryFlows[project.slug] || []).map(flow => ({
    ...flow,
    items: flow.files
      .map(file => byFile.get(file))
      .filter(Boolean)
      .map(item => ({ ...item, focus: flow.focus, pan: flow.pan, crop: flow.crop })),
  })).filter(flow => flow.items.length);

  const assigned = new Set(flows.flatMap(flow => flow.items.map(item => item.src)));
  const loose = images
    .filter(item => !assigned.has(item.src))
    .map(item => ({ title: item.title, description: item.title, items: [item] }));

  // Motion clips always stand alone in their own container.
  const motion = videos.map(item => ({
    title: item.title,
    description: motionDescriptions[item.title] || item.title,
    motion: true,
    items: [item],
  }));

  return packFlows([...flows, ...loose, ...motion]);
}

// Each card spans a whole number of columns out of 12: one mockup takes 4,
// two take 6, three or more take 12. Rows are then filled so no gaps remain.
// Two square posters share a panel sized to their own proportions rather than
// the generic fixed-height one, which would fit them by height and waste width.
function isSquarePair(flow) {
  if (flow.items.length !== 2) return false;
  return flow.items.every(item => {
    if (!item?.width || !item?.height) return false;
    const ratio = item.width / item.height;
    return ratio > 0.9 && ratio < 1.1;
  });
}

function flowSpan(flow) {
  if (flow.full || flow.items.length >= 3) return 12;
  // Desktop captures sit two to a row: wide enough to read, small enough that
  // one screen does not fill the viewport.
  if (flow.items.length === 1 && flow.items[0]?.shot) return 6;
  if (flow.items.length === 2) return 6;
  // A very wide banner cannot shrink to a third of the row and stay legible.
  const item = flow.items[0];
  if (item?.width && item?.height && item.width / item.height >= 2.2) return 12;
  return 4;
}

function packFlows(flows) {
  const sized = flows.map(flow => ({ ...flow, span: flowSpan(flow) }));
  const packed = [];
  let row = [];
  let used = 0;

  const flushRow = () => {
    if (!row.length) return;
    const slack = 12 - used;
    if (slack > 0 && !row.some(card => card.compact)) {
      // Grow the row's cards so the run always reaches the full 12 columns.
      const share = Math.floor(slack / row.length);
      let extra = slack - share * row.length;
      row.forEach(card => {
        card.span += share;
        if (extra > 0) { card.span += 1; extra -= 1; }
      });
    }
    packed.push(...row);
    row = [];
    used = 0;
  };

  // A run of same-width cards is split into even rows before packing, so a
  // leftover card is never stretched alone across the full width. Four 4-span
  // cards become 2+2 rather than 3+1.
  const balanced = [];
  for (let i = 0; i < sized.length;) {
    const span = sized[i].span;
    let j = i;
    while (j < sized.length && sized[j].span === span) j += 1;
    const run = sized.slice(i, j);
    const perRow = Math.floor(12 / span);
    if (perRow > 1 && run.length > perRow && run.length % perRow !== 0 && !run.some(card => card.compact)) {
      const rowCount = Math.ceil(run.length / perRow);
      const even = Math.ceil(run.length / rowCount);
      for (let k = 0; k < run.length; k += even) {
        const chunk = run.slice(k, k + even);
        const width = Math.floor(12 / chunk.length);
        let extra = 12 - width * chunk.length;
        chunk.forEach(card => {
          card.span = width + (extra > 0 ? 1 : 0);
          if (extra > 0) extra -= 1;
        });
        balanced.push(...chunk);
      }
    } else {
      balanced.push(...run);
    }
    i = j;
  }

  balanced.forEach(card => {
    if (used + card.span > 12) flushRow();
    row.push(card);
    used += card.span;
    if (used === 12) flushRow();
  });
  flushRow();
  return packed;
}


const warmed = new Set();

function prefetchProject(project) {
  if (typeof window === "undefined" || warmed.has(project.slug)) return;
  warmed.add(project.slug);
  // Decode off the main thread; the browser dedupes these against the real
  // <img> requests once the modal mounts.
  project.items.forEach(item => {
    // Images warm their own source; videos warm their poster frame.
    const src = item.type === "image" ? item.src : item.poster;
    if (!src) return;
    const img = new Image();
    img.decoding = "async";
    img.src = src;
  });
}

function FlowAsset({ item, priority }) {
  const imgRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (priority) img.setAttribute("fetchpriority", "high");
    if (img.complete) setStatus(img.naturalWidth > 0 ? "loaded" : "error");
  }, [item.src, priority]);

  // A panning capture restarts from the top each time it enters view, so the
  // walkthrough always begins where the viewer starts looking.
  useEffect(() => {
    const img = imgRef.current;
    if (!img || item.shot !== "scroll" || item.still) return;
    const observer = new IntersectionObserver(([entry]) => {
      img.getAnimations().forEach(animation => {
        if (entry.isIntersecting) {
          animation.currentTime = 0;
          animation.play();
        } else {
          animation.pause();
        }
      });
      // The image is taller than the viewport, so watch its frame instead.
    }, { root: img.closest("dialog"), rootMargin: "-15% 0px -15% 0px", threshold: 0.25 });
    const frame = img.closest("figure") || img;
    observer.observe(frame);
    return () => observer.disconnect();
  }, [item.src, item.shot, item.still]);

  const focusClass = item.focus ? styles[`flowAssetFocus${item.focus[0].toUpperCase()}${item.focus.slice(1)}`] : "";
  return <div className={`${styles.flowAsset} ${focusClass} ${item.pan ? styles.flowAssetPan : ""} ${status === "loaded" ? styles.isLoaded : styles.isPending}`}>
    <img
      ref={imgRef}
      src={item.src}
      alt={item.title}
      width={item.width}
      height={item.height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onLoad={() => setStatus("loaded")}
      onError={() => setStatus("error")}
    />
      {status !== "loaded" && <span className={styles.mediaStatus} aria-hidden="true">
        {status === "error"
          ? <span className={styles.mediaError}>Couldn&apos;t load</span>
          : <span className={styles.spinner} />}
      </span>}
  </div>;
}

function FlowCard({ flow, index }) {
  // A motion clip carries its own backdrop colour, so the panel adopts it and
  // the two read as one continuous surface.
  const motionBackdrop = flow.motion ? flow.items[0]?.backdrop : null;
  // Desktop captures pick their own layout: a near-viewport screen is shown
  // whole and centred; a tall scroll capture pans from top to bottom.
  const shot = flow.items.length === 1 ? flow.items[0]?.shot : null;
  const shotClass = shot === "viewport" ? styles.flowCardShot
    : shot === "scroll" ? styles.flowCardScroll : "";
  // Some tall captures read better held at the top than panned.
  const stillClass = flow.items.length === 1 && flow.items[0]?.still ? styles.flowCardStill : "";
  return <figure
    className={`${styles.flowCard} ${shotClass} ${stillClass} ${flow.motion ? styles.flowCardMotion : ""} ${!shot && flow.pan ? styles.flowCardPan : ""} ${!shot && flow.crop === "top" ? styles.flowCardCropTop : ""} ${!shot && flow.fit === "wide" ? styles.flowCardWideImage : ""} ${flow.items.length === 2 ? styles.flowCardPair : ""} ${isSquarePair(flow) ? styles.flowCardSquares : ""} ${flow.bleed ? styles.flowCardBleed : ""} ${flow.layout === "mixed" ? styles.flowCardMixed : ""}`}
    style={{ "--flow-span": flow.span }}
  >
    <div
      className={styles.flowMedia}
      style={{
        "--flow-count": flow.items.length,
        ...(motionBackdrop ? { background: motionBackdrop } : null),

      }}
    >
      {flow.items.map(item => item.type === "video"
        ? <FlowVideo key={item.src} item={item} />
        : <FlowAsset key={item.src} item={item} priority={index < 2} />)}
    </div>
    {flow.description ? <figcaption className={styles.flowCaption}>
      <span>{flow.description}</span>
    </figcaption> : null}
  </figure>;
}

function FlowVideo({ item }) {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !preference.matches) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.3 });
    observer.observe(video);
    return () => { observer.disconnect(); video.pause(); };
  }, [item.src]);
  // The clip carries its own device frame, so it is shown whole and the
  // surrounding panel is painted in the asset's own backdrop colour.
  return <div className={styles.flowAsset}>
    <video ref={ref} src={item.src} poster={item.poster} muted loop playsInline preload="metadata" aria-label={item.title} />
  </div>;
}


export default function UndergraduateExplorations({ nextHref }) {
  const router = useRouter();
  const [selection, setSelection] = useState(null);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const openedFromOverview = useRef(false);
  const pageControls = useAnimation();

  const backToTopControls = useAnimation();

  useEffect(() => {
    // This page is shorter than a long-form post, so the writing pages' fixed
    // 400px threshold would only trip near the very end. Reveal at a quarter of
    // whatever the page can actually scroll, capped at the writing-page value.
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const threshold = Math.min(400, scrollable * 0.25);
      backToTopControls.start({ opacity: window.scrollY > threshold ? 1 : 0 });
    };
    // Not called immediately: controls.start() throws before the motion
    // element has mounted, and the link's initial opacity of 0 is already
    // correct at the top of the page.
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [backToTopControls]);

  const handleClick = async () => {
    // Trigger a fade-out animation for other elements
    await pageControls.start({
      opacity: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    });
  };
  const project = selection ? projects[selection.project] : null;
  const projectFlows = project ? getProjectFlows(project) : [];
  const open = Boolean(selection);

  useEffect(() => {
    if (!router.isReady) return;
    const slug = typeof router.query.project === "string" ? router.query.project : null;
    const projectIndex = projects.findIndex(item => item.slug === slug);
    setSelection(projectIndex >= 0 ? { project: projectIndex, index: 0 } : null);
  }, [router.isReady, router.query.project]);

  const closeGallery = () => {
    if (openedFromOverview.current) {
      openedFromOverview.current = false;
      router.back();
      return;
    }
    router.replace(router.pathname, undefined, { shallow: true, scroll: false });
  };

  // This page has no wishlist column; the class lets the writing column widen
  // into that space without affecting the writing pages.
  useEffect(() => {
    const container = document.getElementById("postContainer");
    container?.classList.add("work-page");
    return () => container?.classList.remove("work-page");
  }, []);

  useEffect(() => {
    if (!open) return;
    const modal = dialog.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.showModal();
    modal.scrollTop = 0;
    modal.querySelector('[aria-label="Close gallery"]')?.focus();
    return () => {
      modal.close();
      document.body.style.overflow = overflow;
      trigger.current?.focus();
    };
  }, [open]);

  return <Layout
    isPostPage
    bottomContent={
      // A gallery covers the page, so back to top does not belong there.
      project ? null : (
        <motion.div initial={{ opacity: 0 }} animate={backToTopControls}>
          <motion.div initial={{ opacity: 1 }} animate={pageControls}>
            <Link href="/work/undergraduate-explorations#top" onClick={scrollToTop} className="accent-heading block type-opacity-50">back to top</Link>
          </motion.div>
        </motion.div>
      )
    }
  >
    <Head>
      <title>Selected Work | Bhabani SM</title>
      <meta name="description" content="Selected product and UX work from my college years, spanning independent products, company work, open-source initiatives, and public-service collaborations." />
      <meta property="og:title" content="Selected Work | Bhabani SM" />
      <meta property="og:description" content="Selected product and UX work created across independent, company, open-source, and public-service contexts." />
      <meta property="og:image" content="/work/undergraduate/biote/002.avif" />
    </Head>
    <motion.article initial={{ opacity: 1 }} animate={pageControls} className={styles.page}>
      <div id="top"></div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } }}>
        <Link href="/" onClick={handleClick} className={`accent-heading type-opacity-50 ${styles.back}`}>/back</Link>
      </motion.div>
      <header className={styles.intro}>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.5, delay: 0, ease: "easeInOut" } }} className={`accent-heading type-opacity-50 ${styles.eyebrow}`}>2020–2022</motion.p>
        <h1 className={styles.srOnly}>Selected Design Work</h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.08, ease: "easeInOut" } }} className="para blogtype">Selected design work across independent products, company teams, open-source initiatives, and public-service collaborations.</motion.p>
      </header>
      {projects.map((p, pi) => {
        const items = p.items.filter(item => item.type === "image");
        const remainingUnits = Math.max(0, getProjectFlows(p).length - 1);
        return <motion.section
          key={p.slug}
          id={p.slug}
          className={styles.section}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.5,
              // Every section fades in on load, one after another, so the
              // page arrives whole rather than filling in as it is scrolled.
              delay: Math.min(0.12 + pi * 0.05, 0.4),
              ease: "easeInOut",
            },
          }}
        >
          <Link href={{ pathname: router.pathname, query: { project: p.slug } }} shallow scroll={false} className={styles.projectLink} aria-label={`View ${getProjectFlows(p).length} gallery units from ${p.title}`} onMouseEnter={() => prefetchProject(p)} onFocus={() => prefetchProject(p)} onTouchStart={() => prefetchProject(p)} onClick={e => { trigger.current = e.currentTarget; openedFromOverview.current = true; }}>
            <div className={styles.sectionStackWrap}><span className={`${styles.tile} ${styles.moreTile} ${styles.sectionStack}`}>
              <span className={styles.moreFront} aria-hidden="true"><Preview item={items[0]} /><span className={styles.morePill}>+{remainingUnits}</span></span>
            </span></div>
            <div className={styles.projectHeader}>
              <h2 className={`heading-md type ${styles.heading}`}>{p.title}</h2>
              <p className={`para ${styles.context}`}>{renderContext(p.context)}</p>
            </div>
          </Link>
        </motion.section>})}
      <footer className={`${styles.footer} page-nav`}>
        <Link href="/" onClick={handleClick} className="accent-heading type-opacity-50">/back</Link>
        {nextHref && <Link href={nextHref} onClick={handleClick} className="accent-heading type-opacity-50">/next</Link>}
      </footer>
    </motion.article>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="gallery-title" onCancel={e => { e.preventDefault(); closeGallery(); }}>
      {project && <div className={styles.dialogInner}>
        <div className={styles.dialogColumn}>
          <header className={styles.toolbar}>
            <button type="button" className={styles.backButton} onClick={closeGallery} autoFocus aria-label="Close gallery">/back to Design Explorations</button>
            <div className={styles.galleryHeading}>
              <h2 id="gallery-title" className={styles.galleryTitle}>{project.title}</h2>
              <p className={styles.galleryDescription}>{project.description}</p>
            </div>
          </header>
          <div className={styles.galleryGrid}>
            {projectFlows.map((flow, flowIndex) => <FlowCard key={`${project.slug}-${flow.title}`} flow={flow} index={flowIndex} />)}
          </div>
        </div>
      </div>}
    </dialog>
  </Layout>;
}

export async function getStaticProps() {
  // The reading order ends here and returns to the writing, so this page
  // needs the first post's slug from Notion.
  try {
    const pageProperties = await retrievePageProperties(
      process.env.NOTION_DATABASE_ID
    );
    const firstPost = Array.isArray(pageProperties)
      ? pageProperties.find((p) => p.Tags === "notes" && p.slug)
      : null;
    return {
      props: { nextHref: firstPost ? `/post/${firstPost.slug}` : "/" },
      revalidate: 1800,
    };
  } catch (error) {
    console.error("Error resolving next link:", error);
    return { props: { nextHref: "/" }, revalidate: 60 };
  }
}
