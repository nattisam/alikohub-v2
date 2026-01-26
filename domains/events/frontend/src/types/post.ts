// Post types for events platform
export const PostType = {
  EVENT: "EVENT",
  NEWS: "NEWS",
  ANNOUNCEMENT: "ANNOUNCEMENT"
} as const;

export type PostType = typeof PostType[keyof typeof PostType];

export const PostStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PUBLISHED: "PUBLISHED"
} as const;

export type PostStatus = typeof PostStatus[keyof typeof PostStatus];

export interface Post {
  id: string;
  title: string;
  type: PostType;
  shortDescription: string; // excerpt
  content: string; // full rich text content
  coverImage?: string;
  status: PostStatus;
  createdBy: string; // Content Manager ID
  createdByName?: string; // Content Manager name
  approvedBy?: string; // Admin ID
  approvedByName?: string; // Admin name
  rejectionFeedback?: string;
  publishDate?: string;
  createdAt: string;
  updatedAt: string;
  
  // Event-specific fields (only for EVENT type)
  eventDate?: string;
  eventTime?: string;
  location?: string; // physical or online
  externalLink?: string; // Zoom, Google Meet, etc.
}

export interface CreatePostDto {
  title: string;
  type: PostType;
  shortDescription: string;
  content: string;
  coverImage?: string;
  
  // Event-specific fields
  eventDate?: string;
  eventTime?: string;
  location?: string;
  externalLink?: string;
}

export interface UpdatePostDto extends Partial<CreatePostDto> {
  status?: PostStatus;
  rejectionFeedback?: string;
}
