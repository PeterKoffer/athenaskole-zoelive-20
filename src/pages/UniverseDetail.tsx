import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Globe, Lock } from "lucide-react";
import { resolveLearnerGrade } from '@/lib/grade';
import { UserMetadata } from '@/types/auth';

interface Universe {
  id: string;
  title: string;
  subject: string;
  grade_level: string;
  lang: string;
  description?: string | null;
  visibility: string;
  image_url?: string | null;
  image_status: string;
  owner_id: string;
  created_at: string;
}

export default function UniverseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchUniverse() {
      if (!slug || !user) return;

      try {
        const { data, error } = await supabase
          .from('universes')
          .select('*')
          .eq('slug', slug)
          .maybeSingle(); // respects RLS: owner or visibility='public'

        if (error) {
          setError(error.message);
          return;
        }

        if (!data) {
          setError('Universe not found or access denied');
          return;
        }

        setUniverse(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load universe');
      } finally {
        setLoading(false);
      }
    }

    fetchUniverse();
  }, [slug, user]);

  const handleVisibilityToggle = async (isPublic: boolean) => {
    if (!universe || !user || universe.owner_id !== user.id) return;

    setUpdating(true);
    try {
      const newVisibility = isPublic ? 'public' : 'private';
      
      const { data, error } = await supabase
        .from('universes')
        .update({ visibility: newVisibility })
        .eq('id', universe.id)
        .select('visibility')
        .single(); // race-free update

      if (error) throw error;

      setUniverse({ ...universe, visibility: data.visibility });
      toast({
        title: "Visibility updated",
        description: `Universe is now ${newVisibility}`,
      });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getImageUrl = () => {
    if (universe?.image_url) {
      return `${universe.image_url}?v=${Date.now()}`; // cache-bust when swapping
    }
    // Initial fallback URL
    return `${supabase.storage.from('universe-images').getPublicUrl(`${universe?.id}.png`).data.publicUrl}`;
  };

  const getImageStatusBadge = () => {
    if (!universe) return null;
    
    switch (universe.image_status) {
      case 'pending':
        return <Badge variant="secondary">Image: Pending</Badge>;
      case 'locked':
        return <Badge variant="outline">AI Images Locked</Badge>;
      case 'ready':
        return null;
      case 'failed':
        return <Badge variant="destructive">Image: Failed</Badge>;
      default:
        return <Badge variant="outline">Image: Fallback</Badge>;
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground">Please sign in to view this universe.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading universe...</div>
      </div>
    );
  }

  if (error || !universe) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-destructive">Universe Not Found</h2>
          <p className="text-muted-foreground mb-4">{error || 'This universe may be private or does not exist.'}</p>
          <Button onClick={() => navigate('/universes')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Universes
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = user.id === universe.owner_id;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/universes')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Universes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2">{universe.title}</CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{universe.subject}</Badge>
                <Badge variant="outline">Grade {(() => {
                  const metadata = user?.user_metadata as UserMetadata | undefined;
                  const learnerGrade = resolveLearnerGrade(metadata?.grade_level, metadata?.age);
                  return learnerGrade;
                })()}</Badge>
                <Badge variant="outline">{universe.lang}</Badge>
                {getImageStatusBadge()}
              </div>
              <div className="flex items-center gap-2">
                {universe.visibility === 'public' ? (
                  <Badge variant="default">
                    <Globe className="w-3 h-3 mr-1" />
                    Public
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <Lock className="w-3 h-3 mr-1" />
                    Private
                  </Badge>
                )}
              </div>
            </div>
            
            {isOwner && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="visibility-toggle">Public</Label>
                <Switch
                  id="visibility-toggle"
                  checked={universe.visibility === 'public'}
                  onCheckedChange={handleVisibilityToggle}
                  disabled={updating}
                />
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img
                src={getImageUrl()}
                alt={universe.title}
                className="w-full aspect-video object-cover rounded-lg bg-muted"
                onError={(e) => {
                  // Fallback to subject-based placeholder
                  e.currentTarget.src = `https://via.placeholder.com/400x225/e5e7eb/6b7280?text=${encodeURIComponent(universe.subject)}`;
                }}
              />
            </div>
            
            <div>
              {universe.description && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{universe.description}</p>
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Details</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Created: {new Date(universe.created_at).toLocaleDateString()}</p>
                  <p>Language: {universe.lang}</p>
                  <p>ID: {universe.id}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="lg" className="flex-1">
                  Start Learning
                </Button>
                {isOwner && (
                  <Button variant="outline">
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}