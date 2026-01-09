import { Users, UserCheck, MessageSquare, PlayCircle } from "lucide-react";
import coworkerTablet from "../assets/coworkerTablet.png";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

/**
 * FeaturesSection component highlights four key features, with descriptive icons and a responsive layout.
 *
 * Layout & Responsiveness:
 * - Two-column grid on desktop: Features listed on left, illustration shown on right.
 * - On mobile/tablet: Only the features list is visible; the image is hidden.
 *
 * Transitions:
 * - None animated, but the grid adapts seamlessly to screen size.
 *
 * Interaction:
 * - No clickable/interactable elements.
 */
export default function FeaturesSection(): React.ReactElement {
  const features: Feature[] = [
    {
      icon: <Users className="w-10 h-10 text-yellow-500" />,
      title: "24/7 Customer Support",
      description:
        "Provides transparent dashboards with project milestones and financial overviews for clients.",
    },
    {
      icon: <UserCheck className="w-10 h-10 text-yellow-500" />,
      title: "Seamless Integration",
      description:
        "Provides transparent dashboards with project milestones and financial overviews for clients.",
    },
    {
      icon: <MessageSquare className="w-10 h-10 text-yellow-500" />,
      title: "Community of peers",
      description:
        "Provides transparent dashboards with project milestones and financial overviews for clients.",
    },
    {
      icon: <PlayCircle className="w-10 h-10 text-yellow-500" />,
      title: "On - Demand trainings",
      description:
        "Provides transparent dashboards with project milestones and financial overviews for clients.",
    },
  ];

  return (
    <section className="static bg-gray-50 p-10 w-full mx-auto my-5">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch px-2">
        {/* Left Content */}
        <div className="divide-y-2  divide-gray-200">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4 py-6">
              <div className="flex-shrink-0">{feature.icon}</div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base mt-1">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Image */}
        <div className="hidden md:flex  items-center">
          <img
            src={coworkerTablet}
            alt="Worker with tablet"
            className="rounded-2xl shadow-md w-full h-auto"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
