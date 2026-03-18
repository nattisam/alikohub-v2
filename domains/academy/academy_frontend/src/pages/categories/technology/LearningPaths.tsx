import { Link } from 'react-router-dom';
import { ArrowRight, Target, Compass, Clock, BookOpen } from 'lucide-react';
import Layout from '@/components/categories/technology/layout/Layout';
import { Button } from '@/components/categories/technology/ui/button';
import { isFeatureEnabled } from '@/lib/categories/technology/featureFlags';

interface LearningPath {
  id: string;
  title: string;
  careerGoal: string;
  description: string;
  tracks: string[];
  courses: string[];
  totalDuration: string;
  weeklyHours: string;
  prerequisites: string[];
}

const learningPaths: LearningPath[] = [
  {
    id: 'full-stack-career',
    title: 'Full-Stack Developer Path',
    careerGoal: 'Become a Full-Stack Developer',
    description: 'A comprehensive path from fundamentals to full-stack expertise, building both frontend and backend skills.',
    tracks: ['Full-Stack Software Engineering'],
    courses: ['Python Fundamentals', 'Git & GitHub Essentials', 'React Fundamentals'],
    totalDuration: '30-36 weeks',
    weeklyHours: '20-25 hours',
    prerequisites: ['Basic computer literacy', 'Problem-solving aptitude'],
  },
  {
    id: 'data-career',
    title: 'Data Professional Path',
    careerGoal: 'Become a Data Analyst or Data Scientist',
    description: 'Progress from data analysis fundamentals to advanced machine learning and AI.',
    tracks: ['Data Analytics', 'Data Science'],
    courses: ['Python Fundamentals', 'SQL for Data Analysis'],
    totalDuration: '44-52 weeks',
    weeklyHours: '20-30 hours',
    prerequisites: ['Basic math skills', 'Spreadsheet familiarity'],
  },
  {
    id: 'cloud-devops-career',
    title: 'Cloud & DevOps Path',
    careerGoal: 'Become a Cloud/DevOps Engineer',
    description: 'Master cloud infrastructure, automation, and reliability engineering.',
    tracks: ['Cloud Engineering', 'DevOps Engineering'],
    courses: ['AWS Cloud Practitioner Prep', 'Git & GitHub Essentials'],
    totalDuration: '38-44 weeks',
    weeklyHours: '20-25 hours',
    prerequisites: ['Linux basics', 'Scripting experience'],
  },
  {
    id: 'product-design-career',
    title: 'Product & Design Path',
    careerGoal: 'Become a Product Manager or UX Designer',
    description: 'Develop skills in user-centered design and product strategy.',
    tracks: ['UX/UI Design', 'Product Management'],
    courses: ['Figma for Designers'],
    totalDuration: '34-40 weeks',
    weeklyHours: '15-20 hours',
    prerequisites: ['Creative mindset', 'Communication skills'],
  },
];

const LearningPaths = () => {
  if (!isFeatureEnabled('learningPaths')) {
    return (
      <Layout>
        <div className="container-padding mx-auto max-w-7xl py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Coming Soon</h1>
          <p className="text-muted-foreground mb-6">Learning Paths will be available soon.</p>
          <Link to="/programs">
            <Button>Explore Programs</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[hsl(210,30%,16%)] via-[hsl(215,28%,14%)] to-[hsl(220,25%,11%)] text-white py-16">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-accent mb-4">Learning Paths</h1>
            <p className="text-lg text-white/70">
              Curated sequences of career tracks and short courses designed to guide you from where you are to where you want to be.
            </p>
          </div>
        </div>
      </section>

      {/* Paths Grid */}
      <section className="section-padding bg-gradient-to-b from-[hsl(207,45%,14%)] to-[hsl(220,25%,10%)]">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            {learningPaths.map((path) => (
              <div
                key={path.id}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Career Goal</p>
                    <h3 className="font-semibold text-secondary">{path.careerGoal}</h3>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-2">{path.title}</h2>
                <p className="text-white/60 mb-6">{path.description}</p>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Clock className="h-4 w-4 text-white/50" />
                    <span>{path.totalDuration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <BookOpen className="h-4 w-4 text-white/50" />
                    <span>{path.weeklyHours}/week</span>
                  </div>
                </div>

                {/* Recommended Programs */}
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm font-medium text-white/80 mb-2">Career Tracks:</p>
                    <div className="flex flex-wrap gap-2">
                      {path.tracks.map((track) => (
                        <span key={track} className="text-xs px-2 py-1 bg-accent/15 text-accent rounded-full">
                          {track}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80 mb-2">Short Courses:</p>
                    <div className="flex flex-wrap gap-2">
                      {path.courses.map((course) => (
                        <span key={course} className="text-xs px-2 py-1 bg-white/10 text-white/70 rounded-full">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Prerequisites */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-white/80 mb-2">Prerequisites:</p>
                  <ul className="text-sm text-white/60">
                    {path.prerequisites.map((prereq) => (
                      <li key={prereq} className="flex items-center gap-2">
                        <Compass className="h-3 w-3" />
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to="/programs">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-white">
                    Start This Path
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-b from-[hsl(215,28%,12%)] to-[hsl(220,25%,11%)] py-12">
        <div className="container-padding mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Not Sure Which Path is Right for You?</h2>
          <p className="text-white/60 mb-6">Take our skill assessment to get personalized recommendations.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/skill-assessment">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">Take Skill Assessment</Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">Talk to an Advisor</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LearningPaths;
