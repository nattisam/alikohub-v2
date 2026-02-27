import { useState, useEffect, useRef } from "react";
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
    excerpt: "",
    content: "",
    coverImage: "",
    eventDate: "",
    startTime: "",
    location: "",
    externalLink: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        type: initialData.type || PostType.NEWS,
        excerpt: initialData.excerpt || "",
        content: initialData.content || "",
        coverImage: initialData.coverImage || "",
        eventDate: initialData.eventDate || "",
        startTime: initialData.startTime || "",
        location: initialData.location || "",
        externalLink: initialData.externalLink || "",
      });
      if (typeof initialData.coverImage === "string") {
        setImagePreview(initialData.coverImage);
      }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // We'll pass the file along with the form data
    const submissionData: CreatePostDto = {
      ...formData,
      coverImage: imageFile || formData.coverImage,
    };

    await onSubmit(submissionData);
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
                htmlFor="excerpt"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Short Description (Excerpt)
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                required
                rows={3}
                value={formData.excerpt}
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
                Cover Image
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:border-blue-400 transition-colors"
              >
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-48 rounded-lg mx-auto"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                        <span className="text-white text-xs font-bold">
                          Change Image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          Upload a file
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                  <input
                    id="coverImage"
                    name="coverImage"
                    type="file"
                    ref={fileInputRef}
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
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
                    htmlFor="startTime"
                    className="block text-sm font-semibold text-blue-800 mb-1"
                  >
                    {" "}
                    Time{" "}
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    required={formData.type === PostType.EVENT}
                    value={formData.startTime}
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
