
import React from 'react';
import trust from '../assets/trust2.png';
import people from '../assets/people.png';
import idea from '../assets/idea.png';
import clients from '../assets/clients.png';

type StatItem = {
  icon: string;
  label: string;
  value: string;
};

const stats: StatItem[] = [
  { icon: trust, label: 'Skilled Experts', value: '15+' },
  { icon: people, label: 'Finished Projects', value: '15+' },
  { icon: idea, label: 'Satisfied Clients', value: '15+' },
  { icon: clients, label: 'Services', value: '15+' },
];

const BusinessStats: React.FC = () => {
  return (
    <section className="bg-[#FFFBF5] rounded-lg px-10 py-2 w-full mx-auto shadow-md">
      {/* Responsive layout: stacked on mobile, row on desktop */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
        {/* Headline */}
        <h2 className="text-4xl font-semibold text-black leading-tight text-center md:text-left md:w-1/3">
          We are increasing business success.
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-y-10 gap-x-4 md:flex md:justify-between md:items-center md:w-2/3 md:gap-0">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center px-4 relative text-center">
              <img className='w-16 h-16' src={stat.icon} alt={stat.value} />
              <p className="text-4xl font-bold mt-2 text-[#FFC107]">{stat.value}</p>
              <p className="text-medium font-medium text-gray-700">{stat.label}</p>

              {/* Divider for desktop only */}
              {index < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 h-24 w-[2px] bg-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessStats;