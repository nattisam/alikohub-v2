import api from "../lib/api";

export interface PaymentInitializeRequest {
  amount: number;
  currency: string;
  email: string;
  firstName?: string;
  lastName?: string;
  provider: "STRIPE" | "CHAPA";
  purpose?: string;
  metadata?: {
    courseId?: number;
    cohortId?: number;
  };
}

export const paymentService = {
  initializePayment: async (data: PaymentInitializeRequest) => {
    const response = await api.post("/payments/initialize", data);
    return response.data;
  },

  getAllTransactions: async () => {
    const response = await api.get("/payments/transactions/all");
    return response.data;
  },

  getMyTransactions: async () => {
    const response = await api.get("/payments/transactions/my");
    return response.data;
  },

  updateTransactionStatus: async (
    id: number | string,
    status: "PENDING" | "COMPLETED" | "FAILED",
  ) => {
    const response = await api.patch(`/payments/transactions/${id}/status`, {
      status,
    });
    return response.data;
  },
};
