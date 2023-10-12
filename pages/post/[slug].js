import Layout from "../../app/layout";
import "../../styles/styles.css";
import Link from "next/link";
import Image from "next/image";
import retrievePageData from "../../notioncontentModule";
import { retrievePageProperties } from "../../notionModule";
import Head from "next/head";

function BlogPage({ pageContent }) {
  // Render H2 headings from the content in topContent
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
      <div>
        {h2Headings.map((heading, index) => (
          <Link
            href={`#${heading.text}`}
            key={index}
            className="para block type-opacity-50"
            onClick={(event) => scrollToHeading(event, heading.text)}
          >
            {heading.text}
          </Link>
        ))}
      </div>
    );
  };
  // Define content for top-container and bottom-container
  function renderTopContent() {
    return (
      <div>
        <div className="nav-container">
          <Link href="../">home</Link>
        </div>
        <div>
          <div className="spacer"></div>
          {renderH2Headings()} {/* Render H2 headings in top content */}
        </div>
      </div>
    );
  }

  function renderBottomContent() {
    return (
      <div>
        <Link
          href="#top" // Use the same ID as the top of the page
          className="para block type-opacity-50"
          onClick={scrollToTop}
        >
          back to top
        </Link>
      </div>
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
      <div>
        <div className="mobile-show">
          <div className="nav-container-mobile nav-container">
            <Link href="../">home</Link>
          </div>
          <div className="line mobile-show" style={{ height: "1px" }}></div>
          <div style={{ height: "13px" }}></div>
        </div>
        <div className="main-content">
          <div>
            <div id="top"></div>

            <div className="sidebyside">
              {pageContent && pageContent.properties && (
                <>
                  <p className="para type-opacity-50">
                    on{" "}
                    <span className="number">
                      {formatDate(pageContent.properties.creationDate)}
                    </span>
                  </p>
                  &nbsp;
                  <p className="para type-opacity-50">
                    in {pageContent.properties.Tags}
                  </p>
                </>
              )}
            </div>
          </div>
          <div style={{ height: "39px" }}></div>
          <p className="icon">{pageContent.properties.icon}</p>
          <div style={{ height: "39px" }}></div>
          <h1 className="type title">{pageContent.properties.pageTitle}</h1>
          <div style={{ height: "26px" }}></div>
          {pageContent.content.map((block, index) => (
            <div key={index}>
              {block.type === "text" && (
                <p className="para blogtype top-padding-13 bottom-padding-13">
                  {block.text}
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
                  width="2000"
                  height="200"
                  src={block.url}
                  alt="Image"
                />
              )}
              {/* Handle other block types as needed */}
            </div>
          ))}
        </div>
        <div className="mobile-show">
          <div style={{ height: "13px" }}></div>
          <div className="line mobile-show" style={{ height: "1px" }}></div>
          <div className="nav-container-mobile">
            <Link
              href="#top" // Use the same ID as the top of the page
              className="para block type-opacity-50"
              onClick={scrollToTop}
            >
              back to top
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout
      topContent={renderTopContent()}
      bottomContent={renderBottomContent()}
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
          <link rel="icon" href="../../app/favicon.ico" />

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
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
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

  let pageContent = null; // Initialize page content

  try {
    if (slug) {
      pageContent = await retrievePageData(slug); // Fetch content based on the slug
    }
  } catch (error) {
    console.error("Error fetching page content:", error);
  }

  return {
    props: {
      pageContent,
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
