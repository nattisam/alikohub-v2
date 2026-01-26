import TeamActivityCard from "./TeamActivityCard";
import type {Activity} from "./types"
const TeamActivityPanel = ({ activities }:{activities: Activity[]}) => {
  return (
    <section className="flex-1 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold mb-4">Team Activity</h2>
      {activities.map(({avatar,user,time,action}, index) => (
        <TeamActivityCard key={index} avatar={avatar} time={time} action={action} user={user} />
      ))}
    </section>
  );
};

export default TeamActivityPanel;