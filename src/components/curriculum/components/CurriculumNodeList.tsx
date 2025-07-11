
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { CurriculumNode } from '@/types/curriculum/CurriculumNode';

interface CurriculumNodeListProps {
  filteredNodes: CurriculumNode[];
}

const CurriculumNodeList: React.FC<CurriculumNodeListProps> = ({ filteredNodes }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Curriculum Nodes ({filteredNodes.length} results)</CardTitle>
        <CardDescription>
          Browse and explore the curriculum structure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredNodes.map((node) => (
            <div key={node.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">
                      {node.nodeType.replace('_', ' ').toUpperCase()}
                    </Badge>
                    {node.countryCode && (
                      <Badge variant="outline">{node.countryCode}</Badge>
                    )}
                    {node.educationalLevel && (
                      <Badge variant="outline">Grade {node.educationalLevel}</Badge>
                    )}
                    {node.subjectName && (
                      <Badge variant="outline">{node.subjectName}</Badge>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-1">{node.name}</h3>
                  
                  {node.description && (
                    <p className="text-muted-foreground text-sm mb-2">
                      {node.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>ID: {node.id}</span>
                    {node.estimatedDuration && (
                      <span>{node.estimatedDuration}min</span>
                    )}
                    {node.tags && node.tags.length > 0 && (
                      <span>Tags: {node.tags.join(', ')}</span>
                    )}
                  </div>
                </div>
                
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {filteredNodes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No curriculum nodes found matching your filters.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurriculumNodeList;
