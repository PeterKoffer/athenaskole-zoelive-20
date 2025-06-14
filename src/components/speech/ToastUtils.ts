
import { toast } from "@/components/ui/use-toast";

export const showSpeechToast = (title: string, description?: string, variant: "success" | "destructive" | "default" = "default") => {
  toast({
    title,
    description,
    variant,
    duration: 5000,
  });
};
