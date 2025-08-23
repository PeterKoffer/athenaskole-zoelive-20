import React from 'react';

interface Props {
  onSubjectSelect: (subject: string, skillArea: string) => void;
  selectedMode?: any;
}

const SubjectSelector: React.FC<Props> = ({ onSubjectSelect }) => {
  return (
    <div className="p-6 border rounded space-y-2">
      <h2 className="font-semibold">Select Subject</h2>
      <div className="flex gap-2">
        <button className="px-3 py-2 border rounded" onClick={() => onSubjectSelect('mathematics', 'general')}>Mathematics</button>
        <button className="px-3 py-2 border rounded" onClick={() => onSubjectSelect('english', 'reading')}>English</button>
      </div>
    </div>
  );
};

export default SubjectSelector;
