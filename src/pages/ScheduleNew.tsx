import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Clock, MapPin, User, CheckCircle, AlertCircle, Star } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { TherapySession, TherapyFeedback } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const ScheduleNew = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [detailSession, setDetailSession] = useState<TherapySession | null>(null);
  const [feedbackDraft, setFeedbackDraft] = useState<TherapyFeedback | null>(null);

  const [sessions, setSessions] = useState<TherapySession[]>([
    {
      id: "1",
      type: "Abhyanga",
      title: "Abhyanga Oil Massage",
      dateISO: new Date().toISOString().slice(0,10),
      startTimeISO: new Date(new Date().setHours(9,0,0,0)).toISOString(),
      endTimeISO: new Date(new Date().setHours(10,0,0,0)).toISOString(),
      durationMin: 60,
      location: "Treatment Room A",
      practitioner: "Dr. Priya Sharma",
      status: "upcoming",
      precautionsPre: ["Light breakfast", "Hydrate well"],
      precautionsPost: ["Rest for 30 minutes", "Warm water only"],
    },
    {
      id: "2",
      type: "Swedana",
      title: "Swedana Steam Therapy",
      dateISO: new Date().toISOString().slice(0,10),
      startTimeISO: new Date(new Date().setHours(11,30,0,0)).toISOString(),
      endTimeISO: new Date(new Date().setHours(12,0,0,0)).toISOString(),
      durationMin: 30,
      location: "Steam Chamber",
      practitioner: "Therapist Raj",
      status: "upcoming",
      precautionsPre: ["Avoid heavy meals", "Remove metal accessories"],
      precautionsPost: ["Avoid cold exposure", "Gentle stretching"],
    },
    {
      id: "3",
      type: "Shirodhara",
      title: "Shirodhara",
      dateISO: new Date(Date.now() + 24*60*60*1000).toISOString().slice(0,10),
      startTimeISO: new Date(new Date().setDate(new Date().getDate()+1)).toISOString(),
      endTimeISO: new Date(new Date().setDate(new Date().getDate()+1)).toISOString(),
      durationMin: 45,
      location: "Room B",
      practitioner: "Dr. Arun Gupta",
      status: "upcoming",
      precautionsPre: ["Quiet mind before session"],
      precautionsPost: ["Keep head warm", "Avoid screens for 2 hours"],
    },
  ]);

  useEffect(() => {
    const load = async () => {
      try {
        if (!supabase) return; // keep mock
        const start = new Date(selectedDate);
        start.setHours(0,0,0,0);
        const end = new Date(selectedDate);
        end.setHours(23,59,59,999);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from('therapies')
          .select('id,type,title,start_time,end_time,location,practitioner,status')
          .eq('user_id', user.id)
          .gte('start_time', start.toISOString())
          .lte('end_time', end.toISOString())
          .order('start_time', { ascending: true });
        if (data) {
          const mapped: TherapySession[] = data.map((t) => ({
            id: t.id,
            type: t.type,
            title: t.title,
            dateISO: t.start_time.slice(0,10),
            startTimeISO: t.start_time,
            endTimeISO: t.end_time,
            durationMin: Math.max(0, Math.round((new Date(t.end_time).getTime() - new Date(t.start_time).getTime())/60000)),
            location: t.location || '',
            practitioner: t.practitioner || '',
            status: (t.status || 'upcoming') as 'upcoming'|'completed'|'cancelled',
            precautionsPre: [],
            precautionsPost: [],
          }));
          // load precautions
          const ids = mapped.map(m => m.id);
          if (ids.length) {
            const { data: prec } = await supabase
              .from('precautions')
              .select('therapy_id,pre,post')
              .in('therapy_id', ids);
            if (prec) {
              for (const m of mapped) {
                const p = prec.find(x => x.therapy_id === m.id);
                if (p) {
                  m.precautionsPre = p.pre || [];
                  m.precautionsPost = p.post || [];
                }
              }
            }
          }
          setSessions(mapped);
        }
      } catch {}
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-wellness text-wellness-foreground';
      case 'upcoming': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'upcoming': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const sessionsByDay = useMemo(() => {
    const map = new Map<string, TherapySession[]>();
    sessions.forEach(s => {
      const d = s.dateISO;
      const arr = map.get(d) || [];
      arr.push(s);
      map.set(d, arr);
    });
    return map;
  }, [sessions]);

  const selectedISO = useMemo(() => selectedDate.toISOString().slice(0,10), [selectedDate]);
  const daySessions = sessionsByDay.get(selectedISO) || [];
  const totalTodayMin = daySessions.reduce((sum, s) => sum + s.durationMin, 0);

  return (
    <main className="flex-1 p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-elevated border-0 lg:col-span-1">
          <CardHeader>
            <h2 className="font-heading text-xl font-semibold text-foreground">Schedule</h2>
            <p className="text-sm text-muted-foreground">Select a date to view sessions</p>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => d && setSelectedDate(d)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="shadow-elevated border-0 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
                <p className="text-muted-foreground flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> {daySessions.length} session{daySessions.length!==1?'s':''} • {(totalTodayMin/60>=1?`${Math.floor(totalTodayMin/60)}h `:'' )}{totalTodayMin%60}m</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {daySessions.length === 0 && (
              <div className="p-6 text-center text-muted-foreground">No sessions on this date.</div>
            )}
            {daySessions.map((s) => {
              const start = new Date(s.startTimeISO);
              const end = new Date(s.endTimeISO);
              const time = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
              return (
                <div key={s.id} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-gentle">
                  <div className="flex-shrink-0 text-center">
                    <div className="text-lg font-bold text-foreground">{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="text-xs text-muted-foreground">{s.durationMin} min</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-semibold text-foreground">{s.title}</h3>
                      <Badge className={getStatusColor(s.status)}>
                        {getStatusIcon(s.status)}
                        <span className="ml-1 capitalize">{s.status}</span>
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1"><User className="w-4 h-4" /><span>{s.practitioner}</span></div>
                      <div className="flex items-center space-x-1"><Clock className="w-4 h-4" /><span>{time}</span></div>
                      <div className="flex items-center space-x-1"><MapPin className="w-4 h-4" /><span>{s.location}</span></div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => { setDetailSession(s); setFeedbackDraft(null); }}>
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="border-muted text-muted-foreground hover:bg-muted">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!detailSession} onOpenChange={(open) => { if (!open) { setDetailSession(null); setFeedbackDraft(null); } }}>
        <DialogContent className="max-w-lg">
          {detailSession && (
            <>
              <DialogHeader>
                <DialogTitle>{detailSession.title}</DialogTitle>
                <DialogDescription>
                  {new Date(detailSession.startTimeISO).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} • {detailSession.durationMin} min
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h4 className="font-heading font-semibold mb-2">Pre‑therapy precautions</h4>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    {detailSession.precautionsPre.map((p, i) => (<li key={i}>{p}</li>))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading font-semibold mb-2">Post‑therapy precautions</h4>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    {detailSession.precautionsPost.map((p, i) => (<li key={i}>{p}</li>))}
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-heading font-semibold mb-2">Submit feedback</h4>
                  <div className="flex items-center gap-2 mb-2">
                    {[1,2,3,4,5].map((r) => (
                      <Button key={r} variant={feedbackDraft?.rating === r ? 'default' : 'outline'} size="icon" onClick={() => setFeedbackDraft({ sessionId: detailSession.id, rating: r as 1|2|3|4|5, createdAtISO: new Date().toISOString() })}>
                        <Star className={`w-4 h-4 ${feedbackDraft?.rating && feedbackDraft.rating >= r ? 'fill-primary text-primary-foreground' : ''}`} />
                      </Button>
                    ))}
                  </div>
                  <Textarea placeholder="Optional notes" value={feedbackDraft?.notes ?? ''} onChange={(e) => setFeedbackDraft(prev => prev ? { ...prev, notes: e.target.value } : { sessionId: detailSession.id, rating: 3, notes: e.target.value, createdAtISO: new Date().toISOString() })} />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { setDetailSession(null); setFeedbackDraft(null); }}>Close</Button>
                <Button onClick={async () => { 
                  try {
                    if (feedbackDraft) {
                      if (supabase) {
                        await supabase.from('feedback').insert({ therapy_id: detailSession.id, rating: feedbackDraft.rating, notes: feedbackDraft.notes || null });
                      } else {
                        localStorage.setItem(`feedback:${detailSession.id}`, JSON.stringify(feedbackDraft)); 
                      }
                    }
                  } finally {
                    setDetailSession(null);
                  }
                }}>Submit</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default ScheduleNew;


