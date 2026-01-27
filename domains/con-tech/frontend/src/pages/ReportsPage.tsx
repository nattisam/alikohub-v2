import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../hooks';
import { useReports } from '../queries/reports';
import { useProjects } from '../queries/projects';
import { FaFileAlt } from "react-icons/fa";

const ReportsPage = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<string>(projectId || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: allProjects = [], isLoading: projectsLoading } = useProjects();
  const { data: reports, isLoading: reportsLoading, isError, refetch } = useReports(
    selectedProject !== 'all' ? parseInt(selectedProject) : undefined
  );

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
  }, [currentUser, navigate]);

  const filteredReports = (reports || []).filter((report: any) =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (report.summary && report.summary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (projectsLoading || reportsLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-full bg-slate-50">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Scanning Database...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50 animate-in fade-in duration-500">
      <header className="bg-white border-b border-slate-100 p-8 sm:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
           <FaFileAlt size={200} />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">System Monitoring</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium font-serif italic">Consolidated reporting and oversight logs</p>
          </div>
          <button
            onClick={() => navigate('/admin/reports/new')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-8 rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            Generate New Report
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 sm:p-12">
        {isError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-sm font-black italic">!</div>
            <div>
              <p className="text-xs font-black text-red-900 uppercase tracking-widest leading-none">Security / Sync Alert</p>
              <p className="text-[10px] font-bold text-red-400 mt-1 italic uppercase leading-none">Scanning database failed. Please verify your connection or refresh the dashboard.</p>
            </div>
          </div>
        )}
        {/* Filters */}
        <div className="mb-10 flex flex-col lg:flex-row gap-6">
          <div className="relative group flex-1">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-3xl leading-5 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-bold text-slate-900"
              placeholder="Search oversight logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative lg:w-72 group">
            <select
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                refetch();
              }}
              className="block w-full px-8 py-5 bg-white border border-slate-100 rounded-3xl leading-5 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-black text-[10px] uppercase tracking-widest appearance-none text-slate-600 cursor-pointer"
            >
              <option value="all">All Project Scopes</option>
              {allProjects.map((project: any) => (
                <option key={project.id} value={project.id.toString()}>
                  {project.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none text-slate-400">
               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {/* Reports List */}
        {filteredReports.length > 0 ? (
          <div className="grid gap-6">
            {filteredReports.map((report: any) => (
              <div 
                key={report.id} 
                className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer"
                onClick={() => navigate(`/admin/reports/${report.id}`)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                     <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                     <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                       {report.title}
                     </h3>
                  </div>
                  <p className="text-sm font-medium text-slate-400 line-clamp-1 italic max-w-2xl leading-relaxed mb-4">
                    {report.summary || "No executive summary available for this report."}
                  </p>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1.5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                        <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black">R</div>
                        <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-600 uppercase tracking-widest">Verification Log</span>
                     </div>
                     <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">•</span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                
                <button className="px-6 py-3 bg-slate-50 group-hover:bg-slate-900 group-hover:text-white text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all">
                  Open Audit
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 border-dashed">
            <svg className="mx-auto h-16 w-16 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="mt-6 text-xl font-black text-slate-900 uppercase">Archive Empty</h3>
            <p className="mt-2 text-slate-400 font-medium italic">No monitoring logs have been recorded for this scope.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportsPage;