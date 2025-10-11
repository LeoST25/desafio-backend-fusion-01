import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  Edit3, 
  Trash2, 
  Save,
  X,
  User,
  Swords,
  Shield,
  Star,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  MoreHorizontal
} from 'lucide-react';

const CharacterManager = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAffiliation, setFilterAffiliation] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    homeworld: '',
    affiliation: '',
    forceUser: false,
    abilities: '',
    description: ''
  });

  const affiliations = [
    { value: 'jedi', label: 'Jedi Order', color: 'blue', icon: '⚔️' },
    { value: 'sith', label: 'Sith Lords', color: 'red', icon: '🔴' },
    { value: 'rebel', label: 'Rebel Alliance', color: 'orange', icon: '🛡️' },
    { value: 'empire', label: 'Galactic Empire', color: 'gray', icon: '👑' },
    { value: 'neutral', label: 'Neutral', color: 'green', icon: '🌟' }
  ];

  const species = [
    'Human', 'Twi\'lek', 'Rodian', 'Wookiee', 'Droid', 'Zabrak', 
    'Togruta', 'Mon Calamari', 'Ewok', 'Hutt', 'Other'
  ];

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      // Simular dados mockados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCharacters = [
        {
          id: '1',
          name: 'Luke Skywalker',
          species: 'Human',
          homeworld: 'Tatooine',
          affiliation: 'jedi',
          forceUser: true,
          abilities: 'Lightsaber Combat, Force Powers, Piloting',
          description: 'Jedi Knight and hero of the Rebel Alliance',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Darth Vader',
          species: 'Human',
          homeworld: 'Tatooine',
          affiliation: 'sith',
          forceUser: true,
          abilities: 'Dark Side Powers, Lightsaber Mastery, Strategic Mind',
          description: 'Dark Lord of the Sith',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Princess Leia',
          species: 'Human',
          homeworld: 'Alderaan',
          affiliation: 'rebel',
          forceUser: true,
          abilities: 'Leadership, Diplomacy, Force Sensitivity',
          description: 'Leader of the Rebel Alliance',
          createdAt: new Date().toISOString()
        }
      ];
      
      setCharacters(mockCharacters);
    } catch (err) {
      setError('Erro ao carregar personagens');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const openModal = (character = null) => {
    if (character) {
      setEditingCharacter(character);
      setFormData({
        name: character.name,
        species: character.species,
        homeworld: character.homeworld,
        affiliation: character.affiliation,
        forceUser: character.forceUser,
        abilities: character.abilities,
        description: character.description
      });
    } else {
      setEditingCharacter(null);
      setFormData({
        name: '',
        species: '',
        homeworld: '',
        affiliation: '',
        forceUser: false,
        abilities: '',
        description: ''
      });
    }
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCharacter(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingCharacter) {
        setCharacters(prev => prev.map(char => 
          char.id === editingCharacter.id 
            ? { ...char, ...formData }
            : char
        ));
        setSuccess('Personagem atualizado com sucesso!');
      } else {
        const newCharacter = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString()
        };
        setCharacters(prev => [...prev, newCharacter]);
        setSuccess('Personagem criado com sucesso!');
      }
      
      closeModal();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao salvar personagem');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (characterId, characterName) => {
    if (!window.confirm(`Tem certeza que deseja excluir ${characterName}?`)) {
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setCharacters(prev => prev.filter(char => char.id !== characterId));
      setSuccess('Personagem excluído com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao excluir personagem');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getAffiliationConfig = (affiliation) => {
    return affiliations.find(a => a.value === affiliation) || affiliations[4];
  };

  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.species.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAffiliation = !filterAffiliation || character.affiliation === filterAffiliation;
    return matchesSearch && matchesAffiliation;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search characters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-white/10 backdrop-blur border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <select
            value={filterAffiliation}
            onChange={(e) => setFilterAffiliation(e.target.value)}
            className="px-3 py-2 bg-white/10 backdrop-blur border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Affiliations</option>
            {affiliations.map(affiliation => (
              <option key={affiliation.value} value={affiliation.value} className="bg-slate-800 text-white">
                {affiliation.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-white/10 backdrop-blur border border-white/20 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white/20 text-white shadow-sm' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table' 
                  ? 'bg-white/20 text-white shadow-sm' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Table
            </button>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Character
          </button>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-lg flex items-center backdrop-blur-sm">
          <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
          <span className="text-green-200">{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-lg flex items-center backdrop-blur-sm">
          <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
          <span className="text-red-200">{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="relative">
            <Loader2 className="animate-spin h-8 w-8 text-white/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-purple-600/50 rounded-full animate-pulse blur"></div>
          </div>
          <span className="ml-3 text-white/70">Loading characters...</span>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCharacters.map((character) => {
                const affiliationConfig = getAffiliationConfig(character.affiliation);
                return (
                  <div key={character.id} className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-300 group">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 bg-gradient-to-tr ${affiliationConfig.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{character.name}</h3>
                            <p className="text-sm text-white/70">{character.species}</p>
                          </div>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-gray-600 rounded-md">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {character.homeworld}
                        </div>
                        <div className="flex items-center text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${affiliationConfig.color}-100 text-${affiliationConfig.color}-800`}>
                            {affiliationConfig.icon} {affiliationConfig.label}
                          </span>
                          {character.forceUser && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              ⚡ Force User
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {character.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal(character)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(character.id, character.name)}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Character</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Homeworld</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affiliation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Force User</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCharacters.map((character) => {
                    const affiliationConfig = getAffiliationConfig(character.affiliation);
                    return (
                      <tr key={character.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 bg-gradient-to-tr from-${affiliationConfig.color}-400 to-${affiliationConfig.color}-600 rounded-lg flex items-center justify-center mr-4`}>
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{character.name}</div>
                              <div className="text-sm text-gray-500">{character.description.substring(0, 50)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{character.species}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{character.homeworld}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${affiliationConfig.color}-100 text-${affiliationConfig.color}-800`}>
                            {affiliationConfig.icon} {affiliationConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {character.forceUser ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              ⚡ Yes
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => openModal(character)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(character.id, character.name)}
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
          {filteredCharacters.length === 0 && !loading && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No characters found</h3>
              <p className="text-gray-500 mb-6">Get started by creating a new character.</p>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Character
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
                  {editingCharacter ? 'Edit Character' : 'New Character'}
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
                      placeholder="Character name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
                    <select
                      name="species"
                      value={formData.species}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select species</option>
                      {species.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Homeworld</label>
                    <input
                      type="text"
                      name="homeworld"
                      value={formData.homeworld}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Home planet"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation</label>
                    <select
                      name="affiliation"
                      value={formData.affiliation}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select affiliation</option>
                      {affiliations.map(affiliation => (
                        <option key={affiliation.value} value={affiliation.value}>
                          {affiliation.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Abilities</label>
                  <input
                    type="text"
                    name="abilities"
                    value={formData.abilities}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Special abilities or skills"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Character description"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="forceUser"
                    checked={formData.forceUser}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Force User
                  </label>
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
                    {editingCharacter ? 'Update' : 'Create'}
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

export default CharacterManager;