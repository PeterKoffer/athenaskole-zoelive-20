
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LearnerProfile } from '@/types/learnerProfile';
import { KnowledgeComponent } from '@/types/knowledgeComponent';
import { AtomSequence } from '@/types/content';

interface DebugPanelProps {
  learnerProfile: LearnerProfile | null;
  currentKc: KnowledgeComponent | null;
  atomSequence: AtomSequence | null;
  currentAtomIndex: number;
  sessionKcs: KnowledgeComponent[];
  error: string | null;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  learnerProfile,
  currentKc,
  atomSequence,
  currentAtomIndex,
  sessionKcs,
  error
}) => {
  return (
    <Card className="bg-gray-800 border-gray-600 text-white mb-4">
      <CardHeader>
        <CardTitle className="text-sm">🔍 Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Badge variant={learnerProfile ? "default" : "destructive"}>
              Profile: {learnerProfile ? "✅ Loaded" : "❌ Missing"}
            </Badge>
          </div>
          <div>
            <Badge variant={currentKc ? "default" : "destructive"}>
              KC: {currentKc ? "✅ " + currentKc.name : "❌ None"}
            </Badge>
          </div>
          <div>
            <Badge variant={atomSequence ? "default" : "destructive"}>
              Sequence: {atomSequence ? `✅ ${atomSequence.atoms?.length || 0} atoms` : "❌ None"}
            </Badge>
          </div>
          <div>
            <Badge variant="outline">
              Session KCs: {sessionKcs.length}
            </Badge>
          </div>
        </div>
        
        {atomSequence && (
          <div className="bg-gray-700 p-2 rounded text-xs">
            <div>Current Atom: {currentAtomIndex + 1} / {atomSequence.atoms?.length || 0}</div>
            {atomSequence.atoms?.[currentAtomIndex] && (
              <div>Type: {atomSequence.atoms[currentAtomIndex].atom_type}</div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 p-2 rounded border border-red-500">
            <div className="font-semibold text-red-300">Error:</div>
            <div className="text-red-200">{error}</div>
          </div>
        )}

        {learnerProfile && (
          <div className="bg-blue-900/30 p-2 rounded text-xs">
            <div>User ID: {learnerProfile.userId}</div>
            <div>KC Mastery Map: {Object.keys(learnerProfile.kcMasteryMap || {}).length} entries</div>
          </div>
        )}
      </CardContent>        
    </Card>
  );
};

export default DebugPanel;
