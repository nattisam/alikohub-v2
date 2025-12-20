import React, { useState } from "react";

type Lesson = {
  id: number;
  title: string;
  completed: boolean;
};

type Module = {
  id: number;
  title: string;
  status: "completed" | "in-progress" | "locked";
  lessons?: Lesson[];
};

type ModulesSectionProps = {
  modules: Module[];
};

const ModulesSection: React.FC<ModulesSectionProps> = ({ modules }) => {
  const [openModule, setOpenModule] = useState<number | null>(null);

  const toggleModule = (id: number) => {
    setOpenModule(openModule === id ? null : id);
  };

  return (
    <div className="bg-gray-50 rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Modules</h2>
      <div className="space-y-3">
        {modules.map((module) => (
          <div key={module.id} className="rounded-lg overflow-hidden">
            {/* Module Header */}
            <div
              className={`flex flex-col items-start p-3 rounded-lg cursor-pointer ${
                module.status === "completed"
                  ? "bg-gray-100 text-gray-700"
                  : module.status === "in-progress"
                  ? "bg-yellow-100 text-gray-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              onClick={() => module.status !== "locked" && toggleModule(module.id)}
            >
              <div className="flex items-center space-x-2">
                {module.status === "completed" && (
                  <span className="text-gray-600">✔</span>
                )}
                {module.status === "in-progress" && (
                  <span className="text-gray-700">▶</span>
                )}
                {module.status === "locked" && (
                  <span className="text-gray-400">🔒</span>
                )}
                <span className="font-medium">{module.title}</span>
              </div>
              <span className="text-sm pl-7">
                {module.status === "completed" && "Completed"}
                {module.status === "in-progress" && "In progress"}
                {module.status === "locked" && "In progress"}
              </span>
            </div>

            {/* Lessons (expandable) */}
            {openModule === module.id && module.lessons && (
              <div className="mt-2 ml-6 space-y-2">
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center space-x-2 text-sm"
                  >
                    {lesson.completed ? (
                      <span className="text-blue-600">✔</span>
                    ) : (
                      <span className="w-4 h-4 border border-gray-400 rounded-full inline-block" />
                    )}
                    <span>{lesson.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModulesSection;
