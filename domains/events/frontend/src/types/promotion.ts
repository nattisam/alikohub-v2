// Promotion request types
export interface PromotionRequest {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phoneNumber?: string;
  type: "EVENT" | "ANNOUNCEMENT" | "NEWS";
  message: string;
  status: "PENDING" | "REVIEWED";
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface CreatePromotionRequestDto {
  companyName: string;
  contactPerson: string;
  email: string;
  phoneNumber?: string;
  type: "EVENT" | "ANNOUNCEMENT" | "NEWS";
  message: string;
}
