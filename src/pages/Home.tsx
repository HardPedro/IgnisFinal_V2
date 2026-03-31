import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Home as HomeIcon, 
  Users, 
  Car, 
  Package, 
  FileText, 
  Wrench, 
  MessageSquare,
  Settings,
  DollarSign,
  Calendar,
  Bot,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Home() {
  const { userData, tenantData } = useAuth();
  
  const isGestor = userData?.role === 'Gestor' || userData?.role === 'SuperAdmin';
  const mecanicoPermissions = tenantData?.mecanicoPermissions || {
    canViewFinancial: false,
    canDeleteOS: false,
    canEditSettings: false
  };

  const categories = [
    {
      title: 'CADASTROS',
      items: [
        { path: '/vehicles', label: 'Carros', desc: 'Gerenciar veículos', icon: Car, show: true },
        { path: '/catalog', label: 'Produtos', desc: 'Produtos e serviços', icon: Package, show: true },
        { path: '/customers', label: 'Clientes', desc: 'Cadastro de clientes', icon: Users, show: true },
      ]
    },
    {
      title: 'VENDAS & LEADS',
      items: [
        { path: '/quotes', label: 'Orçamentos', desc: 'Gerenciar orçamentos', icon: FileText, show: true },
        { path: '/whatsapp', label: 'Central Inteligente', desc: 'Atendimento via WhatsApp', icon: MessageSquare, show: tenantData?.plan === 'central' || userData?.role === 'SuperAdmin' },
        { path: '/intelligent-assistant', label: 'Assistente Inteligente', desc: 'Configurar IA', icon: Bot, show: tenantData?.plan === 'central' || userData?.role === 'SuperAdmin' },
      ]
    },
    {
      title: 'GESTÃO',
      items: [
        { path: '/dashboard', label: 'Painel do Gestor', desc: 'Métricas e relatórios', icon: HomeIcon, show: isGestor },
        { path: '/schedule', label: 'Agenda', desc: 'Gestão de compromissos', icon: Calendar, show: true },
        { path: '/financial', label: 'Financeiro', desc: 'Controle de caixa e lucros', icon: DollarSign, show: isGestor || mecanicoPermissions.canViewFinancial },
      ]
    },
    {
      title: 'SERVIÇOS',
      items: [
        { path: '/work-orders', label: 'Manutenções', desc: 'Revisões e reparos', icon: Wrench, show: true },
      ]
    },
    {
      title: 'OUTROS',
      items: [
        { path: '/settings', label: 'Configurações', desc: 'Ajustes do sistema', icon: Settings, show: isGestor || mecanicoPermissions.canEditSettings },
        { path: '/admin', label: 'Administração', desc: 'Gerenciar estabelecimentos', icon: Shield, show: userData?.role === 'SuperAdmin' },
      ]
    }
  ].map(category => ({
    ...category,
    items: category.items.filter(item => item.show)
  })).filter(category => category.items.length > 0);

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-950 tracking-tight">Menu Principal</h1>
        <p className="text-slate-500 mt-1">Selecione o módulo que deseja acessar.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max pb-8">
        {categories.map((category, idx) => (
          <motion.div 
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col"
          >
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              {category.title}
            </h2>
            <div className="space-y-2 flex-1">
              {category.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.path}
                    to={item.path}
                    className="flex items-center p-3 -mx-3 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-200"
                  >
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 mr-4 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-blue-950 group-hover:text-orange-600 transition-colors">{item.label}</h3>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
