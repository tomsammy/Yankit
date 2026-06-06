import React from "react";
import StaticPageLayout from "@/components/layouts/StaticPageLayout";
import { Users } from "lucide-react";
import SEO from "@/components/SEO";

const AboutPage = () => {
  return (
    <>
      <SEO
        title="About Yankit | Peer-to-Peer Shipping Platform"
        description="Yankit connects senders with travelers to make international shipping affordable. Verified users, secure
payments, 99% on-time delivery."
        path="/"
        ogImageName="logo.png"
        // schema={schema}
      />
      <StaticPageLayout title="About Yankit" icon={Users}>
        <p>
          Welcome to <span className="font-vernaccia-bold">Yankit</span>! We are
          an innovative Australian-based company passionate about connecting
          people and making global item sharing simpler, more affordable, and
          community-driven. Our platform was born from the idea that the empty
          space in travellers' luggage could be a valuable resource for others.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">
          Our Mission
        </h2>
        <p>
          Our mission is to revolutionize the way people send and receive items
          across distances. We aim to empower individuals by providing a secure,
          reliable, and user-friendly platform that leverages the collective
          power of the travelling community. We believe in creating a more
          connected world where sharing resources benefits everyone.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">
          What We Do
        </h2>
        <p>
          <span className="font-vernaccia-bold">Yankit</span> facilitates
          connections between:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li>
            <strong>Senders:</strong> Individuals or businesses looking for a
            cost-effective way to send items. Senders are matched with
            travellers, pay securely, and drop their items at a designated
            Yankit point for safety assessment.
          </li>
          <li>
            <strong>Yankers (Travellers):</strong> Individuals who are
            travelling and have spare baggage allowance (up to 2 bags, 20kg
            each). They list their trip, get matched, and pick up pre-assessed
            bags from Yankit staff to carry for a fee.
          </li>
        </ul>
        <p>
          Our platform provides the algorithm to match these pairs, secure
          payment processing, and a safe handover process involving Yankit staff
          assessment.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">
          Our Values
        </h2>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li>
            <strong>Trust & Safety:</strong> We prioritize safety by requiring
            senders to sign dangerous goods declarations and having all bags
            assessed by Yankit staff before handover to the traveller.
          </li>
          <li>
            <strong>Community:</strong> We believe in the power of community and
            strive to foster a respectful and collaborative network of users.
          </li>
          <li>
            <strong>Innovation:</strong> We continuously seek to improve our
            platform and services to meet the evolving needs of our users.
          </li>
          <li>
            <strong>Affordability & Accessibility:</strong> We aim to make item
            sharing more accessible and budget-friendly for everyone.
          </li>
          <li>
            <strong>Sustainability:</strong> By utilizing existing travel and
            unused luggage space, we contribute to a more efficient use of
            resources.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary dark:text-secondary">
          The <span className="font-vernaccia-bold">Yankit</span> Team
        </h2>
        <p>
          Based in Brisbane, Australia, our dedicated team is comprised of tech
          enthusiasts, travel lovers, and customer service professionals
          committed to making{" "}
          <span className="font-vernaccia-bold">Yankit</span> the leading
          platform for peer-to-peer item sharing.
        </p>
        <p>
          Thank you for being part of the{" "}
          <span className="font-vernaccia-bold">Yankit</span> community!
        </p>
      </StaticPageLayout>
    </>
  );
};

export default AboutPage;
