
import { Card, CardContent } from "@/components/ui/card";

const SubjectsSection = () => {
  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-white">
          Hvad kan du lære?
        </h2>
        <p className="text-gray-400">
          Udforsk et bredt udvalg af fag og sprog.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h3 className="text-xl font-bold text-white mb-2">Dansk</h3>
            <p className="text-gray-300">
              Styrk dit sprog med personlig vejledning fra Nelie.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h3 className="text-xl font-bold text-white mb-2">Engelsk</h3>
            <p className="text-gray-300">
              Bliv flydende i engelsk gennem interaktive øvelser.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h3 className="text-xl font-bold text-white mb-2">Matematik</h3>
            <p className="text-gray-300">
              Lær matematik på en sjov og engagerende måde.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SubjectsSection;
