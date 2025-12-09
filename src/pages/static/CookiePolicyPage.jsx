import React from 'react';
    import StaticPageLayout from '@/components/layouts/StaticPageLayout';
    import { Cookie } from 'lucide-react';

    const CookiePolicyPage = () => {
      const lastUpdated = "23 May 2025";

      return (
        <StaticPageLayout title="Cookie Policy" icon={Cookie}>
          <p className="text-sm text-muted-foreground dark:text-slate-400">Last Updated: {lastUpdated}</p>
          
          <p>
            This Cookie Policy explains how <span className="font-vernaccia-bold">Yankit</span> Pty Ltd ("<span className="font-vernaccia-bold">Yankit</span>," "we," "us," or "our") uses cookies and similar tracking technologies on our website, mobile applications, and services (collectively, the "Platform"). It also explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">1. What are Cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>
          <p>
            Cookies set by the website owner (in this case, <span className="font-vernaccia-bold">Yankit</span>) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">2. Why Do We Use Cookies?</h2>
          <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Platform to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Platform. Third parties serve cookies through our Platform for advertising, analytics, and other purposes. This is described in more detail below.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">3. Types of Cookies We Use</h2>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>
              <strong>Strictly Necessary Cookies:</strong> These cookies are essential to provide you with services available through our Platform and to enable you to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the Platform to you, you cannot refuse them without impacting how our Platform functions.
            </li>
            <li>
              <strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our Platform but are non-essential to their use. However, without these cookies, certain functionality (like remembering your login details or preferences) may become unavailable.
            </li>
            <li>
              <strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our Platform is being used or how effective our marketing campaigns are, or to help us customize our Platform for you. Examples include cookies from Google Analytics.
            </li>
            <li>
              <strong>Advertising (Targeting) Cookies:</strong> These cookies are used to make advertising messages more relevant to you and your interests. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.
            </li>
            <li>
              <strong>Social Media Cookies:</strong> These cookies are used to enable you to share pages and content that you find interesting on our Platform through third-party social networking and other websites. These cookies may also be used for advertising purposes too.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">4. How Can You Control Cookies?</h2>
          <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences in the following ways:</p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>
              <strong>Browser Controls:</strong> Most web browsers allow some control of most cookies through the browser settings. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our Platform though your access to some functionality and areas of our Platform may be restricted. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline dark:text-secondary">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline dark:text-secondary">www.allaboutcookies.org</a>.
            </li>
            <li>
              <strong>Opting out of interest-based advertising:</strong> Many advertising networks offer you a way to opt out of interest-based advertising. If you would like to find out more information, please visit <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline dark:text-secondary">http://www.aboutads.info/choices/</a> or <a href="http://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline dark:text-secondary">http://www.youronlinechoices.com</a> (for EU users). Australian users can visit <a href="http://www.youronlinechoices.com.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline dark:text-secondary">http://www.youronlinechoices.com.au</a>.
            </li>
             <li>
              <strong>Platform Cookie Consent Tool:</strong> When you first visit our Platform, you may be presented with a cookie banner or consent tool that allows you to set your preferences.
            </li>
          </ul>
          <p>Please note that disabling cookies may affect the functionality of our Platform.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">5. Other Tracking Technologies</h2>
          <p>
            In addition to cookies, we may use other similar tracking technologies like web beacons (sometimes called "tracking pixels" or "clear gifs"). These are tiny graphics files that contain a unique identifier that enable us to recognize when someone has visited our Platform or opened an email that we have sent them. This allows us, for example, to monitor the traffic patterns of users from one page within our Platform to another, to deliver or communicate with cookies, to understand whether you have come to our Platform from an online advertisement displayed on a third-party website, to improve site performance, and to measure the success of email marketing campaigns. In many instances, these technologies are reliant on cookies to function properly, and so declining cookies will impair their functioning.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">6. Changes to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies. The date at the top of this Cookie Policy indicates when it was last updated.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">7. Contact Us</h2>
          <p>
            If you have any questions about our use of cookies or other technologies, please email us at <a href="mailto:privacy@yankit.com.au" className="text-primary hover:underline dark:text-secondary">privacy@yankit.com.au</a>.
          </p>
        </StaticPageLayout>
      );
    };

    export default CookiePolicyPage;