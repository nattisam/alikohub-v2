import { useState } from "react";
import { ArrowRight, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import LmsNavbar from "@/components/LmsNavbar";

import thumbCloud from "@/assets/thumb-cloud.jpg";
import thumbHealthAnalytics from "@/assets/thumb-health-analytics.jpg";
import thumbAutocad from "@/assets/thumb-autocad.jpg";
import thumbCpr from "@/assets/thumb-cpr.jpg";
import thumbPython from "@/assets/thumb-python.jpg";
import thumbAiMl from "@/assets/thumb-ai-ml.jpg";
import thumbBim from "@/assets/thumb-bim.jpg";

const tabs = ["In Progress", "Completed", "Saved"];

const inProgress = [
  { title: "Introduction to Cloud Computing", stream: "Tech", progress: 68, timeLeft: "3 weeks", streamClass: "stream-tech", thumb: thumbCloud },
  { title: "Health Data Analytics Foundations", stream: "Health", progress: 34, timeLeft: "7 weeks", streamClass: "stream-health", thumb: thumbHealthAnalytics },
  { title: "AutoCAD for Civil Engineering", stream: "STEM", progress: 85, timeLeft: "1 week", streamClass: "stream-stem", thumb: thumbAutocad },
];

const completed = [
  { title: "CPR/BLS Certification", stream: "Health", completedDate: "Jan 15, 2026", certified: true, streamClass: "stream-health", thumb: thumbCpr },
  { title: "Python Fundamentals", stream: "Tech", completedDate: "Dec 10, 2025", certified: true, streamClass: "stream-tech", thumb: thumbPython },
];

const saved = [
  { title: "AI and Machine Learning", stream: "Tech", duration: "14 weeks", level: "Advanced", streamClass: "stream-tech", thumb: thumbAiMl },
  { title: "BIM Systems and Design", stream: "STEM", duration: "10 weeks", level: "Intermediate", streamClass: "stream-stem", thumb: thumbBim },
];

const LmsMyLearning = () => {
  const [activeTab, setActiveTab] = useState("In Progress");

  return (
    <div className="min-h-screen bg-background">
      <LmsNavbar />

      <div className="section-container py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-6">My Learning</h1>

        <div className="flex gap-1 mb-8 border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "In Progress" && (
          <div className="space-y-4">
            {inProgress.map((course) => (
              <div key={course.title} className="bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow duration-200 flex">
                <div className="w-32 md:w-48 shrink-0">
                  <img src={course.thumb} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${course.streamClass}`}>{course.stream}</span>
                    <h3 className="font-heading font-semibold text-foreground mt-2">{course.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Clock className="w-3 h-3" /> {course.timeLeft} remaining
                    </div>
                    <div className="mt-3 max-w-sm">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  </div>
                  <Button size="sm" className="gap-1 self-start">Continue <ArrowRight className="w-3 h-3" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Completed" && (
          <div className="space-y-4">
            {completed.map((course) => (
              <div key={course.title} className="bg-card rounded-lg border overflow-hidden flex">
                <div className="w-32 md:w-48 shrink-0">
                  <img src={course.thumb} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${course.streamClass}`}>{course.stream}</span>
                    <h3 className="font-heading font-semibold text-foreground mt-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Completed {course.completedDate}</p>
                  </div>
                  {course.certified && (
                    <div className="flex items-center gap-2 text-accent">
                      <Award className="w-5 h-5" />
                      <span className="text-sm font-medium">Certificate Earned</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Saved" && (
          <div className="space-y-4">
            {saved.map((course) => (
              <div key={course.title} className="bg-card rounded-lg border overflow-hidden flex">
                <div className="w-32 md:w-48 shrink-0">
                  <img src={course.thumb} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${course.streamClass}`}>{course.stream}</span>
                    <h3 className="font-heading font-semibold text-foreground mt-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{course.duration} · {course.level}</p>
                  </div>
                  <Button size="sm">Enroll</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LmsMyLearning;
