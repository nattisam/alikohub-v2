import { Link } from 'react-router-dom';
import { CreditCard, Calendar, Building, CheckCircle, ArrowRight, Sparkles, Star } from 'lucide-react';
import Layout from '@/components/categories/technology/layout/Layout';
import { Button } from '@/components/categories/technology/ui/button';

const paymentOptions = [
  {
    icon: CreditCard,
    title: 'Pay in Full',
    description: 'Pay the full tuition upfront and receive a 10% discount on your program.',
    features: ['10% discount', 'One-time payment', 'Immediate access'],
    color: 'from-secondary to-secondary/80',
  },
  {
    icon: Calendar,
    title: 'Monthly Installments',
    description: 'Spread your tuition over monthly payments throughout your program duration.',
    features: ['Split into monthly payments', 'No interest charges', 'Flexible scheduling'],
    color: 'from-accent to-accent/80',
  },
  {
    icon: Building,
    title: 'Employer Sponsorship',
    description: 'Have your employer cover your tuition. We provide all necessary documentation.',
    features: ['Invoice to employer', 'Corporate billing', 'Tax documentation'],
    color: 'from-accent to-accent/70',
  },
];

const Tuition = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[hsl(210,30%,16%)] via-[hsl(215,28%,14%)] to-[hsl(220,25%,11%)]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />
        <div className="container-padding mx-auto max-w-7xl relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-1 bg-secondary rounded-full" />
              <span className="text-secondary font-semibold text-sm">Flexible Payment Options</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-accent mb-6">
              Tuition & Payment
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Transparent pricing with flexible payment plans. No hidden fees, just value.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">Program Pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our pricing reflects the value of mentor-guided, project-based learning with career support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Career Tracks */}
            <div className="relative bg-card rounded-3xl p-8 border-2 border-secondary shadow-xl overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-white text-xs font-bold">
                  <Star className="h-3 w-3" /> Most Popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-black text-foreground mb-2">Career Tracks</h3>
                <p className="text-muted-foreground">Comprehensive bootcamp programs</p>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-black text-secondary">$4,000</span>
                <span className="text-2xl font-bold text-muted-foreground"> – $10,000</span>
              </div>
              <p className="text-sm text-muted-foreground mb-8">Depending on program length and depth</p>
              <ul className="space-y-4 mb-8">
                {['16-28 weeks of instruction', '1-on-1 mentorship included', 'Career services access', 'Professional certificate'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                    </div>
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/technology/programs?type=career-track">
                <Button className="w-full h-14 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl shadow-orange">
                  View Career Tracks
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Short Courses */}
            <div className="bg-card rounded-3xl p-8 border border-border shadow-lg">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-foreground mb-2">Short Courses</h3>
                <p className="text-muted-foreground">Focused skill modules</p>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-black text-accent">$500</span>
                <span className="text-2xl font-bold text-muted-foreground"> – $1,400</span>
              </div>
              <p className="text-sm text-muted-foreground mb-8">Depending on course scope</p>
              <ul className="space-y-4 mb-8">
                {['3-6 weeks of instruction', 'Office hours & support', 'Hands-on projects', 'Certificate of completion'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/technology/programs?type=short-course">
                <Button variant="outline" className="w-full h-14 border-accent text-accent hover:bg-accent hover:text-white font-bold rounded-xl">
                  View Short Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Options */}
      <section className="section-padding bg-gradient-to-br from-[hsl(207,40%,14%)] to-[hsl(220,25%,17%)]">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Payment Options</h2>
            <p className="text-lg text-white/70">Choose the payment plan that works best for you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {paymentOptions.map((option) => (
              <div key={option.title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-colors">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-6`}>
                  <option.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{option.title}</h3>
                <p className="text-white/70 mb-6">{option.description}</p>
                <ul className="space-y-3">
                  {option.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-white/90">
                      <CheckCircle className="h-5 w-5 text-secondary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'When is tuition due?',
                a: 'For pay-in-full, payment is due before your cohort start date. For installment plans, the first payment is due at enrollment, with subsequent payments on a monthly schedule.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept credit cards, debit cards, bank transfers, and employer invoicing for corporate sponsorship.',
              },
              {
                q: 'Is there a refund policy?',
                a: 'Yes, we offer refunds within the first week of program start. Please see our Refund Policy for complete details.',
              },
              {
                q: 'Can my employer pay for my program?',
                a: 'Absolutely! Many employers offer professional development budgets. We can invoice your employer directly and provide all necessary documentation.',
              },
            ].map((item) => (
              <div key={item.q} className="bg-card rounded-2xl p-6 border border-border hover:border-secondary/30 transition-colors">
                <h3 className="font-bold text-foreground mb-2">{item.q}</h3>
                <p className="text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-accent to-[hsl(207,90%,25%)] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="container-padding mx-auto max-w-7xl text-center relative">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Invest in Your Future?</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Contact our admissions team to discuss payment options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/technology/admissions">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-bold h-14 px-8 rounded-xl shadow-orange">
                Start Application
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/technology/contact">
              <Button size="lg" className="bg-white text-accent hover:bg-white/90 font-bold h-14 px-8 rounded-xl shadow-lg">
                Contact Admissions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Tuition;
