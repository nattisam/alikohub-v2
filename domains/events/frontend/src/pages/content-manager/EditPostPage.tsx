import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPostById, updateDraft } from "../../services/post-service";
import PostForm from "../../components/content/PostForm";
import type { UpdatePostDto } from "../../types/post";
import { LoadingState } from "../../components/states/LoadingState";
import { ErrorState } from "../../components/states/ErrorState";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: post,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(id as string),
    enabled: !!id,
  });

  const updatePostMutation = useMutation({
    mutationFn: (data: UpdatePostDto) => updateDraft(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      navigate("/content-manager");
    },
  });

  const handleSubmit = async (data: UpdatePostDto) => {
    try {
      await updatePostMutation.mutateAsync(data);
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8F9FA]">
        <LoadingState message="Fetching content details..." />
      </div>
    );

  if (isError)
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8F9FA]">
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Sidebar logic maintained for UI consistency */}
      <aside className="w-64 bg-[#001529] text-white hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#0095DA] rounded flex items-center justify-center">
              <span className="font-bold text-xs">CM</span>
            </div>
            <span className="font-semibold tracking-wide">CMS Panel</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <div className="mb-10">
            <button
              onClick={() => navigate("/content-manager")}
              className="text-[#0095DA] font-semibold flex items-center mb-4 hover:underline group"
            >
              <svg
                className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Edit Post</h1>
            <p className="text-gray-500 text-sm mt-1">
              Currently editing:{" "}
              <span className="font-semibold text-[#BF6622]">
                {post?.title}
              </span>
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <PostForm
              initialData={post}
              onSubmit={handleSubmit}
              isLoading={updatePostMutation.isPending}
              buttonText="Save Changes"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
