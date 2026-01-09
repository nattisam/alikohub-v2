import { useState, useEffect, type FormEvent } from "react";
import { type Project, ProjectStatus, type User } from "./type";
import {
  FaBold,
  FaCode,
  FaItalic,
  FaLink,
  FaListOl,
  FaListUl,
} from "react-icons/fa";
import { useCreateProject } from "../queries/projects";
// import { UsersService } from "../../services/users.service";

const CreateProjectForm = () => {
  const [projectInfo, setProjectInfo] = useState<Partial<Project>>({
    name: "",
    subtitle: "",
    contractorId: "",
    inspectorId: "",
    description: "",
    status: ProjectStatus.DRAFT,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    budgetCents: null,
    progress: null,
    site: "",
  });
  const [availableContractors, setAvailableContractors] = useState<User[]>([]);
  const [availableInspectors, setAvailableInspectors] = useState<User[]>([]);
  
  const createProjectMutation = useCreateProject();
  const category = [
    ProjectStatus.ACTIVE,
    ProjectStatus.DRAFT,
    ProjectStatus.ON_HOLD,
    ProjectStatus.PLANNED,

  ]
  const handleCreateProject = async(e: FormEvent) => {
    e.preventDefault()
    
    // Format the project data to match backend expectations
    const formattedProjectData = {
      name: projectInfo.name || '',
      description: projectInfo.description || '',
      startDate: projectInfo.startDate ? new Date(projectInfo.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      endDate: projectInfo.endDate ? new Date(projectInfo.endDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], // Make sure endDate is provided
    };
    
    createProjectMutation.mutate(formattedProjectData, {
      onSuccess: (createdProject) => {
        if(createdProject) {
          alert("Project Created Successfully");
          // Reset form
          setProjectInfo({
            name: "",
            subtitle: "",
            contractorId: "",
            inspectorId: "",
            description: "",
            status: ProjectStatus.DRAFT,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            budgetCents: null,
            progress: null,
            site: "",
          });
        }
      },
      onError: (error) => {
        console.error("Error creating project:", error);
        alert("Failed to create project. Please try again.");
      }
    });
  }
  // useEffect can be added here if needed for fetching contractors and inspectors
  // useEffect(() => {
  //   // Fetch contractors and inspectors when component mounts
  // }, []);
  const handleFormValueChange = (
    event: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >,
    property: string
  ) => {
    setProjectInfo({ ...projectInfo, [property]: event.target.value });
  };

  // TODO: Fetch contractors and inspectors when component mounts
  // You can use React Query hooks here to fetch users with specific roles
  return (
    <form onSubmit={handleCreateProject} className="w-full min-h-screen max-h-fit p-5 md:p-20 md:pt-5 bg-[#E5E7EB] ">
      <div className="bg-[#FFFFFF] rounded-xl p-5 my-10 mt-5 border-1 border-gray-200">
        <h2 className="font-bold text-xl">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 ">
          <div className="flex flex-col items-start my-4">
            <label htmlFor="project_title" className="font-semibold">
              Project Title
            </label>
            <input
              className="outline-1 outline-gray-400 px-4 py-2 rounded-md w-full"
              type="text"
              id="project_title"
              name="name"
              placeholder="Enter Project Title"
              required
              value={projectInfo.name}
              onChange={(e) => handleFormValueChange(e, "name")}
            />
          </div>
          <div className="flex flex-col items-start my-4">
            <label htmlFor="project_subtitle" className="font-semibold">
              Project Subtitle
            </label>
            <input
              id="project_subtitle"
              name="subtitle"
              className="outline-1 outline-gray-400 px-4 py-2 rounded-md w-full"
              value={projectInfo.subtitle || ""}
              onChange={(e) => handleFormValueChange(e, "subtitle")}
            />
          </div>
          <div className="flex flex-col items-start my-4">
            <label htmlFor="project_category" className="font-semibold">
              Category
            </label>
            <select value={projectInfo.status || ""} className="outline-1 outline-gray-400 px-4 py-2 rounded-md w-full" onChange={(e) => handleFormValueChange(e, "status")}>
              <option value="">Select Status</option>
              {category.map((status) => (
                <option key={status} value={status}>{status.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-start my-4">
            <label htmlFor="project_location" className="font-semibold">
              Location
            </label>
            <input
              className="outline-1 outline-gray-400 px-4 py-2 rounded-md w-full"
              id="project_location"
              name="location"
              type="text"
              placeholder="Enter Location of project"
              value={projectInfo.site || ""}
              onChange={(e) => handleFormValueChange(e, "site")}
            />
          </div>
        </div>
      </div>
      <div className="bg-[#FFFFFF] rounded-xl p-5 border-1 border-gray-200">
        <h2 className="font-bold text-xl">Project Description</h2>
        <div>
          <select
            className="p-2 rounded mx-4 my-2 text-base border-1 border-gray-200"
            value={projectInfo.contractorId || ""}
            onChange={(e) => handleFormValueChange(e, "contractorId")}
          >
            <option value="">Contractor</option>
            {availableContractors.map((contractor) => (
              <option
                value={contractor.firebaseId}
              >{`${contractor.firstname} ${contractor.lastname}`}</option>
            ))}
          </select>

          <select
            className="p-2 rounded mx-4 my-2 text-base border-1 border-gray-200"
            value={projectInfo.inspectorId}
            onChange={(e) => handleFormValueChange(e, "inspectorId")}
          >
            <option value="">Inspector</option>
            {availableInspectors.map((inspector) => (
              <option
                value={inspector.firebaseId}
              >{`${inspector.firstname} ${inspector.lastname}`}</option>
            ))}
          </select>
          <input
            type="date"
            className="p-2 rounded mx-4 my-2 text-base border-1 border-gray-200"
            placeholder="Due Date"
            required
            value={
              typeof projectInfo.endDate === "string"
                ? projectInfo.endDate
                : projectInfo.endDate instanceof Date
                  ? projectInfo.endDate.toISOString().split('T')[0]
                  : new Date().toISOString().split('T')[0]
            }
            onChange={(e) => handleFormValueChange(e, "endDate")}
          />
        </div>
        <div className="border-gray-200 border-2 rounded">
          {/*
           //TODO: will added LaTex text editor 
          */}
          <div className="flex flex-row gap-x-4 p-2 bg-[#E5E7EB]">
            <button type="button" className="text-sm">
              <FaBold />
            </button>
            <button type="button" className="text-sm">
              <FaItalic />
            </button>
            <button type="button" className="text-sm">
              <FaListUl />
            </button>
            <button type="button" className="text-sm">
              <FaListOl />
            </button>
            <button type="button" className="text-sm">
              <FaLink />
            </button>
            <button type="button" className="text-sm">
              <FaCode />
            </button>
          </div>
          <textarea
            value={projectInfo.description || ""}
            onChange={(e) => handleFormValueChange(e, "description")}
            className="rounded w-full"
            rows={5}
            placeholder="Describe what your project is about ..."
          />
        </div>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 text-lg rounded mt-10">Create Project</button>
      {createProjectMutation.isPending && (
        <div className="inset-0 z-20 w-full">
          <div className="w-32 h-32 flex items-center justify-center">Creating...</div>
        </div>
      )}
      {createProjectMutation.isError && (
        <div className="inset-0 z-20 w-full">
          <div className="w-5xl h-80">
            <p className="text-red-500 text-lg">Error creating project: {createProjectMutation.error?.message}</p>
          </div>
        </div>
      )}
    </form>
  );
};
export default CreateProjectForm;
