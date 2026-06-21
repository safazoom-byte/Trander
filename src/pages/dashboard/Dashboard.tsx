import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Clapperboard, Flame, Clock, Ban, PlayCircle, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export function Dashboard() {
  const navigate = useNavigate();
  const stats = [
    { title: 'إجمالي الفيديوهات المنشأة', value: 124, icon: Clapperboard, color: 'text-primary' },
    { title: 'ترندات اليوم', value: 12, icon: Flame, color: 'text-destructive' },
    { title: 'آخر توليد', value: '15 دقيقة', icon: Clock, color: 'text-success' },
    { title: 'مواضيع مكررة', value: 8, icon: Ban, color: 'text-amber-500' },
  ];

  const recentTrends = [
    { id: 1, keyword: 'الذكاء الاصطناعي', score: 95, category: 'تكنولوجيا' },
    { id: 2, keyword: 'مباراة ريال مدريد', score: 88, category: 'رياضة' },
    { id: 3, keyword: 'أسعار الذهب', score: 82, category: 'أخبار' },
  ];

  const recentVideos = [
    { id: 1, title: 'هل الذكاء الاصطناعي يستبدل المبرمجين؟', duration: '60s', time: 'ساعتين' },
    { id: 2, title: 'ملخص مباراة الأمس', duration: '180s', time: '5 ساعات' },
  ];

  const performanceData = [
    { name: 'السبت', views: 4000, engagement: 2400 },
    { name: 'الأحد', views: 3000, engagement: 1398 },
    { name: 'الإثنين', views: 6000, engagement: 4800 },
    { name: 'الثلاثاء', views: 2780, engagement: 3908 },
    { name: 'الأربعاء', views: 8890, engagement: 6800 },
    { name: 'الخميس', views: 2390, engagement: 3800 },
    { name: 'الجمعة', views: 11490, engagement: 8300 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">لوحة التحكم</h2>
          <p className="text-muted-foreground mt-1">مرحباً بك في ترندر</p>
        </div>
        <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto">
          <div className="flex items-center gap-2">
            <Label htmlFor="automation-toggle" className="text-muted-foreground font-bold text-xs uppercase cursor-pointer">مؤشر الأتمتة</Label>
            <Switch id="automation-toggle" defaultChecked />
          </div>
          <Link to="/dashboard/generate" className="inline-flex items-center justify-center bg-primary hover:bg-indigo-700 text-white rounded-xl shadow-sm text-xs font-bold px-4 sm:px-6 h-10 w-full sm:w-auto">
            توليد يدوي
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card p-6 rounded-3xl shadow-sm border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">{stat.title}</p>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Chart Row */}
      <div className="bg-card p-4 sm:p-6 rounded-3xl shadow-sm border border-border">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-bold text-card-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            أداء الفيديوهات
          </h4>
        </div>
        <div className="h-[300px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={performanceData}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" name="المشاهدات" dataKey="views" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" name="التفاعل" dataKey="engagement" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        
        {/* Active Trends (60%) */}
        <div className="flex-[2] bg-card rounded-3xl shadow-sm border border-border overflow-hidden flex flex-col">
          <div className="p-4 sm:p-6 border-b border-slate-50 flex justify-between items-center">
            <h4 className="font-bold text-card-foreground flex items-center gap-2">
              <Flame className="w-5 h-5 text-destructive" />
              أبرز الترندات الحالية
            </h4>
            <button onClick={() => navigate('/dashboard/trends')} className="text-primary text-xs font-bold">عرض الكل</button>
          </div>
          <div className="flex-1 p-2 sm:p-6">
            <div className="grid gap-2 sm:gap-3">
              {recentTrends.map((trend) => (
                <div key={trend.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-50 last:border-0 hover:bg-muted rounded-xl transition-colors gap-3">
                  <div>
                    <h4 className="font-medium text-card-foreground">{trend.keyword}</h4>
                    <div className="flex items-center gap-2 sm:gap-3 text-sm mt-2 sm:mt-1">
                      <span className="text-success font-bold text-[10px] sm:text-xs bg-success/20 px-2 py-0.5 rounded-full">Score: {trend.score}</span>
                      <span className="text-muted-foreground font-medium text-[10px] sm:text-xs bg-accent px-2 py-0.5 rounded-full">{trend.category}</span>
                    </div>
                  </div>
                  <Button onClick={() => navigate('/dashboard/generate')} variant="outline" className="border-border text-primary font-bold hover:bg-primary/10 rounded-xl text-xs h-8 w-full sm:w-auto">
                    أنشئ فيديو
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Videos (40%) */}
        <div className="flex-1 bg-slate-900 rounded-3xl shadow-sm flex flex-col overflow-hidden text-white">
          <div className="p-4 sm:p-6 border-b border-slate-800">
            <h4 className="font-bold">آخر فيديوهات منشأة</h4>
          </div>
          <div className="flex-1 p-4 sm:p-6 space-y-4">
            {recentVideos.map((video) => (
              <div key={video.id} className="flex gap-4 border-l-2 border-indigo-500 pl-4 relative group cursor-pointer">
                <div className="w-20 sm:w-24 h-14 sm:h-16 bg-slate-800 rounded-lg relative overflow-hidden flex items-center justify-center shrink-0">
                   <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white/50 group-hover:text-white transition-opacity" />
                  <div className="absolute bottom-1 right-1 bg-black/60 px-1 py-0.5 rounded text-[8px] sm:text-[10px] font-bold">
                    {video.duration}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-xs sm:text-sm leading-tight mb-1">{video.title}</h4>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-tighter">منذ {video.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
