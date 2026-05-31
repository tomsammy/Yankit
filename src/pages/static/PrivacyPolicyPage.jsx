import React from "react";
import StaticPageLayout from "@/components/layouts/StaticPageLayout";
import { Lock } from "lucide-react";

const PrivacyPolicyPage = () => {
  const lastUpdated = "23 May 2025";

  return (
    <StaticPageLayout title="Privacy Policy" icon={Lock}>
      <p className="text-sm text-muted-foreground dark:text-slate-400">
        Last Updated: {lastUpdated}
      </p>

      <p>
        <span className="font-vernaccia-bold">Yankit</span> Proprietary Ltd. ("
        <span className="font-vernaccia-bold">Yankit</span>," "we," "us," or
        "our") is committed to protecting your privacy. This Privacy Policy
        explains how we collect, use, disclose, and safeguard your information
        when you use our website, mobile applications, and services
        (collectively, the "Platform"). Please read this policy carefully.
      </p>
      <p>
        We comply with the Australian Privacy Principles (APPs) contained in the
        Privacy Act 1988 (Cth) ("Privacy Act") and, where applicable, the
        General Data Protection Regulation (GDPR) for users in the European
        Economic Area (EEA).
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">
        1. Information We Collect
      </h2>
      <p>
        We may collect personal information from you in a variety of ways,
        including:
      </p>
      <ul className="list-disc list-inside ml-4 space-y-2">
        <li>
          <strong>Personal Identification Information:</strong> Name, email
          address, phone number, postal address, date of birth,
          government-issued ID (for verification purposes), and profile picture.
        </li>
        <li>
          <strong>Travel and Listing Information:</strong> Details about your
          travel plans (origin, destination, dates), baggage allowance, item
          descriptions, and transaction history on the Platform.
        </li>
        <li>
          <strong>Payment Information:</strong> While we use third-party payment
          processors (e.g., Stripe), we may collect transaction details. We do
          not directly store full credit card numbers.
        </li>
        <li>
          <strong>Communications:</strong> Messages exchanged with other users
          through our in-app messaging system, and communications with our
          support team.
        </li>
        <li>
          <strong>Device and Usage Information:</strong> IP address, browser
          type, operating system, device identifiers, pages visited, time spent
          on pages, links clicked, and other usage data.
        </li>
        <li>
          <strong>Location Information:</strong> With your consent, we may
          collect your device's location information.
        </li>
        <li>
          <strong>Cookies and Tracking Technologies:</strong> We use cookies and
          similar technologies. Please see our{" "}
          <a
            href="/cookies"
            className="text-primary hover:underline dark:text-secondary"
          >
            Cookie Policy
          </a>{" "}
          for more details.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">
        2. How We Use Your Information
      </h2>
      <p>We use the information we collect for various purposes, including:</p>
      <ul className="list-disc list-inside ml-4 space-y-2">
        <li>To provide, operate, and maintain our Platform.</li>
        <li>
          To create and manage your account, and facilitate transactions between
          users.
        </li>
        <li>To process payments and prevent fraudulent transactions.</li>
        <li>
          To personalize your experience and to allow us to deliver the type of
          content and product offerings in which you are most interested.
        </li>
        <li>To improve our Platform, products, and services.</li>
        <li>
          To communicate with you, including responding to your inquiries,
          providing customer support, and sending service-related announcements.
        </li>
        <li>
          To send you marketing and promotional communications (with your
          consent where required by law).
        </li>
        <li>To enforce our Terms of Service and other policies.</li>
        <li>
          To comply with legal obligations and protect the rights, property, and
          safety of <span className="font-vernaccia-bold">Yankit</span>, our
          users, and others.
        </li>
        <li>For analytics and research purposes.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">
        3. How We Share Your Information
      </h2>
      <p>We may share your information in the following situations:</p>
      <ul className="list-disc list-inside ml-4 space-y-2">
        <li>
          <strong>With Other Users:</strong> To facilitate transactions, we
          share relevant information between Senders and Yankers (e.g., names,
          item details, travel plans, communication within the platform).
        </li>
        <li>
          <strong>With Service Providers:</strong> We may share your information
          with third-party vendors, service providers, contractors, or agents
          who perform services for us or on our behalf (e.g., payment
          processing, data analysis, email delivery, hosting services, customer
          service).
        </li>
        <li>
          <strong>For Legal Reasons:</strong> We may disclose your information
          if required to do so by law or in response to valid requests by public
          authorities (e.g., a court or a government agency). This includes
          compliance with Australian law enforcement requests and international
          legal obligations where applicable.
        </li>
        <li>
          <strong>To Protect Rights and Safety:</strong> We may disclose
          information to protect the rights, property, or safety of{" "}
          <span className="font-vernaccia-bold">Yankit</span>, our users, or the
          public as required or permitted by law.
        </li>
        <li>
          <strong>Business Transfers:</strong> In connection with, or during
          negotiations of, any merger, sale of company assets, financing, or
          acquisition of all or a portion of our business by another company.
        </li>
        <li>
          <strong>With Your Consent:</strong> We may disclose your personal
          information for any other purpose with your consent.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">
        4. International Data Transfers
      </h2>
      <p>
        Your information, including personal data, may be transferred to — and
        maintained on — computers located outside of your state, province,
        country, or other governmental jurisdiction where the data protection
        laws may differ from those in your jurisdiction. If you are located in
        the EEA, your data may be transferred outside the EEA. We will take all
        steps reasonably necessary to ensure that your data is treated securely
        and in accordance with this Privacy Policy and no transfer of your
        personal data will take place to an organization or a country unless
        there are adequate controls in place including the security of your data
        and other personal information. For users in Australia, we ensure that
        any overseas recipients of personal information comply with the APPs or
        are subject to laws that provide a similar level of protection.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">
        5. Your Data Protection Rights
      </h2>
      <p>
        Depending on your location and applicable law, you may have the
        following rights regarding your personal information:
      </p>
      <ul className="list-disc list-inside ml-4 space-y-2">
        <li>
          <strong>Right to Access:</strong> You have the right to request copies
          of your personal information.
        </li>
        <li>
          <strong>Right to Rectification:</strong> You have the right to request
          that we correct any information you believe is inaccurate or complete
          information you believe is incomplete.
        </li>
        <li>
          <strong>Right to Erasure (Right to be Forgotten):</strong> You have
          the right to request that we erase your personal information, under
          certain conditions.
        </li>
        <li>
          <strong>Right to Restrict Processing:</strong> You have the right to
          request that we restrict the processing of your personal information,
          under certain conditions.
        </li>
        <li>
          <strong>Right to Object to Processing:</strong> You have the right to
          object to our processing of your personal information, under certain
          conditions.
        </li>
        <li>
          <strong>Right to Data Portability:</strong> You have the right to
          request that we transfer the data that we have collected to another
          organization, or directly to you, under certain conditions.
        </li>
        <li>
          <strong>Right to Withdraw Consent:</strong> If we are processing your
          personal information based on your consent, you have the right to
          withdraw your consent at any time.
        </li>
      </ul>
      <p>
        To exercise these rights, please contact us using the details below.
        Australian users can find more information about their rights from the
        Office of the Australian Information Commissioner (OAIC). EEA users can
        find more information from their local data protection authority.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">
        6. Data Security
      </h2>
      <p>
        We use administrative, technical, and physical security measures to help
        protect your personal information. While we have taken reasonable steps
        to secure the personal information you provide to us, please be aware
        that despite our efforts, no security measures are perfect or
        impenetrable, and no method of data transmission can be guaranteed
        against any interception or other type of misuse.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">
        7. Data Retention
      </h2>
      <p>
        We will retain your personal information only for as long as is
        necessary for the purposes set out in this Privacy Policy, or as
        required by applicable law (e.g., for tax, accounting, or other legal
        requirements).
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">
        8. Children's Privacy
      </h2>
      <p>
        Our Platform is not intended for use by children under the age of 18. We
        do not knowingly collect personal information from children under 18. If
        we become aware that we have collected personal information from a child
        under 18 without verification of parental consent, we take steps to
        remove that information from our servers.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">
        9. Changes to This Privacy Policy
      </h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you
        of any changes by posting the new Privacy Policy on this page and
        updating the "Last Updated" date. You are advised to review this Privacy
        Policy periodically for any changes.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">
        10. Contact Us
      </h2>
      <p>
        If you have any questions or concerns about this Privacy Policy or our
        data practices, or if you wish to make a complaint about a breach of the
        Australian Privacy Principles or GDPR, please contact our Privacy
        Officer at:
      </p>
      <p>
        Email:{" "}
        <a
          href="mailto:privacy@yankit.com.au"
          className="text-primary hover:underline dark:text-secondary"
        >
          privacy@yankit.com.au
        </a>
        <br />
        Address: Privacy Officer,{" "}
        <span className="font-vernaccia-bold">Yankit</span> Proprietary Ltd.,
        Building 5, 22 Magnolia Dr, Brookwater QLD 4300, Australia.
      </p>
      <p>
        We will take reasonable steps to investigate any complaint and respond
        to you in writing within a reasonable timeframe. If you are not
        satisfied with our response, you may be able to take your complaint to
        the Office of the Australian Information Commissioner or your local data
        protection authority in the EEA.
      </p>
    </StaticPageLayout>
  );
};

export default PrivacyPolicyPage;
