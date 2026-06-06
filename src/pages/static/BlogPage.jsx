import React, { useEffect } from "react";
import StaticPageLayout from "@/components/layouts/StaticPageLayout";
import { BookOpen } from "lucide-react";

const BlogPage = () => {
  useEffect(() => {
    const scriptSrc = "https://app.trysoro.com/api/embed/95ecaeab-a348-4bdf-9bbd-9ff9c6b97b49";
    
    // Always append a new script tag on mount to force execution in React client-side routing
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.defer = true;
    script.id = "soro-blog-script";
    document.body.appendChild(script);

    return () => {
      // Clean up the script tag when unmounting
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      
      // Clean up any dynamically injected stylesheet or elements from TrySoro if present
      const injectedStyles = document.querySelectorAll('link[href*="trysoro.com"], style[id*="soro"]');
      injectedStyles.forEach(style => style.remove());
    };
  }, []);

  return (
    <StaticPageLayout title="Yankit Blog & Insights" icon={BookOpen}>
      <div className="space-y-6">
        <p className="text-lg text-muted-foreground dark:text-slate-300 max-w-3xl mb-8">
          Discover travel tips, P2P shipping guides, company news, and inspiring stories from the global <span className="font-vernaccia-bold">Yankit</span> community.
        </p>
        
        {/* CSS for :empty state spinner */}
        <style>{`
          #soro-blog:empty {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            border: 1px dashed #e2e8f0;
            border-radius: 1rem;
          }
          #soro-blog:empty::before {
            content: "";
            width: 2rem;
            height: 2rem;
            border: 4px solid #1d4ed8;
            border-top-color: transparent;
            border-radius: 50%;
            animation: soro-spin 1s linear infinite;
          }
          @keyframes soro-spin {
            to { transform: rotate(360deg); }
          }
          .dark #soro-blog:empty {
            border-color: #1e293b;
          }
          .dark #soro-blog:empty::before {
            border-color: #3b82f6;
            border-top-color: transparent;
          }
        `}</style>

        {/* 
          TrySoro Blog Embed Container
          Rendered with NO children in React Virtual DOM so React's reconciliation engine
          never overwrites the HTML elements injected by the TrySoro script.
        */}
        <div 
          id="soro-blog" 
          className="w-full min-h-[600px] bg-transparent rounded-2xl transition-all duration-300"
        />
      </div>
    </StaticPageLayout>
  );
};

export default BlogPage;
