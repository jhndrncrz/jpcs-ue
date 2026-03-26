import React, { useEffect } from 'react';

interface FacebookFeedProps {
  pageUrl: string;
}

const FacebookFeed: React.FC<FacebookFeedProps> = ({ pageUrl }) => {
  useEffect(() => {
    // Load Facebook SDK if not already loaded
    if (window.FB) {
      window.FB.XFBML.parse();
    } else {
      const script = document.createElement('script');
      script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full bg-[var(--surface)] border border-[var(--border)] p-4 rounded-lg shadow-sm">
      <h3 className="font-heading text-xl text-[var(--foreground)] mb-4 self-start">Latest Facebook Posts</h3>
      <div className="w-full flex justify-center overflow-hidden">
        {/* Facebook Page Plugin */}
        <div 
          className="fb-page" 
          data-href={pageUrl}
          data-tabs="timeline" 
          data-width="500" 
          data-height="600" 
          data-small-header="false" 
          data-adapt-container-width="true" 
          data-hide-cover="false" 
          data-show-facepile="true"
        >
          <blockquote cite={pageUrl} className="fb-xfbml-parse-ignore">
            <a href={pageUrl}>JPCS - UE Manila Chapter</a>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default FacebookFeed;

// Type definition for window.FB
declare global {
  interface Window {
    FB: any;
  }
}
