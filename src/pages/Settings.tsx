import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Moon, 
  Globe, 
  Shield, 
  Smartphone, 
  Volume2, 
  Eye, 
  Download,
  Trash2,
  HelpCircle
} from "lucide-react";
import { initFcm } from "@/lib/fcm";
import { supabase } from "@/lib/supabase";

const Settings = () => {
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(() => {
    const raw = localStorage.getItem('settings:reminders');
    return raw ? raw === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('settings:reminders', String(remindersEnabled));
  }, [remindersEnabled]);

  const onToggleReminders = async (checked: boolean) => {
    setRemindersEnabled(checked);
    if (checked) {
      try {
        const token = await initFcm();
        if (token && supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('user_devices').insert({ user_id: user.id, token, platform: 'web' }).select('id').single();
          }
        }
      } catch (_) {}
    }
  };
  return (
    <main className="flex-1 p-6 space-y-6">
      {/* Notifications */}
      <Card className="shadow-soft border-0">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-xl font-semibold text-foreground">Notifications</h2>
          </div>
          <p className="text-muted-foreground">Manage your notification preferences</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="therapy-reminders" className="text-foreground font-medium">Therapy Reminders</Label>
              <p className="text-sm text-muted-foreground">Get notified before scheduled treatments</p>
            </div>
            <Switch id="therapy-reminders" checked={remindersEnabled} onCheckedChange={onToggleReminders} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ai-insights" className="text-foreground font-medium">Wellness Insights</Label>
              <p className="text-sm text-muted-foreground">Receive personalized wellness tips</p>
            </div>
            <Switch id="ai-insights" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="progress-updates" className="text-foreground font-medium">Progress Updates</Label>
              <p className="text-sm text-muted-foreground">Weekly summaries of your healing journey</p>
            </div>
            <Switch id="progress-updates" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="meditation-reminders" className="text-foreground font-medium">Meditation Reminders</Label>
              <p className="text-sm text-muted-foreground">Daily mindfulness practice reminders</p>
            </div>
            <Switch id="meditation-reminders" />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="shadow-soft border-0">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-xl font-semibold text-foreground">Appearance</h2>
          </div>
          <p className="text-muted-foreground">Customize your app experience</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground font-medium">Theme</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
            <Select defaultValue="system">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground font-medium">Language</Label>
              <p className="text-sm text-muted-foreground">Select your preferred language</p>
            </div>
            <Select defaultValue="english">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">Hindi</SelectItem>
                <SelectItem value="sanskrit">Sanskrit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound-effects" className="text-foreground font-medium">Sound Effects</Label>
              <p className="text-sm text-muted-foreground">Enable app sounds and feedback</p>
            </div>
            <Switch id="sound-effects" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="shadow-soft border-0">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-xl font-semibold text-foreground">Privacy & Security</h2>
          </div>
          <p className="text-muted-foreground">Control your data and privacy settings</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="biometric-lock" className="text-foreground font-medium">Biometric Lock</Label>
              <p className="text-sm text-muted-foreground">Use fingerprint or face recognition</p>
            </div>
            <Switch id="biometric-lock" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="data-sharing" className="text-foreground font-medium">Anonymous Data Sharing</Label>
              <p className="text-sm text-muted-foreground">Help improve the app with anonymous usage data</p>
            </div>
            <Switch id="data-sharing" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ai-learning" className="text-foreground font-medium">Assistant Learning</Label>
              <p className="text-sm text-muted-foreground">Allow the assistant to learn from your interactions</p>
            </div>
            <Switch id="ai-learning" defaultChecked />
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Download className="w-4 h-4 mr-2" />
              Export My Data
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-foreground hover:bg-muted">
              <Shield className="w-4 h-4 mr-2" />
              Privacy Policy
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-foreground hover:bg-muted">
              <HelpCircle className="w-4 h-4 mr-2" />
              Terms of Service
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App Management */}
      <Card className="shadow-soft border-0">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-xl font-semibold text-foreground">App Management</h2>
          </div>
          <p className="text-muted-foreground">Manage app data and storage</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <Label className="text-foreground font-medium">App Version</Label>
              <p className="text-sm text-muted-foreground">AyurSutra v1.0.0</p>
            </div>
            <Button variant="outline" size="sm">
              Check Updates
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <Label className="text-foreground font-medium">Storage Used</Label>
              <p className="text-sm text-muted-foreground">45 MB of local storage</p>
            </div>
            <Button variant="outline" size="sm">
              Clear Cache
            </Button>
          </div>
          
          <Separator />
          
          <Button variant="destructive" className="w-full justify-start">
            <Trash2 className="w-4 h-4 mr-2" />
            Reset All Settings
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default Settings;