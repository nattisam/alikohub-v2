import { publicApi, api } from '../lib/api';
import type { PromotionRequest, CreatePromotionRequestDto } from '../types/promotion';

// Public API - Submit promotion request
export const submitPromotionRequest = async (requestData: CreatePromotionRequestDto): Promise<PromotionRequest> => {
  try {
    const response = await publicApi.post('/events/promotion-requests', requestData);
    return response.data;
  } catch (error) {
    console.error('Error submitting promotion request:', error);
    throw error;
  }
};

// Admin API - Get all promotion requests
export const getPromotionRequests = async (): Promise<PromotionRequest[]> => {
  try {
    const response = await api.get('/events/promotion-requests');
    return response.data;
  } catch (error) {
    console.error('Error fetching promotion requests:', error);
    throw error;
  }
};

// Admin API - Mark promotion request as reviewed
export const markPromotionRequestAsReviewed = async (requestId: string): Promise<PromotionRequest> => {
  try {
    const response = await api.post(`/events/promotion-requests/${requestId}/review`);
    return response.data;
  } catch (error) {
    console.error(`Error marking promotion request ${requestId} as reviewed:`, error);
    throw error;
  }
};
