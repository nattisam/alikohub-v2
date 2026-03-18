import nclexThumb from "@/assets/categories/health/programs/nclex-thumb.jpg";
import teasThumb from "@/assets/categories/health/programs/teas-thumb.jpg";
import cnaExamThumb from "@/assets/categories/health/programs/cna-exam-thumb.jpg";
import maExamThumb from "@/assets/categories/health/programs/ma-exam-thumb.jpg";

export const examPrepPrograms = [
  {
    id: "nclex-review",
    name: "NCLEX Exam Review & Preparation",
    shortName: "NCLEX Review",
    category: "exam-prep" as const,
    duration: "4-8 weeks",
    hours: { total: 60, theory: 60, lab: 0, clinical: 0 },
    modality: "Online",
    location: "Online",
    tuition: 800,
    startDate: "March 15, 2026",
    enrollmentStatus: "open" as const,
    featured: true,
    image: nclexThumb,
    description:
      "Comprehensive NCLEX-RN and NCLEX-PN exam preparation covering all test content areas, test-taking strategies, and practice questions to maximize your exam success.",
    targetAudience: [
      "Nursing School Graduates",
      "LPN/LVN seeking RN licensure",
      "International Nurses",
    ],
    topicsCovered: [
      "Safe and Effective Care Environment",
      "Health Promotion and Maintenance",
      "Psychosocial Integrity",
      "Physiological Integrity",
      "Test-Taking Strategies",
      "Computer Adaptive Testing (CAT) Practice",
    ],
    requirements: [
      "Completion of nursing program",
      "Valid nursing school transcripts",
    ],
  },
  {
    id: "teas-hesi-review",
    name: "TEAS & HESI Exam Review & Preparation",
    shortName: "TEAS/HESI Review",
    category: "exam-prep" as const,
    duration: "2-4 weeks",
    hours: { total: 40, theory: 40, lab: 0, clinical: 0 },
    modality: "Online",
    location: "Online",
    tuition: 500,
    startDate: "April 1, 2026",
    enrollmentStatus: "open" as const,
    featured: true,
    image: teasThumb,
    description:
      "Prepare for nursing school entrance exams with comprehensive review of reading, math, science, and English language arts sections on the TEAS and HESI A2 exams.",
    targetAudience: [
      "Prospective Nursing Students",
      "Pre-Nursing Students",
      "Career Changers",
    ],
    topicsCovered: [
      "Reading Comprehension",
      "Mathematics",
      "Science (Anatomy, Biology, Chemistry)",
      "English and Language Usage",
      "Practice Tests and Timed Drills",
      "Test-Taking Strategies",
    ],
    requirements: [
      "High school diploma or GED",
      "Basic math and reading skills",
    ],
  },
  {
    id: "cna-exam-review",
    name: "CNA Exam Review & Preparation",
    shortName: "CNA Exam Review",
    category: "exam-prep" as const,
    duration: "1-2 weeks",
    hours: { total: 20, theory: 20, lab: 0, clinical: 0 },
    modality: "Hybrid",
    location: "Seattle, WA",
    tuition: 300,
    startDate: "March 22, 2026",
    enrollmentStatus: "open" as const,
    featured: false,
    image: cnaExamThumb,
    description:
      "Focused review for CNA certification exam success, covering written test content, clinical skills demonstration, and state-specific requirements.",
    targetAudience: [
      "CNA Program Graduates",
      "CNAs Seeking Re-certification",
      "Out-of-State CNAs",
    ],
    topicsCovered: [
      "Patient Rights and Safety",
      "Basic Nursing Skills Review",
      "Infection Control",
      "Personal Care Skills",
      "Clinical Skills Practice",
      "Written Exam Strategies",
    ],
    requirements: [
      "Completion of CNA training program or equivalent experience",
    ],
  },
  {
    id: "medical-assistant-exam-review",
    name: "Medical Assistant Exam Review",
    shortName: "MA Exam Review",
    category: "exam-prep" as const,
    duration: "2-3 weeks",
    hours: { total: 30, theory: 30, lab: 0, clinical: 0 },
    modality: "Online",
    location: "Online",
    tuition: 450,
    startDate: "April 15, 2026",
    enrollmentStatus: "open" as const,
    featured: false,
    image: maExamThumb,
    description:
      "Prepare for CMA, RMA, or NCMA certification exams with comprehensive review of administrative, clinical, and general medical knowledge.",
    targetAudience: [
      "Medical Assistant Program Graduates",
      "MAs Seeking National Certification",
    ],
    topicsCovered: [
      "General Medical Knowledge",
      "Administrative Procedures",
      "Clinical Procedures",
      "Anatomy and Physiology Review",
      "Medical Terminology",
      "Practice Exams",
    ],
    requirements: ["Completion of Medical Assistant training program"],
  },
];

export type ExamPrepProgram = (typeof examPrepPrograms)[number];

export const EXAM_PREP_DISCLAIMER =
  "These courses are review and preparation programs only. Completion does not guarantee exam success, certification, or licensure.";

export const COLLABORATION_NOTE =
  "Offered in collaboration with Aliko Consultancy, an academic and career advisory partner. Aliko Consultancy is not a licensing, accrediting, or credential-granting body.";
