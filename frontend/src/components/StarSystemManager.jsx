import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  Edit3, 
  Trash2, 
  Save,
  X,
  Star,
  Globe,
  Sun,
  Orbit,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  MoreHorizontal,
  Zap
} from 'lucide-react';

const StarSystemManager = () => {
  const [starSystems, setStarSystems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    sector: '',
    starType: '',
    planets: '',
    population: '',
    government: '',
    majorTradeCommodities: '',
    description: ''
  });

  const regions = [
    { value: 'outer-rim', label: 'Outer Rim', color: 'red', icon: '🌌' },
    { value: 'mid-rim', label: 'Mid Rim', color: 'yellow', icon: '⭐' },
    { value: 'inner-rim', label: 'Inner Rim', color: 'green', icon: '💫' },
    { value: 'core-worlds', label: 'Core Worlds', color: 'blue', icon: '🏛️' },
    { value: 'deep-core', label: 'Deep Core', color: 'purple', icon: '🔥' },
    { value: 'unknown-regions', label: 'Unknown Regions', color: 'gray', icon: '❓' }
  ];

  const starTypes = [
    'Main Sequence', 'Red Giant', 'White Dwarf', 'Binary System', 
    'Neutron Star', 'Black Hole', 'Supergiant', 'Brown Dwarf'
  ];

  useEffect(() => {
    loadStarSystems();
  }, []);

  const loadStarSystems = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSystems = [
        {
          id: '1',
          name: 'Tatooine System',
          region: 'outer-rim',
          sector: 'Arkanis Sector',
          starType: 'Binary System',
          planets: '1',
          population: '200000',
          government: 'Hutt Cartel',
          majorTradeCommodities: 'Moisture, Scrap Metal',
          description: 'Desert system with twin suns, known for moisture farming',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Coruscant System',
          region: 'core-worlds',
          sector: 'Coruscant Sector',
          starType: 'Main Sequence',
          planets: '1',
          population: '1000000000000',
          government: 'Galactic Republic/Empire',
          majorTradeCommodities: 'Technology, Information, Politics',
          description: 'Capital of the galaxy, completely urbanized planet',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Hoth System',
          region: 'outer-rim',
          sector: 'Anoat Sector',
          starType: 'Main Sequence',
          planets: '3',
          population: '0',
          government: 'None',
          majorTradeCommodities: 'Ice, Minerals',
          description: 'Frozen system, former Rebel Alliance base location',
          createdAt: new Date().toISOString()
        }
      ];
      
      setStarSystems(mockSystems);
    } catch (err) {
      setError('Erro ao carregar sistemas estelares');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const openModal = (system = null) => {
    if (system) {
      setEditingSystem(system);
      setFormData({
        name: system.name,
        region: system.region,
        sector: system.sector,
        starType: system.starType,
        planets: system.planets,
        population: system.population,
        government: system.government,
        majorTradeCommodities: system.majorTradeCommodities,
        description: system.description
      });
    } else {
      setEditingSystem(null);
      setFormData({
        name: '',
        region: '',
        sector: '',
        starType: '',
        planets: '',
        population: '',
        government: '',
        majorTradeCommodities: '',
        description: ''
      });
    }
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSystem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingSystem) {
        setStarSystems(prev => prev.map(system => 
          system.id === editingSystem.id 
            ? { ...system, ...formData }
            : system
        ));
        setSuccess('Sistema estelar atualizado com sucesso!');
      } else {
        const newSystem = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString()
        };
        setStarSystems(prev => [...prev, newSystem]);
        setSuccess('Sistema estelar criado com sucesso!');
      }
      
      closeModal();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao salvar sistema estelar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (systemId, systemName) => {
    if (!window.confirm(`Tem certeza que deseja excluir o sistema ${systemName}?`)) {
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setStarSystems(prev => prev.filter(system => system.id !== systemId));
      setSuccess('Sistema estelar excluído com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao excluir sistema estelar');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getRegionConfig = (region) => {
    return regions.find(r => r.value === region) || regions[0];
  };

  const formatPopulation = (pop) => {
    const num = parseInt(pop);
    if (num >= 1000000000000) return (num / 1000000000000).toFixed(1) + 'T';
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const filteredSystems = starSystems.filter(system => {
    const matchesSearch = system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         system.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = !filterRegion || system.region === filterRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search star systems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Regions</option>
            {regions.map(region => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Table
            </button>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Star System
          </button>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
          <span className="ml-2 text-gray-600">Loading star systems...</span>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSystems.map((system) => {
                const regionConfig = getRegionConfig(system.region);
                return (
                  <div key={system.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 bg-gradient-to-tr from-${regionConfig.color}-400 to-${regionConfig.color}-600 rounded-xl flex items-center justify-center`}>
                            <Star className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{system.name}</h3>
                            <p className="text-sm text-gray-500">{system.sector}</p>
                          </div>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-gray-600 rounded-md">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${regionConfig.color}-100 text-${regionConfig.color}-800`}>
                            {regionConfig.icon} {regionConfig.label}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Sun className="w-4 h-4 mr-2" />
                          {system.starType}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-500">Planets:</span>
                          <p className="font-medium flex items-center">
                            <Globe className="w-3 h-3 mr-1" />
                            {system.planets}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Population:</span>
                          <p className="font-medium">{formatPopulation(system.population)}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Government:</span>
                          <p className="font-medium">{system.government}</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {system.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal(system)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(system.id, system.name)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">System</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Star Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planets</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Population</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSystems.map((system) => {
                    const regionConfig = getRegionConfig(system.region);
                    return (
                      <tr key={system.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 bg-gradient-to-tr from-${regionConfig.color}-400 to-${regionConfig.color}-600 rounded-lg flex items-center justify-center mr-4`}>
                              <Star className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{system.name}</div>
                              <div className="text-sm text-gray-500">{system.sector}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${regionConfig.color}-100 text-${regionConfig.color}-800`}>
                            {regionConfig.icon} {regionConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{system.starType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{system.planets}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPopulation(system.population)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => openModal(system)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(system.id, system.name)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {filteredSystems.length === 0 && !loading && (
            <div className="text-center py-12">
              <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No star systems found</h3>
              <p className="text-gray-500 mb-6">Get started by mapping a new star system.</p>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Map Star System
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModal}></div>
            
            <div className="relative inline-block w-full max-w-2xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingSystem ? 'Edit Star System' : 'New Star System'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">System Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Star system name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select region</option>
                      {regions.map(region => (
                        <option key={region.value} value={region.value}>
                          {region.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                    <input
                      type="text"
                      name="sector"
                      value={formData.sector}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Galactic sector"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Star Type</label>
                    <select
                      name="starType"
                      value={formData.starType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select star type</option>
                      {starTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Planets</label>
                    <input
                      type="number"
                      name="planets"
                      value={formData.planets}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Total planets"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Population</label>
                    <input
                      type="number"
                      name="population"
                      value={formData.population}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Total system population"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Government</label>
                    <input
                      type="text"
                      name="government"
                      value={formData.government}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Governing body or faction"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Major Trade Commodities</label>
                    <input
                      type="text"
                      name="majorTradeCommodities"
                      value={formData.majorTradeCommodities}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Primary exports/imports"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="System description and notable features"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {editingSystem ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StarSystemManager;