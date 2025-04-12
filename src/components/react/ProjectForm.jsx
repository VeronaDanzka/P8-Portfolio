import { useState, useRef } from 'react';

const ProjectForm = ({ modify = false, projects, setView }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [title, setTitle] = useState(modify ? projects.title : '');
  const [subtitle, setSubtitle] = useState(modify ? projects.subtitle : '');
  const [description, setDescription] = useState(modify ? projects.description : '');
  const [tags, setTags] = useState(modify ? projects.tags : '');
  const [github, setGithub] = useState(modify ? projects.github : '');
  const [website, setWebsite] = useState(modify ? projects.website : '');
  const fileInputRef = useRef(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const method = modify ? 'PUT' : 'POST';
      const endpoint = modify ? `/api/private/projects/${projects.id}` : '/api/private/projects';
      const formData = new FormData(e.target); // Pour inclure aussi l'image

      const res = await fetch(endpoint, {
        method: method,
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi");

      if (res.ok){
        setIsLoading(false);
        setSuccess('Projet créé avec succès !');
        setTitle('');
        setSubtitle('');
        setDescription('');
        setTags('');
        setGithub('');
        setWebsite('');
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
        if (modify) {
          setView('mosaique');
        }
      }

    } catch (err) {
      setIsLoading(false);
      setError(err.message);
      
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-center">
        {modify ? 'Modifier le projet' : 'Créer un nouveau projet'}
      </h2>

      {error && <p className="text-red-500 mb-3 text-sm text-center">{error}</p>}
      {success && <p className="text-green-500 mb-3 text-sm text-center">{success}</p>} {/* Fixed success message */}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Titre</label>
          <input type="text" name="title" id="title" required value={title} onChange={e => {setTitle(e.target.value); setError('')}}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Sous-titre</label>
          <input type="text" name="subtitle" id="subtitle" required value={subtitle} onChange={e => {setSubtitle(e.target.value); setError('')}}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description (HTML autorisé)</label>
          <textarea name="description" id="description" rows="5" required value={description} onChange={e => {setDescription(e.target.value); setError('')}}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Tags (séparés par des virgules)</label>
          <input type="text" name="tags" id="tags" placeholder="astro, tailwind, react"
            required value={tags} onChange={e => {setTags(e.target.value); setError('')}}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Lien GitHub</label>
          <input type="url" name="github" id="github" value={github} onChange={e => {setGithub(e.target.value); setError('')}}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Lien site</label>
          <input type="url" name="website" id="website" value={website} onChange={e => {setWebsite(e.target.value); setError('')}}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Image {modify && <span className="text-xs">(facultatif)</span>}</label>
          <input ref={fileInputRef} type="file" name="file" id="file" accept="image/*" {...(!modify ? { required: true } : {})}
            className="mt-2 block w-full text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button type="submit" className="cursor-pointer w-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-500 text-white py-2 rounded transition">
        {isLoading ?
          <span className="inline-block w-6 h-6 mr-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          : (modify ? 'Mettre à jour le projet' : 'Créer le projet')
        }
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;