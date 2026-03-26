import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Trash2, List, CheckSquare, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBulk: (data: { dtos: any[] }) => void;
  moduleId: string;
  lessonId: string;
  isAdding: boolean;
}

export const ExerciseModal = ({
  isOpen,
  onClose,
  onAddBulk,
  moduleId,
  lessonId,
  isAdding,
}: ExerciseModalProps) => {
  const [bulkExercises, setBulkExercises] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    title: "",
    type: "MULTIPLE_CHOICE",
    question: "",
    description: "",
    options: ["", ""],
    correctAnswer: "",
    points: 10,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      type: "MULTIPLE_CHOICE",
      question: "",
      description: "",
      options: ["", ""],
      correctAnswer: "",
      points: 10,
    });
  };

  const clearAll = () => {
    resetForm();
    setBulkExercises([]);
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
        options: ["", ""],
        correctAnswer: "",
      });
    }
  };

  const handleAddOption = () => {
    setFormData({ ...formData, options: [...formData.options, ""] });
  };

  const handleRemoveOption = (index: number) => {
    const optionToRemove = formData.options[index];
    const newOptions = formData.options.filter(
      (_: any, i: number) => i !== index,
    );
    let newCorrectAnswer = formData.correctAnswer;
    if (formData.correctAnswer === optionToRemove) newCorrectAnswer = "";

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
    if (formData.correctAnswer === oldOption) newCorrectAnswer = value;

    setFormData({
      ...formData,
      options: newOptions,
      correctAnswer: newCorrectAnswer,
    });
  };

  const validateForm = () => {
    if (!formData.title || !formData.question) return false;
    return formData.correctAnswer !== "";
  };

  const prepareExerciseData = (data: any) => ({ ...data });

  const handleNext = () => {
    if (!validateForm()) return;
    setBulkExercises([
      ...bulkExercises,
      {
        ...prepareExerciseData(formData),
        moduleId: Number(moduleId),
        lessonId: Number(lessonId),
        order: bulkExercises.length + 1,
      },
    ]);
    resetForm();
  };

  const handleFinalSubmit = () => {
    let finalDtos = [...bulkExercises];
    if (validateForm()) {
      finalDtos.push({
        ...prepareExerciseData(formData),
        moduleId: Number(moduleId),
        lessonId: Number(lessonId),
        order: finalDtos.length + 1,
      });
    }
    if (finalDtos.length === 0) return;
    onAddBulk({ dtos: finalDtos });
  };

  const handleClose = () => {
    clearAll();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] p-0 border-none rounded-3xl overflow-hidden bg-white max-h-[95vh] flex flex-col">
        {/* Header Section */}
        <div className="p-6 pb-2 flex justify-between items-start">
          <div className="space-y-1">
            <DialogTitle className="text-xl font-bold text-slate-900">
              Add Exercise
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Create a multiple-choice question for this lesson.
            </DialogDescription>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4 space-y-6">
          {/* Bulk Collection Badge - Integrated discreetly */}
          {bulkExercises.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <span className="text-[10px] font-black uppercase text-slate-400 w-full mb-1">
                Queue ({bulkExercises.length})
              </span>
              {bulkExercises.map((ex, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="bg-white border-slate-200 text-slate-600 flex gap-1 items-center py-1"
                >
                  #{idx + 1} {ex.title.substring(0, 10)}...
                  <Trash2
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={() =>
                      setBulkExercises(
                        bulkExercises.filter((_, i) => i !== idx),
                      )
                    }
                  />
                </Badge>
              ))}
            </div>
          )}

          {/* Type Selector - Keeping your logic but styling it minimally */}
          <div className="flex gap-2">
            {[
              { id: "MULTIPLE_CHOICE", icon: List, label: "Multiple Choice" },
              { id: "TRUE_FALSE", icon: CheckSquare, label: "True / False" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTypeChange(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-xs font-bold ${
                  formData.type === t.id
                    ? "bg-[#F5C07A]/10 border-[#F5C07A] text-[#d98e32]"
                    : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>

          {/* Title & Points */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-bold text-slate-800">
                Question Title
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Quiz 1"
                className="bg-white border-slate-200 h-12 rounded-xl focus-visible:ring-[#F5C07A]"
              />
            </div>
            <div className="w-24 space-y-2">
              <label className="text-sm font-bold text-slate-800 text-right block">
                Points
              </label>
              <Input
                type="number"
                value={formData.points}
                onChange={(e) =>
                  setFormData({ ...formData, points: parseInt(e.target.value) })
                }
                className="bg-white border-slate-200 h-12 rounded-xl text-center focus-visible:ring-[#F5C07A]"
              />
            </div>
          </div>

          {/* Question Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">Question</label>
            <textarea
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              placeholder="Enter the question..."
              className="w-full min-h-[100px] p-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#F5C07A] focus:border-transparent outline-none transition-all resize-none text-sm font-medium"
            />
          </div>

          {/* Options Section */}
          <div className="space-y-3 pb-4">
            <label className="text-sm font-bold text-slate-800 block">
              Options —{" "}
              <span className="font-normal text-slate-500">
                select the correct answer
              </span>
            </label>

            <div className="space-y-3">
              {formData.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div
                    onClick={() =>
                      setFormData({ ...formData, correctAnswer: option })
                    }
                    className={`w-5 h-5 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all flex-shrink-0 ${
                      formData.correctAnswer === option && option !== ""
                        ? "border-[#F59E0B] bg-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {formData.correctAnswer === option && option !== "" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-400 w-4">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <div className="flex-1 relative">
                    <Input
                      value={option}
                      disabled={formData.type === "TRUE_FALSE"}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      className="bg-white border-slate-200 h-12 rounded-xl focus-visible:ring-[#F5C07A] pr-10"
                    />
                    {formData.type === "MULTIPLE_CHOICE" &&
                      formData.options.length > 2 && (
                        <button
                          onClick={() => handleRemoveOption(index)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>

            {formData.type === "MULTIPLE_CHOICE" && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAddOption}
                className="mt-2 border-slate-200 text-slate-900 font-bold rounded-xl h-12 px-6 flex items-center gap-2 hover:bg-slate-50"
              >
                <Plus className="w-4 h-4" /> Add Option
              </Button>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 flex justify-between items-center bg-white border-t border-slate-50">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="font-bold text-slate-400 hover:text-slate-600 rounded-xl"
          >
            Cancel
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={!validateForm()}
              className="font-bold border-slate-200 text-slate-700 rounded-xl h-12 px-6"
            >
              Add & Next
            </Button>
            <Button
              onClick={handleFinalSubmit}
              disabled={
                isAdding || (bulkExercises.length === 0 && !validateForm())
              }
              className="bg-[#F5C07A] hover:bg-[#f0b05d] text-white font-bold rounded-xl h-12 px-8 shadow-sm transition-all border-none min-w-[140px]"
            >
              {isAdding
                ? "Saving..."
                : bulkExercises.length > 0
                  ? `Finish (${bulkExercises.length + (validateForm() ? 1 : 0)})`
                  : "Save Exercise"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
