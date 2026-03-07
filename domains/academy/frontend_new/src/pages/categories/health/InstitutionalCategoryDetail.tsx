import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout } from "@/components/categories/health/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowLeft,
  Clock,
  Monitor,
  Users,
  Award,
  BookOpen,
  FileText,
  CheckCircle,
  ShieldCheck,
  Cpu,
  Stethoscope,
  HardHat,
  Droplets,
  Crown,
} from "lucide-react";

import publicHealthImg from "@/assets/categories/health/institutional/public-health.jpg";
import digitalHealthImg from "@/assets/categories/health/institutional/digital-health.jpg";
import clinicalImg from "@/assets/categories/health/institutional/clinical.jpg";
import corporateImg from "@/assets/categories/health/institutional/corporate.jpg";
import washImg from "@/assets/categories/health/institutional/wash.jpg";
import executiveImg from "@/assets/categories/health/institutional/executive.jpg";

import progPh1 from "@/assets/categories/health/institutional/prog-ph1.jpg";
import progPh2 from "@/assets/categories/health/institutional/prog-ph2.jpg";
import progDh1 from "@/assets/categories/health/institutional/prog-dh1.jpg";
import progDh2 from "@/assets/categories/health/institutional/prog-dh2.jpg";
import progCl1 from "@/assets/categories/health/institutional/prog-cl1.jpg";
import progCl2 from "@/assets/categories/health/institutional/prog-cl2.jpg";
import progCo1 from "@/assets/categories/health/institutional/prog-co1.jpg";
import progCo2 from "@/assets/categories/health/institutional/prog-co2.jpg";
import progWa1 from "@/assets/categories/health/institutional/prog-wa1.jpg";
import progWa2 from "@/assets/categories/health/institutional/prog-wa2.jpg";
import progEx1 from "@/assets/categories/health/institutional/prog-ex1.jpg";
import progEx2 from "@/assets/categories/health/institutional/prog-ex2.jpg";

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
const programThumbs: Record<string, string[]> = {
  "public-health": [progPh1, progPh2],
  "digital-health": [progDh1, progDh2],
  clinical: [progCl1, progCl2],
  corporate: [progCo1, progCo2],
  wash: [progWa1, progWa2],
  executive: [progEx1, progEx2],
};

interface DbCategory {
  id: string;
  name: string;
  slug: string;
  overview: string | null;
  target_audience: string[];
  duration_options: string[];
  delivery_formats: string[];
  certification_types: string[];
  ideal_for: string[];
}

interface DbProgram {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  delivery: string | null;
}

const InstitutionalCategoryDetail = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [category, setCategory] = useState<DbCategory | null>(null);
  const [programs, setPrograms] = useState<DbProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categorySlug) return;
    // Mock institutional category detail fetching
    const fetchCategoryDetails = async () => {
      setLoading(false);
      setCategory(null); // Fallback to "Not Found" or handle accordingly
    };
    fetchCategoryDetails();
  }, [categorySlug]);

  if (loading) {
    return (
      <Layout>
        <div className="container-academy py-20 text-center text-muted-foreground">
          Loading...
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="container-academy py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Category Not Found
          </h1>
          <Button asChild>
            <Link to="/health/institutional-training">
              Back to Institutional Training
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const CatIcon = categoryIcons[category.slug] || BookOpen;
  const heroImg = categoryImages[category.slug];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[hsl(216,50%,16%)]/85" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-teal/10" />
        </div>
        <div className="container-academy relative z-10">
          <Link
            to="/health/institutional-training"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Institutional Training
          </Link>
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-14 h-14 rounded-xl bg-teal/20 items-center justify-center shrink-0">
              <CatIcon className="h-7 w-7 text-teal" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
                {category.name}
              </h1>
              <p className="mt-4 text-lg text-white/70 max-w-2xl">
                {category.overview}
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-6">
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-teal" />
              </div>
              <div>
                <p className="font-semibold text-white">{programs.length}</p>
                <p className="text-xs text-white/60">Programs</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-teal" />
              </div>
              <div>
                <p className="font-semibold text-white">
                  {(category.duration_options || []).length}
                </p>
                <p className="text-xs text-white/60">Duration Options</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Monitor className="h-5 w-5 text-teal" />
              </div>
              <div>
                <p className="font-semibold text-white">
                  {(category.delivery_formats || []).length}
                </p>
                <p className="text-xs text-white/60">Delivery Formats</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="py-12 bg-muted/30">
        <div className="container-academy">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="border-border/60">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm text-foreground">
                    Target Audience
                  </h3>
                </div>
                <ul className="space-y-1.5">
                  {(category.target_audience || []).map((a) => (
                    <li
                      key={a}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-teal shrink-0 mt-0.5" />
                      {a}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm text-foreground">
                    Duration Options
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(category.duration_options || []).map((d) => (
                    <Badge key={d} variant="secondary" className="text-xs">
                      {d}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Monitor className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm text-foreground">
                    Delivery Format
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(category.delivery_formats || []).map((f) => (
                    <Badge key={f} variant="outline" className="text-xs">
                      {f}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm text-foreground">
                    Certification
                  </h3>
                </div>
                <ul className="space-y-1.5">
                  {(category.certification_types || []).map((c) => (
                    <li
                      key={c}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-teal shrink-0 mt-0.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Programs List */}
      <section className="py-16 bg-background">
        <div className="container-academy">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              Core Programs
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Each program can be customized for your institution's specific
              needs and context.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => {
              const thumbs = programThumbs[category.slug] || [
                publicHealthImg,
                publicHealthImg,
              ];
              const thumbImg = thumbs[index % thumbs.length];
              return (
                <Card
                  key={program.id}
                  className="group flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/60 overflow-hidden"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={thumbImg}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  </div>
                  <CardContent className="flex-1 p-5">
                    <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {program.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{program.duration}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {program.delivery}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {(category.ideal_for || []).length > 0 && (
            <div className="mt-12 p-6 rounded-xl bg-muted/50 border border-border">
              <h3 className="font-semibold text-foreground mb-3">Ideal For</h3>
              <div className="flex flex-wrap gap-2">
                {category.ideal_for.map((item) => (
                  <Badge
                    key={item}
                    className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-14 text-center">
            <Card className="max-w-2xl mx-auto bg-[hsl(216,50%,16%)] border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-3">
                  Ready to Build Capacity?
                </h3>
                <p className="text-white/70 mb-6">
                  Contact our institutional team to discuss customized solutions
                  for your organization.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg">
                    <Link to="/health/contact">
                      <FileText className="mr-2 h-5 w-5" />
                      Request Proposal
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary">
                    <Link to="/health/institutional-training">
                      View All Categories
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default InstitutionalCategoryDetail;
