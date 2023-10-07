import React from 'react';

function Layout({ children, topContent, bottomContent, middleContent,rightContent, isPostPage }) {
  const middleColumnClass = isPostPage ? 'column middlepost' : 'column middle';
  return (
    <div>
      <div className="container" id="postContainer">
        <div className="column left">
          <div className="top-container">
            {topContent}
          </div>
          <div className="bottom-container">
            {bottomContent}
          </div>
        </div>
        <div className={middleColumnClass}>
          {children}
          {middleContent} {/* Add the middle content here */}
        </div>
        <div className="column right">{rightContent}</div>
      </div>
    </div>
  );
}

export default Layout;
