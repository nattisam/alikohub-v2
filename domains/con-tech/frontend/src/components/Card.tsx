import { ArrowUpRight } from "lucide-react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className: string;
  arrowButton: string
  right: boolean | string,
  h3Class: string,
  pClass: string,
  iconClass: string
}

export default function ServiceCard({ icon, title, description, className, arrowButton, right, h3Class, pClass, iconClass }: ServiceCardProps) {
  return (
    <div className={`group md:mr-2 md:w-full relative bg-transparent  shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700  hover:border-yellow-500 cursor-pointer ${className}`}>
      {/* Icon */}
      <div className={`group mb-2 md:w-auto md:h-auto md:mx-auto ${iconClass}`}>{icon }</div>

      {/* Title */}
      <h3 className={`text-lg font-semibold  md:mb-2 md:mt-2 ${h3Class} ${right ? "text-right" : "text-left"}`}>
        {title}
      </h3>

      {/* Description */}
      <p className={`text-md leading-relaxed mb-4 ${pClass} ${right ? "text-right " : "text-left"}`}>
        {description}
      </p>

      {/* Arrow Button */}
      <div className={`absolute right-6 -bottom-6 p-1.5  md:block md:-bottom-6 md:right-6 md:p-3 bg-[#E5E4E0]/20 border-white border-[0.1px] backdrop-blur-xl ${arrowButton}`}>
        <ArrowUpRight className="text-yellow-400 group-hover:text-yellow-400 transition-colors" size={20} />
      </div>
    </div>
  );
}
