/* eslint-disable react/no-unescaped-entities */
import { retrievePageProperties } from "../notionModule";
import { getDatabaseInfo } from "../databasemodule";
import Layout from "../app/layout";
import "../styles/styles.css";
import Head from "next/head";
import { motion, useAnimation } from "framer-motion";

function Home({ pageProperties, databaseInfo }) {
  const controls = useAnimation();

  const handleClick = async () => {
    // Trigger a fade-out animation for other elements
    await controls.start({
      opacity: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    });
  };

  // Filter pageProperties for work and notes separately
  const workPageProperties = Array.isArray(pageProperties)
    ? pageProperties.filter((property) => property.Tags === "work")
    : [];

  const notesPageProperties = Array.isArray(pageProperties)
    ? pageProperties.filter((property) => property.Tags === "notes")
    : [];

  function renderTopContent() {
    return (
      <motion.div initial={{ opacity: 1 }} animate={controls}>
        <div className="nav-container">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.6, ease: "easeInOut" },
            }}
            className="para type work-link"
            onClick={() => scrollToSection("_work")}
          >
            work
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.8, delay: 0.04, ease: "easeInOut" },
            }}
            className="para type notes-link"
            onClick={() => scrollToSection("_notes")}
          >
            notes
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 1.0, delay: 0.08, ease: "easeInOut" },
            }}
            className="para type notes-link"
            onClick={() => scrollToSection("_about")}
          >
            about
          </motion.p>
        </div>
      </motion.div>
    );
  }

  function renderBottomContent() {
    return (
      <motion.div initial={{ opacity: 1 }} animate={controls}>
        <div className="social-links-container">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.6, delay: 0.4, ease: "easeInOut" },
            }}
            className=" para type"
          >
            <a className="type" href="mailto:bhabani10121999@gmail.com">
              email{" "}
            </a>
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.7, delay: 0.44, ease: "easeInOut" },
            }}
            className="para type"
          >
            <a
              className=" type"
              href="https://www.linkedin.com/in/bhabanismoh/"
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin
            </a>
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.8, delay: 0.48, ease: "easeInOut" },
            }}
            className="para type"
          >
            <a
              className=" type"
              href="https://twitter.com/smbhabani"
              target="_blank"
              rel="noopener noreferrer"
            >
              twitter
            </a>
          </motion.p>
        </div>
        {databaseInfo && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.9, delay: 0.52, ease: "easeInOut" },
            }}
            className="para type-opacity-50"
          >
            last updated on{" "}
            <span className="number type-opacity-50">
              {formatDateShort(databaseInfo.lastEditedTime)}
            </span>
          </motion.p>
        )}
      </motion.div>
    );
  }

  function formatDateShort(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so we add 1.
    const year = String(date.getFullYear()).slice(-2);

    return `${day}.${month}.${year}`;
  }

  function scrollToSection(section) {
    // Find the section element by its id
    const sectionElement = document.getElementById(section);

    // Scroll to the section if it exists
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <Layout
      topContent={renderTopContent()}
      bottomContent={renderBottomContent()}
    >
      <>
        <Head>
          <title>Bhabani SM</title>
          <meta
            name="description"
            content="Repository of notes and work by Bhabani SM"
          />

          <meta property="og:title" content="Bhabani SM" />
          <meta
            property="og:description"
            content="Repository of notes and work by Bhabani SM"
          />

          <meta name="Bhabani Shankar Mohapatra" content="Author Name" />
          <meta name="keywords" content="blog, topic, keyword, tags" />
        </Head>
        <div className="mobile-show">
          <div className="nav-container-mobile">
            <div className="nav-container-child">
              <p
                className="para type work-link"
                onClick={() => scrollToSection("_work")}
              >
                work
              </p>
            </div>
            <div className="nav-container-child">
              <p
                className="para type notes-link"
                onClick={() => scrollToSection("_notes")}
              >
                notes
              </p>
            </div>
            <div className="nav-container-child">
              <p
                className="para type notes-link"
                onClick={() => scrollToSection("_about")}
              >
                about
              </p>
            </div>
          </div>
        </div>
        <div className="line mobile-show" style={{ height: "1px" }}></div>
        <div className="mobile-show" style={{ height: "13px" }}></div>

        <motion.div
          initial={{ opacity: 1 }}
          animate={controls}
          className="main-content"
        >
          <div className="inner-container">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.3, delay: 0, ease: "easeInOut" },
              }}
              id="_work"
              className="accent-heading"
            >
              <span className="accent">work</span>
            </motion.h3>
            <div style={{ height: "26px" }}></div>
            {workPageProperties.map((property) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.45, delay: 0.1, ease: "easeInOut" },
                }}
                className="inner-container"
                key={property.id}
              >
                <div className="row">
                  <div className="left-content">
                    <div>
                      <a
                        onClick={handleClick}
                        className="para lowercase  type pageTitleLink"
                        href={`/post/${property.slug}`}
                      >
                        {property.pageTitle}
                      </a>
                    </div>
                    <p className="para lowercase type-opacity-50 pageDescription">
                      {property.pageDescription}
                    </p>
                  </div>
                  <div className="right-content">
                    <span className="number type-opacity-50 creationDate">
                      {formatDateShort(property.creationDate)}
                    </span>
                  </div>
                </div>

                <div style={{ height: "26px" }}></div>
              </motion.div>
            ))}
          </div>
          <div style={{ height: "13px" }}></div>
          <div className="inner-container">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.3, delay: 0, ease: "easeInOut" },
              }}
              id="_notes"
              className="accent-heading"
            >
              <span className="accent">notes</span>
            </motion.h3>
            <div style={{ height: "26px" }}></div>
            {notesPageProperties.map((property) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.8, delay: 0.1, ease: "easeInOut" },
                }}
                className="inner-container"
                key={property.id}
              >
                <div className="row">
                  <div className="left-content">
                    <div>
                      <a
                        onClick={handleClick}
                        className="para lowercase type pageTitleLink"
                        href={`/post/${property.slug}`}
                      >
                        {property.pageTitle}
                      </a>
                    </div>
                    <p className="para lowercase type-opacity-50 pageDescription">
                      {property.pageDescription}
                    </p>
                  </div>
                  <div className="right-content">
                    <span className="number type-opacity-50 creationDate">
                      {formatDateShort(property.creationDate)}
                    </span>
                  </div>
                </div>

                <div style={{ height: "26px" }}></div>
              </motion.div>
            ))}
          </div>
          <div style={{ height: "13px" }}></div>
          <div className="inner-container">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.3, delay: 0, ease: "easeInOut" },
              }}
              id="_about"
              className="accent-heading"
            >
              <span className="accent">about</span>
            </motion.h3>
            <div style={{ height: "26px" }}></div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.45, delay: 0.1, ease: "easeInOut" },
              }}
            >
              <p className="para lowercase blogtype">
                Bhabani (23, Odisha/India). Previously co-founder of Evy Energy,
                acquired by Zemetric USA, and product-designed on workforce
                forecasting systems at Sprinklr.
              </p>
              <div style={{ height: "13px" }}></div>
              <p className="para lowercase blogtype">
                Grad days at IIT Guwahati: Co-built a platform for grad students
                to share placement insights, a newsletter for cinema
                enthusiasts, and led branding efforts for North-East India's
                largest e-summit. Now, I'm looking to spend more time on
                filmmaking, football, and art.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="mobile-show">
          <div style={{ height: "13px" }}></div>
          <div className="line" style={{ height: "1px" }}></div>
          <div className="padding-26">
            <div className="link-container-mobile social-links-container">
              <div className="nav-container-child">
                <p className=" para type">
                  <a className="type" href="mailto:bhabani10121999@gmail.com">
                    email{" "}
                  </a>
                </p>
              </div>
              <div className="nav-container-child">
                <p className=" para type">
                  <a
                    className=" type"
                    href="https://www.linkedin.com/in/bhabanismoh/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    linkedin
                  </a>
                </p>
              </div>
              <div className="nav-container-child">
                <p className="para type">
                  <a
                    className=" type"
                    href="https://twitter.com/smbhabani"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    twitter
                  </a>
                </p>
              </div>
            </div>
            {databaseInfo && (
              <p className="para type-opacity-50">
                last updated on{" "}
                <span className="number type-opacity-50">
                  {formatDateShort(databaseInfo.lastEditedTime)}
                </span>
              </p>
            )}
          </div>
        </div>
      </>
    </Layout>
  );
}

export async function getStaticProps() {
  let databaseInfo = null; // Initialize databaseInfo

  try {
    const pageProperties = await retrievePageProperties(
      process.env.NOTION_DATABASE_ID
    );

    // Fetch database info using your module
    databaseInfo = await getDatabaseInfo(process.env.NOTION_DATABASE_ID);

    return {
      props: {
        pageProperties,

        databaseInfo,
      },
      revalidate: 1800, // Revalidate every 30 minutes (adjust as needed)
    };
  } catch (error) {
    console.error("Error fetching data:", error);

    return {
      props: {
        pageProperties: [],

        databaseInfo,
      },
      revalidate: 1800, // Revalidate every 30 minutes (adjust as needed)
    };
  }
}

export default Home;