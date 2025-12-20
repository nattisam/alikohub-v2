import { FaTrash } from "react-icons/fa";
import type { LessonContent } from "./types.d";

interface ContentListProps {
  contents: LessonContent[];
  onRemove: (contentId: number) => void;
}

const ContentList: React.FC<ContentListProps> = ({ contents, onRemove }) => (
  <div className="mt-3 space-y-2">
    <h6 className="text-xs font-semibold text-gray-800">Contents</h6>
    {contents.map((content) => (
      <div
        key={content.id}
        className="flex justify-between items-center text-sm text-gray-600"
      >
        <span>
          {content.type}: {content.url}
        </span>
        <button
          type="button"
          onClick={() => onRemove(content.id)}
          className="text-red-500 hover:text-red-700"
          aria-label={`Remove content ${content.url}`}
        >
          <FaTrash className="h-4 w-4" />
        </button>
      </div>
    ))}
  </div>
);

export default ContentList;