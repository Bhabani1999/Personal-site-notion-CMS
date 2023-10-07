import React, { useEffect, useState } from 'react';
import Layout from '../../app/Layout';
import '../../styles/styles.css';
import { useRouter } from 'next/router';  
import Link from 'next/link';

function BlogPage() {

 

  const router = useRouter();
  const { slug } = router.query; // Get the slug from the router query

  // State to hold the retrieved page content
  const [pageContent, setPageContent] = useState(null);
  // State to track whether the page is loading
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Your JavaScript code to manipulate the text with class 'text'
    const textElements = document.querySelectorAll('.tex2t');
    
    
    function toggleText(element) {
    const currentText = element.textContent;
    const newText = currentText === '1' ? '0' : '1';
    element.textContent = newText;
    }
    
    
    function toggleTextRandom(element) {
    function toggleWithRandomInterval() {
    const randomInterval = Math.floor(Math.random() * (400 - 200 + 1) + 200); // Random interval between 200ms to 400ms
    toggleText(element);
    setTimeout(toggleWithRandomInterval, randomInterval);
    }
    toggleWithRandomInterval();
    }
    
    
    textElements.forEach((element) => {
    toggleTextRandom(element);
    });
    }, []);
    
  useEffect(() => {
    // Fetch content data from your API endpoint based on the slug
    if (slug) {
      fetch(`/api/content?id=${slug}`)
        .then((response) => response.json())
        .then((data) => {
          setPageContent(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching content data:', error);
          setIsLoading(false);
        });
    }
  }, [slug]);

  // Render H2 headings from the content in topContent
  const renderH2Headings = () => {
    if (!pageContent) {
      return null;
    }

    const scrollToHeading = (event, headingText) => {
      event.preventDefault(); // Prevent the default anchor link behavior
      const headingElement = document.getElementById(headingText);
      if (headingElement) {
        headingElement.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const h2Headings = pageContent.content.filter((block) => block.type === 'h2');

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
        <div className="spacer" ></div>
        {renderH2Headings()} {/* Render H2 headings in top content */}</div>
        
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

  function renderLoader() {
    return (
      <div className="loader">
        <div className="grid-container">
          <div className="grid-item lpara type tex2t">1</div>
          <div className="grid-item lpara type tex2t">0</div>
          <div className="grid-item lpara type tex2t">1</div>
          <div className="grid-item lpara type tex2t">0</div>
          <div className="grid-item lpara type tex2t">1</div>
          <div className="grid-item lpara type tex2t">0</div>
          <div className="grid-item lpara type tex2t">1</div>
          <div className="grid-item lpara type tex2t">0</div>
          <div className="grid-item lpara type tex2t">1</div>
        </div>
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
        <div>
          <div id="top"></div>

          <div className="sidebyside">
            <p className="para type-opacity-50">On {formatDate(pageContent.properties.creationDate)}</p>
            &nbsp;
            <p className="para type-opacity-50">in {pageContent.properties.Tags}</p>
          </div>
        </div>
        <div style={{ height: '39px' }}></div>
        <p className="icon">{pageContent.properties.icon}</p>
        <div style={{ height: '39px' }}></div>
        <h1 className="type title">{pageContent.properties.pageTitle}</h1>
        <div style={{ height: '26px' }}></div>
        {pageContent.content.map((block, index) => (
          <div key={index}>
            {block.type === 'text' && (
              <p className="para blogtype top-padding-13 bottom-padding-13">{block.text}</p>
            )}
            {block.type === 'h2' && (
              <h2 id={block.text} className="type heading-md top-padding-26 bottom-padding-13">
                {block.text}
              </h2>
            )}
            {block.type === 'image' && (
              <img className="image top-padding-26 bottom-padding-26" src={block.url} alt="Image" />
            )}
            {/* Handle other block types as needed */}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Layout topContent={isLoading ? renderLoader() : renderTopContent()} bottomContent={isLoading ? null : renderBottomContent()} >
      {isLoading ? null : renderPageContent()}
    </Layout>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);

  // Define the month names as an array
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const day = String(date.getDate()).padStart(2, '0');
  const month = monthNames[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2);

  return `${day} ${month} '${year}`;
}


const scrollToTop = (event) => {
  event.preventDefault(); // Prevent the default anchor link behavior
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
};

export default BlogPage;
