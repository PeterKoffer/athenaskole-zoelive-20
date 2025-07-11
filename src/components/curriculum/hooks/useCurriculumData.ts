
import { useState, useCallback } from 'react';
import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { curriculumService } from '@/services/curriculum/CurriculumService';

export const useCurriculumData = () => {
  const [nodes, setNodes] = useState<CurriculumNode[]>([]);
  const [filteredNodes, setFilteredNodes] = useState<CurriculumNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [allNodes, curriculumStats] = await Promise.all([
        curriculumService.getNodes(),
        curriculumService.getStats()
      ]);
      setNodes(allNodes);
      setStats(curriculumStats);
    } catch (error) {
      console.error('Error loading curriculum data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(async (filters: {
    searchTerm?: string;
    selectedCountry?: string;
    selectedNodeType?: string;
    selectedSubject?: string;
  }) => {
    const filterParams: any = {};
    
    if (filters.selectedCountry) filterParams.countryCode = filters.selectedCountry;
    if (filters.selectedNodeType) filterParams.nodeType = filters.selectedNodeType;
    if (filters.selectedSubject) filterParams.subjectName = filters.selectedSubject;
    if (filters.searchTerm) filterParams.nameContains = filters.searchTerm;

    const filtered = await curriculumService.getNodes(filterParams);
    setFilteredNodes(filtered);
  }, []);

  return {
    nodes,
    filteredNodes,
    loading,
    stats,
    loadData,
    applyFilters
  };
};
