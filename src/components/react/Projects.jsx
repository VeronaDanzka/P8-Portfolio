import ProjectsMosaique from './ProjectsMosaique.jsx';
import ProjectForm from './ProjectForm.jsx';
import { useState, useEffect } from 'react';

const Projects = ({setProjectView, projectView}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/private/projects');
        if (!res.ok) throw new Error("Erreur lors de la récupération des projets");

        const data = await res.json();
        setProjects(data);
      } catch (err) {
        setError(err.message || 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [projectView]);

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Supprimer ce projet ?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/private/projects/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      // Supprime le projet côté front
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || 'Erreur inconnue');
    }
  };

  const handleEdit = (id) => {
    setProjectView('edit');
    setSelectedProjectId(id);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-semibold mb-6 text-center">Aperçu des projets</h2>
      {projectView === 'mosaique' && <ProjectsMosaique projects={projects} loading={loading} error={error} onEdit={handleEdit} onDelete={handleDelete} client:visible />}
      {projectView === 'edit' && <ProjectForm modify={true} setView={setProjectView} projects={projects.find(p => p.id === selectedProjectId)} client:visible />}
    </div>
  );
};

export default Projects;
