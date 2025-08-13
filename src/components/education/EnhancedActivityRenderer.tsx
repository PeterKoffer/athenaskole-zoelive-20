import { useEduLocalization } from "@/hooks/useEduLocalization";

interface Activity {
  id: string;
  title: string;
  instructions: string;
  materials?: string[];
  timeMinutes: number;
  metadata?: {
    price?: number;
    distance?: number;
    temperature?: number;
  };
}

interface Props {
  activity: Activity;
  profile?: {
    country_code?: string | null;
    locale?: string | null;
    currency_code?: string | null;
    measurement_system?: string | null;
    curriculum_code?: string | null;
  };
}

export function EnhancedActivityRenderer({ activity, profile }: Props) {
  const { formatters, applyTokens } = useEduLocalization(profile);

  // Apply educational tokens to text content
  const localizedInstructions = applyTokens(activity.instructions);
  const localizedTitle = applyTokens(activity.title);

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
              <li key={index}>{applyTokens(material)}</li>
            ))}
          </ul>
        </div>
      )}

      {activity.metadata && (
        <div className="border-t pt-4 space-y-2 text-sm">
          {activity.metadata.price && (
            <div>Estimated cost: {formatters.currency(activity.metadata.price)}</div>
          )}
          {activity.metadata.distance && (
            <div>Distance: {formatters.distanceKm(activity.metadata.distance)}</div>
          )}
          {activity.metadata.temperature && (
            <div>Temperature: {formatters.temperature(activity.metadata.temperature)}</div>
          )}
        </div>
      )}
    </div>
  );
}