import React from "react";
import StaticPageLayout from "@/components/layouts/StaticPageLayout";
import { ShieldCheck } from "lucide-react";

const TrustSafetyPage = () => {
  return (
    <StaticPageLayout title="Trust & Safety at Baggit" icon={ShieldCheck}>
      <p>
        At <span className="font-vernaccia-bold">Baggit</span>, creating a
        trustworthy and secure environment for our community is our top
        priority. We understand that you're entrusting us and other users with
        your items and travel plans, and we take that responsibility seriously.
        Here’s how we work to keep{" "}
        <span className="font-vernaccia-bold">Baggit</span> safe for everyone.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">
        Our Commitment to Safety
      </h2>
      <ul className="list-disc list-inside ml-4 space-y-3">
        <li>
          <strong>Baggit Staff Assessment:</strong> To ensure safety, all bags
          must be dropped off by the sender at a designated Baggit drop-off
          point. Our staff assesses the items before they are handed over to the
          traveller.
        </li>
        <li>
          <strong>Dangerous Goods Declaration:</strong> Senders are required to
          sign a declaration form confirming they are not sending any dangerous
          or prohibited goods.
        </li>
        <li>
          <strong>Secure Payments:</strong> Our platform integrates with trusted
          payment gateways (like Stripe) to handle transactions securely. Funds
          are held by <span className="font-vernaccia-bold">Baggit</span> and
          released to the Yanker only after the Sender confirms successful
          receipt of the item(s).
        </li>
        <li>
          <strong>Community Guidelines:</strong> We have clear Community
          Guidelines that all users must adhere to. These guidelines promote
          respectful interactions and responsible use of the platform.
          Violations can lead to account suspension or termination.
        </li>
        <li>
          <strong>Reviews and Ratings:</strong> After a transaction is
          completed, both Senders and Yankers can rate and review each other.
          This system helps build trust and allows users to make informed
          decisions.
        </li>
        <li>
          <strong>Prohibited Items & Activities:</strong>{" "}
          <span className="font-vernaccia-bold">Baggit</span> strictly prohibits
          the sending or carrying of illegal goods, hazardous materials,
          weapons, counterfeit items, and any other items restricted by airline
          regulations or customs laws.
        </li>
        <li>
          <strong>Data Privacy:</strong> We are committed to protecting your
          personal information. Please review our{" "}
          <a
            href="/privacy"
            className="text-primary hover:underline dark:text-secondary"
          >
            Privacy Policy
          </a>{" "}
          for details on how we collect, use, and protect your data.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">
        Your Role in Staying Safe
      </h2>
      <p>
        Safety is a shared responsibility. Here are some tips for Senders and
        Yankers:
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-2 text-slate-800 dark:text-slate-100">
        For Senders:
      </h3>
      <ul className="list-disc list-inside ml-4 space-y-2">
        <li>
          <strong>Be Clear and Honest:</strong> Accurately describe the items
          you want to send. Do not attempt to send prohibited items.
        </li>
        <li>
          <strong>Sign the Declaration:</strong> Ensure you read and sign the
          dangerous goods declaration truthfully.
        </li>
        <li>
          <strong>Use Secure Payment:</strong> Always make payments through the{" "}
          <span className="font-vernaccia-bold">Baggit</span> platform. Do not
          engage in off-platform payments.
        </li>
        <li>
          <strong>Drop Off Securely:</strong> Drop your bag only at the
          designated Baggit drop-off point for assessment.
        </li>
        <li>
          <strong>Confirm Receipt Promptly:</strong> Once your recipient
          receives the items, confirm delivery on the platform so the Yanker can
          be paid.
        </li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-2 text-slate-800 dark:text-slate-100">
        For Yankers (Travellers):
      </h3>
      <ul className="list-disc list-inside ml-4 space-y-2">
        <li>
          <strong>Pick Up Assessed Bags:</strong> Only pick up bags from the
          designated Baggit drop-off point after they have been assessed by our
          staff.
        </li>
        <li>
          <strong>Understand Regulations:</strong> Be aware of customs and
          airline regulations for both your origin and destination countries.
        </li>
        <li>
          <strong>Communicate Your Availability:</strong> Clearly state your
          travel dates and baggage capacity (max 2 bags, 20kg each).
        </li>
        <li>
          <strong>Report Suspicious Activity:</strong> If you encounter any
          suspicious requests or behaviour, report it to{" "}
          <span className="font-vernaccia-bold">Baggit</span> support
          immediately.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">
        Reporting Issues
      </h2>
      <p>
        If you encounter any safety concerns, violations of our Community
        Guidelines, or suspicious activity, please contact our support team
        immediately through the{" "}
        <a
          href="/support"
          className="text-primary hover:underline dark:text-secondary"
        >
          Help Center
        </a>{" "}
        or by emailing{" "}
        <a
          href="mailto:safety@yankit.com.au"
          className="text-primary hover:underline dark:text-secondary"
        >
          safety@yankit.com.au
        </a>
        .
      </p>
      <p>
        Your vigilance helps us maintain a safe and trusted platform for
        everyone.
      </p>
    </StaticPageLayout>
  );
};

export default TrustSafetyPage;
