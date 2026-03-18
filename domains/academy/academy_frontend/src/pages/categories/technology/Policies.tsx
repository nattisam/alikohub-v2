import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/categories/technology/layout/Layout';
import { Button } from '@/components/categories/technology/ui/button';

const policies = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'January 1, 2026',
    content: `
## 1. Introduction

Aliko Academy – Tech ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.

## 2. Information We Collect

### Personal Information
We may collect personal information that you voluntarily provide to us when you:
- Register for an account
- Enroll in a program
- Subscribe to our newsletter
- Contact us with inquiries
- Apply for admission

This information may include:
- Name and contact information
- Educational background
- Payment information
- Employment history

### Automatically Collected Information
When you visit our website, we may automatically collect:
- IP address
- Browser type
- Device information
- Usage data and analytics

## 3. How We Use Your Information

We use collected information to:
- Process enrollments and applications
- Provide educational services
- Communicate with you about programs
- Improve our services
- Comply with legal obligations

## 4. Information Sharing

We do not sell your personal information. We may share information with:
- Service providers who assist our operations
- Legal authorities when required by law
- Partners with your consent

## 5. Data Security

We implement appropriate security measures to protect your information. However, no method of transmission over the internet is 100% secure.

## 6. Your Rights

You have the right to:
- Access your personal information
- Request corrections
- Request deletion
- Opt-out of communications

## 7. Contact Us

For privacy-related inquiries, contact us at privacy@alikoacademy.tech.
    `,
  },
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'January 1, 2026',
    content: `
## 1. Acceptance of Terms

By accessing and using Aliko Academy – Tech's website and services, you agree to be bound by these Terms of Service.

## 2. Services Description

Aliko Academy – Tech provides online and hybrid technology education programs, including Career Tracks and Short Courses.

## 3. Enrollment and Payment

### Enrollment
- Enrollment is subject to our admissions process
- You must provide accurate information
- Acceptance is at our discretion

### Payment
- Tuition is due as specified in your enrollment agreement
- Payment plans are available for eligible students
- All fees are in US dollars unless otherwise specified

## 4. Program Participation

### Student Responsibilities
- Attend scheduled sessions
- Complete required coursework
- Maintain academic integrity
- Respect other participants

### Code of Conduct
- No harassment or discrimination
- No sharing of proprietary materials
- Professional behavior expected

## 5. Intellectual Property

All course materials, content, and resources are the property of Aliko Academy – Tech and may not be reproduced without permission.

## 6. Credentials and Certificates

- Credentials are awarded upon successful program completion
- We do not guarantee employment or salary outcomes
- Certification exam pass rates are not guaranteed

## 7. Limitation of Liability

Aliko Academy – Tech is not liable for:
- Employment outcomes
- Third-party certification results
- Technical issues beyond our control

## 8. Changes to Terms

We reserve the right to modify these terms at any time. Continued use constitutes acceptance of changes.

## 9. Contact

For questions about these terms, contact us at legal@alikoacademy.tech.
    `,
  },
  refund: {
    title: 'Refund Policy',
    lastUpdated: 'January 1, 2026',
    content: `
## 1. Refund Eligibility

### Full Refund
You are eligible for a full refund if you withdraw within 7 days of your program start date.

### Partial Refund
After the 7-day period:
- Weeks 1-2: 75% refund
- Weeks 3-4: 50% refund
- After Week 4: No refund

## 2. How to Request a Refund

To request a refund:
1. Email admissions@alikoacademy.tech
2. Include your full name and program
3. State your reason for withdrawal

## 3. Processing Time

Refunds are processed within 10 business days of approval. Funds will be returned to the original payment method.

## 4. Non-Refundable Items

The following are non-refundable:
- Application fees
- Materials or resources already accessed
- Third-party certification exam fees

## 5. Exceptions

Exceptions may be considered for:
- Medical emergencies (with documentation)
- Military deployment
- Other extenuating circumstances

## 6. Contact

For refund inquiries, contact admissions@alikoacademy.tech.
    `,
  },
};

const Policies = () => {
  const { policy } = useParams();
  const policyData = policies[policy as keyof typeof policies];

  if (!policyData) {
    return (
      <Layout>
        <div className="container-padding mx-auto max-w-7xl py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Policy Not Found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-padding mx-auto max-w-3xl">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold text-accent mb-2">{policyData.title}</h1>
          <p className="text-muted-foreground mb-8">Last updated: {policyData.lastUpdated}</p>

          <div className="prose prose-sm max-w-none">
            {policyData.content.split('\n').map((line, index) => {
              if (line.startsWith('## ')) {
                return <h2 key={index} className="text-xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={index} className="text-lg font-semibold mt-6 mb-3">{line.replace('### ', '')}</h3>;
              }
              if (line.startsWith('- ')) {
                return <li key={index} className="ml-4">{line.replace('- ', '')}</li>;
              }
              if (line.trim() === '') {
                return <br key={index} />;
              }
              return <p key={index} className="mb-2 text-muted-foreground">{line}</p>;
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Questions about this policy? <Link to="/contact" className="text-accent hover:underline">Contact us</Link>.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Policies;
