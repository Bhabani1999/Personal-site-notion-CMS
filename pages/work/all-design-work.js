import Head from "next/head";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import styles from "../../styles/Evy.module.css";
import { GalleryImage } from "./zemetric";
import { allDesignUnits, allDesignCount } from "../../allDesignWork";
import { retrievePageProperties } from "../../notionModule";

const scrollToTop = event => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export default function AllDesignWork({ nextHref }) {
  const pageControls = useAnimation();
  const backToTopControls = useAnimation();

  const handleClick = async () => {
    await pageControls.start({ opacity: 0, transition: { duration: 0.2, ease: "easeOut" } });
  };

  // This page is the gallery's layout standing on its own, so it drops the
  // writing column and spans the viewport the way the modal does.
  useEffect(() => {
    const container = document.getElementById("postContainer");
    container?.classList.add("gallery-page");
    return () => container?.classList.remove("gallery-page");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const threshold = Math.min(400, scrollable * 0.25);
      backToTopControls.start({ opacity: window.scrollY > threshold ? 1 : 0 });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [backToTopControls]);

  const fadeIn = (delay = 0) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, delay, ease: "easeInOut" } },
  });

  return <Layout
    isPostPage
    bottomContent={
      <motion.div initial={{ opacity: 0 }} animate={backToTopControls}>
        <motion.div initial={{ opacity: 1 }} animate={pageControls}>
          <Link href="/work/all-design-work#top" onClick={scrollToTop} className="accent-heading block type-opacity-50">back to top</Link>
        </motion.div>
      </motion.div>
    }
  >
    <Head>
      <title>All design work | Bhabani SM</title>
      <meta name="description" content={`Every screen from my product and design work: ${allDesignCount} images across charging platforms, fleet software, and earlier explorations.`} />
      <meta property="og:title" content="All design work | Bhabani SM" />
      <meta property="og:description" content="Every screen from my product and design work, in one gallery." />
    </Head>

    <motion.article initial={{ opacity: 1 }} animate={pageControls} className={styles.page}>
      <div id="top"></div>

      <motion.div {...fadeIn()}>
        <Link href="/" onClick={handleClick} className={`accent-heading type-opacity-50 ${styles.back}`}>/back</Link>
      </motion.div>

      <header className={styles.intro}>
        <motion.p {...fadeIn(0)} className={`accent-heading type-opacity-50 ${styles.eyebrow}`}>{allDesignCount} screens</motion.p>
        <motion.h1 {...fadeIn(0.04)} className={`title type ${styles.title}`}>All design work</motion.h1>
        <motion.p {...fadeIn(0.08)} className={`para blogtype ${styles.lede}`}>
          Every screen from the work above, in one place. The case studies carry the reasoning; this is the visual record.
        </motion.p>
      </header>

      <motion.div className={styles.grid} {...fadeIn(0.12)}>
        {allDesignUnits.map((unit, i) => {
          // The same layout rules the individual galleries use, so a unit
          // keeps the shape it was designed with.
          const span = unit.full || unit.items.length >= 3 ? 12 : 6;
          const dense = unit.items.length >= 4;
          const wide = unit.items.every(x => x.width > x.height);
          const tall = unit.items.length === 1 && (
            unit.items[0].pan || unit.items[0].height > unit.items[0].width * 3
          );
          const desktopPan = tall && Boolean(unit.items[0].panAspect);
          return <figure
            key={`${unit.source}-${i}-${unit.items[0].src}`}
            className={`${styles.card} ${tall ? styles.cardTall : ""} ${desktopPan ? styles.cardDesktopPan : ""} ${dense ? styles.cardDense : ""} ${wide ? styles.cardWide : ""} ${unit.items.length >= 3 ? styles.cardPan : ""}`}
            style={{
              "--unit-span": span,
              "--pan-ratio": unit.items[0].panAspect || "375 / 812",
            }}
          >
            <div className={styles.cardMedia}>
              <div className={styles.panTrack}>
                {unit.items.map(item => (
                  <GalleryImage key={item.src} item={item} priority={i < 2} />
                ))}
              </div>
            </div>
          </figure>;
        })}
      </motion.div>

      <footer className={`${styles.footer} page-nav`}>
        <Link href="/" onClick={handleClick} className="accent-heading type-opacity-50">/back</Link>
        {nextHref && <Link href={nextHref} onClick={handleClick} className="accent-heading type-opacity-50">/next</Link>}
      </footer>
    </motion.article>
  </Layout>;
}

export async function getStaticProps() {
  // This page sits last in the work order, so /next hands back to the writing.
  try {
    const pageProperties = await retrievePageProperties(process.env.NOTION_DATABASE_ID);
    const firstPost = Array.isArray(pageProperties)
      ? pageProperties.find(p => p.Tags === "notes" && p.slug)
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
