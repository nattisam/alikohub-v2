import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services/paymentService";
import type { PaymentInitializeRequest } from "@/services/paymentService";
import { toast } from "sonner";

export const useInitializePayment = () => {
  return useMutation({
    mutationFn: (data: PaymentInitializeRequest) =>
      paymentService.initializePayment(data),
    onSuccess: (data: any) => {
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.success("Payment initialized successfully!");
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to initialize payment",
      );
    },
  });
};

export const useAllTransactions = () => {
  return useQuery({
    queryKey: ["all-transactions"],
    queryFn: () => paymentService.getAllTransactions(),
  });
};

export const useMyTransactions = () => {
  return useQuery({
    queryKey: ["my-transactions"],
    queryFn: () => paymentService.getMyTransactions(),
  });
};

export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number | string;
      status: "PENDING" | "COMPLETED" | "FAILED";
    }) => paymentService.updateTransactionStatus(id, status),
    onSuccess: () => {
      toast.success("Transaction status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["all-transactions"] });
      // Optionally invalidate my-transactions if admin is updating their own
      queryClient.invalidateQueries({ queryKey: ["my-transactions"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update transaction status",
      );
    },
  });
};
