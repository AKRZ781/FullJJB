import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTimes, FaEdit } from 'react-icons/fa';

function AdminTechnique() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [techniques, setTechniques] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const maxDescriptionLength = 1000;
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTechniques = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/techniques`, { withCredentials: true });
        setTechniques(res.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des techniques:', error);
      }
    };

    fetchTechniques();
  }, [apiUrl]);

  const handleAdminTechnique = async () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Le titre est requis.';
    if (!description.trim()) newErrors.description = 'La description est requise.';
    if (description.length > maxDescriptionLength) newErrors.description = `La description doit contenir au maximum ${maxDescriptionLength} caractères.`;
    if (!editMode && !videoFile) newErrors.videoFile = 'La vidéo est requise.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (videoFile) formData.append('video', videoFile);

    try {
      let res;
      if (editMode) {
        res = await axios.put(`${apiUrl}/api/techniques/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
      } else {
        res = await axios.post(`${apiUrl}/api/techniques`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
      }

      if (res.data.Status === "Success") {
        alert(editMode ? 'Technique mise à jour avec succès.' : 'Technique ajoutée avec succès.');
        setTitle('');
        setDescription('');
        setVideoFile(null);
        fileInputRef.current.value = '';
        setErrors({});
        if (editMode) {
          setTechniques(techniques.map((tech) => (tech.id === editId ? res.data.Data : tech)));
          setEditMode(false);
          setEditId(null);
        } else {
          setTechniques([...techniques, res.data.Data]);
        }
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout/mise à jour de la technique:', err);
    }
  };

  const handleDeleteTechnique = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette technique ?')) {
      return;
    }

    try {
      await axios.delete(`${apiUrl}/api/techniques/${id}`, { withCredentials: true });
      setTechniques(techniques.filter((technique) => technique.id !== id));
      alert('Technique supprimée avec succès.');
    } catch (error) {
      console.error('Erreur lors de la suppression de la technique:', error);
    }
  };

  const handleEditTechnique = (technique) => {
    setTitle(technique.title);
    setDescription(technique.description);
    setEditMode(true);
    setEditId(technique.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAccessTechniques = () => {
    navigate('/home');
  };

  return (
    <div className="container-fluid d-flex flex-column" style={{ backgroundColor: '#000235', minHeight: '100vh', color: 'white' }}>
      <div className="container mt-5">
        <h2>{editMode ? 'Modifier la Technique' : 'Ajouter une Technique'}</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Titre</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <div className="text-danger">{errors.title}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={maxDescriptionLength}
            ></textarea>
            <div>{description.length}/{maxDescriptionLength} caractères</div>
            {errors.description && <div className="text-danger">{errors.description}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="video" className="form-label">Vidéo</label>
            <input
              type="file"
              className="form-control"
              id="video"
              onChange={(e) => setVideoFile(e.target.files[0])}
              ref={fileInputRef}
            />
            {editMode && <div className="form-text text-white">Laissez ce champ vide pour conserver la vidéo actuelle.</div>}
            {errors.videoFile && <div className="text-danger">{errors.videoFile}</div>}
          </div>
          <button type="button" className="btn btn-dark" onClick={handleAdminTechnique}>
            {editMode ? 'Mettre à jour' : 'Ajouter'}
          </button>
          <button type="button" className="btn btn-dark ms-3" onClick={handleAccessTechniques}>
            Retour aux Techniques
          </button>
        </form>

        <div className="mt-5">
          <h2>Liste des Techniques</h2>
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Titre</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {techniques.map((technique, index) => (
                <tr key={technique.id}>
                  <td>{index + 1}</td>
                  <td>{technique.title}</td>
                  <td>
                    <button className="btn btn-danger me-2" onClick={() => handleDeleteTechnique(technique.id)}>
                      <FaTimes />
                    </button>
                    <button className="btn btn-warning" onClick={() => handleEditTechnique(technique)}>
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminTechnique;
