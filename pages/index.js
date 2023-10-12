/* eslint-disable react/no-unescaped-entities */
import { retrievePageProperties } from "../notionModule";
import { getDatabaseInfo } from "../databasemodule";
import Layout from "../app/layout";
import "../styles/styles.css";
import { useMediaQuery } from "react-responsive";
import Head from "next/head";
import Link from "next/link";

function Home({ pageProperties, databaseInfo }) {
  // State to hold the retrieved page properties

  const isMobile = useMediaQuery({ maxWidth: 768 });

  // State to hold the retrieved database properties

  // Filter pageProperties for work and notes separately
  const workPageProperties = Array.isArray(pageProperties)
    ? pageProperties.filter((property) => property.Tags === "work")
    : [];

  const notesPageProperties = Array.isArray(pageProperties)
    ? pageProperties.filter((property) => property.Tags === "notes")
    : [];

  function renderTopContent() {
    return (
      <div>
        <div className="nav-container">
          <p
            className="para type work-link"
            onClick={() => scrollToSection("_work")}
          >
            work
          </p>
          <p
            className="para type notes-link"
            onClick={() => scrollToSection("_notes")}
          >
            notes
          </p>
          <p
            className="para type notes-link"
            onClick={() => scrollToSection("_about")}
          >
            about
          </p>
        </div>
      </div>
    );
  }

  function renderBottomContent() {
    return (
      <div>
        <div className="social-links-container">
          <p className=" para type">
            <a className="type" href="mailto:bhabani10121999@gmail.com">
              email{" "}
            </a>
          </p>
          <p className="para type">
            <a
              className=" type"
              href="https://www.linkedin.com/in/bhabanismoh/"
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin
            </a>
          </p>
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
        {databaseInfo && (
          <p className="para type-opacity-50">
            last updated on{" "}
            <span className="number type-opacity-50">
              {formatDateShort(databaseInfo.lastEditedTime)}
            </span>
          </p>
        )}
      </div>
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

        <div className="main-content">
          <div className="inner-container">
            <h3 id="_work" className="accent-heading">
              <span className="accent">_ work</span>
            </h3>
            <div style={{ height: "26px" }}></div>
            {workPageProperties.map((property) => (
              <div className="inner-container" key={property.id}>
                <div className="row">
                  <div className="left-content">
                    <div>
                      <a
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
                    {isMobile ? (
                      <span className="number type-opacity-50 creationDate">
                        {formatDateShort(property.creationDate)}
                      </span>
                    ) : (
                      <span className="number type-opacity-50 creationDate">
                        {formatDateShort(property.creationDate)}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ height: "26px" }}></div>
              </div>
            ))}
          </div>
          <div style={{ height: "13px" }}></div>
          <div className="inner-container">
            <h3 id="_notes" className="accent-heading">
              <span className="accent">_ notes</span>
            </h3>
            <div style={{ height: "26px" }}></div>
            {notesPageProperties.map((property) => (
              <div className="inner-container" key={property.id}>
                <div className="row">
                  <div className="left-content">
                    <div>
                      <a
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
                    {isMobile ? (
                      <span className="number type-opacity-50 creationDate">
                        {formatDateShort(property.creationDate)}
                      </span>
                    ) : (
                      <span className="number type-opacity-50 creationDate">
                        {formatDateShort(property.creationDate)}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ height: "26px" }}></div>
              </div>
            ))}
          </div>
          <div style={{ height: "13px" }}></div>
          <div className="inner-container">
            <h3 id="_about" className="accent-heading">
              <span className="accent">_ about</span>
            </h3>
            <div style={{ height: "26px" }}></div>
            <div>
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
            </div>
          </div>
        </div>

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
