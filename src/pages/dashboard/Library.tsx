import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Trash2, LayoutGrid, Clock, PlayCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { useAuth } from '@/lib/supabase/AuthProvider';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Video {
  id: string;
  title: string;
  duration: string;
  status: string;
  created_at: string;
}

export function Library() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchVideos();
  }, [user]);

  const fetchVideos = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;
      setVideos(videos.filter(v => v.id !== id));
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">مكتبة الفيديوهات</h2>
          <p className="text-muted-foreground mt-1 text-sm font-medium">تصفح جميع الفيديوهات التي تم إنشاؤها عبر المنصة</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 shrink-0 bg-card p-4 rounded-3xl shadow-sm border border-border">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="بحث بالكلمة المفتاحية..." className="pl-4 pr-10 bg-muted border-none rounded-2xl h-12 focus-visible:ring-ring text-card-foreground" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-48 bg-muted border-none rounded-2xl h-12 text-card-foreground font-medium">
            <SelectValue placeholder="الفلترة بالحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الفيديوهات</SelectItem>
            <SelectItem value="ready">جاهز</SelectItem>
            <SelectItem value="published">منشور</SelectItem>
            <SelectItem value="failed">فشل</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 bg-muted rounded-2xl p-1 h-12 shadow-inner border border-border">
          <Button variant="ghost" className="bg-card text-primary h-10 px-3 rounded-xl shadow-sm"><LayoutGrid className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="overflow-auto flex-1 pb-8">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-muted-foreground font-medium">جاري تحميل الفيديوهات...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="flex items-center justify-center h-48 bg-card rounded-3xl border border-border">
            <div className="text-center">
              <p className="text-muted-foreground font-medium mb-2">لا توجد فيديوهات حتى الآن</p>
              <Button size="sm" variant="outline" className="rounded-xl">إنشاء فيديو جديد</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {videos.map(video => (
              <div key={video.id} className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden group flex flex-col h-full relative hover:shadow-md transition-shadow">
                <div className="aspect-[9/16] bg-slate-800 relative flex items-center justify-center cursor-pointer m-4 rounded-2xl overflow-hidden shrink-0">
                  <PlayCircle className="w-16 h-16 text-white/40 group-hover:text-white transition-opacity z-10 drop-shadow-md" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full ${
                      video.status === 'جاهز' ? 'bg-success/100 text-white' : 
                      video.status === 'منشور' ? 'bg-primary/100 text-white' : 
                      'bg-destructive/100 text-white'
                    }`}>{video.status}</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 px-2.5 py-1.5 flex items-center gap-1.5 rounded-lg text-xs font-bold text-white shadow-sm backdrop-blur-sm">
                    <Clock className="w-3 h-3" />
                    {video.duration || '60s'}
                  </div>
                </div>
                <div className="p-5 pt-1 space-y-3 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-card-foreground line-clamp-2 leading-tight" title={video.title}>{video.title}</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {formatDistanceToNow(new Date(video.created_at), { addSuffix: true, locale: ar })}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-border">
                    <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10 font-bold text-xs rounded-xl px-4">نشر الآن</Button>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"><Download className="w-4 h-4" /></Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => deleteVideo(video.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
