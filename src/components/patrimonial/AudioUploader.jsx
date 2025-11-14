import React, { useState } from 'react';
import { patrimonialService } from '../../services/patrimonialService';

const AudioUploader = () => {
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    cultural_manifestation: '',
    neighborhood: '',
    author: '',
    recording_date: '',
    rights_type: 'CC BY-SA'
  });

  const handleUpload = async (file) => {
    // Implementación de subida con validación
  };

  return (
    <form>
      {/* Formulario de metadatos culturales */}
      <input 
        type="text" 
        placeholder="Título de la grabación"
        value={metadata.title}
        onChange={(e) => setMetadata({...metadata, title: e.target.value})}
      />
      <select 
        value={metadata.cultural_manifestation}
        onChange={(e) => setMetadata({...metadata, cultural_manifestation: e.target.value})}
      >
        <option value="">Seleccione manifestación cultural</option>
        <option value="cumbia">Cumbia</option>
        <option value="bullerengue">Bullerengue</option>
        <option value="champeta">Champeta</option>
      </select>
      {/* Más campos de metadatos... */}
    </form>
  );
}
