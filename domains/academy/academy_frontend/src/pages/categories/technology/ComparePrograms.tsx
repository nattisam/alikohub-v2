import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, ArrowRight } from 'lucide-react';
import Layout from '@/components/categories/technology/layout/Layout';
import { Button } from '@/components/categories/technology/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/categories/technology/ui/select';
import { isFeatureEnabled } from '@/lib/categories/technology/featureFlags';
import { programs, Program } from '@/data/categories/technology/programs';

const ComparePrograms = () => {
  const [selectedPrograms, setSelectedPrograms] = useState<(Program | null)[]>([null, null, null]);

  if (!isFeatureEnabled('programComparison')) {
    return (
      <Layout>
        <div className="container-padding mx-auto max-w-7xl py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Coming Soon</h1>
          <p className="text-muted-foreground mb-6">Program Comparison will be available soon.</p>
          <Link to="/technology/programs">
            <Button>Explore Programs</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSelectProgram = (index: number, programId: string) => {
    const program = programs.find(p => p.id === programId) || null;
    const newSelected = [...selectedPrograms];
    newSelected[index] = program;
    setSelectedPrograms(newSelected);
  };

  const handleRemoveProgram = (index: number) => {
    const newSelected = [...selectedPrograms];
    newSelected[index] = null;
    setSelectedPrograms(newSelected);
  };

  const selectedCount = selectedPrograms.filter(Boolean).length;

  const compareFields = [
    { key: 'outcome', label: 'Career Outcome' },
    { key: 'duration', label: 'Duration' },
    { key: 'weeklyHours', label: 'Weekly Hours' },
    { key: 'level', label: 'Level' },
    { key: 'deliveryMode', label: 'Delivery Mode' },
    { key: 'tuition', label: 'Tuition' },
    { key: 'startDate', label: 'Next Start Date' },
    { key: 'projects', label: 'Projects' },
    { key: 'tools', label: 'Tools' },
    { key: 'mentorship', label: 'Mentorship' },
  ];

  const getFieldValue = (program: Program, field: string): string => {
    switch (field) {
      case 'outcome':
        return program.outcome;
      case 'duration':
        return program.duration;
      case 'weeklyHours':
        return program.weeklyHours;
      case 'level':
        return program.level;
      case 'deliveryMode':
        return program.deliveryMode;
      case 'tuition':
        return `$${program.tuition.toLocaleString()}`;
      case 'startDate':
        return program.startDate;
      case 'projects':
        return program.projects.length + ' projects';
      case 'tools':
        return program.tools.slice(0, 4).join(', ') + (program.tools.length > 4 ? '...' : '');
      case 'mentorship':
        return program.mentorship.cadence;
      default:
        return '-';
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[hsl(210,30%,16%)] via-[hsl(215,28%,14%)] to-[hsl(220,25%,11%)] text-white py-12">
        <div className="container-padding mx-auto max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-bold text-accent mb-2">Compare Programs</h1>
          <p className="text-white/70">
            Select up to 3 programs to compare side by side.
          </p>
        </div>
      </section>

      {/* Program Selectors */}
      <section className="border-b border-border bg-muted/50 py-6">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedPrograms.map((program, index) => (
              <div key={index} className="relative">
                {program ? (
                  <div className="bg-card border border-border rounded-lg p-4">
                    <button
                      onClick={() => handleRemoveProgram(index)}
                      className="absolute top-2 right-2 p-1 hover:bg-muted rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <p className="font-semibold pr-6">{program.title}</p>
                    <p className="text-sm text-muted-foreground">{program.type === 'career-track' ? 'Career Track' : 'Short Course'}</p>
                  </div>
                ) : (
                  <Select onValueChange={(value) => handleSelectProgram(index, value)}>
                    <SelectTrigger className="h-auto py-4">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Add Program {index + 1}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {programs
                        .filter(p => !selectedPrograms.some(sp => sp?.id === p.id))
                        .map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding">
        <div className="container-padding mx-auto max-w-7xl">
          {selectedCount < 2 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Select at least 2 programs to compare.</p>
              <Link to="/technology/programs">
                <Button>Browse Programs</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground w-1/4">
                      Feature
                    </th>
                    {selectedPrograms.map((program, index) => (
                      <th key={index} className="text-left py-4 px-4 font-semibold">
                        {program?.title || '-'}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareFields.map((field) => (
                    <tr key={field.key} className="border-b border-border">
                      <td className="py-4 px-4 font-medium text-muted-foreground">
                        {field.label}
                      </td>
                      {selectedPrograms.map((program, index) => (
                        <td key={index} className="py-4 px-4">
                          {program ? getFieldValue(program, field.key) : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* CTA Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {selectedPrograms.map((program, index) => (
                  <div key={index}>
                    {program && (
                      <Link
                        to={program.type === 'career-track' ? `/programs/career-tracks/${program.slug}` : `/programs/short-courses/${program.slug}`}
                      >
                        <Button className="w-full">
                          View {program.title}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ComparePrograms;
