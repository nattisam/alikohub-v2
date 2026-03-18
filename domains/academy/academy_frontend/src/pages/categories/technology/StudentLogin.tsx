import { ExternalLink } from 'lucide-react';
import Layout from '@/components/categories/technology/layout/Layout';
import logo from '@/assets/categories/technology/logo-full.png';

const StudentLogin = () => {
  const lmsUrl = 'https://lms.alikoacademy.tech';

  return (
    <Layout>
      <section className="section-padding min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        {/* Animated background rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-accent/10 animate-pulse" />
          <div className="absolute w-[450px] h-[450px] rounded-full border border-secondary/10 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute w-[300px] h-[300px] rounded-full border border-accent/15 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container-padding mx-auto max-w-md text-center relative z-10">
          {/* Logo with glow effect */}
          <div className="relative inline-block mb-8 group">
            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-150 group-hover:bg-secondary/20 transition-colors duration-700" />
            <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl hover:border-accent/30 transition-all duration-500 hover:scale-105">
              <img src={logo} alt="Aliko Academy Tech" className="h-16 w-auto mx-auto" />
            </div>
          </div>

          {/* Card */}
          <div className="bg-card/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <h1 className="text-2xl font-bold mb-2 text-accent">Student Login</h1>
            <p className="text-muted-foreground mb-6 font-medium">
              You will be redirected to our learning management system.
            </p>
            <a
              href={lmsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-6 py-3.5 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 hover:scale-[1.02] transition-all shadow-lg hover:shadow-orange btn-glow-orange"
            >
              Continue to LMS
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
            <p className="text-xs text-muted-foreground mt-3">
              You are being redirected to the Learning Management System.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Having trouble? Contact{' '}
              <a href="mailto:support@alikoacademy.tech" className="text-accent hover:underline">
                support@alikoacademy.tech
              </a>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StudentLogin;
