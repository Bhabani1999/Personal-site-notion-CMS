import Head from "next/head";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import styles from "../../styles/Undergraduate.module.css";
import { FlowCard, packFlows } from "./undergraduate-explorations";
import { allDesignGroups, allDesignCount } from "../../allDesignWork";
import { retrievePageProperties } from "../../notionModule";

const scrollToTop = event => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Every screen from the three work pages, grouped by where it came from.
// The case studies carry the explanation, so this view runs without
// captions: it is for scanning the work, not reading about it.
function groupUnits(group) {
  return packFlows(
    group.items.map(item => ({
      title: item.title,
      items: [item],
      pan: item.pan,
      crop: item.crop,
      fit: item.fit,
    }))
  );
}

export default function AllDesignWork({ nextHref }) {
  const pageControls = useAnimation();
  const backToTopControls = useAnimation();

  const handleClick = async () => {
    await pageControls.start({ opacity: 0, transition: { duration: 0.2, ease: "easeOut" } });
  };

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
        <motion.p {...fadeIn(0.08)} className="para blogtype">
          Every screen from the work above, in one place. The case studies carry the reasoning; this is the visual record.
        </motion.p>
      </header>

      {allDesignGroups.map((group, groupIndex) => (
        <motion.section
          key={group.id}
          id={group.id}
          className={styles.section}
          {...fadeIn(Math.min(0.12 + groupIndex * 0.03, 0.3))}
        >
          <div className={styles.projectHeader}>
            <p className={`accent-heading type-opacity-50 ${styles.eyebrow}`}>{group.source}</p>
            <h2 className={`heading-md type ${styles.heading}`}>{group.title}</h2>
          </div>
          <div className={styles.galleryGrid}>
            {groupUnits(group).map((flow, flowIndex) => (
              <FlowCard key={`${group.id}-${flowIndex}`} flow={flow} index={flowIndex} />
            ))}
          </div>
        </motion.section>
      ))}

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
