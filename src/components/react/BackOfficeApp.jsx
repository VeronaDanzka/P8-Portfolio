import CreateProject from './CreateProject';
import Projects from './Projects';
import { useState } from 'react';





const BackofficeApp = () => {
  const [view, setView] = useState('createProject');
  const [projectView, setProjectView] = useState('mosaique');
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Sidebar */}
      <aside className="bg-white dark:bg-gray-800 shadow-md w-full md:w-64 p-6">
        <h1 className="text-xl font-bold mb-6">Admin 💼</h1>
        <nav className="space-y-3">
          <button onClick={() => setView('createProject')} className={`cursor-pointer block w-full text-left px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${view === 'createProject' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
            Créer un projet
          </button>
          <button onClick={() => { setView('projects'); setProjectView('mosaique'); }} className={`cursor-pointer block w-full text-left px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${view === 'projects' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
            Projets
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* change la vue du backoffice en fonction du clic */}
        {view === 'createProject' && <CreateProject setView={setProjectView} client:visible />}
        {view === 'projects' && <Projects setProjectView={setProjectView} projectView={projectView} client:visible />}
      </main>
    </div>
  );
};

export default BackofficeApp;