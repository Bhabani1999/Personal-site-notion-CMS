import Layout from "../../app/layout";
import "../../styles/styles.css";
import Link from "next/link";
import Image from "next/image";
import retrievePageData from "../../notioncontentModule";
import { retrievePageProperties } from "../../notionModule";
import Head from "next/head";
import { motion, useAnimation } from "framer-motion";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';




function BlogPage({ pageContent, nextPageSlug }) {
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.6, ease: "easeInOut" },
          }}
          className="nav-container"
        >
          <Link className= 'accent-heading type-opacity-50' onClick={handleClick} href="../">
          /go home
          </Link>
        </motion.div>
        <div>
          <div className="spacer"></div>
          {renderH2Headings()} {/* Render H2 headings in top content */}
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
          };
        };
  
        window.addEventListener('scroll', handleScroll);
  
        // Clean up the event listener and update the mounted state when the component unmounts
        return () => {
          isMounted.current = false;
          window.removeEventListener('scroll', handleScroll);
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
            <Link onClick={handleClick} className="accent-heading type-opacity-50 " href="../">/go home</Link>
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
                transition: { duration: 0.3, delay: 0, ease: "easeInOut" },
              }}
              
            >
              {pageContent && pageContent.properties && (
                <div className="sidebyside">
                 
                 
                  <p className="accent-heading type-opacity-50">
                 
                    
                    In {pageContent.properties.Tags}, 
                  
                  </p>

                  <p className="accent-heading type-opacity-50">
                 
                    
                 &nbsp;{formatDate(pageContent.properties.creationDate)}
              
              </p>
                  
                 
                </div>
              )}
            </motion.div>
          </div>
          <motion.div
           
            style={{ height: "26px" }}
          ></motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.5, delay: 0, ease: "easeInOut" },
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
              transition: { duration: 0.5, delay: 0.1, ease: "easeInOut" },
            }}
            className="type title"
          >
            {pageContent.properties.pageTitle}
          </motion.h1>
          <div style={{ height: "26px" }}></div>
          {pageContent.content.map((block, index) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.6, delay: 0.2, ease: "easeInOut" },
              }}
              key={index}
            >
              {block.type === "paragraph" && (
  <p className="para blogtype top-padding-13 bottom-padding-13">
    {block.content.reduce((acc, text, textIndex, content) => {
      if (text.contentType === "sidenote") {
        if (!acc.currentSidenote) {
          acc.currentSidenote = [text];
        } else {
          acc.currentSidenote.push(text);
        }
      } else {
        if (acc.currentSidenote) {
          const sidenoteText = acc.currentSidenote.map((sidenote, sidenoteIndex) => {
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
              return <span key={sidenoteIndex}>{sidenote.text}</span>;
            }
          })
          acc.result.push(
            <span key={acc.result.length} className="sidenote">
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
          acc.result.push(<span key={textIndex}>{text.text}</span>);
        }
      }
      if (textIndex === content.length - 1 && acc.currentSidenote) {
        const sidenoteText = acc.currentSidenote.map((sidenote, sidenoteIndex) => {
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
            return <span key={sidenoteIndex}>{sidenote.text}</span>;
          }
        })
        acc.result.push(
          <span key={acc.result.length} className="sidenote">
            {sidenoteText}
          </span>
        );
        delete acc.currentSidenote;
      }
      return acc;
    }, { currentSidenote: null, result: [] }).result}
  </p>
)}

            
              {block.type === "h2" && (
                <h2
                  id={block.text}
                  className="type heading-md top-padding-26 bottom-padding-13"
                >
                  {block.text}
                </h2>
              )}
              {block.type === "image" && (
                <Image
                  className="image top-padding-26 bottom-padding-26"
                  width="20000000"
                  height="200"
                  src={block.url}
                  alt="Image"
                />
              )}
              {block.type === "bookmark" && (
                <div className="image-flex">
                  <Image
                    className="full-width-content top-padding-26 bottom-padding-26"
                    width="200"
                    height="200"
                    src={block.url}
                    alt="Image"
                  />
                </div>
              )}
              {block.type === "bullet" && (
               <ul className='para'>
               <li className="para blogtype">{block.text}</li>
              </ul>
              )}
              {/* Handle other block types as needed */}
            </motion.div>
          ))}
                    <div style={{ height: "26px" }}></div>

          <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.3, delay: 0, ease: "easeInOut" },
          }}
          >
           <a className="accent-heading type-opacity-50" onClick={handleClick} href={`/post/${nextPageSlug}`}>/go to Next Post</a>
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
    "Novemeber",
    "Decemeber",
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
    // Fetch all page properties to build dynamic paths
    const pageProperties = await retrievePageProperties(process.env.NOTION_DATABASE_ID);

    if (slug) {
      // Find the index of the current post
      const currentIndex = pageProperties.findIndex((property) => property.slug === slug);

      // Calculate the index of the next post
      const nextIndex = (currentIndex + 1) % pageProperties.length;

      // Get the slug of the next post
      const nextPageSlug = pageProperties[nextIndex].slug;

      const pageContent = await retrievePageData(slug);

      return {
        props: {
          pageContent,
          nextPageSlug,
        },
      };
    }
  } catch (error) {
    console.error("Error fetching page content:", error);
  }

  // Return a fallback value or handle errors as needed
  return {
    props: {
      pageContent: null,
      nextPageSlug: null,
    },
  };
}

export async function getStaticPaths() {
  // Fetch all page properties to build dynamic paths
  const pageProperties = await retrievePageProperties(
    process.env.NOTION_DATABASE_ID
  );

  const paths = pageProperties.map((property) => ({
    params: { slug: property.slug }, // Use "slug" from your properties
  }));

  return {
    paths,
    fallback: false, // Render a 404 page if the path doesn't match any page
  };
}



export default BlogPage;
