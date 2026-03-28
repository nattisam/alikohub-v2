import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Terms of Service | AlikoHub";
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 lg:py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="px-6 py-12 rounded-[2rem] bg-card border border-border/50 shadow-[var(--shadow-card)] prose prose-slate dark:prose-invert max-w-none">
            <h1 className="font-heading text-4xl font-bold text-black dark:text-white mb-4">Terms of Service (Final Version)</h1>
            <p className="font-medium text-black/80 dark:text-white/80 mb-1">Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="font-medium text-black/80 dark:text-white/80 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">Terms of Service</h2>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              By accessing or using AlikoHub services, you agree to the following terms.
            </p>
            
            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">1. Use of Services</h3>
            <p className="text-black dark:text-white mb-4">You agree to use AlikoHub services lawfully and responsibly. You may not:</p>
            <ul className="text-black dark:text-white list-disc pl-6 space-y-2 mb-8">
              <li>Violate laws or regulations</li>
              <li>Engage in misuse or unauthorized access</li>
              <li>Disrupt platform functionality</li>
              <li>Copy or distribute content without permission</li>
            </ul>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">2. Accounts</h3>
            <p className="text-black dark:text-white mb-4">Users are responsible for:</p>
            <ul className="text-black dark:text-white list-disc pl-6 space-y-2 mb-8">
              <li>Accurate account information</li>
              <li>Securing login credentials</li>
              <li>All activity under their account</li>
            </ul>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">3. Services Scope</h3>
            <p className="text-black dark:text-white mb-4">AlikoHub provides:</p>
            <ul className="text-black dark:text-white list-disc pl-6 space-y-2 mb-4">
              <li>Education and training (Aliko Academy)</li>
              <li>Technology and innovation solutions</li>
              <li>Consulting and ecosystem services</li>
            </ul>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              Participation does not guarantee employment or outcomes unless explicitly stated.
            </p>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">4. Payments</h3>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              Where applicable, fees must be paid per service terms. Refund policies are defined per offering.
            </p>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">5. Intellectual Property</h3>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              All content, branding, and materials belong to AlikoHub unless stated otherwise. Unauthorized use is prohibited.
            </p>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">6. User Content</h3>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              Users retain ownership of submitted content but grant AlikoHub limited rights to use it for platform operations.
            </p>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">7. Third-Party Services</h3>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              We are not responsible for third-party tools or platforms integrated or linked.
            </p>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">8. Disclaimer</h3>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              Services are provided &ldquo;as is&rdquo; without guarantees of uninterrupted or error-free performance.
            </p>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">9. Limitation of Liability</h3>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              AlikoHub is not liable for indirect or consequential damages resulting from use of the platform.
            </p>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">10. Termination</h3>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              We may suspend or terminate access for violations of these terms.
            </p>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">11. Governing Law</h3>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              These Terms are governed by applicable laws relevant to AlikoHub&rsquo;s operations.
            </p>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">12. Updates</h3>
            <p className="text-black dark:text-white leading-relaxed mb-8">
              We may update these Terms. Continued use constitutes acceptance.
            </p>

            <hr className="my-8 border-border/50" />

            <h3 className="text-xl font-bold text-black dark:text-white mt-8 mb-4 tracking-tight">13. Contact</h3>
            <div className="text-black dark:text-white leading-relaxed space-y-2">
              <p><strong>AlikoHub</strong></p>
              <p><strong>Email:</strong> <a href="mailto:info@alikohub.com" className="text-primary hover:underline">info@alikohub.com</a></p>
              <p><strong>Website:</strong> <a href="https://www.alikohub.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.alikohub.com</a></p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
