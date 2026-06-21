import { Outlet, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { Activity, Clapperboard, Calendar, Settings as SettingsIcon, LayoutDashboard, LogOut, Video, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/supabase/AuthProvider';
import { supabase } from '@/lib/supabase/supabase';

export function Layout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (loading) return <div>جاري التحميل...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'الرئيسية', path: '/dashboard', icon: LayoutDashboard },
    { name: 'مستكشف الترندات', path: '/dashboard/trends', icon: Activity },
    { name: 'موّلد الفيديو', path: '/dashboard/generate', icon: Clapperboard },
    { name: 'مكتبة الفيديوهات', path: '/dashboard/library', icon: Video },
    { name: 'الجدولة التلقائية', path: '/dashboard/schedule', icon: Calendar },
    { name: 'الإعدادات', path: '/dashboard/settings', icon: SettingsIcon },
  ];

  return (
    <div dir="rtl" className="flex h-screen bg-background text-foreground font-['Noto_Kufi_Arabic','Cairo','sans-serif'] overflow-hidden">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-sidebar flex flex-col transform transition-transform duration-300 lg:static lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-border`}>
        <div className="p-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
            </div>
            <span className="text-sidebar-foreground font-bold tracking-tight text-xl">ترندر (Trander)</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-sidebar-foreground hover:text-primary"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive(item.path)
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground rounded-xl shadow-sm'
                  : 'text-muted-foreground hover:text-sidebar-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-sidebar-foreground transition-colors w-full rounded-xl">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 lg:h-20 bg-card border-b border-border flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-muted-foreground hover:bg-muted rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-foreground">لوحة العمليات</h1>
              <p className="hidden sm:block text-muted-foreground text-xs mt-1">مرحباً بك مجدداً. نظرة عامة على المنصة.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-3 border-r border-border pr-4 lg:pr-6">
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-foreground">حساب الإدارة</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase">المدير</p>
              </div>
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-muted rounded-full border-2 border-border shadow-sm overflow-hidden shrink-0">
                <div className="w-full h-full bg-gradient-to-tr from-primary to-secondary"></div>
              </div>
            </div>
          </div>
        </header>
        <div className="p-4 lg:p-8 flex-1 overflow-auto bg-background">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
