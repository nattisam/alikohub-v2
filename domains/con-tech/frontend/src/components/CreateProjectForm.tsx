import { useState, type FormEvent } from "react";
import { useCreateProject } from "../queries/projects";

const CreateProjectForm = () => {
  const [projectInfo, setProjectInfo] = useState({
    name: "",
    description: "",
    clientId: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default +1 year
  });
  
  const createProjectMutation = useCreateProject();

  const handleCreateProject = async(e: FormEvent) => {
    e.preventDefault()
    
    // Format dates to ISO string with time
    const formattedStartDate = new Date(projectInfo.startDate).toISOString();
    const formattedEndDate = new Date(projectInfo.endDate).toISOString();
    
    const formattedProjectData = {
      name: projectInfo.name,
      description: projectInfo.description,
      clientId: projectInfo.clientId,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
    
    createProjectMutation.mutate(formattedProjectData, {
      onSuccess: (createdProject) => {
        if(createdProject) {
          alert("Project Created Successfully");
          setProjectInfo({
            name: "",
            description: "",
            clientId: "",
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
          });
        }
      },
      onError: (error) => {
        console.error("Error creating project:", error);
        alert("Failed to create project. Please check permissions.");
      }
    });
  }

  const handleFormValueChange = (
    event: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >,
    property: string
  ) => {
    setProjectInfo({ ...projectInfo, [property]: event.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Create New Project</h2>
          <p className="text-slate-500 text-xs mt-1 font-medium font-serif italic">Assign internal staff and partners to a project scope</p>
        </div>
        <div className="text-sm font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 italic">
          Project Creation
        </div>
      </div>

      <form onSubmit={handleCreateProject} className="space-y-6">
        <div className="border-none shadow-lg shadow-slate-200/50 bg-white rounded-3xl overflow-hidden p-6">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
          <div className="mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Project Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Project Name</label>
              <input
                className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-2xl py-4 px-6 transition-all outline-none font-bold text-slate-900"
                type="text"
                placeholder="e.g. Luxury Villa Construction"
                required
                value={projectInfo.name}
                onChange={(e) => handleFormValueChange(e, "name")}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Primary Client ID</label>
              <input
                className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-2xl py-4 px-6 transition-all outline-none font-bold text-slate-900"
                type="text"
                placeholder="Client ID (e.g. 2)"
                required
                value={projectInfo.clientId}
                onChange={(e) => handleFormValueChange(e, "clientId")}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Start Date</label>
              <input
                type="date"
                className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-2xl py-4 px-6 transition-all outline-none font-bold text-slate-900"
                required
                value={projectInfo.startDate}
                onChange={(e) => handleFormValueChange(e, "startDate")}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Target End Date</label>
              <input
                type="date"
                className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-2xl py-4 px-6 transition-all outline-none font-bold text-slate-900"
                required
                value={projectInfo.endDate}
                onChange={(e) => handleFormValueChange(e, "endDate")}
              />
            </div>
          </div>
        </div>

        <div className="border-none shadow-lg shadow-slate-200/50 bg-white rounded-3xl overflow-hidden p-6">
          <div className="mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Project Description</h3>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Description</label>
            <textarea
              value={projectInfo.description}
              onChange={(e) => handleFormValueChange(e, "description")}
              className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-2xl py-4 px-6 transition-all outline-none font-bold text-slate-900"
              rows={6}
              placeholder="e.g. Building a 5-bedroom luxury villa in Lekki"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={createProjectMutation.isPending}
            className="bg-slate-900 hover:bg-slate-800 text-white font-black px-8 py-3.5 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 uppercase tracking-tight"
          >
            {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectForm;