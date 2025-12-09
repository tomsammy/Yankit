import React from 'react';
    import StaticPageLayout from '@/components/layouts/StaticPageLayout';
    import { Briefcase } from 'lucide-react';

    const CareersPage = () => {
      return (
        <StaticPageLayout title="Careers at Yankit" icon={Briefcase}>
          <p>
            Join the <span className="font-vernaccia-bold">Yankit</span> team and help us reshape the future of item sharing and logistics! We are a dynamic and growing company based in Brisbane, Australia, with a global vision. We're looking for passionate, innovative, and driven individuals to contribute to our mission.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">Why Work With Us?</h2>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li><strong>Impactful Work:</strong> Be part of a platform that is making a real difference by connecting people and optimizing resources.</li>
            <li><strong>Innovative Environment:</strong> We foster a culture of creativity, collaboration, and continuous learning.</li>
            <li><strong>Growth Opportunities:</strong> As we expand, so do the opportunities for our team members to grow and develop their careers.</li>
            <li><strong>Diverse Team:</strong> We value diversity and believe it drives innovation. We are an equal opportunity employer.</li>
            <li><strong>Great Culture:</strong> Join a supportive and energetic team that is passionate about what we do.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">Current Openings</h2>
          <p>
            We are always on the lookout for talented individuals. While we may not have specific roles listed at all times, we encourage you to reach out if you believe your skills and passion align with our mission.
          </p>
          <div className="p-6 my-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">No current openings listed.</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Please check back later for specific job postings. However, if you are passionate about what we do and believe you can contribute to <span className="font-vernaccia-bold">Yankit</span>'s success, we'd love to hear from you!
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">How to Apply</h2>
          <p>
            If you are interested in potential future opportunities or wish to submit a general application, please send your resume and a cover letter explaining your interest in <span className="font-vernaccia-bold">Yankit</span> and how you can contribute to our team to:
          </p>
          <p className="font-medium text-primary dark:text-secondary">
            <a href="mailto:careers@yankit.com.au" className="hover:underline">careers@yankit.com.au</a>
          </p>
          <p>
            Please include the type of role you are interested in (e.g., Software Development, Marketing, Customer Support, Operations) in the subject line of your email.
          </p>
          <p>
            <span className="font-vernaccia-bold">Yankit</span> Pty Ltd is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees.
          </p>
          <p>
            We look forward to hearing from talented individuals who want to be part of our exciting journey!
          </p>
        </StaticPageLayout>
      );
    };

    export default CareersPage;