/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Layout from "../../components/Layout";
import content from "../../content/zemetric.json";
import styles from "../../styles/Evy.module.css";

// A gallery stop sits inline in the narrative: a stacked thumbnail that
// opens the full-screen gallery, matching the pattern on the other work page.
function GalleryStop({ gallery, galleryKey, onOpen }) {
  // A gallery is grouped into units; the thumbnail wants a flat count.
  const items = gallery.units ? gallery.units.flatMap(u => u.items) : (gallery.items || []);
  const first = items[0];
  const remaining = Math.max(0, items.length - 1);
  // A tall screenshot is inset like a phone; a wide one fills more of the tile.
  const previewClass = first && first.height > first.width * 1.35
    ? styles.mobilePreview
    : styles.shotPreview;

  // The whole row is the link, so the title and caption open the gallery too.
  return <Link
    href={{ pathname: "/work/zemetric", query: { gallery: galleryKey } }}
    shallow
    scroll={false}
    className={styles.stopWrap}
    onClick={onOpen}
    onMouseEnter={() => prefetchGallery(galleryKey, gallery)}
    onFocus={() => prefetchGallery(galleryKey, gallery)}
    onTouchStart={() => prefetchGallery(galleryKey, gallery)}
    aria-label={first ? `View ${items.length} screens from ${gallery.title}` : `${gallery.title} - screens not yet added`}
  >
    <span className={`${styles.tile} ${styles.moreTile}`} aria-hidden="true">
      <span className={styles.moreFront}>
        {first
          ? <img src={first.src} alt="" className={previewClass} loading="lazy" decoding="async" />
          : <span className={styles.stopPending} />}
        {remaining > 0 && <span className={styles.morePill}>+{remaining}</span>}
      </span>
    </span>
    <span className={styles.stopText}>
      <span className={styles.stopTitle}>{gallery.title}</span>
      <span className={styles.stopCaption}>{gallery.caption || gallery.description}</span>
    </span>
  </Link>;
}

// A gallery's screens are fetched on hover so the modal opens warm. The
// browser dedupes these against the real requests that follow.
const warmed = new Set();
function prefetchGallery(key, gallery) {
  if (typeof window === "undefined" || warmed.has(key)) return;
  warmed.add(key);
  const items = gallery.units ? gallery.units.flatMap(u => u.items) : (gallery.items || []);
  items.slice(0, 8).forEach(item => {
    const img = new Image();
    img.decoding = "async";
    img.src = item.src;
  });
}

// Each screen fades in once decoded, over a placeholder that holds its
// space, so a slow connection shows a shimmer rather than a jump.
// The chrome bar's height as a share of the capture's own width, with a
// floor and ceiling so it stays slim on a wide screen and legible on a
// small one.
const BAR_RATIO = 0.026;
const BAR_MIN = 7.5;
const BAR_MAX = 13;
// A bar never takes more than this share of a small capture's width.
const BAR_CAP = 0.04;
// Every capture is sized to the same stack height, taken from the sites
// screen (1903x967). Captures vary from 0.84 to 2.45, and letting each one
// fill the panel made the page jump between very tall and very short units.
const REFERENCE_RATIO = 1903 / 967;

function GalleryImage({ item, priority }) {
  const ref = useRef(null);
  const [status, setStatus] = useState("loading");
  const isPhone = item.height > item.width * 1.45;

  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    if (img.complete) setStatus(img.naturalWidth > 0 ? "loaded" : "error");
  }, [item.src]);

  // Whether width or height constrains a capture depends on the unit it sits
  // in, so both the bar's height and the shell's width are computed from the
  // panel rather than guessed at in CSS. The panel is observed, not the
  // capture: observing the capture while resizing its own shell would feed
  // the observer its own output.
  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    const shell = img.parentElement;
    const panel = shell.closest(`.${styles.cardMedia}`) || shell.parentElement;

    const apply = () => {
      const panelBox = panel.getBoundingClientRect();
      if (!panelBox.height) return;
      const style = getComputedStyle(panel);
      const count = panel.querySelectorAll("img").length || 1;
      const gap = parseFloat(style.columnGap) || 0;
      const innerW = panelBox.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const innerH = panelBox.height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      const slotW = (innerW - gap * (count - 1)) / count;

      // The floor keeps the bar legible, but on a small capture a fixed
      // floor would dominate it, so cap the bar at a share of the width too.
      const barFor = (width) => Math.min(
        BAR_MAX,
        Math.max(Math.min(BAR_MIN, width * BAR_CAP), width * BAR_RATIO)
      );

      // Every capture in a gallery gets the same stack height, set by the
      // reference ratio, so the units line up down the page. A capture wider
      // than the reference then sits narrower than the slot rather than
      // being cropped, and a squarer one is scaled down to fit the height.
      const ratio = item.width / item.height;
      let capH = Math.min(innerH, slotW / REFERENCE_RATIO);
      let w = capH * ratio;
      if (w > slotW) {
        w = slotW;
        capH = w / ratio;
      }
      // Fit the bar into the same height so the whole stack matches.
      for (let i = 0; i < 3; i += 1) {
        const bar = barFor(w);
        const maxCapH = Math.min(innerH, slotW / REFERENCE_RATIO) - bar;
        capH = maxCapH;
        w = Math.min(slotW, capH * ratio);
        capH = w / ratio;
      }
      const displayScale = item.displayScale || 1;
      w *= displayScale;
      capH *= displayScale;
      const barH = barFor(w);
      const cropBottom = Math.min(Math.max(item.cropBottom || 0, 0), 0.4);
      shell.style.setProperty("--chrome-h", `${barH}px`);
      shell.style.width = `${w}px`;
      shell.style.height = `${capH * (1 - cropBottom) + barH}px`;
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [item.src, item.width, item.height, item.displayScale, item.cropBottom]);

  return <span
    className={`${styles.cardAsset} ${styles.chromeShell} ${isPhone ? styles.phoneFrame : ""} ${item.fit === "contain" ? styles.assetContain : ""} ${item.centered ? styles.assetCentered : ""} ${item.cropBottom ? styles.assetCropBottom : ""} ${status === "loaded" ? styles.isLoaded : styles.isPending}`}
  >
    <span className={styles.chromeBar} aria-hidden="true">
      <span className={styles.chromeNav}>
        {/* Material Symbols chevrons, so the arrows stay crisp at any size. */}
        <svg className={styles.chromeIcon} viewBox="0 -960 960 960" fill="currentColor">
          <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
        </svg>
        <svg className={`${styles.chromeIcon} ${styles.chromeIconNext}`} viewBox="0 -960 960 960" fill="currentColor">
          <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
        </svg>
      </span>
    </span>
    <img
      ref={ref}
      src={item.src}
      alt={item.title}
      width={item.width}
      height={item.height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onLoad={() => setStatus("loaded")}
      onError={() => setStatus("error")}
    />
  </span>;
}

export default function Zemetric() {
  const router = useRouter();
  const [openKey, setOpenKey] = useState(null);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const openedFromPage = useRef(false);
  const pageControls = useAnimation();
  const backToTopControls = useAnimation();

  const gallery = openKey ? content.galleries[openKey] : null;
  const galleryUnits = gallery
    ? (gallery.units || (gallery.items || []).map(item => ({ caption: item.title, items: [item] })))
    : [];
  const notesBySection = Object.fromEntries(
    content.notes.map(note => [note.section, note])
  );

  useEffect(() => {
    if (!router.isReady) return;
    const key = typeof router.query.gallery === "string" ? router.query.gallery : null;
    setOpenKey(key && content.galleries[key] ? key : null);
  }, [router.isReady, router.query.gallery]);

  const closeGallery = () => {
    if (openedFromPage.current) {
      openedFromPage.current = false;
      router.back();
      return;
    }
    router.replace(router.pathname, undefined, { shallow: true, scroll: false });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const threshold = Math.min(400, scrollable * 0.25);
      backToTopControls.start({ opacity: window.scrollY > threshold ? 1 : 0 });
    };
    // Not called immediately: controls.start() throws before the motion
    // element has mounted, and the initial opacity of 0 is already correct.
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [backToTopControls]);

  // Work pages drop the side column; the layout rules live in styles.css.
  useEffect(() => {
    const container = document.querySelector(".container");
    container?.classList.add("work-page");
    return () => container?.classList.remove("work-page");
  }, []);

  useEffect(() => {
    const modal = dialog.current;
    if (!openKey || !modal) return;
    const overflow = document.body.style.overflow;
    modal.showModal();
    document.body.style.overflow = "hidden";
    modal.scrollTop = 0;
    modal.querySelector('[aria-label="Close gallery"]')?.focus();
    return () => {
      modal.close();
      document.body.style.overflow = overflow;
      trigger.current?.focus();
    };
  }, [openKey]);

  const handleClick = async () => {
    await pageControls.start({ opacity: 0, transition: { duration: 0.2, ease: "easeOut" } });
  };

  const scrollToTop = (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fadeIn = (delay = 0) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, delay, ease: "easeInOut" } },
  });

  // Sections below the fold reveal as the reader reaches them, rather than
  // all fading in at once behind the first screen. `once` keeps a section
  // settled after its first reveal, and the margin starts the fade a little
  // before the section's top edge arrives.
  const revealOnScroll = (delay = 0) => ({
    initial: { opacity: 0 },
    whileInView: { opacity: 1, transition: { duration: 0.5, delay, ease: "easeInOut" } },
    viewport: { once: true, margin: "0px 0px -12% 0px" },
  });

  // A gallery opens over the page the reader is already on, so it settles
  // faster than a page transition does.
  const galleryFade = (delay = 0) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.28, delay, ease: "easeInOut" } },
  });

  return <Layout
    isPostPage
    bottomContent={
      // A gallery covers the page, so back to top does not belong there.
      openKey ? null : (
        <motion.div initial={{ opacity: 0 }} animate={backToTopControls}>
          <motion.div initial={{ opacity: 1 }} animate={pageControls}>
            <Link href="/work/zemetric#top" onClick={scrollToTop} className="accent-heading block type-opacity-50">back to top</Link>
          </motion.div>
        </motion.div>
      )
    }
  >
    <Head>
      <title>{content.title} | Bhabani SM</title>
      <meta name="description" content={content.intro.slice(0, 180)} />
      <meta property="og:title" content={`${content.title} | Bhabani SM`} />
      <meta property="og:description" content={content.intro.slice(0, 180)} />
    </Head>

    <motion.article initial={{ opacity: 1 }} animate={pageControls} className={styles.page}>
      <div id="top"></div>

      <motion.div {...fadeIn()}>
        <Link href="/" onClick={handleClick} className={`accent-heading type-opacity-50 ${styles.back}`}>/back</Link>
      </motion.div>

      <header className={styles.intro}>
        <motion.p {...fadeIn(0)} className={`accent-heading type-opacity-50 ${styles.eyebrow}`}>{content.dateLabel}</motion.p>
        <motion.h1 {...fadeIn(0.04)} className={`title type ${styles.title}`}>{content.title}</motion.h1>
        <motion.p {...fadeIn(0.08)} className={`para blogtype ${styles.lede}`}>{content.intro}</motion.p>
      </header>

      {content.sections.map((section, i) => (
        <motion.section
          key={section.id}
          id={section.id}
          className={`${styles.section} ${section.heading ? "" : styles.sectionContinued}`}
          {...(i === 0 ? fadeIn(0.12) : revealOnScroll())}
        >
          {section.heading && <h2 className={`heading-md type ${styles.heading}`}>{section.heading}</h2>}
          {section.body.map((p, j) => {
            const note = notesBySection[section.id];
            const hasNote = note && note.paragraph === j;
            return <p key={j} className={`para ${styles.body} ${hasNote ? styles.bodyWithNote : ""}`}>
              {p}
              {hasNote && <>
                <sup className={styles.referenceMarker}>{note.marker}</sup>
                <span className={`sidenote para type-opacity-50 ${styles.alignedSidenote}`}>
                  <sup className={styles.sidenoteMarker}>{note.marker}</sup>
                  {note.text}
                  {note.link && <a href={note.link.href} target="_blank" rel="noreferrer" className="sidenote-link">{note.link.label}</a>}
                  {note.after}
                </span>
              </>}
            </p>;
          })}

          {section.stats && <ul className={styles.stats}>
            {section.stats.map((s, j) => <li key={j} className={styles.stat}>{s}</li>)}
          </ul>}

          {section.outro && section.outro.map((p, j) => <p key={j} className={`para ${styles.body}`}>{p}</p>)}

          {section.gallery && content.galleries[section.gallery] && (
            <GalleryStop
              gallery={content.galleries[section.gallery]}
              galleryKey={section.gallery}
              onOpen={(e) => {
                trigger.current = e?.currentTarget;
                openedFromPage.current = true;
              }}
            />
          )}

          {section.galleries && (
            <div className={styles.pairedStops}>
              {section.galleries.map((galleryKey) => (
                <GalleryStop
                  key={galleryKey}
                  gallery={content.galleries[galleryKey]}
                  galleryKey={galleryKey}
                  onOpen={(e) => {
                    trigger.current = e?.currentTarget;
                    openedFromPage.current = true;
                  }}
                />
              ))}
            </div>
          )}
        </motion.section>
      ))}

      <motion.footer className={`${styles.footer} page-nav`} {...fadeIn(0.14)}>
        <Link href="/" onClick={handleClick} className="accent-heading type-opacity-50">/back</Link>
        <Link href="/work/evy-energy" onClick={handleClick} className="accent-heading type-opacity-50">/next</Link>
      </motion.footer>
    </motion.article>

    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="zemetric-gallery-title"
      onCancel={(e) => { e.preventDefault(); closeGallery(); }}
    >
      {gallery && <div className={styles.dialogInner} key={openKey}>
        <motion.header className={styles.toolbar} {...galleryFade(0)}>
          <button type="button" className={styles.backButton} onClick={closeGallery} autoFocus aria-label="Close gallery">
            /back to Zemetric
          </button>
          <div className={`${styles.galleryHeading} ${openKey === "chargeconnect" ? styles.chargeconnectHeading : ""}`}>
            <h2 id="zemetric-gallery-title" className={styles.galleryTitle}>{gallery.title}</h2>
            {gallery.description && <p className={styles.galleryDescription}>{gallery.description}</p>}
          </div>
        </motion.header>
        <motion.div className={`${styles.grid} ${openKey === "chargeconnect" ? styles.chargeconnectGrid : ""}`} {...galleryFade(0.06)}>
          {galleryUnits.map((unit, i) => {
            // A unit of three needs the full row; anything smaller takes half.
            const span = unit.full || unit.items.length >= 3 ? 12 : 6;
            const dense = unit.items.length >= 4;
            // A landscape capture needs a short wide panel, not the tall
            // one that suits phone screens.
            const wide = unit.items.every(x => x.width > x.height);
            // Only a genuinely long capture pans. A normal 375x812 phone screen
            // is already taller than 2:1, so the threshold sits well above that.
            const tall = unit.items.length === 1 && (
              unit.items[0].pan || unit.items[0].height > unit.items[0].width * 3
            );
            const desktopPan = tall && Boolean(unit.items[0].panAspect);
            return <figure
              key={i}
              className={`${styles.card} ${tall ? styles.cardTall : ""} ${desktopPan ? styles.cardDesktopPan : ""} ${dense ? styles.cardDense : ""} ${wide ? styles.cardWide : ""} ${unit.items.length >= 3 ? styles.cardPan : ""}`}
              style={{
                "--unit-span": span,
                "--pan-ratio": unit.items[0].panAspect || "375 / 812"
              }}
            >
              <div className={styles.cardMedia}>
                <div className={styles.panTrack}>
                  {unit.items.map((item) => (
                    <GalleryImage key={item.src} item={item} priority={i < 2} />
                  ))}
                </div>
              </div>
              {unit.caption && <figcaption className={styles.cardCaption}>{unit.caption}</figcaption>}
            </figure>;
          })}
        </motion.div>
      </div>}
    </dialog>
  </Layout>;
}
