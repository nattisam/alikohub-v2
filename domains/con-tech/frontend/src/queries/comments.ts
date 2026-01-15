import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contechAPI } from '../services/api';

export const useComments = (projectId?: number) => {
  const queryClient = useQueryClient();

  const commentsQuery = useQuery({
    queryKey: ['comments', projectId],
    queryFn: () => {
      if (projectId) {
        return contechAPI.comments.getProjectComments(projectId);
      }
      return contechAPI.comments.getAllComments();
    },
    staleTime: 5 * 60 * 1000,
  });

  const createComment = useMutation({
    mutationFn: (commentData: { projectId?: number; text: string; authorId?: string }) =>
      contechAPI.comments.createComment(commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  const updateComment = useMutation({
    mutationFn: ({ id, ...commentData }: { id: string; text: string }) =>
      contechAPI.comments.updateComment(id, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  const deleteComment = useMutation({
    mutationFn: (id: string) =>
      contechAPI.comments.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  return {
    ...commentsQuery,
    createComment,
    updateComment,
    deleteComment,
  };
};
