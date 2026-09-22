import Layout from "../../components/Layout";
import Link from "next/link";
import Image from "next/image";
import retrievePageData from "../../notioncontentModule";
import { retrievePageProperties } from "../../notionModule";
import Head from "next/head";
import { motion, useAnimation } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { nextAfterPost } from "../../navigationOrder";
import conversionCulture from "../../content/posts/conversion-culture";
import vietnamChair from "../../content/posts/vietnam-chair";

const localPosts = {
  "the-street-begins-with-a-chair": vietnamChair,
  "conversion-culture": conversionCulture,
};

const postMetadataOverrides = {
  "why-how-create-personal-space2": {
    pageTitle: "Designing a Timeless Website",
    pageDescription:
      "On owning a corner of the internet and separating its visual system from its content.",
  },
};

function BlogPage({ pageContent, nextHref }) {
  const pageControls = useAnimation();
  const SCROLL_THRESHOLD = 400; // Adjust this value to set the scroll threshold
  const router = useRouter();

  const handleClick = async () => {
    // Trigger a fade-out animation for other elements
    await pageControls.start({
      opacity: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    });
  };

  const renderH2Headings = () => {
    if (!pageContent || !pageContent.content) {
      return null;
    }

    const scrollToHeading = (event, headingText) => {
      event.preventDefault(); // Prevent the default anchor link behavior
      const headingElement = document.getElementById(headingText);
      if (headingElement) {
        headingElement.scrollIntoView({ behavior: "smooth" });
      }
    };

    const h2Headings = pageContent.content.filter(
      (block) => block.type === "h2"
    );

    if (h2Headings.length === 0) {
      return null; // No 'h2' headings found, return null
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.8, delay: 0.04, ease: "easeInOut" },
        }}
      >
        {h2Headings.map((heading, index) => (
          <Link
            href={`#${heading.text}`}
            key={index}
            className="para h2link block type-opacity-50"
            onClick={(event) => scrollToHeading(event, heading.text)}
          >
            {heading.text}
          </Link>
        ))}
      </motion.div>
    );
  };
  // Define content for top-container and bottom-container
  function renderTopContent() {
    return (
      <motion.div initial={{ opacity: 1 }} animate={pageControls}>
        <div>
          <div className="spacer"></div>
          {renderH2Headings()}
        </div>
      </motion.div>
    );
  }

  function RenderBottomContent() {
    const controls = useAnimation();
    const isMounted = useRef(true); // Use a ref to track the mounted state

    const scrollToTop = () => {
      // Your scrollToTop logic here
    };

    useEffect(() => {
      if (isMounted.current) {
        const handleScroll = () => {
          if (window.scrollY > SCROLL_THRESHOLD) {
            controls.start({ opacity: 1 });
          } else {
            controls.start({ opacity: 0 });
          }
        };

        window.addEventListener("scroll", handleScroll);

        // Clean up the event listener and update the mounted state when the component unmounts
        return () => {
          isMounted.current = false;
          window.removeEventListener("scroll", handleScroll);
        };
      }
    }, [controls]);

    return (
      <motion.div initial={{ opacity: 0 }} animate={controls}>
        <motion.div initial={{ opacity: 1 }} animate={pageControls}>
          <Link
            href="#top"
            className="accent-heading block type-opacity-50"
            onClick={scrollToTop}
          >
            back to top
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  // Render the page content when it's available
  const renderPageContent = () => {
    if (!pageContent) {
      return null;
    }

    // Render the content based on the structure returned by the notionContentModule
    // You can customize this part based on your specific content structure
    return (
      <motion.div initial={{ opacity: 1 }} animate={pageControls}>
        <div className="mobile-show">
          <div className="nav-container-mobile nav-container">
            <Link
              onClick={handleClick}
              className="accent-heading type-opacity-50 "
              href="../"
            >
              /back
            </Link>
          </div>
          <div className="line mobile-show" style={{ height: "1px" }}></div>
        </div>
        <div className="main-content">
          <div>
            <div id="top"></div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.5, ease: "easeInOut" },
              }}
            >
              <Link
                className="accent-heading type-opacity-50"
                onClick={handleClick}
                href="../"
              >
                /back
              </Link>
            </motion.div>
            <div style={{ height: "52px" }}></div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.4, delay: 0, ease: "easeInOut" },
            }}
            className="icon"
          >
            {pageContent.properties.icon}
          </motion.p>
          <div style={{ height: "26px" }}></div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.5, delay: 0, ease: "easeInOut" },
            }}
            className="type title"
          >
            {pageContent.properties.pageTitle}
          </motion.h1>
          <div style={{ height: "26px" }}></div>
          <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.3, delay: 0, ease: "easeInOut" },
              }}
            >
              {pageContent && pageContent.properties && (
                <div className="sidebyside">
                  <p className="para type-opacity-50">
                    In {pageContent.properties.Tags},
                  </p>

                  <p className="para type-opacity-50">
                    &nbsp;{formatDate(pageContent.properties.creationDate)}
                  </p>
                </div>
              )}
            </motion.div>
          <div style={{ height: "26px" }}></div>
          {pageContent.content.map((block, index) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.5, delay: 0.1, ease: "easeInOut" },
              }}
              key={index}
            >
              {block.type === "paragraph" && (
                <p className="para blogtype top-padding-13 bottom-padding-13">
                  {
                    block.content.reduce(
                      (acc, text, textIndex, content) => {
                        if (text.contentType === "sidenote") {
                          if (!acc.currentSidenote) {
                            acc.currentSidenote = [text];
                          } else {
                            acc.currentSidenote.push(text);
                          }
                        } else {
                          if (acc.currentSidenote) {
                            const sidenoteText = acc.currentSidenote.map(
                              (sidenote, sidenoteIndex) => {
                                if (sidenote.href) {
                                  return (
                                    <a
                                      key={sidenoteIndex}
                                      className="sidenote-link underline"
                                      href={sidenote.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {sidenote.text}
                                    </a>
                                  );
                                } else {
                                  return (
                                    <span key={sidenoteIndex}>
                                      {sidenote.text}
                                    </span>
                                  );
                                }
                              }
                            );
                            acc.result.push(
                              <span
                                key={acc.result.length}
                                className="sidenote"
                              >
                                {sidenoteText}
                              </span>
                            );
                            delete acc.currentSidenote;
                          }
                          if (text.href) {
                            acc.result.push(
                              <a
                                key={textIndex}
                                className="blogtype noorange underline"
                                href={text.href}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {text.text}
                              </a>
                            );
                          } else {
                            acc.result.push(
                              <span key={textIndex}>{text.text}</span>
                            );
                          }
                        }
                        if (
                          textIndex === content.length - 1 &&
                          acc.currentSidenote
                        ) {
                          const sidenoteText = acc.currentSidenote.map(
                            (sidenote, sidenoteIndex) => {
                              if (sidenote.href) {
                                return (
                                  <a
                                    key={sidenoteIndex}
                                    className="sidenote-link  underline"
                                    href={sidenote.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {sidenote.text}
                                  </a>
                                );
                              } else {
                                return (
                                  <span key={sidenoteIndex}>
                                    {sidenote.text}
                                  </span>
                                );
                              }
                            }
                          );
                          acc.result.push(
                            <span key={acc.result.length} className="sidenote">
                              {sidenoteText}
                            </span>
                          );
                          delete acc.currentSidenote;
                        }
                        return acc;
                      },
                      { currentSidenote: null, result: [] }
                    ).result
                  }
                </p>
              )}
              {block.type === "h2" && (
                <h2
                  id={block.text}
                  className="type heading-md top-padding-39 bottom-padding-13"
                >
                  {block.text}
                </h2>
              )}
              
              {block.type === "image" && (
                <figure className="article-figure bottom-padding-26">
                  <Image
                    className="image top-padding-26"
                    width={block.width || 20000000}
                    height={block.height || 200}
                    src={block.url}
                    alt={block.alt || "Article illustration"}
                  />
                  {block.credit && (
                    <figcaption className="article-image-caption">
                      {block.creditUrl ? (
                        <a
                          href={block.creditUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {block.credit}
                        </a>
                      ) : (
                        block.credit
                      )}
                    </figcaption>
                  )}
                </figure>
              )}
              {block.type === "bookmark" && (
                <div className="top-padding-26 bottom-padding-26">
                  <a
                    className="blogtype noorange underline"
                    href={block.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {block.url}
                  </a>
                </div>
              )}
              {block.type === "bullet" && (
                <ul className="para">
                  <li className="para blogtype">{block.text}</li>
                </ul>
              )}
              {/* Handle other block types as needed */}
            </motion.div>
          ))}
          <div style={{ height: "26px" }}></div>

          <motion.div
            className="page-nav"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.3, delay: 0, ease: "easeInOut" },
            }}
          >
            <Link
              className="accent-heading type-opacity-50"
              onClick={handleClick}
              href="/"
            >
              /back
            </Link>
            {nextHref && (
              <Link
                className="accent-heading type-opacity-50"
                onClick={handleClick}
                href={nextHref}
              >
                /next
              </Link>
            )}
          </motion.div>
        </div>
        <div className="mobile-show">
          <div className="line mobile-show" style={{ height: "1px" }}></div>
          <div className="nav-container-mobile">
            <Link
              href="#top" // Use the same ID as the top of the page
              className="accent-heading block type-opacity-50"
              onClick={scrollToTop}
            >
              back to top
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Layout
      topContent={renderTopContent()}
      bottomContent={RenderBottomContent()}
      isPostPage={true}
    >
      <>
        <Head>
          <title>{pageContent.properties.pageTitle}</title>
          <meta
            name="description"
            content={pageContent.properties.pageDescription}
          />

          <meta
            property="og:title"
            content={pageContent.properties.pageTitle}
          />
          <meta
            property="og:description"
            content={pageContent.properties.pageDescription}
          />

          <meta name="Bhabani Shankar Mohapatra" content="Author Name" />
          <meta name="keywords" content="blog, topic, keyword, tags" />
        </Head>
        {renderPageContent()}
      </>
    </Layout>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);

  // Define the month names as an array
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = monthNames[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2);

  return `${day} ${month} '${year}`;
}

const scrollToTop = (event) => {
  event.preventDefault(); // Prevent the default anchor link behavior
  window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page
};

export async function getStaticProps({ params }) {
  const { slug } = params;

  try {
    const retrievedContent = localPosts[slug] || (await retrievePageData(slug));
    const pageContent = postMetadataOverrides[slug]
      ? {
          ...retrievedContent,
          properties: {
            ...retrievedContent.properties,
            ...postMetadataOverrides[slug],
          },
        }
      : retrievedContent;
    let pageProperties = [];

    try {
      pageProperties = await retrievePageProperties(
        process.env.NOTION_DATABASE_ID
      );
    } catch (error) {
      console.error("Error fetching post navigation:", error);
    }

    // The reading order runs through the writing and on into the work pages,
    // so the last post hands over rather than looping back to the first.
    const notionSlugs = pageProperties
      .filter((p) => p.Tags === "notes" && p.slug)
      .map((p) => p.slug);
    const postSlugs = Array.from(
      new Set([...Object.keys(localPosts), ...notionSlugs])
    );
    const nextHref = nextAfterPost(slug, postSlugs);

    return {
      props: { pageContent, nextHref },
      revalidate: 1800,
    };
  } catch (error) {
    console.error("Error fetching page content:", error);
    return {
      props: { pageContent: null, nextHref: null },
      revalidate: 60,
    };
  }
}

export async function getStaticPaths() {
  let pageProperties = [];

  try {
    pageProperties = await retrievePageProperties(
      process.env.NOTION_DATABASE_ID
    );
  } catch (error) {
    console.error("Error fetching post paths:", error);
  }

  const slugs = Array.from(
    new Set([
      ...Object.keys(localPosts),
      ...pageProperties.filter((p) => p.slug).map((p) => p.slug),
    ])
  );
  const paths = slugs.map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: "blocking",
  };
}

export default BlogPage;
