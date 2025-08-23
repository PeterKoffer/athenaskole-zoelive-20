// src/utils/curriculumTargets.dk.ts
// Beskrivende Fælles Mål-mapping (kan erstattes med eksakte koder senere).
export const DK_TARGETS: Record<string, Record<string, string[]>> = {
  "3-5": {
    Danish: [
      "FM: Læsning – afkodning & læseforståelse",
      "FM: Mundtlig fremstilling – struktur og respons",
      "FM: Skrivning – genre, formål og modtager"
    ],
    Mathematics: [
      "FM: Tal & algebra – brøker og procent",
      "FM: Geometri – vinkler, figurer og måling",
      "FM: Statistik – dataindsamling og diagrammer"
    ],
    // Natur/teknologi benævnes ofte 'Science' i appen – støt begge nøgler.
    Science: [
      "FM: Undersøgelser – planlæg, gennemfør, konkludér",
      "FM: Økosystemer – sammenhænge og energistrømme",
      "FM: Energi – kilder og omdannelser"
    ],
    "Natur/teknologi": [
      "FM: Undersøgelser – planlæg, gennemfør, konkludér",
      "FM: Økosystemer – sammenhænge og energistrømme",
      "FM: Energi – kilder og omdannelser"
    ]
  },
  "6-8": {
    Danish: [
      "FM: Læsning – argumentation & kildevurdering",
      "FM: Sprog & stil – virkemidler og retorik",
      "FM: Skrivning – disposition, revision og genrekrav"
    ],
    Mathematics: [
      "FM: Ligninger & udtryk – algebraisk tænkning",
      "FM: Funktioner – grafer og sammenhænge",
      "FM: Sandsynlighed/Statistik – chance og data"
    ],
    Science: [
      "FM: Biologi – celler, tilpasning og økologi",
      "FM: Fysik/Kemi – stof, reaktioner og energi",
      "FM: Geografi – naturgrundlag, kort og globale mønstre"
    ],
    "Naturfag": [
      "FM: Biologi – celler, tilpasning og økologi",
      "FM: Fysik/Kemi – stof, reaktioner og energi",
      "FM: Geografi – naturgrundlag, kort og globale mønstre"
    ]
  }
};
