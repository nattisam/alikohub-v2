import { Link } from "react-router-dom";
import { Layout } from "@/components/categories/health/layout/Layout";
import { programs } from "@/data/categories/health/programs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  CreditCard,
  Building2,
  Users,
  DollarSign,
  BookOpen,
  Wallet,
  Gift,
  GraduationCap,
} from "lucide-react";

const Tuition = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-card to-accent/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

        <div className="container-academy relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-12 bg-accent rounded-full" />
            <span className="text-sm font-medium text-accent">
              Invest in Your Future
            </span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">
            Tuition & Payment Plans
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Transparent pricing with flexible payment options. Invest in your
            healthcare career with confidence.
          </p>

          {/* Quick visual */}
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Flexible</p>
                <p className="text-xs">Payment Plans</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground">All-Inclusive</p>
                <p className="text-xs">Materials Included</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-academy space-y-16">
          {/* Tuition Table */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-8 bg-primary rounded-full" />
              <span className="text-sm font-medium text-primary">
                Program Costs
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Program Tuition
            </h2>
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 sm:px-6 py-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-medium text-sm sm:text-base">
                    Healthcare Training Programs
                  </span>
                </div>
              </div>
              {/* Mobile card layout */}
              <div className="block md:hidden p-4 space-y-4">
                {programs.map((program) => {
                  const hasPricing = program.enrollmentStatus === "open";
                  return (
                    <div
                      key={program.id}
                      className="border border-border rounded-xl p-4 space-y-2 bg-background"
                    >
                      <Link
                        to={`/health/programs/${program.id}`}
                        className="font-semibold hover:text-primary transition-colors block"
                      >
                        {program.name}
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        {program.duration} • {program.hours.total} hours
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="text-xs text-muted-foreground">
                          <p>
                            Registration:{" "}
                            {hasPricing && "registrationFee" in program
                              ? `$${program.registrationFee.toLocaleString()}`
                              : "TBD"}
                          </p>
                          <p>
                            Tuition:{" "}
                            {hasPricing
                              ? `$${program.tuition.toLocaleString()}`
                              : "TBD"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Total</p>
                          <p className="font-bold text-primary text-lg">
                            {hasPricing && "totalCost" in program
                              ? `$${program.totalCost.toLocaleString()}`
                              : "TBD"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Desktop table */}
              <CardContent className="p-0 hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Program</TableHead>
                      <TableHead className="font-semibold">Duration</TableHead>
                      <TableHead className="font-semibold">
                        Total Hours
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        Registration Fee
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        Tuition
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        Total Cost
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programs.map((program, index) => {
                      const hasPricing = program.enrollmentStatus === "open";
                      return (
                        <TableRow
                          key={program.id}
                          className={
                            index % 2 === 0 ? "bg-background" : "bg-muted/30"
                          }
                        >
                          <TableCell className="font-medium">
                            <Link
                              to={`/health/programs/${program.id}`}
                              className="hover:text-primary transition-colors"
                            >
                              {program.name}
                            </Link>
                          </TableCell>
                          <TableCell>{program.duration}</TableCell>
                          <TableCell>{program.hours.total} hours</TableCell>
                          <TableCell className="text-right">
                            {hasPricing && "registrationFee" in program ? (
                              `$${program.registrationFee.toLocaleString()}`
                            ) : (
                              <span className="text-muted-foreground">TBD</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {hasPricing ? (
                              `$${program.tuition.toLocaleString()}`
                            ) : (
                              <span className="text-muted-foreground">TBD</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-primary">
                            {hasPricing && "totalCost" in program ? (
                              `$${program.totalCost.toLocaleString()}`
                            ) : (
                              <span className="text-muted-foreground">TBD</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* What's Included - Distinct visual treatment with accent border and background */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent/10 rounded-3xl" />
            <div className="relative p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <span className="text-sm font-medium text-accent">
                    Everything You Need
                  </span>
                  <h2 className="text-2xl font-bold text-foreground">
                    What's Included
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground mb-8 max-w-2xl">
                Your tuition covers all the essentials for your training — no
                hidden fees or surprise costs.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: "Course Materials",
                    desc: "All textbooks, workbooks, and digital learning resources",
                    icon: BookOpen,
                  },
                  {
                    title: "Lab Equipment",
                    desc: "Access to all lab equipment and practice supplies",
                    icon: GraduationCap,
                  },
                  {
                    title: "Clinical Placement",
                    desc: "Coordination of clinical training at partner facilities",
                    icon: Building2,
                  },
                  {
                    title: "Exam Preparation",
                    desc: "Practice tests and certification exam prep materials",
                    icon: CheckCircle,
                  },
                  {
                    title: "LMS Access",
                    desc: "Online learning platform access throughout your program",
                    icon: Users,
                  },
                  {
                    title: "Career Services",
                    desc: "Resume assistance and job search support",
                    icon: CreditCard,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-4 rounded-xl bg-background/80 backdrop-blur-sm border border-accent/20 hover:border-accent/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Options - Distinct visual treatment with primary border */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl" />
            <div className="relative p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-medium text-primary">
                    Flexible Options
                  </span>
                  <h2 className="text-2xl font-bold text-foreground">
                    Payment Options
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground mb-8 max-w-2xl">
                Choose the payment method that works best for your situation.
              </p>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-background border-2 border-primary/20 hover:border-primary/40">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                      <CreditCard className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-primary">Pay in Full</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Pay your tuition in full before your program start date
                      and focus on your studies.
                    </p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Simple, one-time payment</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>No payment tracking needed</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-background border-2 border-accent/20 hover:border-accent/40">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-4 group-hover:from-accent/30 group-hover:to-accent/20 transition-colors">
                      <Users className="h-7 w-7 text-accent" />
                    </div>
                    <CardTitle className="text-accent">Payment Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Split your tuition into manageable installments during
                      your program.
                    </p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span>Down payment required</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span>Monthly installments</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-background border-2 border-primary/20 hover:border-primary/40">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                      <Building2 className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-primary">
                      Sponsor / Agency Pay
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Employer or workforce agency sponsoring your training? We
                      work with sponsors.
                    </p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Employer reimbursement</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>WorkSource eligible</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Refund Policy */}
          <Card
            className="bg-gradient-to-br from-muted/50 to-muted/30 border-l-4 border-l-accent"
            id="refund"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-accent" />
                </div>
                Refund Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">
                We understand that circumstances change. Our refund policy is
                designed to be fair and transparent:
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  "Full refund if withdrawn before program start date",
                  "Prorated refund during the first 50% of the program",
                  "No refund after 50% of program completion",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                For complete details, please review our{" "}
                <Link
                  to="/health/policies#refund"
                  className="text-primary hover:underline font-medium"
                >
                  full refund and cancellation policy
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="relative text-center bg-gradient-to-br from-primary/10 via-card to-accent/10 rounded-2xl p-8 lg:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <div className="relative">
              <p className="text-muted-foreground mb-6">
                Have questions about payment options or need financial guidance?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="shadow-lg">
                  <Link to="/health/contact">Contact Admissions</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/health/apply">Apply Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Tuition;
