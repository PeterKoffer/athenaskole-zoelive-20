
import { useNavigate } from "react-router-dom";
import { subjects } from "./SubjectsData";
import SubjectCard from "./subject-card/SubjectCard";

const SubjectsSection = () => {
  const navigate = useNavigate();

  const handleStartLearning = (path: string) => {
    console.log(`🚀 Starting learning for path: ${path}`);
    navigate(path);
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose Your Learning Adventure
          </h2>
          <p className="text-xl text-white/80">
            Dive into interactive lessons tailored to your learning style
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {subjects.map((subject, index) => (
            <SubjectCard
              key={index}
              subject={subject}
              index={index}
              onStartLearning={handleStartLearning}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
