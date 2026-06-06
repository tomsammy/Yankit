import React, { useEffect } from "react";
import StaticPageLayout from "@/components/layouts/StaticPageLayout";
import { BookOpen } from "lucide-react";

const BlogPage = () => {
  useEffect(() => {
    // Check if the script is already loaded to avoid duplicates
    const scriptSrc = "https://app.trysoro.com/api/embed/95ecaeab-a348-4bdf-9bbd-9ff9c6b97b49";
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);

    let script;
    if (!existingScript) {
      script = document.createElement("script");
      script.src = scriptSrc;
      script.defer = true;
      document.body.appendChild(script);
    }

    return () => {
      // Clean up the script tag if we added it
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
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
          className="w-full min-h-[600px] bg-transparent rounded-2xl transition-all duration-300"
        />
      </div>
    </StaticPageLayout>
  );
};

export default BlogPage;
