import React from "react";
import { getEffectiveEduContext } from "@/services/edu/effectiveContext";
import { loadStudentProfileEdu, loadTeacherOverrides, loadClassOverrides } from "@/services/edu/loadOverrides";
import { fmtCurrency, fmtDistanceKm, fmtTemperatureC } from "@/services/edu/format";
import { applyEduTokens } from "@/services/edu/textTokens";
import type { EduContext } from "@/services/edu/locale";

function useEduContext(classId?: string) {
  const [edu, setEdu] = React.useState<EduContext | null>(null);
  React.useEffect(() => {
    (async () => {
      const [student, teacher, cls] = await Promise.all([
        loadStudentProfileEdu(),
        loadTeacherOverrides(),
        loadClassOverrides(classId),
      ]);
      setEdu(getEffectiveEduContext({
        studentProfile: student,
        teacherOverrides: teacher,
        classOverrides: cls,
        cacheKey: `edu:${classId ?? "no-class"}`
      }));
    })();
  }, [classId]);
  return edu;
}

interface Activity {
  id: string;
  title: string;
  instructions: string;
  materials?: string[];
  timeMinutes: number;
  classId?: string;
  metadata?: {
    price?: number;
    distance?: number;
    temperature?: number;
  };
}

interface Props {
  activity: Activity;
}

export function EnhancedActivityRenderer({ activity }: Props) {
  const edu = useEduContext(activity.classId);
  
  if (!edu) return null;

  // Apply educational tokens to text content
  const localizedInstructions = applyEduTokens(activity.instructions, edu);
  const localizedTitle = applyEduTokens(activity.title, edu);

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold">{localizedTitle}</h3>
      
      <div className="text-sm text-muted-foreground">
        Duration: {activity.timeMinutes} minutes
      </div>

      <div className="prose prose-sm">
        <p>{localizedInstructions}</p>
      </div>

      {activity.materials && activity.materials.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Materials:</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {activity.materials.map((material, index) => (
              <li key={index}>{applyEduTokens(material, edu)}</li>
            ))}
          </ul>
        </div>
      )}

      {activity.metadata && (
        <div className="border-t pt-4 space-y-2 text-sm">
          {activity.metadata.price && (
            <div>Estimated cost: {fmtCurrency(activity.metadata.price, edu)}</div>
          )}
          {activity.metadata.distance && (
            <div>Distance: {fmtDistanceKm(activity.metadata.distance, edu)}</div>
          )}
          {activity.metadata.temperature && (
            <div>Temperature: {fmtTemperatureC(activity.metadata.temperature, edu)}</div>
          )}
        </div>
      )}
    </div>
  );
}