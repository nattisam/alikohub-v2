import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDraft } from "../../services/post-service";
import PostForm from "../../components/content/PostForm";
import type { CreatePostDto } from "../../types/post";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: (data: CreatePostDto) => createDraft(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      navigate("/content-manager");
    },
  });

  const handleSubmit = async (data: CreatePostDto) => {
    try {
      await createPostMutation.mutateAsync(data);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Mini Sidebar to match Dashboard feel */}
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
            <h1 className="text-2xl font-bold text-gray-800">
              Create New Content
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Submit your draft for review after saving. All drafts are private.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <PostForm
              onSubmit={handleSubmit}
              isLoading={createPostMutation.isPending}
              buttonText="Save as Draft"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
