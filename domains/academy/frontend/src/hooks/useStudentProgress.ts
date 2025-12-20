import { useState, useEffect } from "react";
import { academyApi } from "../api";

interface ProgressItem {
    moduleId: number;
    moduleTitle: string;
    status: string;
    lessons: Array<{
        lessonId: number;
        lessonTitle: string;
        status: string;
        contents: Array<{
            contentId: number;
            contentTitle: string;
            contentType: string;
            status: string;
            score?: number;
        }>;
    }>;
}

export const useStudentProgress = (courseId: number, userId: string) => {
    const [progress, setProgress] = useState<ProgressItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch detailed progress
                const progressResponse = await academyApi.get(
                    `/progress/course/${courseId}/user/${userId}`
                );
                setProgress(progressResponse.data);
            } catch (err: any) {
                console.error("Error fetching student progress:", err);
                setError(err.message || "Failed to load progress data");
            } finally {
                setLoading(false);
            }
        };

        if (courseId && userId) {
            fetchProgress();
        }
    }, [courseId, userId]);

    // Calculate overall progress
    const calculateOverallProgress = () => {
        if (progress.length === 0) return 0;

        let totalItems = 0;
        let completedItems = 0;

        progress.forEach(module => {
            module.lessons.forEach(lesson => {
                totalItems += 1;
                if (lesson.status === "COMPLETED") completedItems += 1;

                lesson.contents.forEach(content => {
                    totalItems += 1;
                    if (content.status === "COMPLETED") completedItems += 1;
                });
            });
        });

        return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    };

    const overallProgress = calculateOverallProgress();

    // Function to update content progress
    const updateContentProgress = async (
        moduleId: number,
        lessonId: number,
        contentId: number,
        status: string,
        score?: number
    ) => {
        try {
            const response = await academyApi.post(
                `/progress/course/${courseId}/module/${moduleId}/lesson/${lessonId}/content/${contentId}`,
                { status, score }
            );

            // Refresh progress data
            const progressResponse = await academyApi.get(
                `/progress/course/${courseId}/user/${userId}`
            );
            setProgress(progressResponse.data);

            return response.data;
        } catch (err: any) {
            console.error("Error updating content progress:", err);
            throw new Error(err.message || "Failed to update progress");
        }
    };

    return {
        progress,
        overallProgress,
        loading,
        error,
        updateContentProgress,
        refetch: () => {
            // Refetch progress data
            const fetchProgress = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    const progressResponse = await academyApi.get(
                        `/progress/course/${courseId}/user/${userId}`
                    );
                    setProgress(progressResponse.data);
                } catch (err: any) {
                    console.error("Error fetching student progress:", err);
                    setError(err.message || "Failed to load progress data");
                } finally {
                    setLoading(false);
                }
            };

            fetchProgress();
        }
    };
};