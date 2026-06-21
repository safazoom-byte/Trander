import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/supabase/AuthProvider';
import { supabase } from '@/lib/supabase/supabase';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground" dir="rtl">
      <div className="w-full max-w-md p-10 bg-card rounded-3xl border border-border shadow-sm text-center">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 bg-primary-foreground rounded-[4px]"></div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">ترندر</h1>
        <p className="text-sm font-medium text-muted-foreground mb-10">منصة فيديوهات الترند التلقائية بالعربي</p>
        
        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 text-right">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" htmlFor="email">البريد الإلكتروني</label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="name@example.com"
              dir="ltr"
            />
          </div>
          
          <div className="flex flex-col gap-2 mb-2">
            <label className="text-sm font-semibold" htmlFor="password">كلمة المرور</label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 mt-2"
          >
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
