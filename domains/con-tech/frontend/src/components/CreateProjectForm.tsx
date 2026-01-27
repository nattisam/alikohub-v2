import { useState, type FormEvent } from "react";
import { ProjectStatus, type Project, type User } from "./types";
import {
  FaBold,
  FaItalic,
  FaLink,
  FaListUl,
  FaProjectDiagram,
} from "react-icons/fa";
import { useCreateProject } from "../queries/projects";

const CreateProjectForm = () => {
  const [projectInfo, setProjectInfo] = useState<Partial<Project>>({
    name: "",
    subtitle: "",
    contractorId: "",
    clientId: "",
    description: "",
    status: ProjectStatus.ACTIVE,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default +90 days
    site: "",
  });
  
  // Mocking available users for now - in production these would come from useUsers({role: '...'})
  const availableContractors: User[] = [];
  const availableClients: User[] = [];
  
  const createProjectMutation = useCreateProject();
  const categoryList = [
    ProjectStatus.ACTIVE,
    ProjectStatus.PLANNED,
    ProjectStatus.ON_HOLD,
    ProjectStatus.COMPLETED,
  ]

  const handleCreateProject = async(e: FormEvent) => {
    e.preventDefault()
    
    const formattedProjectData = {
      name: projectInfo.name || '',
      description: projectInfo.description || '',
      contractorId: projectInfo.contractorId || undefined,
      clientId: projectInfo.clientId || undefined,
      status: projectInfo.status || 'ACTIVE',
      site: projectInfo.site || '',
      startDate: projectInfo.startDate,
      endDate: projectInfo.endDate,
    };
    
    createProjectMutation.mutate(formattedProjectData, {
      onSuccess: (createdProject) => {
        if(createdProject) {
          alert("Project Created Successfully");
          setProjectInfo({
            name: "",
            subtitle: "",
            contractorId: "",
            clientId: "",
            description: "",
            status: ProjectStatus.ACTIVE,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            site: "",
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
    <div className="w-full min-h-screen bg-slate-50 p-6 md:p-10 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Initiate New Project</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium font-serif italic">Assign internal staff and partners to a project scope</p>
          </div>
          <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-200">
            <FaProjectDiagram className="text-white text-xl" />
          </div>
        </header>

        <form onSubmit={handleCreateProject} className="space-y-8 pb-20">
          <section className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
            <h2 className="text-lg font-black text-slate-900 mb-8 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs">01</span>
              General Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Project Name</label>
                <input
                  className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-2xl py-4 px-6 transition-all outline-none font-bold text-slate-900"
                  type="text"
                  placeholder="e.g. G+5 Residential Building – Ayat"
                  required
                  value={projectInfo.name}
                  onChange={(e) => handleFormValueChange(e, "name")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Site Location</label>
                <input
                  className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-2xl py-4 px-6 transition-all outline-none font-bold text-slate-900"
                  type="text"
                  placeholder="Street Address or Coordinates"
                  value={projectInfo.site || ""}
                  onChange={(e) => handleFormValueChange(e, "site")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Scope / Category</label>
                <select 
                  value={projectInfo.status || ""} 
                  className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-2xl py-4 px-6 transition-all outline-none font-bold text-slate-900 appearance-none" 
                  onChange={(e) => handleFormValueChange(e, "status")}
                >
                  <option value="">Select Status</option>
                  {categoryList.map((status) => (
                    <option key={status} value={status}>{status.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Target End Date</label>
                <input
                  type="date"
                  className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-2xl py-4 px-6 transition-all outline-none font-bold text-slate-900"
                  required
                  value={typeof projectInfo.endDate === "string" ? projectInfo.endDate : ""}
                  onChange={(e) => handleFormValueChange(e, "endDate")}
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>
            <h2 className="text-lg font-black text-slate-900 mb-8 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs">02</span>
              Assignments & Context
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Project Contractor</label>
                <select
                  className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-2xl py-4 px-6 transition-all outline-none font-bold text-slate-900 appearance-none"
                  value={projectInfo.contractorId || ""}
                  onChange={(e) => handleFormValueChange(e, "contractorId")}
                >
                  <option value="">Search internal staff...</option>
                  {availableContractors.map((contractor) => (
                    <option key={String(contractor.firebaseId)} value={contractor.firebaseId}>
                      {`${contractor.firstname} ${contractor.lastname}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Primary Client</label>
                <select
                  className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-2xl py-4 px-6 transition-all outline-none font-bold text-slate-900 appearance-none"
                  value={projectInfo.clientId || ""}
                  onChange={(e) => handleFormValueChange(e, "clientId")}
                >
                  <option value="">Search partners...</option>
                  {availableClients.map((client) => (
                    <option key={String(client.firebaseId)} value={client.firebaseId}>
                      {`${client.firstname} ${client.lastname}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Project Roadmap & Description</label>
              <div className="border border-slate-100 rounded-3xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                <div className="flex flex-row gap-x-2 p-3 bg-slate-50 border-b border-slate-100">
                  <button type="button" className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-all"><FaBold /></button>
                  <button type="button" className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-all"><FaItalic /></button>
                  <button type="button" className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-all"><FaListUl /></button>
                  <button type="button" className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-all"><FaLink /></button>
                </div>
                <textarea
                  value={projectInfo.description || ""}
                  onChange={(e) => handleFormValueChange(e, "description")}
                  className="w-full bg-white py-6 px-8 outline-none font-medium text-slate-700 placeholder:italic"
                  rows={6}
                  placeholder="Outline the key phases and materials for this project..."
                />
              </div>
            </div>
          </section>

          <footer className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900 p-8 rounded-3xl shadow-2xl">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Final Authorization</p>
              <p className="text-white text-sm mt-1">Check all assignments before initializing.</p>
            </div>
            <button 
              type="submit" 
              disabled={createProjectMutation.isPending}
              className="w-full md:w-auto bg-blue-500 hover:bg-blue-400 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-tighter"
            >
              {createProjectMutation.isPending ? 'Processing...' : 'Create Project Hub'}
              <FaLink className="text-xs" />
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectForm;
