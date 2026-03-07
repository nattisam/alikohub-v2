import { Link } from "react-router-dom";
import { Layout } from "@/components/categories/health/layout/Layout";
import { programs } from "@/data/categories/health/programs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle,
  Users,
  Sparkles,
  Sun,
  Moon,
  CalendarDays,
} from "lucide-react";
import morningImg from "@/assets/categories/health/schedule-morning.jpg";
import eveningImg from "@/assets/categories/health/schedule-evening.jpg";
import weekendImg from "@/assets/categories/health/schedule-weekend.jpg";

// Helper to color-code schedule content lines
const FormatContent = ({ content }: { content: string }) => {
  const lines = content.split("\n");
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const isExam = line.toLowerCase().startsWith("exam");
        const isSkill = line.toLowerCase().startsWith("skill");
        const isChapter =
          line.toLowerCase().startsWith("chapter") ||
          line.toLowerCase().startsWith("ch");
        return (
          <p
            key={i}
            className={`text-xs leading-snug ${
              isChapter
                ? "font-bold text-foreground"
                : isExam
                  ? "font-semibold text-teal"
                  : isSkill
                    ? "font-medium text-accent"
                    : "text-foreground/70"
            }`}
          >
            {line}
          </p>
        );
      })}
    </div>
  );
};

const Schedule = () => {
  // Sort programs by start date
  const sortedPrograms = [...programs].sort((a, b) => {
    // Simple date comparison - in production would use proper date parsing
    return a.startDate.localeCompare(b.startDate);
  });

  const openPrograms = sortedPrograms.filter(
    (p) => p.enrollmentStatus === "open",
  );
  const closedPrograms = sortedPrograms.filter(
    (p) => p.enrollmentStatus === "closed",
  );

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
              Plan Your Journey
            </span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">
            Start Dates & Schedule
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            View upcoming cohort start dates and enrollment status for all our
            healthcare training programs.
          </p>

          {/* Quick stats */}
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {openPrograms.length}
                </p>
                <p className="text-xs">Open Enrollments</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Cohort-Based</p>
                <p className="text-xs">Structured Learning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-academy space-y-12">
          {/* Open Enrollment */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-teal" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-teal">
                  Open for Enrollment
                </h2>
                <Badge variant="outline" className="border-teal text-teal mt-1">
                  {openPrograms.length} Programs Available
                </Badge>
              </div>
            </div>
            <Card className="overflow-hidden">
              <div className="bg-teal/10 border-b border-teal/20 px-6 py-2.5">
                <div className="flex items-center gap-2 text-teal">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Enroll Now — Limited Seats Available
                  </span>
                </div>
              </div>
              {/* Mobile card layout */}
              <div className="block md:hidden p-4 space-y-4">
                {openPrograms.map((program) => (
                  <div
                    key={program.id}
                    className="border border-border rounded-xl p-4 space-y-3 bg-background"
                  >
                    <Link
                      to={`/health/programs/${program.id}`}
                      className="font-bold text-base hover:text-primary transition-colors block"
                    >
                      {program.name}
                    </Link>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{program.duration}</span>
                      </div>
                      <Badge variant="outline">{program.modality}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-teal" />
                      <span className="font-bold text-teal">
                        {program.startDate}
                      </span>
                    </div>
                    <Button asChild size="sm" className="w-full shadow-sm">
                      <Link to="/health/apply">
                        Apply Now
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
              {/* Desktop table */}
              <CardContent className="p-0 hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-bold text-base">
                        Program
                      </TableHead>
                      <TableHead className="font-bold text-base">
                        Duration
                      </TableHead>
                      <TableHead className="font-bold text-base">
                        Modality
                      </TableHead>
                      <TableHead className="font-bold text-base">
                        Start Date
                      </TableHead>
                      <TableHead className="text-right font-bold text-base">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openPrograms.map((program, index) => (
                      <TableRow
                        key={program.id}
                        className={`${index % 2 === 0 ? "bg-background" : "bg-muted/30"} hover:bg-accent/5 transition-colors`}
                      >
                        <TableCell className="font-bold text-base">
                          <Link
                            to={`/health/programs/${program.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {program.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-base">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {program.duration}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{program.modality}</Badge>
                        </TableCell>
                        <TableCell className="text-base">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-teal" />
                            <span className="font-bold text-teal">
                              {program.startDate}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild size="sm" className="shadow-sm">
                            <Link to="/health/apply">
                              Apply Now
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* CNA Class Schedule - Photo Cards */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  CNA Class Schedules
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choose the schedule that fits your lifestyle
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Weekday Morning */}
              <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="aspect-[3/4] relative">
                  <img
                    src={morningImg}
                    alt="Morning class"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Sun className="h-6 w-6 text-yellow-300" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <Badge className="bg-primary/90 backdrop-blur-sm text-white border-primary/50 hover:bg-primary text-sm px-3 py-1">
                      Morning Class
                    </Badge>
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/15 backdrop-blur-sm">
                        <Clock className="h-4 w-4 text-blue-200 shrink-0" />
                        <span className="font-bold text-blue-200 text-lg">
                          8:00 AM – 12:00 PM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekday Evening */}
              <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="aspect-[3/4] relative">
                  <img
                    src={eveningImg}
                    alt="Evening class"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Moon className="h-6 w-6 text-blue-300" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <Badge className="bg-primary/90 backdrop-blur-sm text-white border-primary/50 hover:bg-primary text-sm px-3 py-1">
                      Night Class
                    </Badge>
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/15 backdrop-blur-sm">
                        <Clock className="h-4 w-4 text-blue-200 shrink-0" />
                        <span className="font-bold text-blue-200 text-lg">
                          5:00 PM – 9:00 PM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekend */}
              <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="aspect-[3/4] relative">
                  <img
                    src={weekendImg}
                    alt="Weekend class"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <CalendarDays className="h-6 w-6 text-green-300" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <Badge className="bg-primary/90 backdrop-blur-sm text-white border-primary/50 hover:bg-primary text-sm px-3 py-1">
                      Weekend Class
                    </Badge>
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/15 backdrop-blur-sm">
                        <Sun className="h-4 w-4 text-blue-200 shrink-0" />
                        <span className="font-bold text-blue-200 text-sm">
                          8:00 AM – 12:00 PM
                        </span>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/10 backdrop-blur-sm">
                        <Clock className="h-4 w-4 text-white/60 shrink-0" />
                        <span className="font-medium text-sm text-white/70">
                          12:00 – 1:00 PM Lunch
                        </span>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/15 backdrop-blur-sm">
                        <Sun className="h-4 w-4 text-blue-200 shrink-0" />
                        <span className="font-bold text-blue-200 text-sm">
                          1:00 PM – 5:00 PM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CNA 20-Day Calendar - Single unified table */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  CNA Program – 20-Day Calendar
                </h2>
                <p className="text-sm text-muted-foreground">
                  Complete program breakdown by day
                </p>
              </div>
            </div>

            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">
                      20-Day Training Schedule
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-primary/30 inline-block" />{" "}
                      Theory
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-accent/40 inline-block" />{" "}
                      Skills
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-teal/40 inline-block" />{" "}
                      Clinical
                    </span>
                  </div>
                </div>
              </div>
              <CardContent className="p-4 overflow-x-auto">
                {/* Week 1: Days 1-5 */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                    Week 1 — Theory Foundation
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {[
                      { day: 1, hrs: 4, content: "Ch.1 & Ch.2" },
                      { day: 2, hrs: 4, content: "Ch.2 & Ch.3" },
                      {
                        day: 3,
                        hrs: 4,
                        content: "Exam Ch1–3\nCh.4\nSkills Ch4",
                      },
                      { day: 4, hrs: 4, content: "Exam Ch4\nCh.5" },
                      { day: 5, hrs: 4, content: "Ch.6\nSkills Ch5–6" },
                    ].map((d) => (
                      <div
                        key={d.day}
                        className="rounded-xl border border-border bg-card shadow-sm p-3 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-primary">
                            Day {d.day}
                          </span>
                          <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                            {d.hrs}h
                          </span>
                        </div>
                        <FormatContent content={d.content} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Week 2: Days 6-10 */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                    Week 2 — Advanced Theory & Skills Intro
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {[
                      {
                        day: 6,
                        hrs: 4,
                        content: "Exam Ch5–6\nCh.7\nSkills Ch7",
                      },
                      {
                        day: 7,
                        hrs: 4,
                        content: "Ch.8\nSkills Ch8\nExam Ch7–8",
                      },
                      {
                        day: 8,
                        hrs: 5,
                        content: "Ch.9 & Ch.10\nSkills Ch9–10\nExam Ch9–10",
                      },
                      {
                        day: 9,
                        hrs: 5,
                        content: "Skill Practice",
                        isSkill: true,
                      },
                      {
                        day: 10,
                        hrs: 5,
                        content: "Skill Practice",
                        isSkill: true,
                      },
                    ].map((d) => (
                      <div
                        key={d.day}
                        className={`rounded-xl border shadow-sm p-3 hover:shadow-md transition-all ${
                          "isSkill" in d && d.isSkill
                            ? "border-accent/30 bg-accent/5"
                            : "border-border bg-card"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-xs font-bold ${"isSkill" in d && d.isSkill ? "text-accent" : "text-primary"}`}
                          >
                            Day {d.day}
                          </span>
                          <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                            {d.hrs}h
                          </span>
                        </div>
                        <FormatContent content={d.content} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Week 3: Days 11-15 */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2 px-1">
                    Week 3 — Full Skills Practice
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {[11, 12, 13, 14, 15].map((day) => (
                      <div
                        key={day}
                        className="rounded-xl border border-accent/30 bg-accent/5 shadow-sm p-3 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-accent">
                            Day {day}
                          </span>
                          <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                            5h
                          </span>
                        </div>
                        <p className="text-xs font-medium text-accent">
                          Full Skills Practice
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Week 4: Days 16-20 */}
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 px-1">
                    Week 4 — Clinical Rotation
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {[16, 17, 18, 19, 20].map((day) => (
                      <div
                        key={day}
                        className="rounded-xl border border-primary/30 bg-primary/5 shadow-sm p-3 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-primary">
                            Day {day}
                          </span>
                          <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                            8h
                          </span>
                        </div>
                        <p className="text-xs font-medium text-primary">
                          Clinical
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Closed Enrollment */}
          {closedPrograms.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-destructive">
                    Upcoming Cohorts
                  </h2>
                  <Badge variant="destructive" className="mt-1">
                    {closedPrograms.length} Programs
                  </Badge>
                </div>
              </div>
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">
                      Coming Soon — Join the Waitlist
                    </span>
                  </div>
                </div>
                {/* Mobile card layout */}
                <div className="block md:hidden p-4 space-y-4">
                  {closedPrograms.map((program) => (
                    <div
                      key={program.id}
                      className="border border-border rounded-xl p-4 space-y-3 bg-background"
                    >
                      <Link
                        to={`/health/programs/${program.id}`}
                        className="font-medium hover:text-primary transition-colors block"
                      >
                        {program.name}
                      </Link>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{program.duration}</span>
                        </div>
                        <Badge variant="outline">{program.modality}</Badge>
                        <Badge variant="destructive">Coming Soon</Badge>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        <Link to={`/health/programs/${program.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
                {/* Desktop table */}
                <CardContent className="p-0 hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold text-sm">
                          Program
                        </TableHead>
                        <TableHead className="font-semibold text-sm">
                          Duration
                        </TableHead>
                        <TableHead className="font-semibold text-sm">
                          Modality
                        </TableHead>
                        <TableHead className="font-semibold text-sm">
                          Status
                        </TableHead>
                        <TableHead className="text-right font-semibold text-sm">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {closedPrograms.map((program, index) => (
                        <TableRow
                          key={program.id}
                          className={`${index % 2 === 0 ? "bg-background" : "bg-muted/30"} hover:bg-primary/5 transition-colors`}
                        >
                          <TableCell className="font-medium">
                            <Link
                              to={`/health/programs/${program.id}`}
                              className="hover:text-primary transition-colors"
                            >
                              {program.name}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {program.duration}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{program.modality}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="destructive">Coming Soon</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button asChild size="sm" variant="outline">
                              <Link to={`/health/programs/${program.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Info Card */}
          <Card className="bg-gradient-to-br from-muted/50 to-muted/30 border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                About Our Cohort Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">
                Aliko Academy operates on a cohort-based schedule, with new
                classes starting on specific dates throughout the year. This
                approach ensures:
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  "Structured learning with dedicated instructor support",
                  "Peer collaboration and networking opportunities",
                  "Coordinated clinical placement scheduling",
                  "Clear timelines for program completion and certification",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                <Link
                  to="/health/contact"
                  className="text-primary hover:underline font-medium"
                >
                  Contact our admissions team
                </Link>{" "}
                if you have questions about upcoming start dates or need
                assistance with enrollment.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Schedule;
