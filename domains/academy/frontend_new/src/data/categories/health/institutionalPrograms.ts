export interface InstitutionalProgram {
  title: string;
  description: string;
  duration: string;
  delivery: string;
}

export interface InstitutionalCategory {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  overview: string;
  targetAudience: string[];
  durationOptions: string[];
  deliveryFormats: string[];
  certificationTypes: string[];
  programs: InstitutionalProgram[];
  idealFor?: string[];
}

export interface WhoWeServeCard {
  title: string;
  description: string;
  icon: string; // lucide icon name
  filterCategories: string[];
}

export const whoWeServe: WhoWeServeCard[] = [
  {
    title: "Government Ministries & Agencies",
    description: "National and subnational health ministries, public health agencies, and defense health services building workforce capacity.",
    icon: "Landmark",
    filterCategories: ["public-health", "executive", "wash"],
  },
  {
    title: "Hospitals & Health Systems",
    description: "Public and private healthcare institutions upgrading clinical staff skills and operational standards.",
    icon: "Hospital",
    filterCategories: ["clinical", "digital-health", "corporate"],
  },
  {
    title: "International & Development Organizations",
    description: "UN agencies, multilateral bodies, and international NGOs delivering health programs globally.",
    icon: "Globe",
    filterCategories: ["public-health", "wash", "executive"],
  },
  {
    title: "African Union & Regional Bodies",
    description: "Continental and regional institutions shaping cross-border health policy, governance, and cooperation.",
    icon: "MapPin",
    filterCategories: ["executive", "public-health", "wash"],
  },
  {
    title: "Private Corporations & Employers",
    description: "Companies investing in occupational health, workplace safety, and corporate wellness programs.",
    icon: "Building2",
    filterCategories: ["corporate", "clinical", "digital-health"],
  },
];

export const institutionalCategories: InstitutionalCategory[] = [
  {
    id: "public-health",
    name: "Public Health & Emergency Response",
    shortName: "Public Health",
    slug: "public-health",
    overview:
      "Emergency preparedness, outbreak response, and humanitarian health operations training.",
    targetAudience: [
      "Public health officers",
      "Emergency coordinators",
      "Government health teams",
      "Humanitarian response organizations",
    ],
    durationOptions: ["3-Day Intensive", "5-Day Simulation", "2–4 Week Certificate"],
    deliveryFormats: ["Hybrid", "On-site Government Delivery", "Simulation-based training"],
    certificationTypes: ["Certificate of Completion", "Professional Development Units"],
    programs: [
      { title: "Emergency Preparedness & Response", description: "Build institutional readiness for health emergencies including natural disasters, pandemics, and mass casualty events.", duration: "3–5 days", delivery: "Hybrid" },
      { title: "Infection Prevention & Control (IPC)", description: "Evidence-based IPC strategies for healthcare facilities and community settings.", duration: "3–5 days", delivery: "On-site" },
      { title: "Field Epidemiology Fundamentals", description: "Core skills in disease surveillance, outbreak investigation, and data-driven response.", duration: "2–4 weeks", delivery: "Hybrid" },
      { title: "Outbreak Investigation & Surveillance", description: "Systematic approaches to detecting, investigating, and containing disease outbreaks.", duration: "5 days", delivery: "Simulation" },
      { title: "Humanitarian Health Operations", description: "Health service delivery in complex emergencies, conflict zones, and displacement settings.", duration: "5 days", delivery: "Hybrid" },
      { title: "Refugee & Displacement Health Coordination", description: "Coordinating health responses for displaced populations across camp and urban settings.", duration: "3–5 days", delivery: "On-site" },
      { title: "Rapid Health Needs Assessment", description: "Conducting rapid assessments to guide resource allocation in emergency contexts.", duration: "3 days", delivery: "Hybrid" },
    ],
  },
  {
    id: "digital-health",
    name: "Digital Health & Health Technology",
    shortName: "Digital Health",
    slug: "digital-health",
    overview:
      "Health IT systems, data analytics, AI, and telemedicine deployment for modern institutions.",
    targetAudience: [
      "Health IT professionals",
      "Hospital administrators",
      "Ministry of Health teams",
      "Development partners",
    ],
    durationOptions: ["3-Day Workshop", "1-Week Intensive", "2–4 Week Certificate"],
    deliveryFormats: ["LMS + Live Labs", "Executive Workshop", "Corporate Package"],
    certificationTypes: ["Certificate of Completion", "Digital Health Credential"],
    programs: [
      { title: "Electronic Health Records Implementation", description: "Planning, deploying, and managing EHR systems for healthcare facilities.", duration: "1–2 weeks", delivery: "Hybrid" },
      { title: "Health Data Analytics & Dashboard Development", description: "Turning health data into actionable insights using modern analytics tools.", duration: "1 week", delivery: "LMS + Live Labs" },
      { title: "AI Applications in Healthcare", description: "Practical applications of artificial intelligence in clinical and administrative health settings.", duration: "3–5 days", delivery: "Workshop" },
      { title: "Telemedicine Systems Deployment", description: "Designing and implementing telemedicine infrastructure for remote care delivery.", duration: "1 week", delivery: "Hybrid" },
      { title: "Health Information Systems Management", description: "Managing national and institutional health information systems for data quality and interoperability.", duration: "2 weeks", delivery: "LMS + Live Labs" },
      { title: "Health Data Governance & Cybersecurity", description: "Protecting health data through governance frameworks, privacy policies, and cybersecurity protocols.", duration: "3–5 days", delivery: "Workshop" },
      { title: "Digital Health Transformation Strategy", description: "Strategic planning for digital health adoption at institutional and national levels.", duration: "3 days", delivery: "Executive Workshop" },
    ],
  },
  {
    id: "clinical",
    name: "Clinical & Advanced Workforce Training",
    shortName: "Clinical Training",
    slug: "clinical",
    overview:
      "Advanced clinical skills for frontline healthcare professionals beyond entry-level certification.",
    targetAudience: [
      "Nurses and nursing assistants",
      "Clinical officers",
      "Hospital training departments",
      "Healthcare staffing agencies",
    ],
    durationOptions: ["3-Day Skills Lab", "1-Week Intensive", "2–4 Week Certificate"],
    deliveryFormats: ["In-person Skills Lab", "Hybrid", "On-site Hospital Training"],
    certificationTypes: ["Certificate of Completion", "Clinical Skills Credential"],
    programs: [
      { title: "Advanced Patient Care Skills", description: "Beyond-basic patient care techniques for experienced healthcare workers.", duration: "1 week", delivery: "Skills Lab" },
      { title: "IV Therapy & Medication Support", description: "Safe IV insertion, medication administration, and monitoring protocols.", duration: "3–5 days", delivery: "Skills Lab" },
      { title: "Wound Care & Infection Management", description: "Assessment and management of acute and chronic wounds using evidence-based protocols.", duration: "3–5 days", delivery: "Hybrid" },
      { title: "Geriatric & Dementia Care", description: "Specialized care approaches for elderly patients and those with cognitive decline.", duration: "1 week", delivery: "Hybrid" },
      { title: "Maternal & Child Health Support", description: "Essential maternal and newborn care skills for frontline health workers.", duration: "1–2 weeks", delivery: "On-site" },
      { title: "Trauma & Emergency Care Basics", description: "Initial trauma assessment, stabilization, and emergency care fundamentals.", duration: "3–5 days", delivery: "Skills Lab" },
      { title: "Mental Health First Aid", description: "Recognizing and responding to mental health crises in clinical and community settings.", duration: "2–3 days", delivery: "Hybrid" },
    ],
  },
  {
    id: "corporate",
    name: "Occupational & Corporate Health",
    shortName: "Corporate Health",
    slug: "corporate",
    overview:
      "Workplace safety, first aid, and corporate wellness for construction, manufacturing, and industry.",
    targetAudience: [
      "HR and safety officers",
      "Construction and manufacturing firms",
      "Oil & gas companies",
      "Corporate wellness managers",
    ],
    durationOptions: ["1-Day Workshop", "3-Day Intensive", "1-Week Certificate"],
    deliveryFormats: ["On-site Corporate", "Hybrid", "Virtual Workshop"],
    certificationTypes: ["Certificate of Completion", "OSHA-aligned Credential"],
    idealFor: [
      "Construction Firms",
      "Manufacturing Companies",
      "Oil & Gas Projects",
      "Infrastructure Programs",
    ],
    programs: [
      { title: "Workplace First Aid & CPR", description: "Essential first aid and CPR training for non-clinical workplace environments.", duration: "1 day", delivery: "On-site" },
      { title: "Occupational Health & Safety Compliance", description: "Meeting regulatory requirements for workplace health and safety standards.", duration: "3–5 days", delivery: "Hybrid" },
      { title: "Industrial Hygiene Fundamentals", description: "Identifying and controlling workplace health hazards in industrial settings.", duration: "3 days", delivery: "On-site" },
      { title: "Psychological First Aid", description: "Supporting colleagues and employees through psychological distress and workplace crises.", duration: "2 days", delivery: "Virtual" },
      { title: "Corporate Emergency Response Planning", description: "Developing and testing emergency response plans for corporate environments.", duration: "3 days", delivery: "On-site" },
      { title: "Workplace Wellness Program Design", description: "Designing evidence-based wellness programs to improve employee health outcomes.", duration: "3–5 days", delivery: "Hybrid" },
    ],
  },
  {
    id: "wash",
    name: "WASH & Environmental Health",
    shortName: "WASH",
    slug: "wash",
    overview:
      "Water, sanitation, and hygiene programs aligned with global sustainable development goals.",
    targetAudience: [
      "WASH program managers",
      "Environmental health officers",
      "Development agencies",
      "Community health organizations",
    ],
    durationOptions: ["3-Day Workshop", "1-Week Field Training", "2–4 Week Certificate"],
    deliveryFormats: ["Field-based", "Hybrid", "Community Training"],
    certificationTypes: ["Certificate of Completion", "WASH Professional Credential"],
    programs: [
      { title: "Water Safety Planning", description: "Developing and implementing water safety plans for communities and institutions.", duration: "3–5 days", delivery: "Hybrid" },
      { title: "Sanitation & Hygiene Promotion", description: "Designing effective sanitation and hygiene behavior change interventions.", duration: "3–5 days", delivery: "Field-based" },
      { title: "Community-Led Total Sanitation", description: "Facilitating community-driven approaches to ending open defecation.", duration: "1 week", delivery: "Field-based" },
      { title: "WASH Project Management", description: "Planning, implementing, and monitoring WASH projects in development contexts.", duration: "1–2 weeks", delivery: "Hybrid" },
      { title: "Environmental Risk Assessment", description: "Assessing environmental health risks and developing mitigation strategies.", duration: "3–5 days", delivery: "Hybrid" },
      { title: "School & Community WASH Systems", description: "Designing and maintaining WASH infrastructure for schools and community facilities.", duration: "3–5 days", delivery: "Field-based" },
    ],
  },
  {
    id: "executive",
    name: "Executive & Policy Programs",
    shortName: "Executive & Policy",
    slug: "executive",
    overview:
      "Strategic leadership programs for health policymakers, executives, and institutional leaders.",
    targetAudience: [
      "Health ministry leadership",
      "Hospital executives",
      "Policy advisors",
      "Development agency directors",
    ],
    durationOptions: ["2-Day Executive Retreat", "1-Week Intensive", "2–4 Week Fellowship"],
    deliveryFormats: ["Executive Workshop", "Hybrid", "Policy Simulation"],
    certificationTypes: ["Executive Certificate", "Policy Leadership Credential"],
    programs: [
      { title: "Health Systems Strengthening", description: "Frameworks and strategies for building resilient, responsive health systems.", duration: "1 week", delivery: "Executive Workshop" },
      { title: "Universal Health Coverage Strategy", description: "Planning and implementing pathways toward universal health coverage.", duration: "3–5 days", delivery: "Hybrid" },
      { title: "Health Financing & Budget Planning", description: "Health sector budgeting, financing mechanisms, and resource allocation strategies.", duration: "3–5 days", delivery: "Executive Workshop" },
      { title: "Monitoring & Evaluation for Health Programs", description: "Designing M&E frameworks that drive accountability and program improvement.", duration: "1 week", delivery: "Hybrid" },
      { title: "One Health Framework Implementation", description: "Integrating human, animal, and environmental health approaches at the policy level.", duration: "3–5 days", delivery: "Policy Simulation" },
      { title: "Health Governance & Regulatory Leadership", description: "Strengthening governance structures and regulatory capacity in the health sector.", duration: "3–5 days", delivery: "Executive Workshop" },
    ],
  },
];

export const institutionalPricingTiers = [
  {
    name: "Small Team",
    participants: "10–20 Participants",
    description: "Ideal for department-level training and pilot programs.",
    features: [
      "Custom curriculum alignment",
      "Dedicated program coordinator",
      "Certificate of completion",
      "Post-training support (30 days)",
    ],
    highlighted: false,
  },
  {
    name: "Enterprise",
    participants: "50+ Participants",
    description: "Full-scale institutional training with comprehensive support.",
    features: [
      "Everything in Small Team",
      "On-site delivery option",
      "Custom branding & materials",
      "LMS access for 12 months",
      "Quarterly progress reports",
    ],
    highlighted: true,
  },
  {
    name: "Government Contract",
    participants: "Custom Scale",
    description: "Tailored programs for government ministries and public agencies.",
    features: [
      "Everything in Enterprise",
      "Multi-site delivery",
      "Policy-aligned curriculum",
      "Government compliance documentation",
      "Long-term capacity building plan",
    ],
    highlighted: false,
  },
  {
    name: "Multi-Year Partnership",
    participants: "Ongoing Engagement",
    description: "Strategic capacity-building partnerships with measurable outcomes.",
    features: [
      "Everything in Government Contract",
      "Annual training needs assessment",
      "Dedicated account manager",
      "Impact evaluation reports",
      "Priority scheduling",
    ],
    highlighted: false,
  },
];
