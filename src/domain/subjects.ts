export type SubjectId =
  | 'native-language' | 'mathematics' | 'language-lab' | 'science'
  | 'history-religion' | 'geography' | 'computer-tech' | 'creative-arts'
  | 'music' | 'physical-education' | 'mental-wellness' | 'life-essentials';

export const SUBJECTS: Record<SubjectId, { id: SubjectId; i18nKey: string }> = {
  'native-language':     { id: 'native-language',     i18nKey: 'subjects.nativeLanguage' },
  'mathematics':         { id: 'mathematics',         i18nKey: 'subjects.mathematics' },
  'language-lab':        { id: 'language-lab',        i18nKey: 'subjects.languageLab' },
  'science':             { id: 'science',             i18nKey: 'subjects.science' },
  'history-religion':    { id: 'history-religion',    i18nKey: 'subjects.historyReligion' },
  'geography':           { id: 'geography',           i18nKey: 'subjects.geography' },
  'computer-tech':       { id: 'computer-tech',       i18nKey: 'subjects.computerTech' },
  'creative-arts':       { id: 'creative-arts',       i18nKey: 'subjects.creativeArts' },
  'music':               { id: 'music',               i18nKey: 'subjects.music' },
  'physical-education':  { id: 'physical-education',  i18nKey: 'subjects.physicalEducation' },
  'mental-wellness':     { id: 'mental-wellness',     i18nKey: 'subjects.mentalWellness' },
  'life-essentials':     { id: 'life-essentials',     i18nKey: 'subjects.lifeEssentials' },
};
