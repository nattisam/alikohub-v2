import { Layout } from "@/components/categories/stem/layout/Layout";
import { Badge } from "@/components/categories/stem/ui/badge";
import { Card, CardContent } from "@/components/categories/stem/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/categories/stem/ui/accordion";
import { 
  Shield, 
  Building2, 
  Cog, 
  Zap, 
  Building, 
  ClipboardList, 
  Plane, 
  Globe,
  AlertTriangle,
  Award,
  GraduationCap
} from "lucide-react";
import {
  coreLicensureExams,
  domainCertifications,
  aviationCertifications,
  type CertificationCategory,
  type Certification,
} from "@/data/categories/stem/certifications";

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="h-5 w-5" />,
  Building2: <Building2 className="h-5 w-5" />,
  Cog: <Cog className="h-5 w-5" />,
  Zap: <Zap className="h-5 w-5" />,
  Building: <Building className="h-5 w-5" />,
  ClipboardList: <ClipboardList className="h-5 w-5" />,
  Plane: <Plane className="h-5 w-5" />,
  Globe: <Globe className="h-5 w-5" />,
};

// Color mapping for different domains - enhanced contrast
const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  primary: { bg: 'bg-primary/15', text: 'text-[hsl(207_90%_70%)]', border: 'border-primary/40', glow: 'shadow-primary/20' },
  accent: { bg: 'bg-accent/15', text: 'text-[hsl(195_100%_70%)]', border: 'border-accent/40', glow: 'shadow-accent/20' },
  'accent-green': { bg: 'bg-accent-green/15', text: 'text-[hsl(80_70%_65%)]', border: 'border-accent-green/40', glow: 'shadow-accent-green/20' },
  'accent-orange': { bg: 'bg-accent-orange/15', text: 'text-[hsl(155_55%_65%)]', border: 'border-accent-orange/40', glow: 'shadow-accent-orange/20' },
  'electrical': { bg: 'bg-[hsl(280_68%_55%)]/15', text: 'text-[hsl(280_68%_75%)]', border: 'border-[hsl(280_68%_55%)]/40', glow: 'shadow-[hsl(280_68%_55%)]/20' },
};

const CertificationCard = ({ cert, accentColor = 'primary' }: { cert: Certification; accentColor?: string }) => {
  const colors = colorMap[accentColor] || colorMap.primary;
  return (
    <Card className={`group border-divider ${colors.bg} hover:${colors.border} hover:shadow-lg ${colors.glow} transition-all duration-300`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge className={`${colors.bg} ${colors.text} ${colors.border} text-sm font-bold`}>
            {cert.shortName}
          </Badge>
          <Badge variant="outline" className="text-xs bg-secondary/50 text-muted-foreground border-divider">
            Coming Soon
          </Badge>
        </div>
        <h4 className={`font-semibold text-foreground text-sm mb-2 group-hover:${colors.text} transition-colors`}>
          {cert.name}
        </h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Award className={`h-3 w-3 ${colors.text}`} />
          <span>{cert.outcome}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const CategorySection = ({ category, colorClass }: { category: CertificationCategory; colorClass: string }) => {
  const colors = colorMap[colorClass] || colorMap.primary;
  return (
    <AccordionItem 
      value={category.id}
      className={`border ${colors.border} rounded-xl px-6 ${colors.bg} mb-3 overflow-hidden`}
    >
      <AccordionTrigger className="hover:no-underline py-5">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${colors.bg} ${colors.text}`}>
            {iconMap[category.icon] || <Award className="h-5 w-5" />}
          </div>
          <div className="text-left">
            <span className={`font-semibold ${colors.text} text-lg`}>{category.title}</span>
            <p className="text-sm text-muted-foreground font-normal mt-0.5">{category.description}</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-6">
        <div className="grid gap-4 md:grid-cols-2">
          {category.certifications.map((cert) => (
            <CertificationCard key={cert.id} cert={cert} accentColor={colorClass} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

const Certifications = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-hero py-12 lg:py-16">
        <div className="container-content">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                Professional Pathways
              </Badge>
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                Prep Support Coming Soon
              </Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Engineering Licensure & Professional Exams
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              Explore professional certification pathways. Preparation courses coming soon.
            </p>
            
            {/* Quick Stats - More Visual with vibrant colors */}
            <div className="mt-6 grid grid-cols-3 gap-4 max-w-lg">
              <div className="text-center p-3 rounded-lg bg-primary/20 border border-primary/40 shadow-lg shadow-primary/10">
                <Shield className="h-6 w-6 text-primary mx-auto mb-1" />
                <span className="text-2xl font-bold text-primary">3</span>
                <p className="text-xs text-primary/80">Core Exams</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-accent/20 border border-accent/40 shadow-lg shadow-accent/10">
                <Award className="h-6 w-6 text-accent mx-auto mb-1" />
                <span className="text-2xl font-bold text-accent">25+</span>
                <p className="text-xs text-accent/80">Certifications</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-accent-green/20 border border-accent-green/40 shadow-lg shadow-accent-green/10">
                <Plane className="h-6 w-6 text-accent-green mx-auto mb-1" />
                <span className="text-2xl font-bold text-accent-green">6</span>
                <p className="text-xs text-accent-green/80">Domains</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Licensure Section */}
      <section className="py-10 border-b border-divider">
        <div className="container-content">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-primary/30 shadow-lg shadow-primary/20">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-xl lg:text-2xl font-bold text-primary">
              Core Engineering Licensure
            </h2>
            <Badge variant="outline" className="text-xs bg-primary/20 text-primary border-primary/40 ml-auto">
              Prep Coming Soon
            </Badge>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            {coreLicensureExams.certifications.map((cert, index) => {
              const colors = ['primary', 'accent', 'accent-green'][index] || 'primary';
              const colorStyles = colorMap[colors];
              return (
                <Card key={cert.id} className={`group border ${colorStyles.border} ${colorStyles.bg} hover:shadow-xl ${colorStyles.glow} transition-all`}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2.5 rounded-lg ${colorStyles.bg} shadow-md ${colorStyles.glow}`}>
                        <Shield className={`h-5 w-5 ${colorStyles.text}`} />
                      </div>
                      <Badge className={`${colorStyles.bg} ${colorStyles.text} ${colorStyles.border} text-lg px-3 py-1 font-bold`}>
                        {cert.shortName}
                      </Badge>
                    </div>
                    <h3 className={`font-display text-lg font-semibold ${colorStyles.text} mb-2`}>
                      {cert.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <GraduationCap className={`h-4 w-4 ${colorStyles.text}`} />
                      <span>{cert.outcome}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.domains?.slice(0, 3).map((domain, i) => (
                        <Badge key={i} variant="secondary" className={`text-xs ${colorStyles.bg} ${colorStyles.text} max-w-[140px] truncate`} title={domain}>
                          {domain}
                        </Badge>
                      ))}
                      {cert.domains && cert.domains.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{cert.domains.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Domain-Specific Certifications */}
      <section className="py-10 border-b border-divider">
        <div className="container-content">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-accent/30 shadow-lg shadow-accent/20">
              <Award className="h-5 w-5 text-accent" />
            </div>
            <h2 className="font-display text-xl lg:text-2xl font-bold text-accent">
              Domain-Specific Certifications
            </h2>
            <Badge variant="outline" className="text-xs bg-primary/20 text-primary border-primary/40 ml-auto">
              Prep Coming Soon
            </Badge>
          </div>
          
          <Accordion type="multiple" className="space-y-2">
            {domainCertifications.map((category) => (
              <CategorySection 
                key={category.id} 
                category={category} 
                colorClass={category.accentColor}
              />
            ))}
          </Accordion>
        </div>
      </section>

      {/* Aviation Domain */}
      <section className="py-10 border-b border-divider bg-gradient-to-b from-background to-accent-green/5">
        <div className="container-content">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-accent-green/30 shadow-lg shadow-accent-green/20">
              <Plane className="h-5 w-5 text-accent-green" />
            </div>
            <h2 className="font-display text-xl lg:text-2xl font-bold text-accent-green">
              Aviation Domain
            </h2>
            <Badge variant="outline" className="text-xs bg-primary/20 text-primary border-primary/40 ml-auto">
              Prep Coming Soon
            </Badge>
          </div>
          
          <Accordion type="multiple" className="space-y-2">
            {aviationCertifications.map((category) => (
              <CategorySection 
                key={category.id} 
                category={category} 
                colorClass="accent-green"
              />
            ))}
          </Accordion>
        </div>
      </section>

      {/* Terminology Cards - Visual with vibrant colors */}
      <section className="py-10">
        <div className="container-content">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-primary/40 bg-primary/10 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20 transition-all">
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-primary text-sm">Licensure</h3>
                <p className="text-xs text-primary/70 mt-1">
                  Legal authority (FE, PE, SE)
                </p>
              </CardContent>
            </Card>
            <Card className="border-accent/40 bg-accent/10 hover:bg-accent/20 hover:shadow-lg hover:shadow-accent/20 transition-all">
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-semibold text-accent text-sm">Certification</h3>
                <p className="text-xs text-accent/70 mt-1">
                  Professional credentials (PMP)
                </p>
              </CardContent>
            </Card>
            <Card className="border-accent-green/40 bg-accent-green/10 hover:bg-accent-green/20 hover:shadow-lg hover:shadow-accent-green/20 transition-all">
              <CardContent className="p-4 text-center">
                <Cog className="h-8 w-8 text-accent-green mx-auto mb-2" />
                <h3 className="font-semibold text-accent-green text-sm">Tool Training</h3>
                <p className="text-xs text-accent-green/70 mt-1">
                  Software proficiency
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Minimal Disclaimer - Footer Style */}
      <div className="border-t border-divider py-4 bg-secondary/20">
        <div className="container-content">
          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
            <AlertTriangle className="h-3 w-3" />
            Aliko Academy STEM provides exam preparation support only. Licenses and certifications are issued by third-party authorities.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Certifications;