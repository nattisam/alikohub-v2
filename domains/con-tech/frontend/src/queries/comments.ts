import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contechAPI } from "../services/api";

export const useComments = (projectId?: number) => {
  const queryClient = useQueryClient();

  const commentsQuery = useQuery({
    queryKey: ["comments", projectId],
    queryFn: () => {
      if (projectId) {
        return contechAPI.getProjectComments(projectId);
      }
      return contechAPI.getComments();
    },
    staleTime: 5 * 60 * 1000,
  });

  const createComment = useMutation({
    mutationFn: (commentData: {
      projectId?: number;
      text: string;
      authorId?: string;
    }) => {
      // Adapter: map text to content, authorId to userId if needed, or assume backend handles it.
      // Assuming 'createComment' in api.ts takes 'Comment' type.
      // We need to cast or adapt here.
      return contechAPI.createComment(commentData as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const updateComment = useMutation({
    mutationFn: ({ id, ...commentData }: { id: string; text: string }) =>
      contechAPI.updateComment(id, commentData as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const deleteComment = useMutation({
    mutationFn: (id: string) => contechAPI.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  return {
    ...commentsQuery,
    createComment,
    updateComment,
    deleteComment,
  };
};
