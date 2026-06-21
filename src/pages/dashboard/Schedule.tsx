import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Settings2, Play, Square } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export function Schedule() {
  const schedules = [
    { id: 1, name: 'الجدول اليومي', interval: 'كل 6 ساعات', count: '2 فيديو/دورة', lastRun: 'منذ 3 ساعات', nextRun: 'بعد 3 ساعات', active: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">الجدولة التلقائية</h2>
          <p className="text-muted-foreground font-medium text-sm mt-1">أتمتة إنشاء الفيديوهات بناءً على الترندات اليومية</p>
        </div>
        
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center bg-primary hover:bg-indigo-700 text-white font-bold h-10 px-6 rounded-xl shadow-sm gap-2 whitespace-nowrap transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            <Plus className="w-4 h-4" />
            إنشاء جدول جديد
          </DialogTrigger>
          <DialogContent className="bg-card border-border sm:max-w-md rounded-3xl" dir="rtl">
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle className="text-xl font-bold text-card-foreground">إعدادات الجدولة التلقائية</DialogTitle>
              <DialogDescription className="text-muted-foreground">قم بتكوين الجدولة لتوليد الفيديوهات تلقائياً</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">تكرار كل</Label>
                  <Select defaultValue="6">
                    <SelectTrigger className="bg-muted border-none rounded-xl h-12 focus:ring-ring font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 ساعات</SelectItem>
                      <SelectItem value="6">6 ساعات</SelectItem>
                      <SelectItem value="12">12 ساعة</SelectItem>
                      <SelectItem value="24">يومياً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">عدد الفيديوهات</Label>
                  <Input type="number" defaultValue={2} className="bg-muted border-none rounded-xl h-12 focus-visible:ring-ring font-medium" />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between"><span>أدنى درجة للترند</span><span className="text-primary">80</span></Label>
                <div className="pt-2">
                  <Slider defaultValue={[80]} max={100} step={1} className="[&>span:first-child]:bg-accent [&_[role=slider]]:bg-primary [&_[role=slider]]:border-0 [&_[role=slider]]:w-5 [&_[role=slider]]:h-5 [&_[role=slider]]:shadow-md" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">المدة الافتراضية</Label>
                  <Select defaultValue="60">
                    <SelectTrigger className="bg-muted border-none rounded-xl h-12 focus:ring-ring font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">60ث</SelectItem>
                      <SelectItem value="180">3د</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">اللهجة</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger className="bg-muted border-none rounded-xl h-12 focus:ring-ring font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">فصحى</SelectItem>
                      <SelectItem value="egyptian">مصري</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-slate-50 bg-muted/50 rounded-b-3xl">
              <Button variant="outline" className="border-border text-muted-foreground font-bold hover:bg-accent rounded-xl px-6 h-10">إلغاء</Button>
              <Button className="bg-primary hover:bg-indigo-700 text-white font-bold rounded-xl px-6 h-10 shadow-sm">حفظ الجدول</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schedules.map(schedule => (
          <div key={schedule.id} className="bg-card rounded-3xl shadow-sm border border-border p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Switch id={`schedule-${schedule.id}`} defaultChecked={schedule.active} className="data-[state=checked]:bg-primary/100" />
                <Label htmlFor={`schedule-${schedule.id}`} className="font-bold text-lg text-card-foreground cursor-pointer">{schedule.name}</Label>
              </div>
              <span className={`px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full ${schedule.active ? 'bg-success/20 text-success' : 'bg-accent text-muted-foreground'}`}>
                {schedule.active ? 'تفعيل' : 'توقف'}
              </span>
            </div>

            <div className="bg-muted p-5 rounded-2xl border border-border space-y-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                 <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">دورة التشغيل</p>
                    <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                      <Settings2 className="w-4 h-4 text-primary" />
                      <span>{schedule.interval}</span>
                    </div>
                 </div>
                 <div className="w-px h-8 bg-accent hidden sm:block"></div>
                 <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">الكمية المستهدفة</p>
                    <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                      <Play className="w-4 h-4 text-primary" />
                      <span>{schedule.count}</span>
                    </div>
                 </div>
              </div>
              <div className="h-px bg-accent w-full" />
              <div className="flex items-center justify-between gap-4 text-xs">
                <div className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> <span className="font-medium">النشاط السابق: <span className="text-foreground font-bold">{schedule.lastRun}</span></span></div>
                <div className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> <span className="font-medium">موعد التشغيل: <span className="text-primary font-bold">{schedule.nextRun}</span></span></div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-auto">
              {schedule.active ? (
                <Button variant="outline" className="flex-1 border-rose-200 text-destructive hover:bg-destructive/10 hover:text-rose-700 rounded-xl font-bold h-11">
                  <Square className="w-4 h-4 ml-2 fill-current" /> إيقاف مؤقت
                </Button>
              ) : (
                <Button variant="outline" className="flex-1 border-emerald-200 text-success hover:bg-success/10 hover:text-emerald-700 rounded-xl font-bold h-11">
                  <Play className="w-4 h-4 ml-2 fill-current" /> بدء التشغيل
                </Button>
              )}
              <Button variant="outline" className="w-24 border-border text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl font-bold h-11 shadow-sm">تعديل</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
