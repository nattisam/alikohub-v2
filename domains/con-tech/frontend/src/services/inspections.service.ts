import { contechApi } from '../api';


// Type definitions
export interface Inspection {
    id: number;
    projectId: number;
    inspectorId: string;
    findings: string;
    recommendations: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
    updatedAt: string;
}

export interface CreateInspectionDto {
    projectId: number;
    inspectorId: string;
    findings: string;
    recommendations: string;
}

export interface UpdateInspectionDto {
    id: number;
    findings?: string;
    recommendations?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export class InspectionsService {
    private static instance: InspectionsService;

    private constructor() { }

    static getInstance(): InspectionsService {
        if (!InspectionsService.instance) {
            InspectionsService.instance = new InspectionsService();
        }
        return InspectionsService.instance;
    }

    async create(createInspectionDto: CreateInspectionDto, files: any[]): Promise<Inspection> {
        try {
            const formData = new FormData();
            formData.append('data', JSON.stringify(createInspectionDto));
            files.forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });

            const response = await contechApi.post('/inspections', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating inspection:', error);
            throw error;
        }
    }

    async findAllForProject(projectId: number, pagination: { skip?: number; take?: number } = {}): Promise<Inspection[]> {
        try {
            const response = await contechApi.get(`/inspections/project/${projectId}`, {
                params: pagination,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching inspections for project ${projectId}:`, error);
            throw error;
        }
    }

    async findOne(id: number): Promise<Inspection> {
        try {
            const response = await contechApi.get(`/inspections/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching inspection ${id}:`, error);
            throw error;
        }
    }

    async update(updateInspectionDto: UpdateInspectionDto): Promise<Inspection> {
        try {
            const response = await contechApi.put(`/inspections/${updateInspectionDto.id}`, updateInspectionDto, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating inspection ${updateInspectionDto.id}:`, error);
            throw error;
        }
    }

    async remove(id: number): Promise<void> {
        try {
            await contechApi.delete(`/inspections/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
        } catch (error) {
            console.error(`Error deleting inspection ${id}:`, error);
            throw error;
        }
    }
}