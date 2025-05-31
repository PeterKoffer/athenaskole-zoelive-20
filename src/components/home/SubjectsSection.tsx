
import { Card, CardContent } from "@/components/ui/card";

const SubjectsSection = () => {
  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-white">
          What can you learn?
        </h2>
        <p className="text-gray-400">
          Explore a wide range of subjects and skills.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h3 className="text-xl font-bold text-white mb-2">English</h3>
            <p className="text-gray-300">
              Strengthen your language skills with personal guidance from Athena.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h3 className="text-xl font-bold text-white mb-2">Math</h3>
            <p className="text-gray-300">
              Master mathematics through interactive exercises and practice.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h3 className="text-xl font-bold text-white mb-2">Science</h3>
            <p className="text-gray-300">
              Learn science in a fun and engaging way.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SubjectsSection;
