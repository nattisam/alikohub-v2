import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Privacy Policy | AlikoHub";
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 lg:py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="px-6 py-12 rounded-[2rem] bg-card border border-border/50 shadow-[var(--shadow-card)] prose prose-slate dark:prose-invert max-w-none">
            <h1 className="font-heading text-4xl font-bold text-black dark:text-white mb-4">Privacy Policy (Final Version)</h1>
            <p className="font-medium text-black/80 dark:text-white/80 mb-1">Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="font-medium text-black/80 dark:text-white/80 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">Privacy Policy</h2>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              AlikoHub is committed to protecting your privacy and ensuring the security of your personal information across our platforms, including Aliko Academy and related services.
            </p>
            
            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">1. Information We Collect</h3>
            <p className="text-black dark:text-white mb-4">We may collect:</p>
            <ul className="text-black dark:text-white list-disc pl-6 space-y-2 mb-8">
              <li>Personal information (name, email, phone, location, organization)</li>
              <li>Account and learning activity data</li>
              <li>Technical data (IP address, browser, device, cookies)</li>
              <li>Communication and inquiry submissions</li>
            </ul>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">2. How We Use Your Information</h3>
            <p className="text-black dark:text-white mb-4">We use your data to:</p>
            <ul className="text-black dark:text-white list-disc pl-6 space-y-2 mb-8">
              <li>Operate and improve our platform</li>
              <li>Manage accounts and services</li>
              <li>Deliver learning programs and communications</li>
              <li>Personalize user experience</li>
              <li>Maintain platform security</li>
              <li>Comply with legal obligations</li>
            </ul>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">3. Cookies and Tracking</h3>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              We use cookies and analytics tools to enhance functionality and performance. Users may control cookies through browser settings.
            </p>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">4. Information Sharing</h3>
            <p className="text-black dark:text-white mb-4">We do not sell user data. Information may be shared with:</p>
            <ul className="text-black dark:text-white list-disc pl-6 space-y-2 mb-8">
              <li>Service providers and technical partners</li>
              <li>Approved program and ecosystem partners</li>
              <li>Legal authorities when required</li>
            </ul>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">5. International Use</h3>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              AlikoHub operates globally. Your data may be processed across jurisdictions, including the United States and other regions where we operate.
            </p>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">6. Data Security</h3>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              We implement reasonable safeguards to protect user data. However, no system is fully secure.
            </p>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">7. Data Retention</h3>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              We retain data only as necessary for service delivery, compliance, and operational purposes.
            </p>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">8. Your Rights</h3>
            <p className="text-black dark:text-white mb-4">Users may request:</p>
            <ul className="text-black dark:text-white list-disc pl-6 space-y-2 mb-4">
              <li>Access to their data</li>
              <li>Corrections or updates</li>
              <li>Deletion where applicable</li>
              <li>Opt-out from communications</li>
            </ul>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              <strong>Contact:</strong> <a href="mailto:info@alikohub.com" className="text-primary hover:underline">info@alikohub.com</a>
            </p>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">9. Third-Party Links</h3>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              We are not responsible for third-party platforms linked through our website.
            </p>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">10. Updates to Policy</h3>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              This policy may be updated. Continued use of the platform indicates acceptance of changes.
            </p>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">11. Contact</h3>
            <div className="text-black dark:text-white leading-relaxed space-y-2">
              <p><strong>AlikoHub</strong></p>
              <p><strong>Email:</strong> <a href="mailto:info@alikohub.com" className="text-primary hover:underline">info@alikohub.com</a></p>
              <p><strong>Website:</strong> <a href="https://www.alikohub.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.alikohub.com</a></p>
              <p><strong>Location:</strong> Seattle, Washington, USA</p>
              <p><strong>Regional:</strong> Addis Ababa, Ethiopia</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
