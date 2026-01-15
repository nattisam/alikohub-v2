import { academyApi } from "../api";

// Define the teaching schedule types
export interface TeachingSchedule {
    id: number;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    type: string;
    courseId: number;
    instructorId: string;
    isRecurring: boolean;
    recurrencePattern?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTeachingScheduleDto {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    type: string;
    courseId: number;
    isRecurring?: boolean;
    recurrencePattern?: string;
}

export interface UpdateTeachingScheduleDto {
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    type?: string;
    isRecurring?: boolean;
    recurrencePattern?: string;
}

// Teaching Schedule APIs
export const teachingScheduleApi = {
    // Get schedules for the current instructor
    getInstructorSchedules: () => academyApi.get<TeachingSchedule[]>("/teaching-schedules/instructor"),

    // Get schedules for a specific course
    getCourseSchedules: (courseId: number) => academyApi.get<TeachingSchedule[]>(`/teaching-schedules/course/${courseId}`),

    // Create a new teaching schedule
    createSchedule: (data: CreateTeachingScheduleDto) => academyApi.post<TeachingSchedule>("/teaching-schedules", data),

    // Update an existing teaching schedule
    updateSchedule: (id: number, data: UpdateTeachingScheduleDto) => academyApi.put<TeachingSchedule>(`/teaching-schedules/${id}`, data),

    // Delete a teaching schedule
    deleteSchedule: (id: number) => academyApi.delete(`/teaching-schedules/${id}`),

    // Get a specific teaching schedule by ID
    getScheduleById: (id: number) => academyApi.get<TeachingSchedule>(`/teaching-schedules/${id}`),
};