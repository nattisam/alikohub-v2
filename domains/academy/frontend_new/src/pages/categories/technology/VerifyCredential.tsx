import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle, XCircle, Shield } from 'lucide-react';
import Layout from '@/components/categories/technology/layout/Layout';
import { Button } from '@/components/categories/technology/ui/button';
import { Input } from '@/components/categories/technology/ui/input';
import { isFeatureEnabled } from '@/lib/categories/technology/featureFlags';

interface VerificationResult {
  valid: boolean;
  name?: string;
  program?: string;
  completionDate?: string;
  credentialType?: string;
}

const VerifyCredential = () => {
  const [certificateId, setCertificateId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  if (!isFeatureEnabled('credentialVerification')) {
    return (
      <Layout>
        <div className="container-padding mx-auto max-w-7xl py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Coming Soon</h1>
          <p className="text-muted-foreground mb-6">Credential Verification will be available soon.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setResult(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock result - in production this would query the database
    if (certificateId.toUpperCase().startsWith('AA-')) {
      setResult({
        valid: true,
        name: 'Sample Graduate',
        program: 'Full-Stack Software Engineering',
        completionDate: 'January 15, 2026',
        credentialType: 'Professional Certificate (Non-degree)',
      });
    } else {
      setResult({ valid: false });
    }

    setIsSearching(false);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[hsl(210,30%,16%)] via-[hsl(215,28%,14%)] to-[hsl(220,25%,11%)]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />
        <div className="container-padding mx-auto max-w-7xl relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-1 bg-secondary rounded-full" />
              <span className="text-secondary font-semibold text-sm">Certificate Verification</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-accent" />
              <h1 className="text-4xl md:text-5xl font-bold text-accent">Verify Credential</h1>
            </div>
            <p className="text-lg text-white/70">
              Verify the authenticity of an Aliko Academy – Tech certificate or credential.
            </p>
          </div>
        </div>
      </section>

      {/* Verification Form */}
      <section className="section-padding">
        <div className="container-padding mx-auto max-w-xl">
          <div className="bg-card rounded-xl p-8 border border-border">
            <h2 className="text-xl font-semibold mb-6 text-center">Enter Certificate ID</h2>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g., AA-2026-XXXXX"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSearching}>
                {isSearching ? 'Verifying...' : 'Verify Certificate'}
              </Button>
            </form>

            {/* Result */}
            {result && (
              <div className="mt-8">
                {result.valid ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-800">Valid Credential</h3>
                        <p className="text-sm text-green-700">This certificate is authentic.</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Graduate Name:</span>
                        <span className="font-medium text-green-900">{result.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Program:</span>
                        <span className="font-medium text-green-900">{result.program}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Completion Date:</span>
                        <span className="font-medium text-green-900">{result.completionDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Credential Type:</span>
                        <span className="font-medium text-green-900">{result.credentialType}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-8 w-8 text-red-600" />
                      <div>
                        <h3 className="font-semibold text-red-800">Invalid or Not Found</h3>
                        <p className="text-sm text-red-700">
                          This certificate ID could not be verified. Please check the ID and try again.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-center text-muted-foreground mt-6">
            Certificate IDs can be found on the bottom of official Aliko Academy – Tech certificates.
            If you believe there is an error, please <Link to="/contact" className="text-primary hover:underline">contact us</Link>.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default VerifyCredential;
