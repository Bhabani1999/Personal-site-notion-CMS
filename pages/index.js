/* eslint-disable react/no-unescaped-entities */

import React, { useEffect, useState } from 'react';
import Layout from '../app/layout';
import '../styles/styles.css';

function HomePage() {
  useEffect(() => {
    // Your JavaScript code to manipulate the text with class 'text'
    const textElements = document.querySelectorAll('.tex1t');
    
    
    function toggleText(element) {
    const currentText = element.textContent;
    const newText = currentText === "1" ? "0" : "1";
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
    


  // State to hold the retrieved page properties
  const [pageProperties, setPageProperties] = useState([]);
  // State to track whether the API data is loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data from your API endpoint
    fetch('/api/properties')
      .then((response) => response.json())
      .then((data) => {
        setPageProperties(data);
        setIsLoading(false); // Set loading state to false once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Set loading state to false in case of an error
      });
  }, []);

  // State to hold the retrieved database properties
const [databaseInfo, setDatabaseInfo] = useState(null);

useEffect(() => {
  // Fetch data from your API endpoint
  fetch('/api/databaseproperties')
    .then((response) => response.json())
    .then((data) => {
      setDatabaseInfo(data);
     ; // Set loading state to false once data is fetched
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
       // Set loading state to false in case of an error
    });
}, []);


  // Filter pageProperties for work and notes separately
  const workPageProperties = Array.isArray(pageProperties)
  ? pageProperties.filter((property) => property.Tags === "work")
  : [];

const notesPageProperties = Array.isArray(pageProperties)
  ? pageProperties.filter((property) => property.Tags === 'notes')
  : [];
  

  function renderTopContent() {
    return (
      <div>
        <div className="nav-container">
          <p className="para type work-link" onClick={() => scrollToSection('_work')}>
            work
          </p>
          <p className="para type notes-link" onClick={() => scrollToSection('_notes')}>
            notes
          </p>
          <p className="para type notes-link" onClick={() => scrollToSection('_about')}>
            about
          </p>
        </div>
      </div>
    );
  }

  function renderLoader() {
    return (
      <div className="loader">
      <div className="grid-container">
        <div className="grid-item lpara type tex1t">1</div>
        <div className="grid-item lpara type tex1t">0</div>
        <div className="grid-item lpara type tex1t">1</div>
        <div className="grid-item lpara type tex1t">0</div>
        <div className="grid-item lpara type tex1t">1</div>
        <div className="grid-item lpara type tex1t">0</div>
        <div className="grid-item lpara type tex1t">1</div>
        <div className="grid-item lpara type tex1t">0</div>
        <div className="grid-item lpara type tex1t">1</div>
      </div>
    </div>
    );
  }

  function renderBottomContent() {
    return (
      <div>
        <div className="social-links-container">
          <p className="para type">
            <a href="mailto:bhabani10121999@gmail.com">email</a>
          </p>
          <p className="para type">
            <a href="https://www.linkedin.com/in/bhabanismoh/" target="_blank" rel="noopener noreferrer">
              linkedin
            </a>
          </p>
          <p className="para type">
            <a href="https://twitter.com/smbhabani" target="_blank" rel="noopener noreferrer">
              twitter
            </a>
          </p>
        </div>
        {databaseInfo && (
          <p className="para type-opacity-50">last updated on <span className="number type-opacity-50">
            {formatDate(databaseInfo.lastEditedTime)}
          </span></p>
          // Enable eslint rule again after the line
          /* eslint-enable react/no-unescaped-entities */
        )}
      </div>
    );
  }

 

  function formatDate(dateString) {
    const date = new Date(dateString);
  
    // Define the month names as an array
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Se", "Oct", "Nov", "Dec"
    ];
  
    const day = String(date.getDate()).padStart(2, "0");
    const month = monthNames[date.getMonth()];
    const year = String(date.getFullYear()).slice(-2);
  
    return `${day} ${month} ${year}`;
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
    <Layout topContent={isLoading ? renderLoader() : renderTopContent()} bottomContent={isLoading ? null : renderBottomContent()} >
    {isLoading ? ( // Show loader if data is loading
       <div></div>
      ) : (
        <div>
          <div className="inner-container">
            <h3 id="_work" className="accent-heading"><span className="accent">_work</span></h3>
            <div style={{ height: "26px" }}></div>
            {workPageProperties.map((property) => (
              <div className="inner-container" key={property.id}>
                <div className="row">
                  <div className="left-content">
                    <a className="para type pageTitleLink" href={`/post/${property.id}`}>
                      {property.pageTitle}
                    </a>
                  </div>
                  <div className="right-content">
                    <span className="number type-opacity-50 creationDate">
                      {formatDate(property.creationDate)}
                    </span>
                  </div>
                </div>
                <p className="para type-opacity-50 pageDescription">{property.pageDescription}</p>
                <div style={{ height: "13px" }}></div>
              </div>
            ))}
          </div>
          <div style={{ height: "26px" }}></div>
          <div className="inner-container">
            <h3 id="_notes" className="accent-heading"><span className="accent">_notes</span></h3>
            <div style={{ height: "26px" }}></div>
            {notesPageProperties.map((property) => (
              <div className="inner-container" key={property.id}>
                <div className="row">
                  <div className="left-content">
                    <a className="para type pageTitleLink" href={`/post/${property.id}`}>
                      {property.pageTitle}
                    </a>
                  </div>
                  <div className="right-content">
                    <span className="number type-opacity-50 creationDate">
                      {formatDate(property.creationDate)}
                    </span>
                  </div>
                </div>
                {/* Additional content for notes goes here */}
              </div>
            ))}
          </div>
          <div style={{ height: "39px" }}></div>
          <div className="inner-container">
            <h3 id="_about" className="accent-heading"><span className="accent">_about</span></h3>
            <div style={{ height: "26px" }}></div>
            <div>
        <p className="para type-opacity-50">Bhabani (23, Odisha/India). Previously co-founder of Evy Energy, acquired by Zemetric USA, and product-designed on workforce forecasting systems at Sprinklr.


        
        </p>
        <div style={{ height: "13px" }}></div>
        <p className="para type-opacity-50">Grad days at IIT Guwahati:  Co-built a platform for grad students to share placement insights, a newsletter for cinema enthusiasts, and led branding efforts for North-East India's largest e-summit.

Now, I'm looking to spend more time on filmmaking, football, and art
        </p>
      </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
/* eslint-enable react/no-unescaped-entities */
export default HomePage;
