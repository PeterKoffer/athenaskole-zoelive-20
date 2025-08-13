import { useMemo, useState } from "react";
import { UniversePacks } from "@/content/universe.catalog";
import { setSchoolTimezone, getPinnedWeek, pinWeek } from "@/services/universe/offlineScheduler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, GlobeIcon, PinIcon, PinOffIcon } from "lucide-react";
import { toast } from "sonner";

const ALL_TZS = (Intl as any).supportedValuesOf ? (Intl as any).supportedValuesOf("timeZone") as string[]
  : ["UTC","Europe/Copenhagen","America/New_York","Asia/Tokyo","Australia/Sydney"];

export default function UniverseAdminPage() {
  // In your app these come from auth/context/route
  const [schoolId] = useState<string>("demo-school");
  const [classId, setClassId] = useState<string>("demo-class-A");

  const [tz, setTz] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const pinned = useMemo(() => getPinnedWeek(classId), [classId]);
  const [packId, setPackId] = useState<string>(pinned?.packId ?? UniversePacks[0].id);
  const [startISO, setStartISO] = useState<string>(pinned?.startISO ?? new Date().toISOString().slice(0,10));
  const [endISO, setEndISO] = useState<string>(pinned?.endISO ?? new Date(Date.now()+4*86400000).toISOString().slice(0,10));

  const handleSaveTimezone = () => {
    setSchoolTimezone(schoolId, tz);
    toast.success(`Timezone set to ${tz}`);
  };

  const handlePinWeek = () => {
    pinWeek(classId, packId, startISO, endISO);
    toast.success("Universe week pinned successfully!");
  };

  const handleUnpin = () => {
    pinWeek(classId, "", "1900-01-01", "1900-01-02");
    toast.success("Universe week unpinned");
  };

  const selectedPack = UniversePacks.find(p => p.id === packId);

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Universe Scheduling Admin</h1>
        <p className="text-muted-foreground">
          Manage timezone settings and pin specific universe experiences to class schedules
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GlobeIcon className="h-5 w-5" />
            Daily Rollover Timezone
          </CardTitle>
          <CardDescription>
            Set when "today" resets for your school. This affects when students see new daily universes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Label htmlFor="timezone">School Timezone</Label>
              <Select value={tz} onValueChange={setTz}>
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_TZS.map(zone => (
                    <SelectItem key={zone} value={zone}>
                      {zone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveTimezone} className="shrink-0">
              Save Timezone
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PinIcon className="h-5 w-5" />
            Pin Universe to Week
          </CardTitle>
          <CardDescription>
            Override the random daily selection by pinning a specific universe to a date range.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classId">Class ID</Label>
              <Input
                id="classId"
                value={classId}
                onChange={e => setClassId(e.target.value)}
                placeholder="e.g., grade-6-math"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="universe">Universe Pack</Label>
              <Select value={packId} onValueChange={setPackId}>
                <SelectTrigger id="universe">
                  <SelectValue placeholder="Select universe" />
                </SelectTrigger>
                <SelectContent>
                  {UniversePacks.map(pack => (
                    <SelectItem key={pack.id} value={pack.id}>
                      <div className="flex flex-col items-start">
                        <span>{pack.title}</span>
                        <span className="text-xs text-muted-foreground">{pack.category}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startISO}
                onChange={e => setStartISO(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endISO}
                onChange={e => setEndISO(e.target.value)}
              />
            </div>
          </div>

          {selectedPack && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Selected Universe Preview</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Title:</strong> {selectedPack.title}</p>
                <p><strong>Category:</strong> {selectedPack.category}</p>
                <p><strong>Main Subject:</strong> {selectedPack.subjectHint}</p>
                <p><strong>Cross-subjects:</strong> {selectedPack.crossSubjects.join(", ")}</p>
                <p><strong>Tags:</strong> {selectedPack.tags.join(", ")}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handlePinWeek} className="flex-1">
              <PinIcon className="h-4 w-4 mr-2" />
              Pin Universe Week
            </Button>
            <Button variant="outline" onClick={handleUnpin}>
              <PinOffIcon className="h-4 w-4 mr-2" />
              Unpin
            </Button>
          </div>

          {pinned && pinned.packId ? (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">Currently Pinned</span>
              </div>
              <div className="text-sm space-y-1">
                <p><strong>Universe:</strong> {UniversePacks.find(p => p.id === pinned.packId)?.title || pinned.packId}</p>
                <p><strong>Duration:</strong> {pinned.startISO} → {pinned.endISO}</p>
                <p><strong>Class:</strong> {classId}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No universe currently pinned for this class. Students will receive random daily selections.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}