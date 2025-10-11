import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Globe, 
  Users, 
  Rocket, 
  Star,
  TrendingUp,
  Activity,
  BarChart3,
  Zap,
  Shield,
  Crown,
  Flame,
  Sparkles,
  ArrowUpRight,
  Calendar,
  Clock,
  Target,
  Award,
  Plus,
  Eye,
  Edit3,
  MoreHorizontal
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    planets: 0,
    characters: 0,
    spaceships: 0,
    starSystems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setStats({
          planets: 42,
          characters: 156,
          spaceships: 89,
          starSystems: 23
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Planetas', 
      value: stats.planets, 
      icon: Globe, 
      gradient: 'from-emerald-500 to-teal-600',
      change: '+12%',
      description: 'Mundos catalogados',
      trend: 'up'
    },
    { 
      title: 'Personagens', 
      value: stats.characters, 
      icon: Users, 
      gradient: 'from-violet-500 to-purple-600',
      change: '+8%',
      description: 'Heróis e vilões',
      trend: 'up'
    },
    { 
      title: 'Naves', 
      value: stats.spaceships, 
      icon: Rocket, 
      gradient: 'from-orange-500 to-red-600',
      change: '+15%',
      description: 'Frota espacial',
      trend: 'up'
    },
    { 
      title: 'Sistemas', 
      value: stats.starSystems, 
      icon: Star, 
      gradient: 'from-amber-500 to-yellow-600',
      change: '+5%',
      description: 'Sistemas estelares',
      trend: 'up'
    }
  ];

  const recentActivities = [
    { 
      id: 1, 
      title: 'Novo planeta descoberto', 
      description: 'Tatooine foi adicionado ao banco de dados',
      time: '2 min atrás', 
      type: 'create',
      icon: Globe,
      color: 'text-emerald-500 bg-emerald-500/10'
    },
    { 
      id: 2, 
      title: 'Personagem atualizado', 
      description: 'Luke Skywalker - informações atualizadas',
      time: '15 min atrás', 
      type: 'edit',
      icon: Users,
      color: 'text-violet-500 bg-violet-500/10'
    },
    { 
      id: 3, 
      title: 'Nova nave registrada', 
      description: 'X-Wing T-65 adicionada à frota',
      time: '1h atrás', 
      type: 'create',
      icon: Rocket,
      color: 'text-orange-500 bg-orange-500/10'
    },
    { 
      id: 4, 
      title: 'Sistema mapeado', 
      description: 'Sistema Coruscant completamente catalogado',
      time: '3h atrás', 
      type: 'update',
      icon: Star,
      color: 'text-amber-500 bg-amber-500/10'
    }
  ];

  const quickActions = [
    { 
      title: 'Novo Planeta', 
      description: 'Catalogar mundo', 
      icon: Globe, 
      color: 'from-emerald-500 to-teal-600' 
    },
    { 
      title: 'Novo Personagem', 
      description: 'Adicionar herói', 
      icon: Users, 
      color: 'from-violet-500 to-purple-600' 
    },
    { 
      title: 'Nova Nave', 
      description: 'Registrar veículo', 
      icon: Rocket, 
      color: 'from-orange-500 to-red-600' 
    },
    { 
      title: 'Novo Sistema', 
      description: 'Mapear região', 
      icon: Star, 
      color: 'from-amber-500 to-yellow-600' 
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Zap className="w-6 h-6 text-white animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-xl"></div>
        <div className="relative backdrop-blur-sm bg-white/10 border border-white/20 rounded-3xl p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Bem-vindo, {user?.email?.split('@')[0] || 'Comandante'}
                  </h1>
                  <p className="text-xl text-blue-200">
                    Centro de Comando Galáctico
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm text-white/70">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>Jedi Master</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-white">98.5%</p>
                <p className="text-sm text-blue-200">Sistema Online</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 border-2 border-green-400/30 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={stat.title} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl" 
                 style={{background: `linear-gradient(135deg, ${stat.gradient.split(' ')[1]}, ${stat.gradient.split(' ')[3]})`}}></div>
            <div className="relative backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-6 group-hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-green-400 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  <span>{stat.change}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-3xl font-bold text-white">{stat.value.toLocaleString()}</p>
                <p className="text-lg font-semibold text-white/90">{stat.title}</p>
                <p className="text-sm text-white/60">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Atividade Recente</h3>
              <button className="text-white/60 hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <div className={`p-3 rounded-xl ${activity.color}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-white">{activity.title}</p>
                    <p className="text-sm text-white/60">{activity.description}</p>
                  </div>
                  <div className="text-xs text-white/50 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Ações Rápidas</h3>
            
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button key={index} className="w-full group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur"
                       style={{background: `linear-gradient(135deg, ${action.color.split(' ')[1]}, ${action.color.split(' ')[3]})`}}></div>
                  <div className="relative flex items-center space-x-4 p-4 rounded-xl bg-white/5 group-hover:bg-white/10 transition-all duration-300 border border-white/10 group-hover:border-white/20">
                    <div className={`p-2 bg-gradient-to-br ${action.color} rounded-lg shadow-lg`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white group-hover:text-white transition-colors">
                        {action.title}
                      </p>
                      <p className="text-sm text-white/60">{action.description}</p>
                    </div>
                    <Plus className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Status do Sistema</h3>
            
            <div className="space-y-4">
              {[
                { name: 'API Server', status: 'Online', uptime: '99.9%', color: 'bg-green-500' },
                { name: 'Database', status: 'Online', uptime: '98.7%', color: 'bg-green-500' },
                { name: 'Auth Service', status: 'Online', uptime: '99.5%', color: 'bg-green-500' },
                { name: 'File Storage', status: 'Warning', uptime: '97.2%', color: 'bg-yellow-500' }
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 ${service.color} rounded-full animate-pulse`}></div>
                    <span className="text-white font-medium">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/80">{service.status}</p>
                    <p className="text-xs text-white/60">{service.uptime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;