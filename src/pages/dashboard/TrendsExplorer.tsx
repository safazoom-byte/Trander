import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Search, Video, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function TrendsExplorer() {
  const navigate = useNavigate();
  const [trends, setTrends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTrends = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/trends/fetch');
      if (response.data.success) {
        setTrends(response.data.trends);
      }
    } catch (error) {
      console.error('Error fetching trends', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">مستكشف الترندات</h2>
          <p className="text-muted-foreground mt-1 text-sm font-medium">تصفح المواضيع الشائعة حالياً للبدء في إنشاء المحتوى</p>
        </div>
        <Button 
          onClick={fetchTrends}
          disabled={isLoading}
          className="bg-primary hover:bg-indigo-700 text-white rounded-xl shadow-sm text-xs font-bold px-6 h-10 flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          تحديث الترندات الآن
        </Button>
      </div>

      <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="بحث بالكلمة المفتاحية..." className="pl-3 pr-9 bg-muted border-none rounded-full h-10 focus-visible:ring-ring" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-36 bg-muted border-none rounded-full h-10">
                  <SelectValue placeholder="المصدر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل المصادر</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-36 bg-muted border-none rounded-full h-10">
                  <SelectValue placeholder="الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الفئات</SelectItem>
                  <SelectItem value="tech">تكنولوجيا</SelectItem>
                  <SelectItem value="sports">رياضة</SelectItem>
                  <SelectItem value="news">أخبار</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" className="border-border text-muted-foreground rounded-xl font-bold text-xs" disabled>
              توليد متعدد المحددة
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <Table className="w-full text-right">
            <thead>
              <tr className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold border-b border-slate-50">
                <th className="px-6 py-4 w-12 text-center"><Checkbox className="border-slate-300 data-[state=checked]:bg-primary" /></th>
                <th className="px-6 py-4">الكلمة المفتاحية</th>
                <th className="px-6 py-4">الدرجة</th>
                <th className="px-6 py-4">الفئة</th>
                <th className="px-6 py-4">المصدر</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4 text-center">إجراء</th>
              </tr>
            </thead>
            <TableBody className="divide-y divide-slate-50">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : trends.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-medium">
                    لا توجد ترندات متاحة حالياً
                  </TableCell>
                </TableRow>
              ) : trends.map((trend) => (
                <TableRow key={trend.id} className="text-sm border-0 hover:bg-muted transition-colors">
                  <TableCell className="px-6 py-4 text-center"><Checkbox className="border-slate-300 data-[state=checked]:bg-primary" /></TableCell>
                  <TableCell className="px-6 py-4 font-bold text-card-foreground">{trend.keyword}</TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-success font-bold bg-success/20 px-2.5 py-1 rounded-full text-xs">Score: {trend.score}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-muted-foreground font-medium">{trend.category}</TableCell>
                  <TableCell className="px-6 py-4 text-muted-foreground font-medium">{trend.source}</TableCell>
                  <TableCell className="px-6 py-4">
                    {trend.used ? (
                      <span className="px-3 py-1 bg-accent text-muted-foreground rounded-full text-xs font-bold">مستخدم</span>
                    ) : (
                      <span className="px-3 py-1 bg-indigo-100 text-primary rounded-full text-xs font-bold">جديد</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <Button 
                      onClick={() => navigate('/dashboard/generate')}
                      size="sm" 
                      variant="ghost" 
                      className="text-primary hover:text-primary hover:bg-primary/10 rounded-xl font-bold text-xs h-8"
                    >
                      <Video className="w-4 h-4 ml-2" />
                      توليد
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
