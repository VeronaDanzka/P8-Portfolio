const ProjectsMosaique = ({ projects, loading, error, onEdit, onDelete }) => {
    projects.map((project) => {
        console.log("🧪 Project rendu :", project)
    });
    return(
        <>
            {loading && <p className="text-center">Chargement...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}

                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                        ))
                    )}
                    </div>
                )}
            </>
    )};

export default ProjectsMosaique;