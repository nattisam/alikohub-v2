import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout } from "@/components/categories/health/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Landmark,
  Hospital,
  Globe,
  Building2,
  MapPin,
  ShieldCheck,
  BookOpen,
  Cpu,
  Stethoscope,
  HardHat,
  Droplets,
  Crown,
  FileText,
  Users,
  CheckCircle,
} from "lucide-react";
import {
  whoWeServe,
  institutionalPricingTiers,
} from "@/data/categories/health/institutionalPrograms";

import publicHealthImg from "@/assets/categories/health/institutional/public-health.jpg";
import digitalHealthImg from "@/assets/categories/health/institutional/digital-health.jpg";
import clinicalImg from "@/assets/categories/health/institutional/clinical.jpg";
import corporateImg from "@/assets/categories/health/institutional/corporate.jpg";
import washImg from "@/assets/categories/health/institutional/wash.jpg";
import executiveImg from "@/assets/categories/health/institutional/executive.jpg";

import serveGovernmentImg from "@/assets/categories/health/institutional/serve-government.jpg";
import serveHospitalImg from "@/assets/categories/health/institutional/serve-hospital.jpg";
import serveInternationalImg from "@/assets/categories/health/institutional/serve-international.jpg";
import serveAuImg from "@/assets/categories/health/institutional/serve-au.jpg";
import serveCorporateImg from "@/assets/categories/health/institutional/serve-corporate.jpg";
import serveDefenseImg from "@/assets/categories/health/institutional/serve-defense.jpg";

const iconMap: Record<string, React.ElementType> = {
  Landmark,
  Hospital,
  Globe,
  Building2,
  MapPin,
  ShieldCheck,
};
const categoryIcons: Record<string, React.ElementType> = {
  "public-health": ShieldCheck,
  "digital-health": Cpu,
  clinical: Stethoscope,
  corporate: HardHat,
  wash: Droplets,
  executive: Crown,
};
const categoryImages: Record<string, string> = {
  "public-health": publicHealthImg,
  "digital-health": digitalHealthImg,
  clinical: clinicalImg,
  corporate: corporateImg,
  wash: washImg,
  executive: executiveImg,
};

interface DbCategory {
  id: string;
  name: string;
  short_name: string;
  slug: string;
  overview: string | null;
  icon: string | null;
  duration_options: string[];
  is_active: boolean;
  programs: { id: string }[];
}

const InstitutionalTraining = () => {
  const [categories, setCategories] = useState<DbCategory[]>([]);

  useEffect(() => {
    // Mock institutional categories fetching
    const fetchCategories = async () => {
      // In a real scenario, this would call an API service
      setCategories([]);
    };
    fetchCategories();
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-[hsl(216,50%,16%)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-teal/10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal/5 rounded-full blur-3xl" />
        <div className="container-academy relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-teal/20 text-teal-foreground border-teal/30 hover:bg-teal/30">
              <BookOpen className="h-3 w-3 mr-1" />
              Institutional & Specialty Training
            </Badge>
            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
              Strengthening Health Systems Through{" "}
              <span className="text-teal">Institutional Training</span>
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-white/75 max-w-2xl">
              Tailored training for governments, NGOs, hospitals, and
              corporations building stronger health workforces.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base shadow-lg">
                <a href="#programs">
                  Explore Programs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-base"
              >
                <Link to="/health/contact">
                  <FileText className="mr-2 h-5 w-5" />
                  Request Institutional Proposal
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 bg-background">
        <div className="container-academy">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              Our Partners
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Who We Serve
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We design training solutions for the world's most critical health
              institutions.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whoWeServe.map((card, index) => {
              const IconComp = iconMap[card.icon] || Building2;
              const serveImages = [
                serveGovernmentImg,
                serveHospitalImg,
                serveInternationalImg,
                serveAuImg,
                serveCorporateImg,
                serveDefenseImg,
              ];
              const thumbImg = serveImages[index] || serveGovernmentImg;
              return (
                <Card
                  key={card.title}
                  className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/60 overflow-hidden"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={thumbImg}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(216,50%,16%)]/70 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center">
                        <IconComp className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Program Categories from DB */}
      <section id="programs" className="py-20 bg-muted/30">
        <div className="container-academy">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal/10 text-teal text-sm font-semibold mb-4">
              Training Divisions
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Program Categories
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Six divisions. One mission — build health capacity where it
              matters most.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const CatIcon = categoryIcons[cat.slug] || BookOpen;
              const thumbImg = categoryImages[cat.slug];
              return (
                <Card
                  key={cat.id}
                  className="group flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={thumbImg}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(216,50%,16%)]/80 to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center">
                        <CatIcon className="h-4 w-4 text-teal" />
                      </div>
                      <h3 className="text-base font-bold text-white drop-shadow-md">
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="flex-1 p-6">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {cat.overview}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Users className="h-4 w-4 shrink-0 text-primary/60" />
                      <span>{cat.programs.length} programs</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {(cat.duration_options || []).map((d) => (
                        <Badge key={d} variant="secondary" className="text-xs">
                          {d}
                        </Badge>
                      ))}
                    </div>
                    <Button asChild className="w-full">
                      <Link to={`/health/institutional-training/${cat.slug}`}>
                        View Programs
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-background">
        <div className="container-academy">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
              Pricing
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Institutional Packages
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Flexible pricing structured around your team size and
              institutional needs.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {institutionalPricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`flex flex-col transition-all duration-300 hover:shadow-lg ${tier.highlighted ? "ring-2 ring-primary border-primary/30" : "border-border/60"}`}
              >
                {tier.highlighted && (
                  <div className="bg-primary text-primary-foreground text-xs font-medium text-center py-1.5">
                    Most Popular
                  </div>
                )}
                <CardContent className="flex-1 p-6">
                  <h3 className="text-lg font-bold text-foreground">
                    {tier.name}
                  </h3>
                  <p className="text-sm font-medium text-primary mt-1">
                    {tier.participants}
                  </p>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    {tier.description}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-teal shrink-0 mt-0.5" />
                        <span className="text-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="w-full mt-6"
                    variant={tier.highlighted ? "default" : "secondary"}
                  >
                    <Link to="/health/contact">Request Quote</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Contracts CTA */}
      <section className="py-16 bg-[hsl(216,50%,16%)]">
        <div className="container-academy text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Need a Custom Government Contract?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            We design tailored training programs for government agencies, with
            full compliance documentation and multi-site delivery capabilities.
          </p>
          <Button asChild size="lg" className="text-base">
            <Link to="/health/contact">
              Contact Our Institutional Team
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default InstitutionalTraining;
