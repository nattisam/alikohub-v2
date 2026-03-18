import { Link } from 'react-router-dom';
import { Code2, Sparkles, ArrowRight } from 'lucide-react';
import Layout from '@/components/categories/technology/layout/Layout';
import { Button } from '@/components/categories/technology/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/categories/technology/ui/select';
import { useState } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  track: string;
  skills: string[];
  image: string;
  type: 'capstone' | 'course-project';
  color: string;
}

const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce application with user authentication, product catalog, cart functionality, and payment integration.',
    track: 'Full-Stack Software Engineering',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    image: '💻',
    type: 'capstone',
    color: 'from-secondary to-secondary/70',
  },
  {
    id: '2',
    title: 'Customer Analytics Dashboard',
    description: 'Interactive dashboard analyzing customer behavior, segmentation, and lifetime value using real business data.',
    track: 'Data Analytics',
    skills: ['Python', 'SQL', 'Tableau', 'Statistics'],
    image: '📊',
    type: 'capstone',
    color: 'from-accent to-accent/70',
  },
  {
    id: '3',
    title: 'AI-Powered Chatbot',
    description: 'Conversational AI assistant using LLMs with RAG for context-aware responses and document Q&A.',
    track: 'AI Engineering',
    skills: ['Python', 'LangChain', 'OpenAI', 'Vector DB'],
    image: '🤖',
    type: 'capstone',
    color: 'from-accent to-accent/70',
  },
  {
    id: '4',
    title: 'Mobile Banking App Redesign',
    description: 'Complete UX redesign of a mobile banking application with user research, prototyping, and usability testing.',
    track: 'UX/UI Design',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    image: '📱',
    type: 'capstone',
    color: 'from-secondary to-secondary/70',
  },
  {
    id: '5',
    title: 'Cloud Infrastructure Deployment',
    description: 'Multi-tier application deployment on AWS with Infrastructure as Code, auto-scaling, and monitoring.',
    track: 'Cloud Engineering',
    skills: ['AWS', 'Terraform', 'Docker', 'Kubernetes'],
    image: '☁️',
    type: 'capstone',
    color: 'from-accent to-accent/70',
  },
  {
    id: '6',
    title: 'Security Operations Center Simulation',
    description: 'Simulated SOC environment with threat detection, incident response, and security monitoring implementation.',
    track: 'Cybersecurity Analyst',
    skills: ['Splunk', 'SIEM', 'Incident Response', 'Threat Analysis'],
    image: '🔒',
    type: 'capstone',
    color: 'from-secondary to-secondary/70',
  },
];

const tracks = [
  'All Tracks',
  'Full-Stack Software Engineering',
  'Data Analytics',
  'AI Engineering',
  'UX/UI Design',
  'Cloud Engineering',
  'Cybersecurity Analyst',
];

const Projects = () => {
  const [selectedTrack, setSelectedTrack] = useState('All Tracks');

  const filteredProjects = selectedTrack === 'All Tracks'
    ? sampleProjects
    : sampleProjects.filter(p => p.track === selectedTrack);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[hsl(210,30%,16%)] via-[hsl(215,28%,14%)] to-[hsl(220,25%,11%)]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />
        <div className="container-padding mx-auto max-w-7xl relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-1 bg-secondary rounded-full" />
              <span className="text-secondary font-semibold text-sm">Portfolio-Ready Work</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-accent mb-6">
              Projects & Portfolio
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Explore sample projects and capstones built by our students. Every program includes hands-on, portfolio-ready projects.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-40 bg-background/95 backdrop-blur-lg border-b border-border py-4 shadow-sm">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-foreground">Filter by Track:</span>
            <Select value={selectedTrack} onValueChange={setSelectedTrack}>
              <SelectTrigger className="w-[280px] h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tracks.map((track) => (
                  <SelectItem key={track} value={track}>{track}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground ml-auto">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="bg-card rounded-2xl overflow-hidden border border-border hover:border-secondary/30 hover:shadow-xl transition-all group"
              >
                {/* Image placeholder */}
                <div className={`aspect-video bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="text-7xl relative z-10 group-hover:scale-110 transition-transform">{project.image}</span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs px-3 py-1 bg-secondary/10 text-secondary rounded-full font-bold uppercase">
                      {project.type === 'capstone' ? 'Capstone' : 'Course Project'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-secondary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <p className="text-sm text-muted-foreground mb-4">
                    <span className="font-semibold text-foreground">Track:</span> {project.track}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-3 py-1 bg-muted rounded-full text-muted-foreground font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No projects found for this track.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-[hsl(var(--secondary-dark))] to-[hsl(18,80%,32%)] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="container-padding mx-auto max-w-7xl text-center relative">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Build Your Own Portfolio</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Every program includes multiple projects designed to showcase your skills to employers.
          </p>
          <Link to="/programs">
            <Button size="lg" className="bg-white text-secondary hover:bg-white/90 font-bold h-14 px-8 rounded-xl shadow-lg">
              Explore Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
