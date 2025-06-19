import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Table, Filter, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { format, parseISO, addDays, subDays } from "date-fns";
import { mockClasses, mockLessonCoverage, getLessonCoverageStats } from "@/data/mockLessonCoverage";
import { LessonCoverageFilters, LessonCoverage } from "@/types/lessonCoverage";
import LessonDetailsModal from "@/components/admin/LessonDetailsModal";

const LessonCoverageDisplay = () => {
  const [viewType, setViewType] = useState<'calendar' | 'table'>('table');
  const [selectedLesson, setSelectedLesson] = useState<LessonCoverage | null>(null);
  const [filters, setFilters] = useState<LessonCoverageFilters>({
    classId: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });

  const filteredCoverage = useMemo(() => {
    return mockLessonCoverage.filter(coverage => {
      if (filters.classId && filters.classId !== 'all' && coverage.classId !== filters.classId) {
        return false;
      }
      if (filters.status && filters.status !== 'all' && coverage.status !== filters.status) {
        return false;
      }
      if (filters.dateFrom && coverage.date < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && coverage.date > filters.dateTo) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const stats = useMemo(() => getLessonCoverageStats(filteredCoverage), [filteredCoverage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500';
      case 'missing':
        return 'bg-red-500';
      case 'incomplete':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'missing':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'incomplete':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  const uniqueDates = useMemo(() => {
    const dates = Array.from(new Set(filteredCoverage.map(c => c.date))).sort();
    return dates;
  }, [filteredCoverage]);

  const coverageByClassAndDate = useMemo(() => {
    const result: Record<string, Record<string, any>> = {};
    
    filteredCoverage.forEach(coverage => {
      if (!result[coverage.classId]) {
        result[coverage.classId] = {};
      }
      result[coverage.classId][coverage.date] = coverage;
    });
    
    return result;
  }, [filteredCoverage]);

  return (
    <div className="space-y-6">
      <LessonDetailsModal 
        coverage={selectedLesson} 
        onClose={() => setSelectedLesson(null)} 
      />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Lesson Coverage Dashboard</h2>
        <div className="flex gap-2">
          <Button
            variant={viewType === 'table' ? 'default' : 'outline'}
            onClick={() => setViewType('table')}
            size="sm"
          >
            <Table className="w-4 h-4 mr-2" />
            Table View
          </Button>
          <Button
            variant={viewType === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewType('calendar')}
            size="sm"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Calendar View
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Coverage Rate</p>
                <p className="text-2xl font-bold text-white">{stats.coveragePercentage}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Present Lessons</p>
                <p className="text-2xl font-bold text-green-400">{stats.presentLessons}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Missing Lessons</p>
                <p className="text-2xl font-bold text-red-400">{stats.missingLessons}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Incomplete</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.incompleteLessons}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Class</label>
              <Select value={filters.classId || 'all'} onValueChange={(value) => setFilters({...filters, classId: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {mockClasses.map(classItem => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Status</label>
              <Select value={filters.status || 'all'} onValueChange={(value) => setFilters({...filters, status: value as any})}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="missing">Missing</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-2 block">From Date</label>
              <input
                type="date"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                value={filters.dateFrom || ''}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-2 block">To Date</label>
              <input
                type="date"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                value={filters.dateTo || ''}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coverage Display */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Lesson Coverage {viewType === 'calendar' ? 'Calendar' : 'Table'} 
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewType === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 p-2">Class</th>
                    {uniqueDates.map(date => (
                      <th key={date} className="text-center text-gray-400 p-2 min-w-24">
                        {format(parseISO(date), 'MMM dd')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockClasses
                    .filter(classItem => !filters.classId || filters.classId === 'all' || classItem.id === filters.classId)
                    .map(classItem => (
                    <tr key={classItem.id} className="border-b border-gray-700">
                      <td className="p-2">
                        <div>
                          <div className="text-white font-medium">{classItem.name}</div>
                          <div className="text-sm text-gray-400">{classItem.teacher}</div>
                        </div>
                      </td>
                      {uniqueDates.map(date => {
                        const coverage = coverageByClassAndDate[classItem.id]?.[date];
                        const dayOfWeek = parseISO(date).getDay();
                        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                        
                        return (
                          <td key={date} className="p-2 text-center">
                            {isWeekend ? (
                              <div className="w-6 h-6 rounded-full bg-gray-700 mx-auto flex items-center justify-center">
                                <span className="text-xs text-gray-500">-</span>
                              </div>
                            ) : coverage ? (
                              <div className="flex flex-col items-center">
                                <button
                                  className={`w-6 h-6 rounded-full ${getStatusColor(coverage.status)} flex items-center justify-center hover:scale-110 transition-transform cursor-pointer`}
                                  onClick={() => setSelectedLesson(coverage)}
                                  title="Click for details"
                                >
                                  {getStatusIcon(coverage.status)}
                                </button>
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {coverage.status}
                                </Badge>
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gray-600 mx-auto" title="No lesson scheduled"></div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Calendar View Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockClasses
                  .filter(classItem => !filters.classId || filters.classId === 'all' || classItem.id === filters.classId)
                  .map(classItem => (
                  <Card key={classItem.id} className="bg-gray-700 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center justify-between">
                        <span>{classItem.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {classItem.subject}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-400">{classItem.teacher} • {classItem.students} students</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-white">Recent Lesson Coverage</h4>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                            <div key={index} className="text-center text-xs text-gray-400 p-1">
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: 14 }, (_, index) => {
                            const date = format(addDays(subDays(new Date(), 13), index), 'yyyy-MM-dd');
                            const coverage = coverageByClassAndDate[classItem.id]?.[date];
                            const dayOfWeek = parseISO(date).getDay();
                            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                            
                            return (
                              <div
                                key={date}
                                className={`
                                  h-8 w-8 rounded border flex items-center justify-center text-xs cursor-pointer hover:scale-110 transition-transform
                                  ${isWeekend ? 'bg-gray-800 border-gray-600' : 'bg-gray-600 border-gray-500'}
                                  ${coverage ? getStatusColor(coverage.status) : ''}
                                `}
                                title={`${format(parseISO(date), 'MMM dd')} - ${coverage ? coverage.status : isWeekend ? 'Weekend' : 'No lesson scheduled'}`}
                                onClick={() => coverage && setSelectedLesson(coverage)}
                              >
                                {coverage ? (
                                  <div className="w-full h-full rounded flex items-center justify-center">
                                    {coverage.status === 'present' && <CheckCircle className="w-3 h-3 text-white" />}
                                    {coverage.status === 'missing' && <AlertTriangle className="w-3 h-3 text-white" />}
                                    {coverage.status === 'incomplete' && <AlertTriangle className="w-3 h-3 text-white" />}
                                  </div>
                                ) : (
                                  <span className={`${isWeekend ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {parseISO(date).getDate()}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Summary for this class */}
                        <div className="mt-4 pt-3 border-t border-gray-600">
                          <div className="flex justify-between text-xs">
                            <span className="text-green-400">
                              Present: {filteredCoverage.filter(c => c.classId === classItem.id && c.status === 'present').length}
                            </span>
                            <span className="text-red-400">
                              Missing: {filteredCoverage.filter(c => c.classId === classItem.id && c.status === 'missing').length}
                            </span>
                            <span className="text-yellow-400">
                              Incomplete: {filteredCoverage.filter(c => c.classId === classItem.id && c.status === 'incomplete').length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Legend */}
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <h4 className="text-white font-medium mb-3">Legend</h4>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-500"></div>
                      <span className="text-sm text-gray-300">Lesson Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-yellow-500"></div>
                      <span className="text-sm text-gray-300">Lesson Incomplete</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-500"></div>
                      <span className="text-sm text-gray-300">Lesson Missing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gray-600 border border-gray-500"></div>
                      <span className="text-sm text-gray-300">Weekend/No Data</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonCoverageDisplay;