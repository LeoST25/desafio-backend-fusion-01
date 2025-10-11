import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter,
  Globe,
  Sun,
  Thermometer,
  Droplets,
  Wind,
  Users,
  MapPin,
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

const PlanetManager = () => {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClimate, setFilterClimate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlanet, setEditingPlanet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    climate: '',
    terrain: '',
    population: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  const climates = [
    'arid', 'temperate', 'tropical', 'frozen', 'murky', 
    'windy', 'hot', 'cold', 'humid', 'dry'
  ];

  useEffect(() => {
    loadPlanets();
  }, []);

  const loadPlanets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/planets');
      setPlanets(response.data);
    } catch (err) {
      setError('Erro ao carregar planetas');
      console.error('Error loading planets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (planet = null) => {
    if (planet) {
      setEditingPlanet(planet);
      setFormData({
        name: planet.name,
        climate: planet.climate,
        terrain: planet.terrain,
        population: planet.population.toString(),
      });
    } else {
      setEditingPlanet(null);
      setFormData({
        name: '',
        climate: '',
        terrain: '',
        population: ''
      });
    }
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlanet(null);
    setFormData({
      name: '',
      climate: '',
      terrain: '',
      population: ''
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      const planetData = {
        name: formData.name.trim(),
        climate: formData.climate,
        terrain: formData.terrain.trim(),
        population: parseInt(formData.population) || 0,
      };

      if (editingPlanet) {
        await api.put(`/planets/${editingPlanet._id}`, planetData);
        setSuccess('Planeta atualizado com sucesso!');
      } else {
        await api.post('/planets', planetData);
        setSuccess('Planeta criado com sucesso!');
      }

      closeModal();
      await loadPlanets();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar planeta');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (planetId, planetName) => {
    if (!window.confirm(`Tem certeza que deseja excluir o planeta ${planetName}?`)) {
      return;
    }

    try {
      await api.delete(`/planets/${planetId}`);
      setSuccess('Planeta excluído com sucesso!');
      await loadPlanets();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao excluir planeta');
      setTimeout(() => setError(''), 3000);
    }
  };

  const filteredPlanets = planets.filter(planet => {
    const matchesSearch = planet.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClimate = !filterClimate || planet.climate === filterClimate;
    return matchesSearch && matchesClimate;
  });

  const getClimateColor = (climate) => {
    const colors = {
      'arid': 'text-yellow-400',
      'temperate': 'text-green-400',
      'tropical': 'text-orange-400',
      'frozen': 'text-blue-400',
      'murky': 'text-gray-400',
      'windy': 'text-purple-400',
      'hot': 'text-red-400',
      'cold': 'text-cyan-400',
      'humid': 'text-teal-400',
      'dry': 'text-amber-400'
    };
    return colors[climate] || 'text-gray-400';
  };

  const getClimateIcon = (climate) => {
    const icons = {
      'arid': Sun,
      'temperate': Thermometer,
      'tropical': Droplets,
      'frozen': Wind,
      'murky': Globe,
      'windy': Wind,
      'hot': Sun,
      'cold': Wind,
      'humid': Droplets,
      'dry': Sun
    };
    return icons[climate] || Globe;
  };

  return (
    <div className="space-y-6">
      {/* Mensagens */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          <span className="text-red-300">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-center">
          <CheckCircle2 className="h-5 w-5 text-green-400 mr-2" />
          <span className="text-green-300">{success}</span>
        </div>
      )}

      {/* Header e controles */}
      <div className="card p-8 animate-fadeIn">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div>
            <h2 className="text-3xl font-bold text-gradient mb-3">Planetas da Galáxia</h2>
            <p className="text-slate-400 text-lg">Gerencie os mundos conhecidos do universo</p>
          </div>

          <button
            onClick={() => openModal()}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Novo Planeta</span>
          </button>
        </div>

        {/* Filtros */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar planetas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-12 pr-4 py-4"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <select
              value={filterClimate}
              onChange={(e) => setFilterClimate(e.target.value)}
              className="input-field w-full pl-12 pr-4 py-4"
            >
              <option value="">Todos os climas</option>
              {climates.map(climate => (
                <option key={climate} value={climate}>
                  {climate.charAt(0).toUpperCase() + climate.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de planetas */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin h-8 w-8 text-blue-400" />
          <span className="ml-2 text-gray-300">Carregando planetas...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlanets.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <Globe className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhum planeta encontrado</h3>
              <p className="text-gray-400">
                {searchTerm || filterClimate ? 'Tente ajustar os filtros' : 'Crie seu primeiro planeta'}
              </p>
            </div>
          ) : (
            filteredPlanets.map((planet) => {
              const ClimateIcon = getClimateIcon(planet.climate);
              return (
                <div
                  key={planet._id}
                  className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{planet.name}</h3>
                        <div className="flex items-center space-x-1">
                          <ClimateIcon className={`w-4 h-4 ${getClimateColor(planet.climate)}`} />
                          <span className={`text-sm ${getClimateColor(planet.climate)}`}>
                            {planet.climate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openModal(planet)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(planet._id, planet.name)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">
                        <span className="text-gray-400">Terreno:</span> {planet.terrain}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">
                        <span className="text-gray-400">População:</span>{' '}
                        {planet.population.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal de criação/edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-white">
                {editingPlanet ? 'Editar Planeta' : 'Novo Planeta'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Planeta
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Tatooine"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Clima
                </label>
                <select
                  name="climate"
                  value={formData.climate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione o clima</option>
                  {climates.map(climate => (
                    <option key={climate} value={climate}>
                      {climate.charAt(0).toUpperCase() + climate.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Terreno
                </label>
                <input
                  type="text"
                  name="terrain"
                  value={formData.terrain}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: desert, forest, mountains"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  População
                </label>
                <input
                  type="number"
                  name="population"
                  value={formData.population}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 200000"
                  min="0"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {formLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      {editingPlanet ? 'Atualizar' : 'Criar'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanetManager;