import { Layout } from "@/components/categories/stem/layout/Layout";

const Policies = () => {
  return (
    <Layout>
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container-content">
          <h1 className="font-display text-5xl font-extrabold text-foreground">
            <span className="text-primary">Policies</span>
          </h1>
          <p className="mt-5 text-xl text-muted-foreground">Legal information and disclaimers</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-content max-w-3xl space-y-14">
          <div id="privacy" className="p-8 rounded-2xl bg-card border border-primary/20">
            <h2 className="font-display text-2xl font-bold text-primary mb-4">Privacy Policy</h2>
            <p className="text-base text-muted-foreground leading-relaxed">We collect and process personal information to provide our training services. Your data is protected and never shared with third parties for marketing purposes without consent.</p>
          </div>

          <div id="terms" className="p-8 rounded-2xl bg-card border border-accent/20">
            <h2 className="font-display text-2xl font-bold text-accent mb-4">Terms of Use</h2>
            <p className="text-base text-muted-foreground leading-relaxed">By using our services, you agree to these terms. Training materials are for personal educational use only and may not be redistributed.</p>
          </div>

          <div id="disclaimer" className="p-8 rounded-2xl bg-card border border-accent-green/20">
            <h2 className="font-display text-2xl font-bold text-accent-green mb-4">Training Disclaimer</h2>
            <p className="text-base text-[hsl(210_30%_78%)] leading-relaxed">Aliko Academy STEM provides industry-aligned training based on globally recognized vendor ecosystems. We do not guarantee employment outcomes or salary levels.</p>
          </div>

          <div id="certification" className="p-8 rounded-2xl bg-card border border-accent/20">
            <h2 className="font-display text-2xl font-bold text-accent mb-4">Certification Disclaimer</h2>
            <p className="text-base text-[hsl(210_30%_78%)] leading-relaxed">Certification exams and credentials are administered by third-party vendors. Aliko Academy STEM provides training and preparation only and does not guarantee exam outcomes or issue vendor certifications.</p>
          </div>

          <div id="refund" className="p-8 rounded-2xl bg-card border border-primary/20">
            <h2 className="font-display text-2xl font-bold text-primary mb-4">Refund Policy</h2>
            <p className="text-base text-muted-foreground leading-relaxed">Refund requests are handled on a case-by-case basis. Please contact us within 7 days of enrollment for refund inquiries.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Policies;
