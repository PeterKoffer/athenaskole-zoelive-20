import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Globe, Lock } from "lucide-react";
import { resolveLearnerGrade, gradeToBand } from '@/lib/grade';
import { UserMetadata } from '@/types/auth';

interface Universe {
  id: string;
  title: string;
  subject: string;
  grade_level: string;
  slug: string;
  visibility: string;
  image_url?: string | null;
  image_status: string;
  created_at: string;
}

export default function MyUniverses() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  useEffect(() => {
    async function fetchUniverses() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('universes')
          .select('id, title, slug, subject, grade_level, visibility, image_url, image_status, created_at')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching universes:', error);
          return;
        }

        setUniverses(data || []);
      } catch (err) {
        console.error('Failed to fetch universes:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUniverses();
  }, [user]);

  const getImageUrl = (universe: Universe) => {
    if (universe.image_url) {
      return universe.image_url;
    }
    return `${supabase.storage.from('universe-images').getPublicUrl(`${universe.id}.png`).data.publicUrl}`;
  };

  const getImageStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="text-xs">Pending</Badge>;
      case 'locked':
        return <Badge variant="outline" className="text-xs">Locked</Badge>;
      case 'ready':
        return null;
      case 'failed':
        return <Badge variant="destructive" className="text-xs">Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Fallback</Badge>;
    }
  };

  const subjects = Array.from(new Set(universes.map(u => u.subject)));

  const filteredUniverses = universes.filter(universe => {
    const matchesSearch = universe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         universe.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || universe.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground">Please sign in to view your universes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Universes</h1>
        <Button onClick={() => navigate('/create-universe')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Universe
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search universes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map(subject => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading your universes...</div>
      ) : filteredUniverses.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">
            {searchTerm || filterSubject !== 'all' ? 'No matching universes' : 'No universes yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterSubject !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first universe to get started!'
            }
          </p>
          {(!searchTerm && filterSubject === 'all') && (
            <Button onClick={() => navigate('/create-universe')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Universe
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUniverses.map((universe) => (
            <Card 
              key={universe.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/u/${universe.slug}`)}
            >
              <CardHeader className="pb-3">
                <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                  <img
                    src={getImageUrl(universe)}
                    alt={universe.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/300x169/e5e7eb/6b7280?text=${encodeURIComponent(universe.subject)}`;
                    }}
                  />
                </div>
                <CardTitle className="text-lg line-clamp-2">{universe.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{universe.subject}</Badge>
                  <Badge variant="outline">{(() => {
                    const metadata = user?.user_metadata as UserMetadata | undefined;
                    const learnerGrade = resolveLearnerGrade(metadata?.grade_level, metadata?.age);
                    const band = gradeToBand(learnerGrade);
                    return band;
                  })()}</Badge>
                  {getImageStatusBadge(universe.image_status)}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {universe.visibility === 'public' ? (
                      <>
                        <Globe className="w-3 h-3" />
                        <span>Public</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Private</span>
                      </>
                    )}
                  </div>
                  <span>{new Date(universe.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}