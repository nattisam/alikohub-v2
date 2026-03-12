import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface LegalPageProps {
  title: string;
  content: string[];
}

const LegalPage = ({ title, content }: LegalPageProps) => (
  <div>
    <section className="bg-navy section-padding">
      <div className="container-wide">
        <h1 className="font-serif text-4xl font-bold text-primary-foreground">{title}</h1>
      </div>
    </section>
    <section className="section-padding">
      <div className="container-narrow prose prose-sm max-w-none">
        {content.map((p, i) => (
          <p key={i} className="text-muted-foreground leading-relaxed mb-4">{p}</p>
        ))}
        <p className="text-muted-foreground text-sm mt-8">Last updated: March 2026</p>
      </div>
    </section>
  </div>
);

export const Privacy = () => (
  <LegalPage
    title="Privacy Policy"
    content={[
      "At Aliko Consultancy, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.",
      "We collect information you provide directly, such as your name, email, phone number, and application details. We use this information to deliver our consultancy services and communicate with you.",
      "We do not sell, rent, or share your personal information with third parties except as necessary to provide our services or as required by law.",
      "We implement industry-standard security measures to protect your data. If you have questions about our privacy practices, please contact us.",
    ]}
  />
);

export const Terms = () => (
  <LegalPage
    title="Terms & Conditions"
    content={[
      "By using Aliko Consultancy's services, you agree to these terms and conditions.",
      "Our consultancy services are provided for informational and advisory purposes. While we strive to provide accurate and helpful guidance, outcomes are not guaranteed.",
      "You are responsible for providing accurate information in your applications and bookings. Aliko Consultancy reserves the right to decline or terminate services if false information is provided.",
      "All content on this website is the property of Aliko Consultancy and may not be reproduced without permission.",
    ]}
  />
);

export const Refund = () => (
  <LegalPage
    title="Refund Policy"
    content={[
      "Aliko Consultancy offers refunds under the following conditions:",
      "Cancellations made 48 hours or more before a scheduled consultation are eligible for a full refund. Cancellations within 48 hours may be subject to a cancellation fee.",
      "For program enrollments, refund eligibility depends on the specific program terms provided at the time of enrollment.",
      "To request a refund, please contact our team with your booking or application code.",
    ]}
  />
);

export const Cookies = () => (
  <LegalPage
    title="Cookie Policy"
    content={[
      "This website uses cookies to enhance your browsing experience and provide personalized services.",
      "Essential cookies are required for the website to function properly. Analytics cookies help us understand how visitors interact with our site.",
      "You can manage your cookie preferences through your browser settings. Disabling certain cookies may affect the functionality of our website.",
      "For more information about how we use cookies, please contact us.",
    ]}
  />
);
