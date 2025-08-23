import UniverseImage from "@/components/UniverseImage"; // eller relativ sti: ../components/UniverseImage

<UniverseImage
  universeId={universe.id}                // fx UUID for universet
  title={universe.title}                  // fx "Genetic Engineering Lab"
  subject={universe.subject ?? "Science"}
  grade={universe.gradeLevel ?? 6}
/>

