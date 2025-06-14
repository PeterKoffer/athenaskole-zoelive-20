
import { toast } from "@/components/ui/use-toast";

export const showSpeechToast = (
  title: string,
  description?: string,
  variant: "success" | "destructive" | "default" = "default"
) => {
  // Map "success" to "default" due to allowed type restriction
  const mappedVariant: "destructive" | "default" =
    variant === "success" ? "default" : variant;
  toast({
    title,
    description,
    variant: mappedVariant,
    duration: 5000,
  });
};
