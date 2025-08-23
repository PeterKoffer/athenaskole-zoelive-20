import { logEvent } from "@/services/telemetry/events";
import { bump } from "./interestProfile";

export type InterestTag =
  | "food" | "animals" | "sports" | "music" | "fashion" | "coding" | "space"
  | "weather" | "history" | "law" | "art" | "film" | "robots" | "cars"
  | "finance" | "cooking" | "travel" | "nature" | "gaming" | "health"
  | "mathematics" | "science" | "languages" | "technology" | "geography"
  | "general" | "adventure";

export function emitInterest(tag: InterestTag, weight = 1, source = "ui") {
  // Update local profile immediately
  bump(tag, weight);
  
  // Log to telemetry for analytics
  return logEvent("interest_signal", { tag, weight, source });
}

export function emitMultipleInterests(tags: InterestTag[], weight = 1, source = "ui") {
  tags.forEach(tag => emitInterest(tag, weight, source));
}