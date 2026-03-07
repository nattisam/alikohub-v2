import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/categories/health/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  Stethoscope,
  Briefcase,
  Handshake,
  ArrowRight,
  Heart,
  Users,
  Star,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { useStateConfig } from "@/hooks/categories/health/useStateConfig";

// Static fallback data with local images
import clinicalImg1 from "@/assets/categories/health/partners/clinical-partner-1.jpg";
import clinicalImg2 from "@/assets/categories/health/partners/clinical-partner-2.jpg";
import clinicalImg3 from "@/assets/categories/health/partners/clinical-partner-3.jpg";
import careerImg1 from "@/assets/categories/health/partners/career-partner-1.jpg";
import careerImg2 from "@/assets/categories/health/partners/career-partner-2.jpg";
import careerImg3 from "@/assets/categories/health/partners/career-partner-3.jpg";
import sponsorImg1 from "@/assets/categories/health/partners/sponsor-1.jpg";
import sponsorImg2 from "@/assets/categories/health/partners/sponsor-2.jpg";
import sponsorImg3 from "@/assets/categories/health/partners/sponsor-3.jpg";

interface Partner {
  id: string;
  name: string;
  category: "clinical" | "career" | "sponsor";
  organization_type: string | null;
  region: string | null;
  description: string | null;
  programs: string[];
  hiring_roles: string | null;
  logo_url: string | null;
  website_url: string | null;
  is_active: boolean;
  display_order: number;
}

const fallbackPartners: Partner[] = [
  {
    id: "c1",
    name: "Evergreen Health Center",
    category: "clinical",
    organization_type: "Skilled Nursing Facility",
    region: "Seattle, WA",
    description:
      "Providing exceptional long-term care and clinical training for nursing assistants.",
    programs: ["CNA", "HHA", "Medication Aide"],
    hiring_roles: null,
    logo_url: clinicalImg1,
    website_url: null,
    is_active: true,
    display_order: 0,
  },
  {
    id: "c2",
    name: "Pacific Medical Group",
    category: "clinical",
    organization_type: "Multi-Specialty Clinic",
    region: "Bellevue, WA",
    description:
      "A premier multi-specialty practice offering diverse clinical rotation opportunities.",
    programs: ["Medical Assistant", "Phlebotomy", "EKG"],
    hiring_roles: null,
    logo_url: clinicalImg2,
    website_url: null,
    is_active: true,
    display_order: 1,
  },
  {
    id: "c3",
    name: "Cascade Rehabilitation",
    category: "clinical",
    organization_type: "Rehabilitation Center",
    region: "Tacoma, WA",
    description:
      "Leading rehabilitation facility focused on patient recovery and staff development.",
    programs: ["CNA", "PCT"],
    hiring_roles: null,
    logo_url: clinicalImg3,
    website_url: null,
    is_active: true,
    display_order: 2,
  },
  {
    id: "c4",
    name: "Puget Sound Home Health",
    category: "clinical",
    organization_type: "Home Health Agency",
    region: "King County, WA",
    description:
      "Compassionate home health services across the greater King County area.",
    programs: ["HHA", "CNA"],
    hiring_roles: null,
    logo_url: clinicalImg1,
    website_url: null,
    is_active: true,
    display_order: 3,
  },
  {
    id: "c5",
    name: "Northwest Cardiac Care",
    category: "clinical",
    organization_type: "Cardiology Practice",
    region: "Seattle, WA",
    description:
      "Specialized cardiac care facility with advanced EKG training capabilities.",
    programs: ["EKG", "Medical Assistant"],
    hiring_roles: null,
    logo_url: clinicalImg2,
    website_url: null,
    is_active: true,
    display_order: 4,
  },
  {
    id: "c6",
    name: "Community Care Partners",
    category: "clinical",
    organization_type: "Assisted Living",
    region: "Snohomish County, WA",
    description:
      "Community-focused assisted living with comprehensive training programs.",
    programs: ["CNA", "Medication Aide", "HHA"],
    hiring_roles: null,
    logo_url: clinicalImg3,
    website_url: null,
    is_active: true,
    display_order: 5,
  },
  {
    id: "k1",
    name: "Swedish Health Services",
    category: "career",
    organization_type: "Hospital System",
    region: "Seattle Metro",
    description:
      "One of the largest nonprofit health providers in the greater Seattle area.",
    programs: [],
    hiring_roles: "CNA, PCT, Medical Assistant, Unit Secretary",
    logo_url: careerImg1,
    website_url: null,
    is_active: true,
    display_order: 0,
  },
  {
    id: "k2",
    name: "Kaiser Permanente",
    category: "career",
    organization_type: "Integrated Healthcare",
    region: "Washington State",
    description:
      "Nationally recognized integrated healthcare system with excellent benefits.",
    programs: [],
    hiring_roles: "Medical Assistant, Phlebotomist, EKG Tech",
    logo_url: careerImg2,
    website_url: null,
    is_active: true,
    display_order: 1,
  },
  {
    id: "k3",
    name: "BrightSpring Health Services",
    category: "career",
    organization_type: "Home Health & Hospice",
    region: "King & Pierce County",
    description:
      "Leading provider of home and community-based health services.",
    programs: [],
    hiring_roles: "HHA, CNA, Care Coordinator",
    logo_url: careerImg3,
    website_url: null,
    is_active: true,
    display_order: 2,
  },
  {
    id: "k4",
    name: "Virginia Mason Franciscan Health",
    category: "career",
    organization_type: "Hospital System",
    region: "Puget Sound Region",
    description:
      "A trusted healthcare partner committed to clinical excellence.",
    programs: [],
    hiring_roles: "CNA, PCT, Patient Services",
    logo_url: careerImg1,
    website_url: null,
    is_active: true,
    display_order: 3,
  },
  {
    id: "k5",
    name: "Multicare Health System",
    category: "career",
    organization_type: "Healthcare Network",
    region: "Pierce County",
    description:
      "A community-based, locally governed health system transforming care.",
    programs: [],
    hiring_roles: "Medical Assistant, Patient Care Tech",
    logo_url: careerImg2,
    website_url: null,
    is_active: true,
    display_order: 4,
  },
  {
    id: "k6",
    name: "SeaMar Community Health",
    category: "career",
    organization_type: "Community Health Center",
    region: "Western Washington",
    description:
      "Community health center providing quality services to diverse populations.",
    programs: [],
    hiring_roles: "Medical Assistant, Phlebotomist",
    logo_url: careerImg3,
    website_url: null,
    is_active: true,
    display_order: 5,
  },
  {
    id: "s1",
    name: "Washington Health Foundation",
    category: "sponsor",
    organization_type: "Foundation",
    region: "Washington State",
    description:
      "Supporting healthcare education and workforce development through grants and scholarships.",
    programs: [],
    hiring_roles: null,
    logo_url: sponsorImg1,
    website_url: null,
    is_active: true,
    display_order: 0,
  },
  {
    id: "s2",
    name: "Workforce Development Council",
    category: "sponsor",
    organization_type: "Government Agency",
    region: "Puget Sound Region",
    description:
      "Public agency funding healthcare training and career advancement programs.",
    programs: [],
    hiring_roles: null,
    logo_url: sponsorImg2,
    website_url: null,
    is_active: true,
    display_order: 1,
  },
  {
    id: "s3",
    name: "HealthBridge Corporate Sponsors",
    category: "sponsor",
    organization_type: "Corporate Partnership",
    region: "National",
    description:
      "Corporate partners investing in the next generation of healthcare professionals.",
    programs: [],
    hiring_roles: null,
    logo_url: sponsorImg3,
    website_url: null,
    is_active: true,
    display_order: 2,
  },
];

const INITIAL_SHOW = 3;

const categoryConfig = {
  clinical: {
    label: "Clinical Training",
    badge: "Clinical Partners",
    icon: Heart,
    gradient: "from-primary/5 to-primary/10",
    iconGradient: "from-primary to-primary/80",
    borderColor: "border-primary/10 hover:border-primary/30",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    accentColor: "text-primary",
  },
  career: {
    label: "Employment Network",
    badge: "Career Partners",
    icon: Users,
    gradient: "from-accent/5 to-accent/10",
    iconGradient: "from-accent to-accent/80",
    borderColor: "border-accent/10 hover:border-accent/30",
    badgeClass: "bg-accent/10 text-accent border-accent/20",
    accentColor: "text-accent",
  },
  sponsor: {
    label: "Sponsors & Supporters",
    badge: "Sponsors",
    icon: Star,
    gradient: "from-yellow-500/5 to-amber-500/10",
    iconGradient: "from-yellow-600 to-amber-500",
    borderColor: "border-yellow-500/10 hover:border-yellow-500/30",
    badgeClass: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    accentColor: "text-yellow-700",
  },
};

const PartnerCard = ({
  partner,
  config,
}: {
  partner: Partner;
  config: typeof categoryConfig.clinical;
}) => (
  <Card
    className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-background border-2 ${config.borderColor} overflow-hidden`}
  >
    <CardContent className="p-0">
      {/* Logo / Image */}
      <div className="h-40 bg-muted/30 flex items-center justify-center overflow-hidden">
        {partner.logo_url ? (
          <img
            src={partner.logo_url}
            alt={partner.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Building2 className="h-12 w-12 text-muted-foreground/40" />
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground text-lg leading-tight">
            {partner.name}
          </h3>
          {partner.organization_type && (
            <p className={`text-sm font-medium ${config.accentColor} mt-0.5`}>
              {partner.organization_type}
            </p>
          )}
        </div>

        {partner.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {partner.description}
          </p>
        )}

        {partner.region && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{partner.region}</span>
          </div>
        )}

        {partner.programs && partner.programs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {partner.programs.map((program) => (
              <Badge key={program} variant="secondary" className="text-xs">
                {program}
              </Badge>
            ))}
          </div>
        )}

        {partner.hiring_roles && (
          <p className="text-sm">
            <span className={`font-medium ${config.accentColor}`}>
              Hiring:{" "}
            </span>
            <span className="text-muted-foreground">
              {partner.hiring_roles}
            </span>
          </p>
        )}

        {partner.website_url && (
          <a
            href={partner.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 text-sm ${config.accentColor} hover:underline`}
          >
            Visit Website <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </CardContent>
  </Card>
);

const PartnerSection = ({
  category,
  partners,
}: {
  category: "clinical" | "career" | "sponsor";
  partners: Partner[];
}) => {
  const [showAll, setShowAll] = useState(false);
  const config = categoryConfig[category];
  const Icon = config.icon;
  const displayed = showAll ? partners : partners.slice(0, INITIAL_SHOW);
  const hasMore = partners.length > INITIAL_SHOW;

  return (
    <div className="relative">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.gradient} rounded-3xl`}
      />
      <div className="relative p-8 lg:p-10">
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.iconGradient} flex items-center justify-center shadow-lg`}
          >
            <Icon className="h-7 w-7 text-white" />
          </div>
          <div>
            <Badge className={config.badgeClass}>{config.label}</Badge>
            <h2 className="text-2xl font-bold text-foreground">
              {config.badge}
            </h2>
            <p className="text-sm text-muted-foreground">
              {partners.length} partners in our network
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} config={config} />
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(!showAll)}
              className="gap-2"
            >
              {showAll ? "Show Less" : `View All ${partners.length} Partners`}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const Partners = () => {
  const { currentState } = useStateConfig();
  const [dbPartners, setDbPartners] = useState<Partner[] | null>(null);

  useEffect(() => {
    // Mock partner data fetching
    const fetchPartners = async () => {
      // For now, using static fallbackPartners
      setDbPartners(null);
    };
    fetchPartners();
  }, []);

  const allPartners = dbPartners ?? fallbackPartners;
  const clinical = allPartners.filter((p) => p.category === "clinical");
  const career = allPartners.filter((p) => p.category === "career");
  const sponsors = allPartners.filter((p) => p.category === "sponsor");

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-card to-accent/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="container-academy relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-12 bg-accent rounded-full" />
            <span className="text-sm font-medium text-accent">Our Network</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">
            Our Partners
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Aliko Academy partners with healthcare organizations throughout{" "}
            {currentState.name} State to provide quality clinical training and
            career opportunities for our graduates.
          </p>

          {/* Quick stats */}
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {clinical.length}+
                </p>
                <p className="text-xs">Clinical Sites</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {career.length}+
                </p>
                <p className="text-xs">Hiring Partners</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {sponsors.length}+
                </p>
                <p className="text-xs">Sponsors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-academy space-y-16">
          {clinical.length > 0 && (
            <PartnerSection category="clinical" partners={clinical} />
          )}
          {career.length > 0 && (
            <PartnerSection category="career" partners={career} />
          )}
          {sponsors.length > 0 && (
            <PartnerSection category="sponsor" partners={sponsors} />
          )}

          {/* Disclaimers */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground italic">
                <strong className="text-primary">Disclaimer:</strong> Clinical
                placements are coordinated based on availability, program
                requirements, and student readiness. Placement at a specific
                partner facility is not guaranteed.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground italic">
                <strong className="text-accent">Disclaimer:</strong> Aliko
                Academy does not guarantee employment. Career services support
                graduates in their job search through resume assistance,
                interview preparation, and employer connections.
              </p>
            </div>
          </div>

          {/* Become a Partner CTA */}
          <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <CardContent className="pt-8 pb-8 relative">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Handshake className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      Become a Partner
                    </h3>
                    <p className="opacity-90 max-w-xl">
                      Interested in partnering with Aliko Academy for clinical
                      education or workforce development? We welcome inquiries
                      from healthcare organizations.
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="shrink-0 shadow-lg"
                >
                  <Link to="/health/partnerships">
                    Partner With Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Partners;
