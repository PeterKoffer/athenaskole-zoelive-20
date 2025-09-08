import { useNavigate } from "react-router-dom";
// ...

const navigate = useNavigate();

// Eksempel på dine kortdata:
const scenarios = [
  {
    id: "fraction-adventure",
    title: "Fraction Adventure",
    subject: "Mathematics",
    description: "Help a baker divide pizzas equally among customers…",
    gradeRange: "3-5",
  },
  {
    id: "ecosystem-explorer",
    title: "Ecosystem Explorer",
    subject: "Science",
    description: "Discover how animals and plants depend on each other…",
    gradeRange: "4-6",
  },
];

// Din elev-/klassekontekst (hent den rigtigt hos dig – her er placeholders)
const context = {
  grade: 5,
  curriculum: "DK/Fælles Mål 2024",
  ability: "core",
  learningStyle: "mixed",
  interests: ["baking", "nature"],
  // + de resterende parametre du i forvejen har i state/store
};

function onStartScenario(s: (typeof scenarios)[number]) {
  navigate(`/scenario/${s.id}`, { state: { scenario: s, context } });
}

// … inde i dit kort
<button
  className="rounded-md bg-blue-600 px-4 py-2 text-white"
  onClick={() => onStartScenario(s)}
>
  Start Scenario
</button>
