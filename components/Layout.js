import React from 'react';


 

 

function Layout({ children, topContent, bottomContent, middleContent,rightContent, isPostPage }) {
  const middleColumnClass = isPostPage ? 'column middlepost' : 'column middle';
  return (
    
    
    <div className="container" id="postContainer">
      <div className={middleColumnClass}>
        {children}
        {middleContent}
      </div>
      <div className="column right">{rightContent}</div>
      {(topContent || bottomContent) ? (
        <div className="column left">
          <div className="top-container">
            {topContent}
          </div>
          <div className="bottom-container">
            {bottomContent}
          </div>
        </div>
      ) : null}
    </div>



    
  );
}

export default Layout;


 

