import ProjectForm from "./ProjectForm";

const CreateProject = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Créer un projet</h2>
      <ProjectForm client:visible />
    </div>
  );

export default CreateProject;