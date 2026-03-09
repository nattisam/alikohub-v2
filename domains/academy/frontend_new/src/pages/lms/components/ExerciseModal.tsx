import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Trash2, CheckCircle2, List, CheckSquare } from "lucide-react";

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  moduleId: string;
  lessonId: string;
  isAdding: boolean;
}

export const ExerciseModal = ({
  isOpen,
  onClose,
  onAdd,
  moduleId,
  lessonId,
  isAdding,
}: ExerciseModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "MULTIPLE_CHOICE",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 10,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      type: "MULTIPLE_CHOICE",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 10,
    });
  };

  const handleTypeChange = (newType: string) => {
    if (newType === "TRUE_FALSE") {
      setFormData({
        ...formData,
        type: newType,
        options: ["True", "False"],
        correctAnswer: "",
      });
    } else {
      setFormData({
        ...formData,
        type: newType,
        options: ["", "", "", ""],
        correctAnswer: "",
      });
    }
  };

  const handleAddOption = () => {
    setFormData({ ...formData, options: [...formData.options, ""] });
  };

  const handleRemoveOption = (index: number) => {
    const optionToRemove = formData.options[index];
    const newOptions = formData.options.filter((_, i) => i !== index);

    let newCorrectAnswer = formData.correctAnswer;
    if (formData.correctAnswer === optionToRemove) {
      newCorrectAnswer = "";
    }

    setFormData({
      ...formData,
      options: newOptions,
      correctAnswer: newCorrectAnswer,
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const oldOption = formData.options[index];
    const newOptions = [...formData.options];
    newOptions[index] = value;

    let newCorrectAnswer = formData.correctAnswer;
    if (formData.correctAnswer === oldOption) {
      newCorrectAnswer = value;
    }

    setFormData({
      ...formData,
      options: newOptions,
      correctAnswer: newCorrectAnswer,
    });
  };

  const handleAdd = () => {
    if (!formData.title || !formData.question || !formData.correctAnswer)
      return;
    onAdd({
      ...formData,
      moduleId: Number(moduleId),
      lessonId: Number(lessonId),
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Exercise to Lesson</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-tighter">
              Exercise Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "MULTIPLE_CHOICE", icon: List, label: "Multiple Choice" },
                { id: "TRUE_FALSE", icon: CheckSquare, label: "True / False" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTypeChange(t.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    formData.type === t.id
                      ? "border-accent bg-accent/5 text-accent"
                      : "border-slate-100 hover:border-slate-200 text-slate-500"
                  }`}
                >
                  <t.icon className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                Exercise Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Knowledge Check 1"
                className="h-11 border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                Points
              </label>
              <Input
                type="number"
                value={formData.points}
                onChange={(e) =>
                  setFormData({ ...formData, points: parseInt(e.target.value) })
                }
                className="h-11 border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-tighter">
              Question *
            </label>
            <textarea
              className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 transition-all font-medium"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              placeholder="What would you like to ask?"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                {formData.type === "TRUE_FALSE"
                  ? "Correct Response"
                  : "Options"}
              </label>
              {formData.type === "MULTIPLE_CHOICE" && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Option
                </button>
              )}
            </div>

            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex gap-3 group">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, correctAnswer: option })
                    }
                    className={`flex items-center justify-center w-12 h-11 rounded-xl font-bold text-xs transition-all border-2 ${
                      formData.correctAnswer === option && option !== ""
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200"
                        : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200"
                    }`}
                  >
                    {formData.correctAnswer === option && option !== "" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : formData.type === "TRUE_FALSE" ? (
                      option === "True" ? (
                        "T"
                      ) : (
                        "F"
                      )
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </button>
                  <div className="flex-1 relative">
                    <Input
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      disabled={formData.type === "TRUE_FALSE"}
                      className={`h-11 pr-10 border-slate-200 transition-all ${
                        formData.correctAnswer === option && option !== ""
                          ? "border-emerald-300 bg-emerald-50/30 ring-1 ring-emerald-300"
                          : ""
                      } ${formData.type === "TRUE_FALSE" ? "bg-slate-50 text-slate-700 font-bold" : ""}`}
                    />
                    {formData.type === "MULTIPLE_CHOICE" &&
                      formData.options.length > 2 && (
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                          onClick={() => handleRemoveOption(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
            {formData.correctAnswer === "" &&
              formData.options.some((o) => o !== "") && (
                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider text-center mt-2">
                  Select the correct answer by clicking the button on the left
                </p>
              )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleClose} className="font-bold">
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={
              isAdding ||
              !formData.title ||
              !formData.question ||
              !formData.correctAnswer
            }
            className="bg-accent hover:bg-amber-light text-slate-900 font-bold px-8 shadow-lg shadow-accent/20"
          >
            {isAdding ? "Adding..." : "Add Exercise"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
