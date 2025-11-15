// src/components/exhibition/CreateExhibition.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import exhibitionService from '../../services/exhibitionService';

const CreateExhibition = ({ currentUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    exhibition_type: 'virtual',
    physical_location: '',
    virtual_url: '',
    start_date: '',
    end_date: '',
    status: 'draft'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newExhibition = await exhibitionService.createExhibition(formData);
      navigate(`/exhibition/${newExhibition.id}`);
    } catch (error) {
      console.error('Error creating exhibition:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Crear Nueva Exposición</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campos del formulario */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título de la Exposición *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-colonial-yellow focus:border-colonial-yellow"
              placeholder="Ingresa el título de la exposición"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-colonial-yellow focus:border-colonial-yellow"
              placeholder="Describe la exposición..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Exposición *
            </label>
            <select
              value={formData.exhibition_type}
              onChange={(e) => setFormData({...formData, exhibition_type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-colonial-yellow focus:border-colonial-yellow"
            >
              <option value="virtual">Virtual</option>
              <option value="physical">Presencial</option>
              <option value="hybrid">Híbrida</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-colonial-yellow focus:border-colonial-yellow"
            >
              <option value="draft">Borrador</option>
              <option value="active">Activa</option>
              <option value="scheduled">Programada</option>
            </select>
          </div>

          {formData.exhibition_type !== 'virtual' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación Física
              </label>
              <input
                type="text"
                value={formData.physical_location}
                onChange={(e) => setFormData({...formData, physical_location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-colonial-yellow focus:border-colonial-yellow"
                placeholder="Dirección o lugar de la exposición"
              />
            </div>
          )}

          {formData.exhibition_type !== 'physical' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Virtual
              </label>
              <input
                type="url"
                value={formData.virtual_url}
                onChange={(e) => setFormData({...formData, virtual_url: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-colonial-yellow focus:border-colonial-yellow"
                placeholder="https://..."
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/galeria')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-colonial-yellow text-white rounded-lg hover:bg-colonial-dark-yellow transition-colors disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Exposición'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExhibition;
