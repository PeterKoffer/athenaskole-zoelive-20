
import { toast } from "@/components/ui/use-toast";

export const showSpeechToast = (
  title: string,
  description?: string,
  variant: "success" | "destructive" | "default" = "default"
) => {
  // Only show error toasts to avoid confusing students with technical details
  if (variant === "destructive") {
    const mappedVariant: "destructive" | "default" = "destructive";
    toast({
      title: "Audio Issue",
      description: "There was a problem with audio playback.",
      variant: mappedVariant,
      duration: 3000,
    });
  }
  // Silently handle success and default toasts to avoid technical noise
};
