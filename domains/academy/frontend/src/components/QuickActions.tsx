import { useState } from "react";

const actions = ["Courses", "Personal Info", "Subscription", "STEM"];

export default function QuickActions() {
  const [active, setActive] = useState("Courses");

  return (
    <div className="flex gap-6 overflow-x-auto scrollbar-hide py-2">
      {actions.map((action) => (
        <button
          key={action}
          onClick={() => setActive(action)}
          className={`flex-shrink-0 pb-2 text:sm md:text-lg font-medium transition-all border-b-2 cursor-pointer
            ${
              active === action
                ? "border-[#E8D90F]"
                : "border-transparent text-gray-600"
            }
            hover:border-[#E8D90F]`}
        >
          {action}
        </button>
      ))}
    </div>
  );
}
