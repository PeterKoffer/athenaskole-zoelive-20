import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CurriculumEditorPage from '@/pages/CurriculumEditorPage';

const CurriculumEditorModal: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full">Manage Lessons</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Curriculum Editor</DialogTitle>
        </DialogHeader>
        <CurriculumEditorPage />
      </DialogContent>
    </Dialog>
  );
};

export default CurriculumEditorModal;
