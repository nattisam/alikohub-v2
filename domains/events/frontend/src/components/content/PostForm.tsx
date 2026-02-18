import { useState, useEffect } from "react";
import { PostType } from "../../types/post";
import type { CreatePostDto, Post } from "../../types/post";

interface PostFormProps {
  initialData?: Post;
  onSubmit: (data: CreatePostDto) => Promise<void>;
  isLoading: boolean;
  buttonText: string;
}

export default function PostForm({
  initialData,
  onSubmit,
  isLoading,
  buttonText,
}: PostFormProps) {
  const [formData, setFormData] = useState<CreatePostDto>({
    title: "",
    type: PostType.NEWS,
    shortDescription: "",
    content: "",
    coverImage: "",
    eventDate: "",
    eventTime: "",
    location: "",
    externalLink: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        type: initialData.type || PostType.NEWS,
        shortDescription: initialData.shortDescription || "",
        content: initialData.content || "",
        coverImage: initialData.coverImage || "",
        eventDate: initialData.eventDate || "",
        eventTime: initialData.eventTime || "",
        location: initialData.location || "",
        externalLink: initialData.externalLink || "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">
              Content Information
            </h2>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Post Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. AlikoHub Tech Summit 2024"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Content Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"
              >
                <option value={PostType.EVENT}>Event</option>
                <option value={PostType.NEWS}>News</option>
                <option value={PostType.ANNOUNCEMENT}>Announcement</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="shortDescription"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Short Description (Excerpt)
              </label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                required
                rows={3}
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="A brief summary that appears on cards..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Full Content
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={12}
                value={formData.content}
                onChange={handleChange}
                placeholder="Write the full story here..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Metadata & Media */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">
              Media
            </h2>
            <div>
              <label
                htmlFor="coverImage"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Cover Image URL
              </label>
              <input
                type="url"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              />
              {formData.coverImage && (
                <div className="mt-4 rounded-xl overflow-hidden aspect-video border border-gray-100">
                  <img
                    src={formData.coverImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Event Specific Fields */}
          {formData.type === PostType.EVENT && (
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 space-y-4">
              <h2 className="text-xl font-bold text-blue-900 border-b border-blue-100 pb-4">
                Event Details
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="eventDate"
                    className="block text-sm font-semibold text-blue-800 mb-1"
                  >
                    {" "}
                    Date{" "}
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    required={formData.type === PostType.EVENT}
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="eventTime"
                    className="block text-sm font-semibold text-blue-800 mb-1"
                  >
                    {" "}
                    Time{" "}
                  </label>
                  <input
                    type="time"
                    id="eventTime"
                    name="eventTime"
                    required={formData.type === PostType.EVENT}
                    value={formData.eventTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-semibold text-blue-800 mb-1"
                >
                  {" "}
                  Location{" "}
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required={formData.type === PostType.EVENT}
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Physical address or 'Online'"
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label
                  htmlFor="externalLink"
                  className="block text-sm font-semibold text-blue-800 mb-1"
                >
                  {" "}
                  Join Link (Optional){" "}
                </label>
                <input
                  type="url"
                  id="externalLink"
                  name="externalLink"
                  value={formData.externalLink}
                  onChange={handleChange}
                  placeholder="Zoom, Google Meet, etc."
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-2xl text-white font-bold shadow-lg transform active:scale-95 transition-all ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed shadow-none"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                buttonText
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
