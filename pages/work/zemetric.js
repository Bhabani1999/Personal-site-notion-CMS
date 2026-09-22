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

// The panel's height is derived from the capture it holds rather than fixed
// for the whole gallery, so a shallow screen does not sit under a deep band
// of empty space. It is measured from the card's width, which does not
// depend on the panel's height, so setting the height cannot feed back into
// the measurement.
function useFittedPanel(ref, unit, enabled) {
  useEffect(() => {
    const figure = ref.current;
    if (!figure || !enabled) return;
    const panel = figure.querySelector(`.${styles.cardMedia}`);
    if (!panel) return;

    let lastWidth = 0;
    let frame = 0;
    const apply = () => {
      const width = figure.getBoundingClientRect().width;
      // Setting the panel's height resizes the figure, which this observer
      // also sees. Only the width feeds the calculation, so a height-only
      // change is ignored and the two cannot chase each other.
      if (!width || width === lastWidth) return;
      lastWidth = width;
      const count = unit.items.length || 1;
      // Padding comes from the stylesheet, which differs between the desktop
      // and phone layouts, so it is read rather than assumed.
      const panelStyle = getComputedStyle(panel);
      const padX = parseFloat(panelStyle.paddingLeft) || 0;
      const padBottom = parseFloat(panelStyle.paddingBottom) || 0;
      // A unit can ask for more or less room above its capture than the
      // default gutter, for screens that read better tighter or airier.
      const padTop = typeof unit.padTop === "number"
        ? unit.padTop
        : parseFloat(panelStyle.paddingTop) || 0;
      const gap = parseFloat(panelStyle.columnGap) || 0;
      const slotW = (width - padX * 2 - gap * (count - 1)) / count;
      // The deepest capture in the unit sets the height the others sit in.
      const tallest = Math.max(
        ...unit.items.map(item => slotW / (item.width / item.height))
      );
      const bar = Math.min(BAR_MAX, Math.max(BAR_MIN, slotW * BAR_RATIO));
      const next = `${Math.round(padTop + padBottom + tallest + bar)}px`;
      // Written on the next frame rather than inside the observer callback:
      // the height change resizes the capture, and doing that during the
      // same delivery is what the browser reports as an observer loop.
      frame = requestAnimationFrame(() => {
        panel.style.height = next;
        if (typeof unit.padTop === "number") panel.style.paddingTop = `${unit.padTop}px`;
      });
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(figure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      panel.style.height = "";
      panel.style.paddingTop = "";
    };
  }, [ref, unit, enabled]);
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

      // Fit the complete capture at the largest size the panel allows. The
      // card supplies the consistent rhythm; normalizing every image to one
      // reference ratio only made desktop UI unnecessarily small.
      const ratio = item.width / item.height;
      let w = slotW;
      let capH = w / ratio;
      // The browser bar belongs inside the same available height. Repeating
      // the calculation settles the small dependency between width and the
      // proportional bar height without cropping the screenshot.
      if (!item.fillWidth) {
        for (let i = 0; i < 3; i += 1) {
          const bar = barFor(w);
          const maxCapH = Math.max(0, innerH - bar);
          capH = Math.min(w / ratio, maxCapH);
          w = Math.min(slotW, capH * ratio);
        }
      }
      const displayScale = item.displayScale || 1;
      w *= displayScale;
      capH *= displayScale;
      const barH = barFor(w);
      const cropBottom = Math.min(Math.max(item.cropBottom || 0, 0), 0.4);
      shell.style.setProperty("--chrome-h", `${barH}px`);
      shell.style.width = `${w}px`;
      shell.style.height = item.fillWidth
        ? `${innerH}px`
        : `${capH * (1 - cropBottom) + barH}px`;
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [item.src, item.width, item.height, item.displayScale, item.cropBottom, item.fillWidth]);

  return <span
    className={`${styles.cardAsset} ${styles.chromeShell} ${isPhone ? styles.phoneFrame : ""} ${item.fit === "contain" ? styles.assetContain : ""} ${item.centered ? styles.assetCentered : ""} ${item.cropBottom || item.fillWidth ? styles.assetCropBottom : ""} ${status === "loaded" ? styles.isLoaded : styles.isPending}`}
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

// One gallery unit: the panel plus its caption. A component rather than an
// inline block so the panel can size itself to the capture it holds.
function UnitCard({ unit, index, fitPanel }) {
  const ref = useRef(null);
  useFittedPanel(ref, unit, fitPanel);

  // A unit of three needs the full row; anything smaller takes half.
  const span = unit.full || unit.items.length >= 3 ? 12 : 6;
  const dense = unit.items.length >= 4;
  // A landscape capture needs a short wide panel, not the tall one that
  // suits phone screens.
  const wide = unit.items.every(x => x.width > x.height);
  // Only a genuinely long capture pans. A normal 375x812 phone screen is
  // already taller than 2:1, so the threshold sits well above that.
  const tall = unit.items.length === 1 && (
    unit.items[0].pan || unit.items[0].height > unit.items[0].width * 3
  );
  const desktopPan = tall && Boolean(unit.items[0].panAspect);

  return <figure
    ref={ref}
    className={`${styles.card} ${tall ? styles.cardTall : ""} ${desktopPan ? styles.cardDesktopPan : ""} ${dense ? styles.cardDense : ""} ${wide ? styles.cardWide : ""} ${unit.items.length >= 3 ? styles.cardPan : ""}`}
    style={{
      "--unit-span": span,
      "--pan-ratio": unit.items[0].panAspect || "375 / 812",
    }}
  >
    <div className={styles.cardMedia}>
      <div className={styles.panTrack}>
        {unit.items.map(item => (
          <GalleryImage key={item.src} item={item} priority={index < 2} />
        ))}
      </div>
    </div>
    {unit.caption && <figcaption className={styles.cardCaption}>{unit.caption}</figcaption>}
  </figure>;
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
          {...fadeIn(Math.min(0.12 + i * 0.05, 0.4))}
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
        <motion.div className={`${styles.grid} ${styles.zemetricGrid} ${openKey === "chargeconnect" ? styles.chargeconnectGrid : ""}`} {...galleryFade(0.06)}>
          {galleryUnits.map((unit, i) => (
            <UnitCard key={i} unit={unit} index={i} fitPanel />
          ))}
        </motion.div>
      </div>}
    </dialog>
  </Layout>;
}
