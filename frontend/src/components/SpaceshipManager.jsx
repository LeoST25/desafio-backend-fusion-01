import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  Edit3, 
  Trash2, 
  Save,
  X,
  Rocket,
  Zap,
  Shield,
  Star,
  Users,
  Gauge,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  MoreHorizontal,
  Award
} from 'lucide-react';

const SpaceshipManager = () => {
  const [spaceships, setSpaceships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpaceship, setEditingSpaceship] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    manufacturer: '',
    class: '',
    crew: '',
    passengers: '',
    length: '',
    maxSpeed: '',
    hyperdrive: '',
    armament: '',
    description: ''
  });

  const shipClasses = [
    { value: 'fighter', label: 'Fighter', color: 'red', icon: '🚀' },
    { value: 'transport', label: 'Transport', color: 'blue', icon: '🚢' },
    { value: 'capital', label: 'Capital Ship', color: 'purple', icon: '🛡️' },
    { value: 'cruiser', label: 'Cruiser', color: 'green', icon: '⭐' },
    { value: 'destroyer', label: 'Destroyer', color: 'orange', icon: '💥' },
    { value: 'freighter', label: 'Freighter', color: 'gray', icon: '📦' }
  ];

  useEffect(() => {
    loadSpaceships();
  }, []);

  const loadSpaceships = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSpaceships = [
        {
          id: '1',
          name: 'Millennium Falcon',
          model: 'YT-1300f',
          manufacturer: 'Corellian Engineering Corporation',
          class: 'transport',
          crew: '2',
          passengers: '6',
          length: '34.75',
          maxSpeed: '1050',
          hyperdrive: '0.5',
          armament: 'Laser cannons, concussion missiles',
          description: 'Fast smuggling ship, used by Han Solo',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'X-wing Starfighter',
          model: 'T-65',
          manufacturer: 'Incom Corporation',
          class: 'fighter',
          crew: '1',
          passengers: '0',
          length: '12.5',
          maxSpeed: '1050',
          hyperdrive: '1.0',
          armament: '4 laser cannons, proton torpedoes',
          description: 'Primary fighter of the Rebel Alliance',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Imperial Star Destroyer',
          model: 'Imperial I-class',
          manufacturer: 'Kuat Drive Yards',
          class: 'capital',
          crew: '47000',
          passengers: '0',
          length: '1600',
          maxSpeed: '975',
          hyperdrive: '2.0',
          armament: 'Turbolasers, ion cannons, tractor beam',
          description: 'Backbone of the Imperial Navy',
          createdAt: new Date().toISOString()
        }
      ];
      
      setSpaceships(mockSpaceships);
    } catch (err) {
      setError('Erro ao carregar naves');
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

  const openModal = (spaceship = null) => {
    if (spaceship) {
      setEditingSpaceship(spaceship);
      setFormData({
        name: spaceship.name,
        model: spaceship.model,
        manufacturer: spaceship.manufacturer,
        class: spaceship.class,
        crew: spaceship.crew,
        passengers: spaceship.passengers,
        length: spaceship.length,
        maxSpeed: spaceship.maxSpeed,
        hyperdrive: spaceship.hyperdrive,
        armament: spaceship.armament,
        description: spaceship.description
      });
    } else {
      setEditingSpaceship(null);
      setFormData({
        name: '',
        model: '',
        manufacturer: '',
        class: '',
        crew: '',
        passengers: '',
        length: '',
        maxSpeed: '',
        hyperdrive: '',
        armament: '',
        description: ''
      });
    }
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSpaceship(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingSpaceship) {
        setSpaceships(prev => prev.map(ship => 
          ship.id === editingSpaceship.id 
            ? { ...ship, ...formData }
            : ship
        ));
        setSuccess('Nave atualizada com sucesso!');
      } else {
        const newSpaceship = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString()
        };
        setSpaceships(prev => [...prev, newSpaceship]);
        setSuccess('Nave criada com sucesso!');
      }
      
      closeModal();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao salvar nave');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (spaceshipId, spaceshipName) => {
    if (!window.confirm(`Tem certeza que deseja excluir ${spaceshipName}?`)) {
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSpaceships(prev => prev.filter(ship => ship.id !== spaceshipId));
      setSuccess('Nave excluída com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao excluir nave');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getClassConfig = (shipClass) => {
    return shipClasses.find(c => c.value === shipClass) || shipClasses[0];
  };

  const filteredSpaceships = spaceships.filter(spaceship => {
    const matchesSearch = spaceship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spaceship.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spaceship.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !filterClass || spaceship.class === filterClass;
    return matchesSearch && matchesClass;
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
              placeholder="Search spaceships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Classes</option>
            {shipClasses.map(shipClass => (
              <option key={shipClass.value} value={shipClass.value}>
                {shipClass.label}
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
            New Spaceship
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
          <span className="ml-2 text-gray-600">Loading spaceships...</span>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpaceships.map((spaceship) => {
                const classConfig = getClassConfig(spaceship.class);
                return (
                  <div key={spaceship.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 bg-gradient-to-tr from-${classConfig.color}-400 to-${classConfig.color}-600 rounded-xl flex items-center justify-center`}>
                            <Rocket className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{spaceship.name}</h3>
                            <p className="text-sm text-gray-500">{spaceship.model}</p>
                          </div>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-gray-600 rounded-md">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Award className="w-4 h-4 mr-2" />
                          {spaceship.manufacturer}
                        </div>
                        <div className="flex items-center text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${classConfig.color}-100 text-${classConfig.color}-800`}>
                            {classConfig.icon} {classConfig.label}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-500">Length:</span>
                          <p className="font-medium">{spaceship.length}m</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Crew:</span>
                          <p className="font-medium">{spaceship.crew}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Max Speed:</span>
                          <p className="font-medium">{spaceship.maxSpeed} km/h</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Hyperdrive:</span>
                          <p className="font-medium">Class {spaceship.hyperdrive}</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {spaceship.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal(spaceship)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(spaceship.id, spaceship.name)}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spaceship</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Length</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crew</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSpaceships.map((spaceship) => {
                    const classConfig = getClassConfig(spaceship.class);
                    return (
                      <tr key={spaceship.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 bg-gradient-to-tr from-${classConfig.color}-400 to-${classConfig.color}-600 rounded-lg flex items-center justify-center mr-4`}>
                              <Rocket className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{spaceship.name}</div>
                              <div className="text-sm text-gray-500">{spaceship.manufacturer}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{spaceship.model}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${classConfig.color}-100 text-${classConfig.color}-800`}>
                            {classConfig.icon} {classConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{spaceship.length}m</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{spaceship.crew}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => openModal(spaceship)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(spaceship.id, spaceship.name)}
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
          {filteredSpaceships.length === 0 && !loading && (
            <div className="text-center py-12">
              <Rocket className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No spaceships found</h3>
              <p className="text-gray-500 mb-6">Get started by adding a new spaceship to your fleet.</p>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Spaceship
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
            
            <div className="relative inline-block w-full max-w-3xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingSpaceship ? 'Edit Spaceship' : 'New Spaceship'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Spaceship name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Model designation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                    <input
                      type="text"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Manufacturing company"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select
                      name="class"
                      value={formData.class}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select class</option>
                      {shipClasses.map(shipClass => (
                        <option key={shipClass.value} value={shipClass.value}>
                          {shipClass.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Crew</label>
                    <input
                      type="number"
                      name="crew"
                      value={formData.crew}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Crew size"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                    <input
                      type="number"
                      name="passengers"
                      value={formData.passengers}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Passenger capacity"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Length (m)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="length"
                      value={formData.length}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Length in meters"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Speed (km/h)</label>
                    <input
                      type="number"
                      name="maxSpeed"
                      value={formData.maxSpeed}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Maximum atmospheric speed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hyperdrive Class</label>
                    <input
                      type="text"
                      name="hyperdrive"
                      value={formData.hyperdrive}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 1.0, 2.0, 0.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Armament</label>
                    <input
                      type="text"
                      name="armament"
                      value={formData.armament}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Weapons and defensive systems"
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
                    placeholder="Spaceship description and history"
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
                    {editingSpaceship ? 'Update' : 'Create'}
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

export default SpaceshipManager;