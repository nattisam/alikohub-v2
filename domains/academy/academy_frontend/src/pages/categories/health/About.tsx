import { Layout } from "@/components/categories/health/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Target,
  Eye,
  Heart,
  Users,
  GraduationCap,
  Building2,
  Award,
} from "lucide-react";
import { useStateConfig } from "@/hooks/categories/health/useStateConfig";

const About = () => {
  const { currentState } = useStateConfig();

  return (
    <Layout>
      {/* Hero Section with gradient background */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-card to-accent/5 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

        <div className="container-academy relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-12 bg-accent rounded-full" />
            <span className="text-sm font-medium text-accent">About Us</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">
            About Aliko Academy
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Empowering the next generation of healthcare professionals through
            quality education, hands-on training, and career-focused support.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-academy space-y-16">
          {/* Mission, Vision, Values */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-primary">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To provide accessible, high-quality healthcare education that
                  prepares students for successful careers and certifications
                  while meeting the workforce needs of our community.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-accent">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Eye className="h-7 w-7 text-accent" />
                </div>
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To be the premier healthcare training institution in{" "}
                  {currentState.name} State, recognized for excellence in
                  education, graduate outcomes, and community partnerships.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-primary">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Heart className="h-7 w-7 text-primary" />
                </div>
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2">
                  <li>
                    <strong>Excellence</strong> in education and training
                  </li>
                  <li>
                    <strong>Integrity</strong> in all our practices
                  </li>
                  <li>
                    <strong>Compassion</strong> for students and patients
                  </li>
                  <li>
                    <strong>Community</strong> partnership and service
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Our Story with visual stats */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-8 bg-primary rounded-full" />
                <span className="text-sm font-medium text-primary">
                  Our Story
                </span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
                Our Commitment
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Aliko Academy was founded with a clear purpose: to bridge the
                  gap between aspiring healthcare workers and the growing demand
                  for qualified professionals in our community.
                </p>
                <p>
                  We believe that quality healthcare education should be
                  accessible, practical, and directly aligned with industry
                  needs. Our programs combine rigorous academic instruction with
                  extensive hands-on training to ensure graduates are truly
                  prepared for their careers.
                </p>
                <p>
                  Through partnerships with healthcare facilities throughout{" "}
                  {currentState.name} State, we provide students with real-world
                  clinical experiences that build confidence and competence.
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                <CardContent className="pt-6 text-center">
                  <GraduationCap className="h-8 w-8 mx-auto mb-3 opacity-80" />
                  <p className="text-4xl font-bold">9</p>
                  <p className="text-sm opacity-80 mt-1">Healthcare Programs</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground">
                <CardContent className="pt-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-3 opacity-80" />
                  <p className="text-4xl font-bold">1000+</p>
                  <p className="text-sm opacity-80 mt-1">Graduates Trained</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground">
                <CardContent className="pt-6 text-center">
                  <Building2 className="h-8 w-8 mx-auto mb-3 opacity-80" />
                  <p className="text-4xl font-bold">50+</p>
                  <p className="text-sm opacity-80 mt-1">
                    Partner Organizations
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                <CardContent className="pt-6 text-center">
                  <Award className="h-8 w-8 mx-auto mb-3 opacity-80" />
                  <p className="text-4xl font-bold">95%</p>
                  <p className="text-sm opacity-80 mt-1">Certification Rate</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Leadership */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl" />
            <div className="relative py-12 px-6 lg:px-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Leadership Team
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mx-auto mb-4 flex items-center justify-center ring-4 ring-primary/10">
                      <span className="text-2xl font-bold text-primary">
                        AA
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">Academy Director</h3>
                    <p className="text-sm text-accent font-medium mt-1">
                      Executive Leadership
                    </p>
                    <p className="text-sm text-muted-foreground mt-3">
                      Oversees all academy operations, strategic planning, and
                      regulatory compliance.
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 mx-auto mb-4 flex items-center justify-center ring-4 ring-accent/10">
                      <span className="text-2xl font-bold text-accent">PD</span>
                    </div>
                    <h3 className="font-semibold text-lg">Program Director</h3>
                    <p className="text-sm text-primary font-medium mt-1">
                      Academic Leadership
                    </p>
                    <p className="text-sm text-muted-foreground mt-3">
                      Manages curriculum development, instructor coordination,
                      and academic standards.
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mx-auto mb-4 flex items-center justify-center ring-4 ring-primary/10">
                      <span className="text-2xl font-bold text-primary">
                        SS
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">
                      Student Services Director
                    </h3>
                    <p className="text-sm text-accent font-medium mt-1">
                      Student Success
                    </p>
                    <p className="text-sm text-muted-foreground mt-3">
                      Leads admissions, career services, and student support
                      initiatives.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="relative text-center bg-gradient-to-br from-primary/10 via-card to-accent/10 rounded-2xl p-8 lg:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <div className="relative">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Ready to Join Our Community?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Take the first step toward your healthcare career. Explore our
                programs or contact us to learn more about how Aliko Academy can
                help you achieve your goals.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="shadow-lg">
                  <Link to="/health/programs">View Programs</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/health/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
