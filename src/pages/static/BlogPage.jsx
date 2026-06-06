import React, { useState, useMemo } from "react";
import StaticPageLayout from "@/components/layouts/StaticPageLayout";
import { BookOpen, Search, Clock, Calendar, User, ArrowRight, X } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Yankit Migrates to Escrow.com for Peer-to-Peer Payments",
    category: "Company Updates",
    readTime: "3 min read",
    date: "June 5, 2026",
    author: "Samuel Thomas",
    excerpt: "We're excited to partner with Escrow.com to bring fully secure, milestone-based peer-to-peer payouts to our global user community.",
    imageUrl: "/images/blog/escrow_migration.png",
    content: `
      <p>Today marks a major milestone in the evolution of Yankit. We are thrilled to announce that we have fully migrated our peer-to-peer payment and escrow infrastructure to <strong>Escrow.com</strong>, the world's leading licensed and regulated online escrow service.</p>
      
      <h3>Why Escrow.com?</h3>
      <p>In a peer-to-peer sharing economy like Yankit, trust is the currency. Shippers need to know their funds are safe and will only be released upon successful delivery. Travelers (Yankers) need to know that the agreed reward is secured before they board their flight. By partnering with Escrow.com, we are introducing a level of security that Stripe simply couldn't offer for peer-to-peer transactions.</p>
      
      <h3>How the New Post-Match Escrow Works</h3>
      <p>We have designed a seamless Post-Match Escrow workflow:</p>
      <ul>
        <li><strong>Create Shipment:</strong> Shippers list their baggage request in the matching pool without any upfront payment.</li>
        <li><strong>Match:</strong> A verified traveler accepts the shipment request.</li>
        <li><strong>Escrow Transaction:</strong> Once matched, a secure transaction is programmatically created on Escrow.com with the Shipper as Buyer, the Traveler as Seller, and Yankit as the Broker (collecting our standard 20% platform commission).</li>
        <li><strong>Shipper Pays:</strong> The Shipper is redirected to the Escrow.com portal to secure the funds using credit card or bank transfer.</li>
        <li><strong>Delivery & Release:</strong> Once the traveler delivers the bag at the destination, the traveler marks it as "In Transit" and the shipper confirms receipt. The funds are instantly released directly from Escrow.com to the traveler's bank account.</li>
      </ul>

      <p>This integration is live today and is already securing transactions across our entire platform. Happy yanking!</p>
    `
  },
  {
    id: 2,
    title: "The Ultimate Guide to P2P Shipping: How to Send Packages Safely",
    category: "Travel Hacks",
    readTime: "5 min read",
    date: "June 4, 2026",
    author: "Emily Grace",
    excerpt: "Learn the best practices for packing, declaring, and sending your packages securely through peer-to-peer travel networks.",
    imageUrl: "/images/blog/p2p_shipping.png",
    content: `
      <p>Peer-to-peer (P2P) shipping is changing the global logistics game. By utilizing the unused baggage space of travelers, you can send items internationally at a fraction of the cost of traditional couriers. However, safety and compliance must always come first.</p>
      
      <h3>1. Know What You Can Send</h3>
      <p>Always review aviation regulations and the dangerous goods guidelines. Items like lithium batteries, aerosols, flammable liquids, and weapons are strictly prohibited. Before listing your baggage on Yankit, double-check that your item does not violate any airline safety rules.</p>

      <h3>2. Complete Transparency is Key</h3>
      <p>When you match with a traveler on Yankit, declare the exact contents of your package. Travelers have a legal right and responsibility to inspect the items they are carrying. Be prepared to show the contents to the traveler at the drop-off point.</p>

      <h3>3. Pack Securely but Openly</h3>
      <p>Do not gift-wrap or seal items permanently before meeting the traveler. Keep the items easily accessible so they can be inspected, and pack them in a way that protects them from flight turbulence.</p>

      <p>By following these simple guidelines, you can ensure a smooth, secure, and highly efficient shipping experience every time you use Yankit!</p>
    `
  },
  {
    id: 3,
    title: "How to Offset Your Flight Costs by Sharing Your Baggage Space",
    category: "Community Stories",
    readTime: "4 min read",
    date: "June 2, 2026",
    author: "Liam Fletcher",
    excerpt: "Discover how globetrotters are offsetting their flight costs by sharing their unused baggage allowance with people in their community.",
    imageUrl: "/images/blog/offset_flight.png",
    content: `
      <p>Travel is back, and flight tickets are more expensive than ever. But what if you could offset a significant portion of your airfare simply by packing a bit lighter? That's exactly what thousands of "Yankers" are doing on our platform.</p>
      
      <h3>Meet David: Offsetting 40% of his flight to London</h3>
      <p>"I was traveling from Perth to London with just a carry-on bag, but my ticket included a 30kg checked bag," says David, a frequent traveler. "I listed my space on Yankit. Within two days, I matched with a shipper who needed to send a box of family photos and some clothing. I carried the items, met them at Heathrow, and earned over $300, which covered almost half of my flight cost."</p>

      <h3>Simple Tips for Travelers (Yankers):</h3>
      <ul>
        <li><strong>List Early:</strong> List your upcoming flight dates on Yankit as soon as you book your tickets to get matched faster.</li>
        <li><strong>Define Your Limits:</strong> Be clear about the weight and volume you are willing to carry.</li>
        <li><strong>Meet in Public Places:</strong> Use airport terminals or central transit hubs for drop-offs and pickups to ensure safety and convenience.</li>
      </ul>

      <p>Start turning your extra baggage weight into travel rewards today by listing your next trip!</p>
    `
  },
  {
    id: 4,
    title: "Top 7 Packing Hacks Every Traveler Needs to Know",
    category: "Baggage Tips",
    readTime: "3 min read",
    date: "May 28, 2026",
    author: "Sophia Martinez",
    excerpt: "From rolling clothes to packing cubes, these space-saving hacks will help you maximize your baggage allowance like a pro.",
    imageUrl: "/images/blog/packing_hacks.png",
    content: `
      <p>Whether you're traveling for leisure or listing your space on Yankit to earn extra income, packing efficiently is a must-have skill. Here are our top 7 packing secrets:</p>
      
      <h3>1. Roll, Don't Fold</h3>
      <p>Rolling your clothes tightly saves an incredible amount of space and reduces wrinkles compared to folding them flat.</p>

      <h3>2. Invest in Packing Cubes</h3>
      <p>Packing cubes keep your suitcase organized, compressed, and make it easy to unpack and repack during customs checks.</p>

      <h3>3. Fill Every Nook and Cranny</h3>
      <p>Put socks, chargers, and small items inside your shoes. Every cubic centimeter counts!</p>

      <h3>4. Wear Your Bulkiest Items</h3>
      <p>Wear your heavy boots, coat, and sweaters during the flight. This frees up precious kilograms in your checked luggage.</p>

      <p>Master these techniques and you will unlock spare baggage capacity that you can monetize on Yankit!</p>
    `
  }
];

const categories = ["All", "Company Updates", "Travel Hacks", "Community Stories", "Baggage Tips"];

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activePost, setActivePost] = useState(null);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const featuredPost = useMemo(() => {
    return blogPosts[0]; // First post is always featured
  }, []);

  return (
    <StaticPageLayout title="Yankit Blog & Insights" icon={BookOpen}>
      <div className="space-y-12">
        <p className="text-lg text-muted-foreground dark:text-slate-300 max-w-3xl">
          Discover travel tips, P2P shipping guides, company news, and inspiring stories from the global <span className="font-vernaccia-bold">Yankit</span> community.
        </p>

        {/* Featured Post Card */}
        {selectedCategory === "All" && !searchQuery && (
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700/50 flex flex-col md:flex-row group transition-all duration-300 hover:shadow-2xl">
            <div className="w-full md:w-1/2 h-64 md:h-96 overflow-hidden">
              <img 
                src={featuredPost.imageUrl} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary dark:bg-secondary/20 dark:text-secondary">
                    {featuredPost.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} /> {featuredPost.readTime}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground dark:text-white group-hover:text-primary dark:group-hover:text-secondary transition-colors line-clamp-2">
                  {featuredPost.title}
                </h3>
                <p className="text-muted-foreground dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary dark:text-secondary">
                    {featuredPost.author[0]}
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{featuredPost.author}</span>
                </div>
                <button 
                  onClick={() => setActivePost(featuredPost)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-primary dark:text-secondary hover:underline"
                >
                  Read Article <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <div 
                key={post.id}
                className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between group transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-white/90 text-slate-800 shadow-sm backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>
                
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                    </div>
                    <h4 className="text-lg font-bold text-foreground dark:text-white line-clamp-2 group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-muted-foreground dark:text-slate-300 text-xs leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <User size={12} /> <span>{post.author}</span>
                    </div>
                    <button 
                      onClick={() => setActivePost(post)}
                      className="flex items-center gap-1 text-xs font-bold text-primary dark:text-secondary hover:underline"
                    >
                      Read <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">No articles found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Try modifying your category filters or search queries.</p>
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      {activePost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            {/* Header / Cover Image */}
            <div className="relative h-64 md:h-80 w-full shrink-0">
              <img 
                src={activePost.imageUrl} 
                alt={activePost.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button 
                onClick={() => setActivePost(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary text-white">
                  {activePost.category}
                </span>
                <h2 className="text-xl md:text-3xl font-extrabold leading-tight text-white drop-shadow-md">
                  {activePost.title}
                </h2>
                <div className="flex items-center gap-4 text-xs opacity-90 drop-shadow-sm pt-1">
                  <span className="flex items-center gap-1"><User size={12} /> By {activePost.author}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {activePost.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {activePost.readTime}</span>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-10 space-y-6 overflow-y-auto">
              <div 
                className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 text-base leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: activePost.content }}
              />
              
              <div className="pt-8 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                <button 
                  onClick={() => setActivePost(null)}
                  className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StaticPageLayout>
  );
};

export default BlogPage;
