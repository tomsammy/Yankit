import React from 'react';
    import StaticPageLayout from '@/components/layouts/StaticPageLayout';
    import { FileText } from 'lucide-react';

    const TermsOfServicePage = () => {
      const lastUpdated = "23 May 2025";

      return (
        <StaticPageLayout title="Terms of Service" icon={FileText}>
          <p className="text-sm text-muted-foreground dark:text-slate-400">Last Updated: {lastUpdated}</p>
          
          <p>
            Welcome to <span className="font-vernaccia-bold">Yankit</span>! These Terms of Service ("Terms") govern your use of the <span className="font-vernaccia-bold">Yankit</span> website, mobile applications, and services (collectively, the "Platform") provided by <span className="font-vernaccia-bold">Yankit</span> Proprietary Ltd. ("<span className="font-vernaccia-bold">Yankit</span>," "we," "us," or "our"). By accessing or using our Platform, you agree to be bound by these Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">1. Platform Overview</h2>
          <p>
            <span className="font-vernaccia-bold">Yankit</span> is a peer-to-peer platform that connects users who wish to send items ("Senders") with users who are travelling and have available baggage allowance to carry such items ("Yankers" or "Travellers"). <span className="font-vernaccia-bold">Yankit</span> facilitates these connections but is not a party to any agreement between Senders and Yankers, nor is it a carrier, freight forwarder, or logistics provider.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">2. Eligibility and Account Registration</h2>
          <p>
            You must be at least 18 years old to use the Platform. By registering for an account, you represent and warrant that all information you provide is accurate, current, and complete. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">3. User Conduct and Responsibilities</h2>
          <p>As a user of the <span className="font-vernaccia-bold">Yankit</span> Platform, you agree to:</p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>Comply with all applicable local, state, national, and international laws and regulations, including customs and airline regulations.</li>
            <li>Provide accurate and truthful information in your listings, communications, and profile.</li>
            <li>Use the Platform for lawful purposes only and not to send or carry prohibited items (including, but not limited to, illegal substances, weapons, hazardous materials, counterfeit goods, or items restricted by airline or customs authorities).</li>
            <li>Communicate respectfully and professionally with other users.</li>
            <li>Not engage in fraudulent activities, misrepresentation, or any conduct that could harm <span className="font-vernaccia-bold">Yankit</span> or its users.</li>
            <li>Complete transactions agreed upon, unless a legitimate reason prevents it (e.g., cancellation agreed by both parties).</li>
          </ul>
          <p>
            Senders are solely responsible for the items they request to be carried. Yankers are solely responsible for the items they agree to carry and for ensuring compliance with all travel and customs regulations. <span className="font-vernaccia-bold">Yankit</span> explicitly disclaims any liability for the nature, legality, or condition of items exchanged through the Platform.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">4. Listings, Bookings, and Payments</h2>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li><strong>Listings:</strong> Yankers may create listings detailing their travel plans and available baggage space. Senders may search for these listings.</li>
            <li><strong>Agreements:</strong> Senders and Yankers negotiate and agree upon the terms of service (item(s), price, pickup/delivery) through the Platform's communication tools. This agreement forms a binding contract between the Sender and Yanker.</li>
            <li><strong>Payments:</strong> Senders pay the agreed-upon fee through the Platform. <span className="font-vernaccia-bold">Yankit</span> uses third-party payment processors (e.g., Stripe) to handle transactions. Funds are held by <span className="font-vernaccia-bold">Yankit</span> (or its processor) and released to the Yanker upon confirmation of successful delivery by the Sender.</li>
            <li><strong>Service Fees:</strong> <span className="font-vernaccia-bold">Yankit</span> charges a service fee to both Senders and Yankers for successfully completed transactions. These fees will be clearly communicated before confirming a transaction.</li>
            <li><strong>Cancellations and Refunds:</strong> Cancellation and refund policies will be detailed on the Platform and may depend on the timing of the cancellation and the agreement between users. <span className="font-vernaccia-bold">Yankit</span> reserves the right to mediate disputes regarding cancellations and refunds.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">5. Intellectual Property</h2>
          <p>
            The Platform and its original content, features, and functionality are and will remain the exclusive property of <span className="font-vernaccia-bold">Yankit</span> Proprietary Ltd. and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of <span className="font-vernaccia-bold">Yankit</span>.
          </p>
          <p>
            By submitting content (e.g., listing descriptions, reviews) to the Platform, you grant <span className="font-vernaccia-bold">Yankit</span> a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform such content in connection with the Platform and <span className="font-vernaccia-bold">Yankit</span>'s (and its successors') business.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">6. Disclaimers and Limitation of Liability</h2>
          <p>
            The Platform is provided on an "AS IS" and "AS AVAILABLE" basis. <span className="font-vernaccia-bold">Yankit</span> makes no warranties, express or implied, regarding the Platform's reliability, security, or suitability for your needs.
          </p>
          <p>
            <span className="font-vernaccia-bold">Yankit</span> is not responsible for the conduct of its users, the legality or condition of items transported, or the performance of any agreements made between users. Any disputes between users must be resolved directly between them, although <span className="font-vernaccia-bold">Yankit</span> may offer a dispute resolution process.
          </p>
          <p>
            To the fullest extent permitted by law (including the Australian Consumer Law), <span className="font-vernaccia-bold">Yankit</span> Proprietary Ltd., its directors, employees, partners, agents, suppliers, or affiliates, shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Platform; (ii) any conduct or content of any third party on the Platform; (iii) any content obtained from the Platform; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.
          </p>
          <p>
            Our liability for any breach of a condition or warranty implied by law and which cannot be excluded, is limited to the extent possible, at <span className="font-vernaccia-bold">Yankit</span>'s option, to: (a) the supplying of the services again; or (b) the payment of the cost of having the services supplied again.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">7. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless <span className="font-vernaccia-bold">Yankit</span> Proprietary Ltd. and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of a) your use and access of the Platform, by you or any person using your account and password; b) a breach of these Terms, or c) content posted on the Platform.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">8. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the Platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms. If you wish to terminate your account, you may simply discontinue using the Platform or contact us to request account deletion.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of Queensland, Australia, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">10. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Platform after any revisions become effective, you agree to be bound by the revised terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:legal@yankit.com.au" className="text-primary hover:underline dark:text-secondary">legal@yankit.com.au</a>.
          </p>
        </StaticPageLayout>
      );
    };

    export default TermsOfServicePage;