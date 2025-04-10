import { useEffect, useState } from "react";
const SlideProjects = () => {
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/public/projects/checked');
                if (!res.ok) throw new Error("Erreur lors de la récupération des projets");
        
                const projects = await res.json();
                console.log(projects)
                // Ajoute tagList à chaque projet
                const formatted = projects.map((p) => ({
                    ...p,
                    tagList: p.tags?.split(',').map(t => t.trim()) || []
                }));
                setProjects(formatted);
            } catch (err) {
                setError(err.message || 'Une erreur est survenue');
            }
        }      
        fetchProjects();
    }, []);
    return (
      <div className="overflow-hidden w-full">
        <h2 className="text-3xl mt-5 font-bold text-center mb-6">Mes projets récents</h2>
        <div className="flex w-full animate-slide gap-6">
          {projects.map((p) => (
            <a key={p.id} href={`/projects/${p.id}`} className="group block cursor-pointer flex-shrink-0 w-80">
              <article className="bg-gray-200 dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 items-center text-center hover:scale-[1.015] transition-transform duration-500 ease-in-out overflow-hidden">
  
                
                <div className="relative overflow-hidden">
                  {p.imageUrl && (
                    <div className="relative left-1/2 transform -translate-x-1/2 translate-y-25 w-60 h-60 rounded-lg overflow-hidden shadow-lg dark:shadow-black z-10 transition-transform duration-500 ease-in-out group-hover:translate-y-10">
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover object-bottom"
                      />
                    </div>
                  )}
                </div>
  
                
                <div className="p-4 border-box flex justify-between bg-white dark:bg-gray-700 relative z-50">
                  <div className="text-start">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-600 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {p.subtitle}
                    </p>
                  </div>
                  <span className="mt-4 text-sm text-gray-400 dark:text-gray-300">
                    Voir plus →
                  </span>
                </div>
  
                
                {p.tagList.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 p-2">
                    {p.tagList.map((tag, i) => (
                      <p key={i} className="px-2 py-1 text-xs font-medium bg-blue-600 dark:bg-blue-900 text-gray-100 dark:text-white rounded">
                        {tag}
                      </p>
                    ))}
                  </div>
                )}
              </article>
            </a>
          ))}
        </div>
      </div>
    );
};
  
export default SlideProjects;