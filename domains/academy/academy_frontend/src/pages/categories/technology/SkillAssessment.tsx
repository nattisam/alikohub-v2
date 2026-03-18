import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import Layout from '@/components/categories/technology/layout/Layout';
import { Button } from '@/components/categories/technology/ui/button';
import { Input } from '@/components/categories/technology/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/categories/technology/ui/radio-group';
import { Label } from '@/components/categories/technology/ui/label';
import { isFeatureEnabled } from '@/lib/categories/technology/featureFlags';
import { programs } from '@/data/categories/technology/programs';

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string; tracks: string[] }[];
}

const questions: Question[] = [
  {
    id: 'interest',
    question: 'What area of tech interests you most?',
    options: [
      { value: 'building', label: 'Building websites and apps', tracks: ['Software Engineering'] },
      { value: 'data', label: 'Analyzing data and finding insights', tracks: ['Data & Analytics'] },
      { value: 'ai', label: 'AI and machine learning', tracks: ['AI & Machine Learning'] },
      { value: 'design', label: 'Designing user experiences', tracks: ['UX/UI & Product'] },
      { value: 'infrastructure', label: 'Cloud and infrastructure', tracks: ['Cloud & DevOps'] },
      { value: 'security', label: 'Cybersecurity', tracks: ['Cybersecurity'] },
    ],
  },
  {
    id: 'experience',
    question: 'What is your current experience level?',
    options: [
      { value: 'none', label: 'Complete beginner - no coding experience', tracks: [] },
      { value: 'some', label: 'Some exposure - taken a few tutorials', tracks: [] },
      { value: 'intermediate', label: 'Intermediate - built small projects', tracks: [] },
      { value: 'professional', label: 'Professional - working in a related field', tracks: [] },
    ],
  },
  {
    id: 'goal',
    question: 'What is your primary goal?',
    options: [
      { value: 'career-change', label: 'Change careers to tech', tracks: [] },
      { value: 'upskill', label: 'Upskill in my current role', tracks: [] },
      { value: 'promotion', label: 'Get a promotion', tracks: [] },
      { value: 'freelance', label: 'Start freelancing', tracks: [] },
    ],
  },
  {
    id: 'time',
    question: 'How much time can you commit weekly?',
    options: [
      { value: 'light', label: 'Less than 10 hours', tracks: [] },
      { value: 'moderate', label: '10-20 hours', tracks: [] },
      { value: 'intensive', label: '20-30 hours', tracks: [] },
      { value: 'full-time', label: '30+ hours', tracks: [] },
    ],
  },
];

const SendResultsForm = ({ email, setEmail }: { email: string; setEmail: (v: string) => void }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSend = () => {
    if (!email) return;
    setStatus('loading');
    // Simulate sending
    setTimeout(() => {
      if (email.includes('@')) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    }, 1500);
  };

  return (
    <div>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading' || status === 'success'}
        />
        <Button onClick={handleSend} disabled={!email || status === 'loading' || status === 'success'}>
          {status === 'loading' && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
          {status === 'success' ? 'Sent!' : 'Send Results'}
        </Button>
      </div>
      {status === 'success' && (
        <p className="text-sm text-secondary mt-2 flex items-center gap-1">
          <CheckCircle className="h-4 w-4" /> Results successfully sent.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-destructive mt-2">
          Something went wrong. Please check your email and try again.
        </p>
      )}
    </div>
  );
};

const SkillAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');

  if (!isFeatureEnabled('skillAssessment')) {
    return (
      <Layout>
        <div className="container-padding mx-auto max-w-7xl py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Coming Soon</h1>
          <p className="text-muted-foreground mb-6">Skill Assessment will be available soon.</p>
          <Link to="/programs">
            <Button>Explore Programs</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getRecommendations = () => {
    const interestAnswer = questions[0].options.find(o => o.value === answers.interest);
    const recommendedCategory = interestAnswer?.tracks[0] || 'Software Engineering';
    
    const experienceLevel = answers.experience === 'none' || answers.experience === 'some' ? 'Beginner' : 'Intermediate';
    const timeCommitment = answers.time === 'light' ? 'short-course' : 'career-track';

    const recommendedPrograms = programs.filter(p => {
      if (timeCommitment === 'short-course') return p.type === 'short-course';
      return p.category === recommendedCategory || p.type === timeCommitment;
    }).slice(0, 4);

    return {
      category: recommendedCategory,
      level: experienceLevel,
      programs: recommendedPrograms,
    };
  };

  if (showResults) {
    const recommendations = getRecommendations();

    return (
      <Layout>
        <section className="section-padding">
          <div className="container-padding mx-auto max-w-3xl">
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Your Recommendations</h1>
              <p className="text-muted-foreground">
                Based on your responses, here are the programs we recommend:
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-6 mb-8">
              <h2 className="font-semibold mb-4">Your Profile</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Recommended Focus</p>
                  <p className="font-medium">{recommendations.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Readiness Level</p>
                  <p className="font-medium">{recommendations.level}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h2 className="font-semibold">Recommended Programs</h2>
              {recommendations.programs.map((program) => (
                <Link
                  key={program.id}
                  to={program.type === 'career-track' ? `/programs/career-tracks/${program.slug}` : `/programs/short-courses/${program.slug}`}
                  className="block p-4 bg-card border border-border rounded-lg hover:border-primary/20 hover:shadow-card transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{program.title}</p>
                      <p className="text-sm text-muted-foreground">{program.duration} • {program.level}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="bg-primary/5 rounded-xl p-6">
              <h3 className="font-semibold mb-2">Get Personalized Guidance</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Want to receive your results and talk to an advisor? Enter your email below.
              </p>
              <SendResultsForm email={email} setEmail={setEmail} />
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" onClick={() => { setShowResults(false); setCurrentStep(0); setAnswers({}); }}>
                Retake Assessment
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-[hsl(210,30%,16%)] via-[hsl(215,28%,14%)] to-[hsl(220,25%,11%)]">
        <div className="container-padding mx-auto max-w-7xl relative">
          <h1 className="text-3xl md:text-4xl font-bold text-accent mb-2">Skill Assessment</h1>
          <p className="text-white/70">
            Answer a few questions to get personalized program recommendations.
          </p>
        </div>
      </section>

      {/* Progress */}
      <div className="bg-background border-b border-border">
        <div className="container-padding mx-auto max-w-3xl py-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <section className="section-padding">
        <div className="container-padding mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold mb-8">{currentQuestion.question}</h2>

          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onValueChange={handleAnswer}
            className="space-y-4"
          >
            {currentQuestion.options.map((option) => (
              <div
                key={option.value}
                className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                  answers[currentQuestion.id] === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
            >
              {currentStep === questions.length - 1 ? 'See Results' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SkillAssessment;
