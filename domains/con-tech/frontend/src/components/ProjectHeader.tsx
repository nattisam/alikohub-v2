const ProjectHeader = ({ title, subtitle }:{title:string; subtitle:string}) => {
  return (
    <header className="px-4 py-4 bg-white">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </header>
  );
};

export default ProjectHeader;