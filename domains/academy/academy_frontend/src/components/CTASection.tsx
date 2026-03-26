import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryLink?: string;
  primaryText?: string;
  secondaryLink?: string;
  secondaryText?: string;
  onSecondaryClick?: () => void;
}

const CTASection = ({
  title = "Ready to Start Your Journey?",
  description = "Join thousands of learners building in-demand skills for real-world careers.",
  primaryLink = "https://lms.alikohub.com",
  primaryText = "Access LMS",
  secondaryLink = "/#streams",
  secondaryText = "Explore Pathways",
  onSecondaryClick,
}: CTASectionProps) => {
  return (
    <section className="section-padding bg-background border-t">
      <div className="section-container text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
          {title}
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-10">
          {description}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            className="gap-2"
            onClick={onSecondaryClick}
            asChild={!onSecondaryClick}
          >
            {onSecondaryClick ? (
              <>
                {secondaryText} <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <Link to={secondaryLink}>
                {secondaryText} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild={primaryLink.startsWith("/")}
          >
            {primaryLink.startsWith("http") ? (
              <a href={primaryLink}>{primaryText}</a>
            ) : (
              <Link to={primaryLink}>{primaryText}</Link>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
