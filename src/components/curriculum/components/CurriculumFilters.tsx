
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';
import { CurriculumNode } from '@/types/curriculum/CurriculumNode';

interface CurriculumFiltersProps {
  searchTerm: string;
  selectedCountry: string;
  selectedNodeType: string;
  selectedSubject: string;
  nodes: CurriculumNode[];
  onSearchTermChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onNodeTypeChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onClearFilters: () => void;
}

const CurriculumFilters: React.FC<CurriculumFiltersProps> = ({
  searchTerm,
  selectedCountry,
  selectedNodeType,
  selectedSubject,
  nodes,
  onSearchTermChange,
  onCountryChange,
  onNodeTypeChange,
  onSubjectChange,
  onClearFilters
}) => {
  const getUniqueStringValues = (field: keyof CurriculumNode): string[] => {
    return [...new Set(
      nodes
        .map(node => node[field])
        .filter((value): value is string => typeof value === 'string' && value !== null && value !== undefined)
    )];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
        <CardDescription>
          Filter and search through the curriculum data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search curriculum nodes..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedCountry} onValueChange={onCountryChange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Countries</SelectItem>
              {getUniqueStringValues('countryCode').map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedNodeType} onValueChange={onNodeTypeChange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              {getUniqueStringValues('nodeType').map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace('_', ' ').toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSubject} onValueChange={onSubjectChange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Subjects</SelectItem>
              {getUniqueStringValues('subjectName').map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={onClearFilters} variant="outline">
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurriculumFilters;
