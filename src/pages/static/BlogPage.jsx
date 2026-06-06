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
        
        {/* TrySoro Blog Embed Container */}
        <div 
          id="soro-blog" 
          className="w-full min-h-[600px] bg-transparent rounded-2xl transition-all duration-300 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800"
        >
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading blog articles...</p>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default BlogPage;
