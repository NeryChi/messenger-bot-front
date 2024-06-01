import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BusinessInfoForm = () => {
  const [info, setInfo] = useState({
    inscripciones: '',
    horarios: '',
    precios: '',
    lugares_de_atencion: '',
    otros_servicios: ''
  });

  useEffect(() => {
    // Obtener la información inicial desde el servidor
    axios.get(process.env.NEXT_PUBLIC_API_URL).then(response => {
      setInfo(response.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo(prevInfo => ({
      ...prevInfo, [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(process.env.NEXT_PUBLIC_API_URL, info).then(response => {
      alert('Información actualizada');
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Inscripciones:</label>
        <textarea name="inscripciones" value={info.inscripciones} onChange={handleChange} />
      </div>
      <div>
        <label>Horarios:</label>
        <textarea name="horarios" value={info.horarios} onChange={handleChange} />
      </div>
      <div>
        <label>Precios:</label>
        <textarea name="precios" value={info.precios} onChange={handleChange} />
      </div>
      <div>
        <label>Lugares de Atención:</label>
        <textarea name="lugares_de_atencion" value={info.lugares_de_atencion} onChange={handleChange} />
      </div>
      <div>
        <label>Otros Servicios:</label>
        <textarea name="otros_servicios" value={info.otros_servicios} onChange={handleChange} />
      </div>
      <button type="submit">Guardar</button>
    </form>
  );
};

export default BusinessInfoForm;
