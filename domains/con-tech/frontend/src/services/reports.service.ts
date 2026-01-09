import { contechApi } from '../api';


// Type definitions
export interface Report {
    id: number;
    projectId: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReportDto {
    projectId: number;
    title: string;
    content: string;
}

export class ReportsService {
    private static instance: ReportsService;

    private constructor() { }

    static getInstance(): ReportsService {
        if (!ReportsService.instance) {
            ReportsService.instance = new ReportsService();
        }
        return ReportsService.instance;
    }

    async create(createClientReportDto: CreateReportDto): Promise<Report> {
        try {
            const response = await contechApi.post('/client-reports', createClientReportDto, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating client report:', error);
            throw error;
        }
    }

    async findAllByProjectId(projectId: number): Promise<Report[]> {
        try {
            const response = await contechApi.get(`/client-reports/project/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching client reports for project ${projectId}:`, error);
            throw error;
        }
    }

    async findOneById(reportId: number): Promise<Report> {
        try {
            const response = await contechApi.get(`/client-reports/${reportId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching client report ${reportId}:`, error);
            throw error;
        }
    }
}