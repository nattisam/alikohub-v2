import { useState, useEffect } from "react";
import conceptIcon from "../../assets/conceptIcon.png";
import lessonIcon from "../../assets/lessonIcon.png";
import quizIcon from "../../assets/quizIcon.png";
import projectIcon from "../../assets/projectIcon.png";
import programIcon from "../../assets/programIcon.png";
import { progressApi } from "../../api/progressApi";
import type { OverallStats } from "../../api/progressApi";

type SidebarItem = {
  id: number;
  label: string;
  icon: string;
  count: number;
};

const initialItems: SidebarItem[] = [
  { id: 1, label: "Concepts Viewed", icon: conceptIcon, count: 0 },
  { id: 2, label: "Lessons Viewed", icon: lessonIcon, count: 0 },
  { id: 3, label: "Quizzes Completed", icon: quizIcon, count: 0 },
  { id: 4, label: "Projects Passed", icon: projectIcon, count: 0 },
  { id: 5, label: "Programs Completed", icon: programIcon, count: 0 },
];

export default function SidebarStats({ className }: { className?: string }) {
  const [stats, setStats] = useState<SidebarItem[]>(initialItems);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch student stats data
        const response = await progressApi.getStudentStats();
        const data: OverallStats = response.data;
        
        // Map the response data to our stats format
        const updatedStats = [
          { ...initialItems[0], count: data.conceptsViewed },
          { ...initialItems[1], count: data.lessonsViewed },
          { ...initialItems[2], count: data.quizzesCompleted },
          { ...initialItems[3], count: data.projectsPassed },
          { ...initialItems[4], count: data.programsCompleted },
        ];
        
        setStats(updatedStats);
      } catch (err: any) {
        console.error("Error fetching stats:", err);
        setError("Failed to load stats");
        // Fallback to initial dummy data
        setStats(initialItems);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <aside className={`bg-white p-4 rounded shadow flex flex-col gap-4 ${className}`}>
        <p>Loading stats...</p>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className={`bg-white p-4 rounded shadow flex flex-col gap-4 ${className}`}>
        <p className="text-red-500">{error}</p>
      </aside>
    );
  }

  return (
    <aside
      className={`bg-white p-4 rounded shadow flex flex-col gap-4 ${className}`}
    >
      {stats.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center bg-[#F3F4F6] p-3 rounded"
        >
          <div className="flex items-center gap-2">
            <img src={item.icon} alt={item.label} className="w-6 h-6" />
            <span>{item.label}</span>
          </div>
          <span className="font-bold">{item.count}</span>
        </div>
      ))}
    </aside>
  );
}