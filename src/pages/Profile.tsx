import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Mail, Phone, MapPin, Calendar, Heart, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import type { PatientProfile, Dosha } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const Profile = () => {
  const [profile, setProfile] = useState<PatientProfile>({ id: "", name: "", clinicName: "", primaryDosha: "Vata" });
  const [loading, setLoading] = useState<boolean>(true);
  const [emailValue, setEmailValue] = useState<string>("");
  const [phoneValue, setPhoneValue] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        if (!supabase) {
          const raw = localStorage.getItem('profile:patient');
          if (raw) setProfile(JSON.parse(raw));
          setEmailValue(profile.email || "");
          setPhoneValue(profile.phone || "");
          return;
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
        if (data) {
          setProfile({
            id: data.id,
            name: data.name || "",
            clinicName: data.clinic_name || "",
            primaryDosha: (data.primary_dosha || 'Vata') as Dosha,
            phone: data.phone || "",
            email: data.email || user.email || ""
          });
          setEmailValue(data.email || user.email || "");
          setPhoneValue(data.phone || "");
        } else {
          setProfile({ id: user.id, name: "", clinicName: "", primaryDosha: "Vata", email: user.email || "" });
          setEmailValue(user.email || "");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDoshaColor = (dosha: string) => {
    switch (dosha.toLowerCase()) {
      case 'vata': return 'bg-accent text-accent-foreground';
      case 'pitta': return 'bg-primary text-primary-foreground';
      case 'kapha': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const saveProfile = async () => {
    const payload = {
      id: profile.id,
      name: profile.name,
      clinic_name: profile.clinicName,
      primary_dosha: profile.primaryDosha,
      phone: phoneValue,
      email: emailValue
    };
    if (!supabase) {
      localStorage.setItem('profile:patient', JSON.stringify({ ...profile, email: emailValue, phone: phoneValue }));
      return;
    }
    await supabase.from('profiles').upsert(payload);
  };

  return (
    <main className="flex-1 p-6 space-y-6">
      {loading && (
        <Card className="shadow-elevated border-0"><CardContent className="p-6">Loading…</CardContent></Card>
      )}
      {/* Profile Header */}
      <Card className="shadow-elevated border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarImage src="" alt={profile.name || 'User'} />
                <AvatarFallback className="bg-gradient-sunset text-accent-foreground text-xl font-bold">
                  {(profile.name || 'U').split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button size="icon" variant="outline" className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="font-heading text-2xl font-bold text-foreground">{profile.name || 'Your Name'}</h1>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge className={getDoshaColor(profile.primaryDosha)}>
                  <Leaf className="w-3 h-3 mr-1" />
                  {profile.primaryDosha} Dosha
                </Badge>
                <Badge variant="outline" className="border-wellness text-wellness">
                  <Heart className="w-3 h-3 mr-1" />
                  Active Patient
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {profile.clinicName ? `Clinic: ${profile.clinicName}` : 'Set your clinic name in the profile form below'}
              </p>
            </div>
            
            <Button className="bg-gradient-saffron hover:shadow-glow text-primary-foreground" onClick={saveProfile}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="shadow-soft border-0">
          <CardHeader>
            <h2 className="font-heading text-xl font-semibold text-foreground">Personal Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
              <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
              <div className="flex">
                <Mail className="w-4 h-4 text-muted-foreground mr-3 mt-3" />
                <Input id="email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground font-medium">Phone</Label>
              <div className="flex">
                <Phone className="w-4 h-4 text-muted-foreground mr-3 mt-3" />
                <Input id="phone" value={phoneValue} onChange={(e) => setPhoneValue(e.target.value)} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="text-foreground font-medium">Location</Label>
              <div className="flex">
                <MapPin className="w-4 h-4 text-muted-foreground mr-3 mt-3" />
                <Input id="location" value={profile.clinicName} onChange={(e) => setProfile({ ...profile, clinicName: e.target.value })} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-foreground font-medium">Date of Birth</Label>
              <div className="flex">
                <Calendar className="w-4 h-4 text-muted-foreground mr-3 mt-3" />
                <Input id="dob" placeholder="Optional" readOnly className="bg-muted/30" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card className="shadow-soft border-0">
          <CardHeader>
            <h2 className="font-heading text-xl font-semibold text-foreground">Medical Information</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-foreground font-medium mb-2 block">Medical History</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground text-sm">Add your conditions</span>
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-foreground font-medium mb-2 block">Allergies</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="destructive" className="text-xs">Add allergies</Badge>
              </div>
            </div>
            
            <div>
              <Label className="text-foreground font-medium mb-2 block">Current Medications</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-wellness rounded-full"></div>
                  <span className="text-foreground text-sm">Add current medications</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Treatment Goals */}
      <Card className="shadow-soft border-0">
        <CardHeader>
          <h2 className="font-heading text-xl font-semibold text-foreground">Treatment Goals</h2>
          <p className="text-muted-foreground">What you aim to achieve through Ayurvedic treatment</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-gradient-earth rounded-lg border border-border/50">
              <div className="w-8 h-8 bg-gradient-saffron rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-foreground font-medium">Set your treatment goals</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Profile;