type Certification = {
  id: string | number;
  title: string;
  subTitle: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  modules: number;
  time: number;
};
const CertificationsSection = () => {
  const certifications: Certification[] = [
    {
      id: 1,
      title: "AWS Certified Developer Associate",
      subTitle: "Foundation Level AWS Knowledge",
      level: "Beginner",
      modules: 4,
      time: 6,
    },
    {
      id: 2,
      title: "AWS Certified Solutions Architect Associate",
      subTitle: "Foundation Level AWS Knowledge",
      level: "Intermediate",
      modules: 6,
      time: 12,
    },
    {
      id: 3,
      title: "AWS Certified Solutions Architect Professional",
      subTitle: "Foundation Level AWS Knowledge",
      level: "Advanced",
      modules: 8,
      time: 18,
    },
    {
      id: 5,
      title: "Azure Fundamentals",
      subTitle: "Foundation Level Azure Knowledge",
      level: "Beginner",
      modules: 4,
      time: 3,
    },
    {
      id: 4,
      title: "Azure Certified Solutions Architect Professional",
      subTitle: "Foundation Level Azure Knowledge",
      level: "Advanced",
      modules: 8,
      time: 18,
    },
    {
      id: 6,
      title: "Azure Certified Solutions Architect Associate",
      subTitle: "Foundation Level Azure Knowledge",
      level: "Intermediate",
      modules: 6,
      time: 12,
    },
  ];
  return (
    <section className="my-20 px-5 md:px-10 lg:px-20">
      <h2 className="font-semibold text-xl md:text-3xl lg:text-5xl">
        Certification Paths
      </h2>
      <div className="flex flex-col items-center md:grid md:grid-cols-2 p-4 gap-x-10">
        <div className="flex flex-col gap-y-4 p-5 border-1 border-gray-200 rounded-lg bg-white">
          <h3 className="font-bold text-2xl">AWS Certification Track</h3>
          <ul className="list-none">
            {certifications
              .slice(0, 3)
              .map(({ id, title, level, subTitle, modules, time }) => (
                <div className="border-1 border-gray-200 p-4 rounded-lg my-4" key={id}>
                  <div className="flex felx-row items-center justify-between">
                    <h4>{title}</h4>
                    <span className="py-1 px-2 rounded-2xl bg-gray-300">{level}</span>
                  </div>
                  <p className="text-xl text-gray-700">{subTitle}</p>
                  <div className="flex flex-row items-center justify-between">
                    <div><span>{time} hours</span> • <span>{modules} modules</span> </div>
                    <button className="py-2 px-4">Start Learning</button>
                  </div>
                </div>
              ))}
          </ul>
        </div>
        <div className="flex flex-col gap-y-4 p-5 border-1 border-gray-200 rounded-lg bg-white">
          <h3 className="font-bold text-2xl">Azure Certification Track</h3>
          <ul className="list-none">
            {certifications
              .slice(3, 6)
              .map(({ id, title, level, subTitle, modules, time }) => (
                <div className="border-1 border-gray-200 p-4 rounded-lg my-4" key={id}>
                  <div className="flex felx-row items-center justify-between">
                    <h4>{title}</h4>
                    <span className="py-1 px-2 rounded-2xl bg-gray-300">{level}</span>
                  </div>
                  <p className="text-xl text-gray-700">{subTitle}</p>
                  <div className="flex flex-row justify-between items-center">
                    <div><span>{time} hours</span> • <span>{modules} modules</span> </div>
                    <button className="py-2 px-4">Start Learning</button>
                  </div>
                </div>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;