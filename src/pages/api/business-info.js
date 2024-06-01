import axios from 'axios';

const API_URL = 'https://chatiaing.azurewebsites.net/api/business-info'; // URL de tu backend

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await axios.get(API_URL);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la información del negocio' });
    }
  } else if (req.method === 'POST') {
    try {
      const response = await axios.post(API_URL, req.body);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la información del negocio' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
