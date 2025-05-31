
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KeyMetricsSection from "./analytics/KeyMetricsSection";
import PerformanceTab from "./analytics/PerformanceTab";
import EngagementTab from "./analytics/EngagementTab";
import SubjectsTab from "./analytics/SubjectsTab";
import TrendsTab from "./analytics/TrendsTab";

const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <KeyMetricsSection />

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="performance" className="data-[state=active]:bg-gray-700">Performance</TabsTrigger>
          <TabsTrigger value="engagement" className="data-[state=active]:bg-gray-700">Engagement</TabsTrigger>
          <TabsTrigger value="subjects" className="data-[state=active]:bg-gray-700">Subject Analysis</TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-gray-700">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceTab />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <EngagementTab />
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <SubjectsTab />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <TrendsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
