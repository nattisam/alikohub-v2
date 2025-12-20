import { FaTrash,FaPlus } from "react-icons/fa";
import { useState } from "react";


interface ArrayInputProps {
  items: string[];
  label: string;
  inputId: string;
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
}

const ArrayInput: React.FC<ArrayInputProps> = ({ items, label, inputId, onAdd, onRemove }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const value = inputValue.trim();
    if (value) {
      onAdd(value);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item, index) => (
          <span
            key={`${inputId}-${index}`}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
          >
            {item}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="ml-2 text-red-500 hover:text-red-700"
              aria-label={`Remove ${item}`}
            >
              <FaTrash className="h-4 w-4" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
        >
          <FaPlus className="mr-2 h-4 w-4" /> Add
        </button>
      </div>
    </div>
  );
};

export default ArrayInput;