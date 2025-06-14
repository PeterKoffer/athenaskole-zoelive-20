
import { useMemo } from 'react';
import { ClassroomConfig } from '../ClassroomEnvironment';
import { getClassroomConfig } from '../classroomConfigs';

export const useClassroomEnvironment = (subject: string): ClassroomConfig => {
  return useMemo(() => getClassroomConfig(subject), [subject]);
};
