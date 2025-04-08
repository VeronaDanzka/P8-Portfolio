import CreateProject from './CreateProject';
import { useState } from 'react';



const Projects = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Projets</h2>
    <p>Gestion des projets à venir ici !</p>
  </div>
);

const BackofficeApp = () => {
  const [view, setView] = useState('createProject');

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Sidebar */}
      <aside className="bg-white dark:bg-gray-800 shadow-md w-full md:w-64 p-6">
        <h1 className="text-xl font-bold mb-6">Admin 💼</h1>
        <nav className="space-y-3">
          <button onClick={() => setView('createProject')} className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${view === 'createProject' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
            Créer un projet
          </button>
          <button onClick={() => setView('projects')} className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${view === 'projects' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
            Projets
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {view === 'createProject' && <CreateProject client:visible />}
        {view === 'projects' && <Projects client:visible />}
      </main>
    </div>
  );
};

export default BackofficeApp;