import React from 'react';
    import StaticPageLayout from '@/components/layouts/StaticPageLayout';
    import { Newspaper } from 'lucide-react';

    const PressPage = () => {
      return (
        <StaticPageLayout title="Press & Media" icon={Newspaper}>
          <p>
            Welcome to the <span className="font-vernaccia-bold">Yankit</span> press room. Here you'll find information about our company, brand assets, and contact details for media inquiries. We are excited to share our story and how we are changing the way people think about sending and receiving items.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">About <span className="font-vernaccia-bold">Yankit</span></h2>
          <p>
            <span className="font-vernaccia-bold">Yankit</span> is a peer-to-peer platform connecting Senders with Travellers (Yankers) who have spare baggage allowance. Our mission is to make item sharing more affordable, efficient, and community-driven. Based in Brisbane, Australia, we are leveraging technology to create a global network for smarter logistics.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">Media Kit & Brand Assets</h2>
          <p>
            For official <span className="font-vernaccia-bold">Yankit</span> logos, brand guidelines, and high-resolution images, please request access by contacting our media team. We kindly ask that you adhere to our brand guidelines when using these assets.
          </p>
          <div className="my-6">
            <a 
              href="mailto:press@yankit.com.au?subject=Media%20Kit%20Request" 
              className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors"
            >
              Request Media Kit
            </a>
          </div>
          

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">Press Releases</h2>
          <p>
            Stay updated with our latest announcements and milestones.
          </p>
          <div className="p-6 my-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">No recent press releases.</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Check back soon for updates on <span className="font-vernaccia-bold">Yankit</span>'s journey and achievements.
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">Media Contact</h2>
          <p>
            For all media inquiries, interview requests, or to be added to our press list, please contact:
          </p>
          <p className="font-medium">
            Media Relations Team <br />
            <span className="font-vernaccia-bold">Yankit</span> Pty Ltd <br />
            Email: <a href="mailto:press@yankit.com.au" className="text-primary hover:underline dark:text-secondary">press@yankit.com.au</a>
          </p>
          <p>
            We aim to respond to all media inquiries within 24-48 business hours.
          </p>
          <p>
            Follow us on our social media channels to stay connected with the latest news and updates from <span className="font-vernaccia-bold">Yankit</span>.
          </p>
        </StaticPageLayout>
      );
    };

    export default PressPage;