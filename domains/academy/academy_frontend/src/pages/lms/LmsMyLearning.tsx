import { useState } from "react";
import { ArrowRight, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import LmsNavbar from "@/components/LmsNavbar";
import { useEnrollments, useStudentDashboard } from "@/hooks/useAcademy";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const tabs = ["In Progress", "Completed", "Saved"];

const LmsMyLearning = () => {
  const [activeTab, setActiveTab] = useState("In Progress");
  const { data: enrollments, isLoading: isEnrollmentsLoading } =
    useEnrollments();
  const { data: dashboard, isLoading: isDashboardLoading } =
    useStudentDashboard();

  const isLoading = isEnrollmentsLoading || isDashboardLoading;

  const filteredEnrollments = enrollments?.filter((enrollment) => {
    if (activeTab === "In Progress") return enrollment.status === "ACTIVE";
    if (activeTab === "Completed") return enrollment.status === "COMPLETED";
    return false;
  });

  return (
    <div className="min-h-screen bg-background">
      <LmsNavbar />

      <div className="section-container py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-6">
          My Learning
        </h1>

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

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-lg" />
            ))}
          </div>
        )}

        {!isLoading && filteredEnrollments?.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              {activeTab === "In Progress" &&
                "You don't have any active courses yet."}
              {activeTab === "Completed" &&
                "You haven't completed any courses yet."}
              {activeTab === "Saved" && "You haven't saved any courses yet."}
            </p>

            <Button asChild>
              <Link to="/lms/explore">Browse Courses</Link>
            </Button>
          </div>
        )}

        {!isLoading &&
          filteredEnrollments &&
          filteredEnrollments.length > 0 && (
            <div className="space-y-4">
              {filteredEnrollments.map((enrollment) => {
                const pData =
                  dashboard && Array.isArray(dashboard)
                    ? dashboard.find(
                        (d: any) => d.courseId === Number(enrollment.courseId),
                      )
                    : null;
                const currentProgress = Math.round(
                  pData?.percentage || enrollment.progress || 0,
                );

                return (
                  <div
                    key={enrollment.id}
                    className="bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow duration-200 flex"
                  >
                    <div className="w-32 md:w-48 shrink-0">
                      {enrollment.course?.thumbnail ? (
                        <img
                          src={enrollment.course.thumbnail}
                          alt={enrollment.course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <span className="text-xs text-muted-foreground">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full stream-tech">
                          {enrollment.course?.category || "General"}
                        </span>

                        <h3 className="font-heading font-semibold text-foreground mt-2">
                          {enrollment.course?.title}
                        </h3>

                        {enrollment.status === "ACTIVE" && (
                          <>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Clock className="w-3 h-3" />
                              In progress
                            </div>

                            <div className="mt-3 max-w-sm">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground">
                                  Progress
                                </span>
                                <span className="font-medium">
                                  {currentProgress}%
                                </span>
                              </div>

                              <Progress
                                value={currentProgress}
                                className="h-2"
                              />
                            </div>
                          </>
                        )}

                        {enrollment.status === "COMPLETED" && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Course completed
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {enrollment.status === "COMPLETED" && (
                          <div className="flex items-center gap-2 text-accent">
                            <Award className="w-5 h-5" />
                            <span className="text-sm font-medium">
                              Certificate Earned
                            </span>
                          </div>
                        )}

                        <Button size="sm" asChild className="gap-1">
                          <Link to={`/lms/learn/${enrollment.courseId}`}>
                            {enrollment.status === "COMPLETED"
                              ? "Review"
                              : "Continue"}
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
};

export default LmsMyLearning;
