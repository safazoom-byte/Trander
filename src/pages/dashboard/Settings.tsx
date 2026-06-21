import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Key, Settings as SettingsIcon, Filter, Database, Trash2, Download } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h2 className="text-2xl font-bold text-card-foreground">الإعدادات</h2>
        <p className="text-muted-foreground mt-1 text-sm font-medium">تكوين مفاتيح API وإعدادات المنصة الأساسية</p>
      </div>

      <Tabs defaultValue="general" className="w-full" dir="rtl">
        <TabsList className="bg-card border border-border rounded-2xl w-full justify-start h-14 p-1.5 shadow-sm overflow-x-auto">
          <TabsTrigger value="general" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none text-muted-foreground font-bold px-6 border-none"><SettingsIcon className="w-4 h-4 ml-2" /> إعدادات التوليد</TabsTrigger>
          <TabsTrigger value="filters" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none text-muted-foreground font-bold px-6 border-none"><Filter className="w-4 h-4 ml-2" /> فلترة المحتوى</TabsTrigger>
          <TabsTrigger value="db" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none text-muted-foreground font-bold px-6 border-none"><Database className="w-4 h-4 ml-2" /> إدارة البيانات</TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="general">
            <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
              <div className="p-6 border-b border-slate-50">
                <h3 className="text-lg font-bold text-card-foreground">إعدادات التوليد الافتراضية</h3>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">مدة الفيديو الافتراضية</Label>
                    <Select defaultValue="60">
                      <SelectTrigger className="bg-muted border-none rounded-xl h-12 focus:ring-ring font-medium max-w-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">60 ثانية</SelectItem>
                        <SelectItem value="180">3 دقائق</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">اللهجة المفضلة</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger className="bg-muted border-none rounded-xl h-12 focus:ring-ring font-medium max-w-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">فصحى</SelectItem>
                        <SelectItem value="egyptian">مصري</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">صوت TTS الافتراضي (ElevenLabs)</Label>
                  <Select defaultValue="voice1">
                    <SelectTrigger className="bg-muted border-none rounded-xl h-12 focus:ring-ring font-medium max-w-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="voice1">أحمد (أخباري)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-4 border-t border-slate-50 flex justify-end">
                  <Button className="bg-primary hover:bg-indigo-700 text-white rounded-xl shadow-sm font-bold px-8 h-12">حفظ الإعدادات</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="filters">
            <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
              <div className="p-6 border-b border-slate-50">
                <h3 className="text-lg font-bold text-card-foreground">فلترة المحتوى والترندات</h3>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">أدنى درجة انتشار مقبولة <span className="px-2 py-0.5 bg-accent rounded text-[10px]">Score</span></Label>
                  <Input type="number" defaultValue={80} className="bg-muted border-none rounded-xl h-12 w-32 focus-visible:ring-ring font-bold text-lg text-center" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">كلمات سوداء مستبعدة</Label>
                  <p className="text-sm text-muted-foreground mb-2">يتم تجاهل الترند في الجدولة التلقائية إذا احتوى على هذه الكلمات.</p>
                  <Textarea placeholder="أدخل الكلمات مفصولة بفاصلة..." className="bg-muted border-none rounded-xl min-h-[120px] focus-visible:ring-ring p-4 leading-relaxed font-medium" />
                </div>
                <div className="pt-4 border-t border-slate-50 flex justify-end">
                  <Button className="bg-primary hover:bg-indigo-700 text-white rounded-xl shadow-sm font-bold px-8 h-12">تحديث الفلاتر</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="db">
            <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
              <div className="p-6 border-b border-slate-50">
                <h3 className="text-lg font-bold text-card-foreground">إحصائيات وقاعدة البيانات</h3>
              </div>
              <div className="p-8 space-y-8">
                <div className="bg-muted border border-border p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-card-foreground mb-2">حجم التخزين المستخدم (Firebase Storage)</h4>
                    <div className="flex items-center gap-3">
                       <div className="text-sm font-bold text-primary">1.2 GB</div>
                       <div className="text-xs text-muted-foreground font-bold uppercase">من أصل 5.0 GB (مجاني)</div>
                    </div>
                    <div className="w-64 bg-accent h-2 rounded-full overflow-hidden mt-3 relative"><div className="bg-primary/100 h-full w-[24%] absolute left-0"></div></div>
                  </div>
                  <div className="w-16 h-16 bg-card rounded-2xl shadow-sm flex items-center justify-center border border-border">
                    <Database className="w-8 h-8 text-primary" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-50">
                  <h4 className="font-bold text-card-foreground mb-4">إجراءات متقدمة</h4>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="outline" className="border-border text-foreground hover:bg-muted hover:text-primary rounded-xl font-bold h-12 shadow-sm px-6">
                      <Download className="w-4 h-4 ml-2" />
                      تصدير الكل (CSV)
                    </Button>
                    <Button variant="outline" className="border-rose-100 text-destructive hover:bg-destructive/10 rounded-xl font-bold h-12 shadow-sm px-6">
                      <Trash2 className="w-4 h-4 ml-2" />
                      مسح التخزين المؤقت
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
