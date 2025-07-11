
import React, { useState, useEffect } from 'react';
import CurriculumStats from './components/CurriculumStats';
import CurriculumFilters from './components/CurriculumFilters';
import CurriculumNodeList from './components/CurriculumNodeList';
import { useCurriculumData } from './hooks/useCurriculumData';

const CurriculumDashboard: React.FC = () => {
  const { nodes, filteredNodes, loading, stats, loadData, applyFilters } = useCurriculumData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedNodeType, setSelectedNodeType] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    applyFilters({
      searchTerm,
      selectedCountry,
      selectedNodeType,
      selectedSubject
    });
  }, [applyFilters, searchTerm, selectedCountry, selectedNodeType, selectedSubject]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCountry('');
    setSelectedNodeType('');
    setSelectedSubject('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading curriculum data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stats && <CurriculumStats stats={stats} />}
      
      <CurriculumFilters
        searchTerm={searchTerm}
        selectedCountry={selectedCountry}
        selectedNodeType={selectedNodeType}
        selectedSubject={selectedSubject}
        nodes={nodes}
        onSearchTermChange={setSearchTerm}
        onCountryChange={setSelectedCountry}
        onNodeTypeChange={setSelectedNodeType}
        onSubjectChange={setSelectedSubject}
        onClearFilters={clearFilters}
      />

      <CurriculumNodeList filteredNodes={filteredNodes} />
    </div>
  );
};

export default CurriculumDashboard;
