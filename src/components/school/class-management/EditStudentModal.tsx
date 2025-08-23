
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Student, Class } from "@/types/school";

// Props:
// - open: boolean
// - onClose: fn
// - student: Student & { classId?: string; grade?: string; currentStepId?: string; }
// - allClasses: Class[]
// - onSave: (updated: Partial<Student> & { classId?: string; grade?: string; currentStepId?: string; }) => void
const gradeOptions = [
  { value: "1", label: "1st Grade" },
  { value: "2", label: "2nd Grade" },
  { value: "3", label: "3rd Grade" },
  { value: "4", label: "4th Grade" },
  { value: "5", label: "5th Grade" },
  { value: "6", label: "6th Grade" },
  { value: "7", label: "7th Grade" },
  { value: "8", label: "8th Grade" },
  { value: "9", label: "9th Grade" },
  { value: "10", label: "10th Grade" },
  { value: "11", label: "11th Grade" },
  { value: "12", label: "12th Grade" },
];

const stepOptions = [
  { value: "1", label: "Step 1" },
  { value: "2", label: "Step 2" },
  { value: "3", label: "Step 3" },
];

interface EditStudentModalProps {
  open: boolean;
  onClose: () => void;
  student: Student & { classId?: string; grade?: string; currentStepId?: string; }; // extended
  allClasses: Class[];
  onSave: (partialUpdate: { classId?: string; grade?: string; currentStepId?: string }) => void;
}

const EditStudentModal = ({ open, onClose, student, allClasses, onSave }: EditStudentModalProps) => {
  const [form, setForm] = useState({
    classId: student.classId || "",
    grade: student.grade?.toString() || "",
    currentStepId: student.currentStepId || "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xs md:max-w-md">
        <DialogHeader>
          <DialogTitle>Ret niveau for {student.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-200 mb-1">Klasse</label>
            <Select value={form.classId} onValueChange={v => handleChange("classId", v)}>
              <SelectTrigger className="bg-gray-700 border-gray-500 text-white">
                {form.classId 
                  ? allClasses.find(c => c.id === form.classId)?.name || form.classId
                  : "Vælg klasse"}
              </SelectTrigger>
              <SelectContent className="z-50 bg-gray-800 border-gray-700">
                {allClasses.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-gray-200 mb-1">Årgang / Trin</label>
            <Select value={form.grade} onValueChange={v => handleChange("grade", v)}>
              <SelectTrigger className="bg-gray-700 border-gray-500 text-white">
                {form.grade ? gradeOptions.find(o => o.value === form.grade)?.label : "Vælg årgang"}
              </SelectTrigger>
              <SelectContent className="z-50 bg-gray-800 border-gray-700">
                {gradeOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-gray-200 mb-1">Curriculum Step</label>
            <Select value={form.currentStepId} onValueChange={v => handleChange("currentStepId", v)}>
              <SelectTrigger className="bg-gray-700 border-gray-500 text-white">
                {form.currentStepId 
                  ? stepOptions.find(o => o.value === form.currentStepId)?.label
                  : "Vælg step"}
              </SelectTrigger>
              <SelectContent className="z-50 bg-gray-800 border-gray-700">
                {stepOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-200">Annuller</Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">Gem</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentModal;

