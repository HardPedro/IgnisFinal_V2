import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogOut,
  ChevronLeft,
  Clock,
  Users,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/home';
  const [currentTime, setCurrentTime] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userData, logout } = useAuth();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('pt-BR', { 
        day: '2-digit', month: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const SidebarContent = () => (
    <>
      <img 
        src="https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&q=80&w=1000" 
        alt="Sidebar Background" 
        className="absolute inset-0 w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/95 to-blue-950/80"></div>
      
      <div className="relative z-10 p-6 flex flex-col h-full justify-end text-white">
        {/* User Info */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white">{userData?.name || 'Usuário'}</h3>
          <p className="text-sm text-orange-500 font-medium">{userData?.role || 'Administrador'}</p>
          <p className="text-xs text-blue-200 mt-1">{userData?.tenantId || 'Oficina Pro'}</p>
        </div>

        {/* Date/Time */}
        <div className="flex items-center text-sm text-blue-200 mb-6">
          <Clock className="h-4 w-4 mr-2" />
          <span>{currentTime}</span>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button onClick={logout} className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl border border-blue-800 hover:bg-blue-900 transition-colors text-sm font-medium">
            <Users className="h-4 w-4 mr-2" />
            Trocar Usuário
          </button>
          <button onClick={logout} className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium border border-red-500/20">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-shrink-0 relative flex-col shadow-2xl z-20 border-r border-blue-900/50">
        <SidebarContent />
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-blue-950 z-50 flex items-center justify-between px-4 shadow-md border-b border-blue-900/50">
        <div className="flex items-center">
          {!isHome && (
            <Link to="/home" className="mr-3 text-blue-200 hover:text-white transition-colors">
              <ChevronLeft className="h-6 w-6" />
            </Link>
          )}
          <h1 className="text-xl font-bold text-white tracking-tight">Oficina <span className="text-orange-500">Pro</span></h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-blue-200 hover:text-white transition-colors">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <aside className="w-72 h-full relative flex flex-col shadow-2xl">
              <SidebarContent />
            </aside>
            <div className="absolute inset-0 bg-black/50 -z-10" onClick={() => setIsMobileMenuOpen(false)}></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 pt-16 lg:pt-0 relative">
        {/* Top bar for desktop */}
        {!isHome && (
          <div className="hidden lg:flex absolute top-0 left-0 p-6 z-10 w-full justify-between items-center pointer-events-none">
            <Link 
              to="/home" 
              className="flex items-center px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600 hover:text-blue-950 hover:border-blue-200 hover:bg-blue-50 transition-all font-medium text-sm pointer-events-auto"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Voltar ao Menu
            </Link>
            <div className="pointer-events-auto bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2">
               <span className="text-sm font-bold text-blue-950 tracking-tight">Oficina <span className="text-orange-500">Pro</span></span>
            </div>
          </div>
        )}

        <div className={`flex-1 overflow-auto p-4 sm:p-6 lg:p-10 ${!isHome ? 'lg:pt-24' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
