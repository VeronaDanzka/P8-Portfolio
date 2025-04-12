import { useState, useEffect } from 'react';
const ProjectsMosaique = ({ projects, loading, error, onEdit, onDelete }) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [successSelected, setSuccessSelected] = useState(false);
    
    useEffect( () => {
        async function fetchSelectedIds() {
            try {
                const response = await fetch('/api/public/projects/checked');
                const data = await response.json();
                const ids = data.map((item) => item.id);
                setSelectedIds(ids); 
                } catch (err) {
                console.error("Erreur lors de la récupération des projets sélectionnés :", err);
                }
            }
        
        fetchSelectedIds();
    }, []);
    const handleBulkSend = async () => {
        try {
            setSuccessSelected(false);
            const res = await fetch('/api/private/projects/checked', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selectedIds }),
            });
        
            const data = await res.json();
            if (res.ok && data.success) {
                setSuccessSelected(true);
            } else {
                console.error('❌ Erreur serveur :', data.error || res.statusText);
            }
        } catch (err) {
          console.error('❌ Erreur côté client :', err);
        }
    };
    // filtre des projets sélectionnés pour le slide en page d'accueil
    const handleCheckboxChange = (id) => {
        setSuccessSelected(false);
        setSelectedIds((prev) =>
          prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
      };
    return(
        <>
            {loading && <p className="text-center">Chargement...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {selectedIds.length > 0 && (
                    <div className="text-center mb-4">
                        {successSelected &&(<p className="text-sm text-gray-500 mb-5">projets sélectionnés avec succès !</p>)}
                        <button
                            onClick={handleBulkSend}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            >
                            Valider la sélection
                        </button>
                    </div>
                )}
                {!loading && !error && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.length === 0 ? (
                        <p className="col-span-full text-center">Aucun projet pour le moment.</p>
                    ) : (
                        projects.map((project) => (
                        <div
                            key={project.id}
                            className="rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700 flex flex-col"
                        >
                            {project.imageUrl && (
                            <img
                                src={project.imageUrl}
                                alt={project.title}
                                className="w-full h-48 object-cover"
                            />
                            )}
                            <div className="p-4 flex-1">
                                <h3 className="text-lg font-semibold">{project.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{project.subtitle}</p>
                            </div>
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between gap-2">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(project.id)}
                                        onChange={() => handleCheckboxChange(project.id)}
                                        className="cursor-pointer mr-2 h-4 w-4"
                                    />
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEdit(project.id)}
                                        className="cursor-pointer px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => onDelete(project.id)}
                                        className="cursor-pointer px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                        ))
                    )}
                    </div>
                )}
            </>
    )};

export default ProjectsMosaique;