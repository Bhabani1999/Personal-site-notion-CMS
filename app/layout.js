import React from 'react';
import { Spline_Sans_Mono } from 'next/font/google'
 
const Spline = Spline_Sans_Mono({
  subsets: ['latin'],
  variable: '--font-Spline',
  display: 'swap',
})
 

function Layout({ children, topContent, bottomContent, middleContent,rightContent, isPostPage }) {
  const middleColumnClass = isPostPage ? 'column middlepost' : 'column middle';
  return (
    
    
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



    
  );
}

export default Layout;


 

