import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProject } from "../queries/projects";
import { useUsersByRole } from "../queries/users";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  Loader2,
  Calendar,
  FileText,
  User,
  Layout,
  Save,
  HardHat,
} from "lucide-react";
import Swal from "sweetalert2";

const CreateProjectForm = () => {
  const navigate = useNavigate();
  const [projectInfo, setProjectInfo] = useState({
    name: "",
    description: "",
    clientId: "",
    contractorId: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  const createProjectMutation = useCreateProject();
  const { data: clients, isLoading: loadingClients } = useUsersByRole("CLIENT");
  const { data: contractors, isLoading: loadingContractors } =
    useUsersByRole("CONTRACTOR");

  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();

    const formattedStartDate = new Date(projectInfo.startDate).toISOString();
    const formattedEndDate = new Date(projectInfo.endDate).toISOString();

    // Backend only accepts: name, description, clientId, contractorId, startDate, endDate
    if (!projectInfo.clientId || !projectInfo.contractorId) {
      Swal.fire({
        title: "Error!",
        text: "Please select both a Client and a Contractor.",
        icon: "error",
        confirmButtonColor: "#3E92D1",
      });
      return;
    }

    const formattedProjectData: Record<string, unknown> = {
      name: projectInfo.name,
      description: projectInfo.description,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      clientId: projectInfo.clientId,
      contractorId: projectInfo.contractorId,
    };

    createProjectMutation.mutate(formattedProjectData, {
      onSuccess: (createdProject) => {
        if (createdProject) {
          Swal.fire({
            title: "Success!",
            text: "Project Created Successfully",
            icon: "success",
            confirmButtonColor: "#3E92D1",
          }).then(() => {
            navigate("/admin/projects");
          });
          setProjectInfo({
            name: "",
            description: "",
            clientId: "",
            contractorId: "",
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
          });
        }
      },
      onError: (error) => {
        console.error("Error creating project:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to create project. Please check permissions.",
          icon: "error",
          confirmButtonColor: "#3E92D1",
        });
      },
    });
  };

  const handleFormValueChange = (
    event: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >,
    property: string,
  ) => {
    setProjectInfo({ ...projectInfo, [property]: event.target.value });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Project
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Assign internal staff and partners to a project scope
          </p>
        </div>
      </div>

      <form onSubmit={handleCreateProject} className="space-y-8">
        {/* Core Project Details */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Layout className="w-5 h-5 text-[#3E92D1]" />
              Project Details
            </CardTitle>
            <CardDescription>
              Enter the core information for the new construction project.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FileText className="h-4 w-4" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-[#3E92D1] transition-all shadow-sm"
                    type="text"
                    placeholder="e.g. G+5 Residential Building – Ayat"
                    required
                    value={projectInfo.name}
                    onChange={(e) => handleFormValueChange(e, "name")}
                  />
                </div>
              </div>

              {/* Primary Client */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Primary Client <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="h-4 w-4" />
                  </div>
                  <select
                    className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-[#3E92D1] transition-all shadow-sm appearance-none"
                    required
                    value={projectInfo.clientId}
                    onChange={(e) => handleFormValueChange(e, "clientId")}
                    disabled={loadingClients}
                  >
                    <option value="">Select a Client</option>
                    {clients?.map((client: any) => (
                      <option
                        key={client.id || client.firebaseId}
                        value={client.id || client.firebaseId}
                      >
                        {client.firstname} {client.lastname}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    {loadingClients ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Assigned Contractor */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Assigned Contractor <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <HardHat className="h-4 w-4" />
                  </div>
                  <select
                    className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-[#3E92D1] transition-all shadow-sm appearance-none"
                    required
                    value={projectInfo.contractorId}
                    onChange={(e) => handleFormValueChange(e, "contractorId")}
                    disabled={loadingContractors}
                  >
                    <option value="">Select a Contractor</option>
                    {contractors?.map((contractor: any) => (
                      <option
                        key={contractor.id || contractor.firebaseId}
                        value={contractor.id || contractor.firebaseId}
                      >
                        {contractor.firstname} {contractor.lastname}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    {loadingContractors ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <input
                    type="date"
                    className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-[#3E92D1] transition-all shadow-sm"
                    required
                    value={projectInfo.startDate}
                    onChange={(e) => handleFormValueChange(e, "startDate")}
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Target End Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <input
                    type="date"
                    className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-[#3E92D1] transition-all shadow-sm"
                    required
                    value={projectInfo.endDate}
                    onChange={(e) => handleFormValueChange(e, "endDate")}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={projectInfo.description}
                onChange={(e) => handleFormValueChange(e, "description")}
                className="block w-full px-4 py-3 border border-gray-200 rounded-lg text-sm leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-[#3E92D1] transition-all shadow-sm min-h-[120px]"
                rows={4}
                placeholder="e.g. Building a 5-bedroom luxury villa in Lekki, including swimming pool and landscaping."
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 px-6 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createProjectMutation.isPending}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 py-2 bg-[#3E92D1] hover:bg-[#2E82C1] text-white shadow-sm min-w-[160px]"
          >
            {createProjectMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectForm;
